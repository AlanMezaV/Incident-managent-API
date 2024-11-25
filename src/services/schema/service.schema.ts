import { Schema, model } from 'mongoose';
import { IService } from '../interface/service.interface';

const serviceSchema = new Schema<IService>(
    {
        service: { type: String, required: true },
        type: { type: String, required: true },
        device_type: { type: String, required: true },
        description: { type: String, required: true },
        duration: { type: Number, required: true }
    },
    { timestamps: { createdAt: 'created_at' } }
);

export const Service = model<IService>('Service', serviceSchema);
