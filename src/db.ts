import mongoose from 'mongoose';
import { MONGODB_URI } from './config';
import { SidebarService } from './sidebar/sidebar.service';
import { initializeSidebarOptions } from './sidebar/sidebar.data';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {});
        console.log('Database connected successfully');

        const sidebarService = new SidebarService();
        await initializeSidebarOptions(sidebarService);
    } catch (err) {
        console.error('Database connection error:', err);
    }
};

connectDB();
