import { SidebarService } from './sidebar.service';
import { CreateSidebarOptionsDto } from './dto/sidebar.dto';
import mongoose from 'mongoose';

const initialSidebarOptions: CreateSidebarOptionsDto[] = [
    {
        route: '/home',
        name: 'Inicio',
        icon: 'House',
        roles: ['ADMIN_DEPARTMENT', 'ADMIN_TECHNICIANS', 'TECHNICIAN', 'ADMIN_LAB', 'ONLY_READ']
    },
    {
        route: '/user',
        name: 'Usuarios',
        icon: 'Users',
        roles: ['ADMIN_DEPARTMENT', 'ADMIN_TECHNICIANS']
    },
    {
        route: '/build',
        name: 'Edificios',
        icon: 'Building2',
        roles: ['ADMIN_DEPARTMENT', 'ADMIN_TECHNICIANS', 'TECHNICIAN', 'ADMIN_LAB', 'ONLY_READ']
    },
    {
        route: '/device',
        name: 'Equipos',
        icon: 'Laptop',
        roles: ['ADMIN_DEPARTMENT', 'ADMIN_TECHNICIANS', 'TECHNICIAN', 'ADMIN_LAB', 'ONLY_READ']
    },
    {
        route: '/incident',
        name: 'Incidencias',
        icon: 'CircleX',
        roles: ['ADMIN_DEPARTMENT', 'ADMIN_TECHNICIANS', 'TECHNICIAN', 'ADMIN_LAB']
    }
];

export async function initializeSidebarOptions(sidebarService: SidebarService) {
    const collectionName = 'sidebar';
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionExists = collections.some(collection => collection.name === collectionName);

    if (!collectionExists) {
        for (const route of initialSidebarOptions) {
            await sidebarService.createSidebarOptions(route);
        }
        console.log('Sidebar options inserted');
    }
}
