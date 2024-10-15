import { Schema, model } from 'mongoose';
import { IDepartment } from '../interface/department.interface';

const departmentSchema = new Schema<IDepartment>(
    {
        name: { type: String, required: true },
        description: { type: String }
    },
    { timestamps: { createdAt: 'created_at' } }
);

export const Department = model<IDepartment>('Department', departmentSchema);
