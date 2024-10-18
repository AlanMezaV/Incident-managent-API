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
    } else {
        const existingSidebarOptions = await sidebarService.getAllSidebarOptions();

        for (const initialOption of initialSidebarOptions) {
            const existingOption = existingSidebarOptions.find(
                option => option.route === initialOption.route
            );

            if (existingOption) {
                if (
                    existingOption.name !== initialOption.name ||
                    existingOption.icon !== initialOption.icon ||
                    JSON.stringify(existingOption.roles) !== JSON.stringify(initialOption.roles)
                ) {
                    await sidebarService.updateSidebarOption(initialOption.route, initialOption);
                    console.log(`Updated sidebar option: ${initialOption.route}`);
                }
            } else {
                await sidebarService.createSidebarOptions(initialOption);
                console.log(`Inserted new sidebar option: ${initialOption.route}`);
            }
        }
    }
}
