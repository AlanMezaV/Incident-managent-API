import mongoose from 'mongoose';
import { roles } from '../utils/constants/user';
import { SidebarService } from './sidebar.service';
import { CreateSidebarOptionsDto } from './dto/sidebar.dto';

const initialSidebarOptions: CreateSidebarOptionsDto[] = [
    {
        route: '/home',
        name: 'Inicio',
        icon: 'House',
        roles: [
            roles.ADMIN_DEPARTMENT,
            roles.ADMIN_TECHNICIANS,
            roles.TECHNICIAN,
            roles.ADMIN_LAB,
            roles.ONLY_READ
        ]
    },
    {
        route: '/user',
        name: 'Usuarios',
        icon: 'Users',
        roles: [roles.ADMIN_DEPARTMENT, roles.ADMIN_TECHNICIANS, roles.ADMIN_LAB]
    },
    {
        route: '/build',
        name: 'Edificios',
        icon: 'Building2',
        roles: [
            roles.ADMIN_DEPARTMENT,
            roles.ADMIN_TECHNICIANS,
            roles.TECHNICIAN,
            roles.ADMIN_LAB,
            roles.ONLY_READ
        ]
    },
    {
        route: '/device',
        name: 'Equipos',
        icon: 'Laptop',
        roles: [
            roles.ADMIN_DEPARTMENT,
            roles.ADMIN_TECHNICIANS,
            roles.TECHNICIAN,
            roles.ADMIN_LAB,
            roles.ONLY_READ
        ]
    },
    {
        route: '/spare-parts',
        name: 'Repuestos',
        icon: 'Cpu',
        roles: [roles.ADMIN_TECHNICIANS, roles.TECHNICIAN]
    },
    {
        route: '/services',
        name: 'Servicios',
        icon: 'Book',
        roles: [roles.ADMIN_TECHNICIANS, roles.TECHNICIAN]
    },
    {
        route: '/problems',
        name: 'Problemas',
        icon: 'Problems',
        roles: [roles.ADMIN_TECHNICIANS, roles.TECHNICIAN]
    },
    {
        route: '/incident',
        name: 'Incidencias',
        icon: 'Incidents',
        roles: [roles.ADMIN_DEPARTMENT, roles.ADMIN_TECHNICIANS, roles.TECHNICIAN, roles.ADMIN_LAB]
    },
    {
        route: '/change',
        name: 'Cambios',
        icon: 'Changes',
        roles: [roles.ADMIN_TECHNICIANS, roles.TECHNICIAN]
    },
    {
        route: '/changes-history',
        name: 'Historial',
        icon: 'History',
        roles: [roles.ADMIN_TECHNICIANS, roles.TECHNICIAN]
    }
];

export async function initializeSidebarOptions(sidebarService: SidebarService) {
    const collectionName = 'sidebar';
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionExists = collections.some(collection => collection.name === collectionName);

    if (!collectionExists) {
        // Si la colección no existe, se crean todas las opciones iniciales
        for (const route of initialSidebarOptions) {
            await sidebarService.createSidebarOptions(route);
        }
        console.log('Sidebar options inserted');
    } else {
        // Obtiene las opciones existentes
        const existingSidebarOptions = await sidebarService.getAllSidebarOptions();

        // Actualiza o inserta opciones según corresponda
        for (const initialOption of initialSidebarOptions) {
            const existingOption = existingSidebarOptions.find(
                option => option.route === initialOption.route
            );

            if (existingOption) {
                // Actualiza si hay cambios en la configuración existente
                if (
                    existingOption.name !== initialOption.name ||
                    existingOption.icon !== initialOption.icon ||
                    JSON.stringify(existingOption.roles) !== JSON.stringify(initialOption.roles)
                ) {
                    await sidebarService.updateSidebarOption(initialOption.route, initialOption);
                    console.log(`Updated sidebar option: ${initialOption.route}`);
                }
            } else {
                // Inserta la opción que falta
                await sidebarService.createSidebarOptions(initialOption);
                console.log(`Inserted new sidebar option: ${initialOption.route}`);
            }
        }

        // Ordena las opciones existentes según el orden de initialSidebarOptions
        const orderedSidebarOptions = initialSidebarOptions.map(
            initialOption =>
                existingSidebarOptions.find(option => option.route === initialOption.route) ||
                initialOption
        );

        // Actualiza el orden en la base de datos (si tu esquema soporta orden explícito)
        await sidebarService.updateSidebarOrder(orderedSidebarOptions);
        console.log('Sidebar options reordered');
    }
}
