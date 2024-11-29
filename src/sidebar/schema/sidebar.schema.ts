import { Schema, model } from 'mongoose';
import { ISidebar } from '../interface/sidebar.interface';

export const sidebarSchema = new Schema<ISidebar>({
    route: { type: String, required: true },
    name: { type: String, required: true },
    icon: { type: String, required: true },
    roles: { type: [String], required: true },
    order: { type: Number, default: 0 }
});

export const Sidebar = model<ISidebar>('Sidebar', sidebarSchema, 'sidebar');
