import { Service } from './schema/service.schema';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';

export class ServicesService {
    // Obtener todos los servicios
    async getServices() {
        return await Service.find().exec();
    }

    // Obtener servicio por id
    async getServiceById(serviceId: string) {
        return await Service.findById(serviceId);
    }

    // Crear servicio
    async createService(serviceData: CreateServiceDto) {
        const newService = new Service({
            ...serviceData
        });

        return await newService.save();
    }

    // Actualizar servicio
    async updateService(serviceId: string, data: UpdateServiceDto) {
        const updatedService = await Service.findByIdAndUpdate(
            serviceId,
            { ...data },
            { new: true }
        ).exec();

        if (!updatedService) {
            throw new Error('Service not found');
        }

        return updatedService;
    }

    // Eliminar servicio
    async deleteService(serviceId: string) {
        return await Service.findByIdAndDelete(serviceId);
    }
}
