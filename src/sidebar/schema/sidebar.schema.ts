import { Schema, model } from 'mongoose';
import { ISidebar } from '../interface/sidebar.interface';

export const sidebarSchema = new Schema<ISidebar>({
    route: { type: String, required: true },
    name: { type: String, required: true },
    icon: { type: String, required: true },
    roles: { type: [String], required: true }
});

export const Sidebar = model<ISidebar>('Sidebar', sidebarSchema, 'sidebar');
