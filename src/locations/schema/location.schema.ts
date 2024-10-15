import { Schema, model } from 'mongoose';
import { ILocation } from '../interface/location.interface';

const locationSchema = new Schema<ILocation>(
    {
        name: { type: String, required: true },
        type: { type: String, required: true },
        description: { type: String },
        building_id: { type: Schema.Types.ObjectId, ref: 'Building', required: true },
        department_id: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
        location_manager: { type: Schema.Types.ObjectId, ref: 'User' }
    },
    { timestamps: { createdAt: 'created_at' } }
);

export const Location = model<ILocation>('Location', locationSchema);
