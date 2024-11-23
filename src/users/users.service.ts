import { User } from './schema/user.schema';
import { Incident } from '../incidents/schema/incident.schema';
import { SecurityService } from '../utils/security';
import { Types } from 'mongoose';
import { UserSearchParamsDTO } from './dto/user.dto';

export class UserService {
    // Obtener usuario por id
    async getUserById(userId: string) {
        return await User.findById(userId).select('-password');
    }

    // Actualizar usuario
    async updateUser(userId: string, data: any) {
        const { password, ...rest } = data;

        if (password) {
            const securityService = new SecurityService();
            rest.password = await securityService.hash(password);
        }

        return await User.findByIdAndUpdate(userId, rest, { new: true });
    }

    // Eliminar usuario
    async deleteUser(userId: string) {
        return await User.findByIdAndDelete(userId);
    }

    // Obtener información de usuario
    async getUserInfo(userId: string) {
        return await User.findById(userId).select('-password').populate('department_id');
    }

    // Buscar usuarios con criterios
    async searchUsers(query: UserSearchParamsDTO) {
        const { name, username, email, position, department_id } = query;
        const filter: any = {};

        if (name) filter.name = { $regex: name, $options: 'i' };
        if (username) filter.username = { $regex: username, $options: 'i' };
        if (email) filter.email = { $regex: email, $options: 'i' };
        if (position && position !== 'ALL') {
            filter.position = { $regex: position, $options: 'i' };
        }
        if (department_id) {
            filter.department_id = new Types.ObjectId(department_id);
            filter.role = { $nin: ['ADMIN_DEPARTMENT', 'ADMIN_TECHNICIANS'] };
        }

        return await User.find(filter).select('-password');
    }

    // Obtener usuarios por departamento
    async getUsersByDepartment(departmentId: string) {
        return await User.find({ department_id: new Types.ObjectId(departmentId) }).select(
            '-password'
        );
    }

    // Obtener técnicos especialistas
    async getTechniciansSpecialist(position: string) {
        const technicians = await User.find({ position, role: 'TECHNICIAN' }).select('-password');

        //Ordenar por cantidad de incidencias que tienen asignadas
        const incidentsPerTechnician = await Incident.aggregate([
            {
                $match: {
                    technician_id: { $in: technicians.map(t => t._id) },
                    status: { $ne: 'RESOLVED' }
                }
            }
        ]);

        const techniciansWithIncidents = technicians.map(t => {
            const incidents = incidentsPerTechnician.filter(i => i.technician_id.equals(t._id));
            return { ...t.toObject(), incidents: incidents.length };
        });

        return techniciansWithIncidents.sort((a, b) => a.incidents - b.incidents);
    }
}
