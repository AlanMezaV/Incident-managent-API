import { Sidebar } from './schema/sidebar.schema';
import { CreateSidebarOptionsDto } from './dto/sidebar.dto';

export class SidebarService {
    async getSidebarRoutes() {
        return await Sidebar.find();
    }

    async createSidebarOptions(data: CreateSidebarOptionsDto) {
        return await Sidebar.create(data);
    }

    async getRoutesByRole(role: string) {
        return Sidebar.find({ roles: role }).sort({ order: 1 }).exec();
    }

    async getAllSidebarOptions(): Promise<CreateSidebarOptionsDto[]> {
        return await Sidebar.find().sort({ order: 1 }).exec();
    }

    async updateSidebarOption(route: string, updateData: CreateSidebarOptionsDto): Promise<void> {
        await Sidebar.updateOne({ route }, updateData).exec();
    }

    async updateSidebarOrder(orderedOptions: CreateSidebarOptionsDto[]) {
        for (let i = 0; i < orderedOptions.length; i++) {
            const option = orderedOptions[i];
            await Sidebar.updateOne(
                { route: option.route }, // Encuentra la opción por su ruta
                { $set: { order: i } }, // Establece el campo `order` con el índice
                { upsert: false } // No crea nuevos documentos, solo actualiza existentes
            );
        }
        console.log('Sidebar options reordered successfully');
    }
}
