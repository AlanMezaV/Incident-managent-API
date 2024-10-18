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
        return Sidebar.find({ roles: role }).exec();
    }
}
