import { Building } from './schema/building.schema';
import { User } from '../users/schema/user.schema';
import { Location } from '../locations/schema/location.schema';
import { Device } from '../devices/schema/device.schema';
import {
    CreateBuildingDTO,
    UpdateBuildingDTO,
    AddDepartmentToBuildingDTO,
    BuildingSearchParamsDTO
} from './dto/building.dto';

export class BuildingService {
    //Obtener Building por id
    async getBuildingById(buildingId: string) {
        return await Building.findById(buildingId);
    }

    //Crear Building
    async createBuilding(data: CreateBuildingDTO) {
        const building = new Building(data);
        return await building.save();
    }

    // Actualizar Building
    async updateBuilding(buildingId: string, data: UpdateBuildingDTO) {
        const building = await Building.findById(buildingId);

        if (!building) {
            return null;
        }

        building.name = data.name ?? building.name;
        building.description = data.description ?? building.description;
        building.isShared = data.isShared ?? building.isShared;

        if (data.departments) {
            const { department_id, build_manager } = data.departments;
            const currentDepartment = building.departments.find(
                dept => dept.department_id.toString() === department_id.toString()
            );

            if (currentDepartment) {
                currentDepartment.build_manager = build_manager;
            } else {
                building.departments.push({
                    department_id,
                    build_manager
                });
            }
        }

        return await building.save();
    }

    //Eliminar Building
    async deleteBuilding(buildingId: string) {
        await Location.deleteMany({ building_id: buildingId });
        return await Building.findByIdAndDelete(buildingId);
    }

    //Añadir departamento a edificio
    async addDepartmentToBuilding(buildingId: string, data: AddDepartmentToBuildingDTO) {
        const building = await Building.findById(buildingId);
        if (!building || !building.isShared) {
            return null;
        }

        building.departments.push({
            department_id: data.department_id,
            build_manager: data.build_manager
        });

        return await building.save();
    }

    // Obtener Buildings por criterios de búsqueda
    async searchBuildings(userId: string, query: BuildingSearchParamsDTO) {
        const { name, description, isShared, department_id, build_manager } = query;
        const filter: any = {};
        const user = await User.findById(userId);
        if (!user) {
            return null;
        }
        const userDepartmentId = user.department_id;
        console.log('userDepartmentId', userDepartmentId);
        if (name) filter.name = { $regex: name, $options: 'i' };
        if (description) filter.description = { $regex: description, $options: 'i' };

        if (isShared) {
            filter.isShared = isShared;
            if (isShared) {
                // Usar $not y $elemMatch para excluir si el department_id del usuario ya está presente
                filter['departments'] = {
                    $not: {
                        $elemMatch: {
                            department_id: userDepartmentId
                        }
                    }
                };
            }
        }

        if (department_id || build_manager) {
            filter['departments'] = {
                $elemMatch: {
                    ...(department_id && { department_id }),
                    ...(build_manager && { build_manager })
                }
            };
        }

        const buildings = await Building.find(filter).populate('departments.build_manager');

        if (!buildings) {
            return null;
        }

        return await Promise.all(
            buildings.map(async (building: { _id: any; toObject: () => any }) => {
                const locations = await Location.find({
                    building_id: building._id,
                    department_id: department_id
                });

                const totalDevices = await Device.countDocuments({
                    location_id: { $in: locations.map(loc => loc._id) }
                });
                return {
                    ...building.toObject(),
                    totalDevices
                };
            })
        );
    }
}
