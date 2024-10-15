import { Location } from './schema/location.schema';
import { Types } from 'mongoose';
import { createLocationDTO, LocationSearchParamsDTO, updateLocationDTO } from './dto/location.dto';
import { Device } from '../devices/schema/device.schema';

export class LocationService {
    //Obtener location por id
    async getLocationById(locationId: string) {
        return await Location.findById(locationId);
    }

    //Crear location
    async createLocation(locationData: createLocationDTO) {
        return await Location.create(locationData);
    }

    //Actualizar location
    async updateLocation(locationId: string, data: updateLocationDTO) {
        return await Location.findByIdAndUpdate(locationId, data, { new: true });
    }

    //Eliminar location
    async deleteLocation(locationId: string) {
        return await Location.findByIdAndDelete(locationId);
    }

    //Obtener locations por criterios de busqueda
    async searchLocations(query: LocationSearchParamsDTO) {
        const { name, type, building_id, department_id, location_manager } = query;
        const filter: any = {};

        if (name) filter.name = { $regex: name, $options: 'i' };
        if (type) filter.type = { $regex: type, $options: 'i' };
        if (building_id) filter.building_id = new Types.ObjectId(building_id);
        if (department_id) filter.department_id = new Types.ObjectId(department_id);
        if (location_manager) filter.location_manager = new Types.ObjectId(location_manager);

        return await Location.find(filter).populate('location_manager');
    }

    //Obtener locations con dispositivos
    async getLocationsWithDevices(query: LocationSearchParamsDTO) {
        const { building_id, department_id } = query;

        const locations = await Location.find({
            building_id: building_id,
            department_id: department_id
        });

        const data = await Promise.all(
            locations.map(async location => {
                const totalDevices = await Device.countDocuments({ location_id: location._id });
                return {
                    ...location.toObject(),
                    totalDevices
                };
            })
        );

        return data;
    }
}
