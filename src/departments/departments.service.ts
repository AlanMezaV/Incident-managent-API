import { Department } from './schema/department.schema';
import { CreateDepartmentDTO, UpdateDepartmentDTO } from './dto/department.dto';

export class DepartmentService {
    //Obtener Department por id
    async getDepartmentById(departmentId: string) {
        return await Department.findById(departmentId);
    }

    //Crear Department
    async createDepartment(data: CreateDepartmentDTO) {
        const department = new Department(data);
        return await department.save();
    }

    // Actualizar Department
    async updateDepartment(departmentId: string, data: UpdateDepartmentDTO) {
        const department = await Department.findById(departmentId);

        if (!department) {
            return null;
        }

        department.name = data.name ?? department.name;
        department.description = data.description ?? department.description;

        return await department.save();
    }

    //Eliminar Department
    async deleteDepartment(departmentId: string) {
        return await Department.findByIdAndDelete(departmentId);
    }
}
