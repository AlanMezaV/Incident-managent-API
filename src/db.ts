import mongoose from 'mongoose';
import { MONGODB_URI } from './config';
import { SidebarService } from './sidebar/sidebar.service'; // Asegúrate de importar SidebarService
import { initializeSidebarOptions } from './sidebar/sidebar.data'; // Asegúrate de importar initializeSidebarOptions

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {});
        console.log('Database connected successfully');

        // Inicializa las opciones de la barra lateral después de la conexión
        const sidebarService = new SidebarService();
        await initializeSidebarOptions(sidebarService);
    } catch (err) {
        console.error('Database connection error:', err);
    }
};

connectDB();
