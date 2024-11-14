import { Schema, model } from 'mongoose';
import { ISparePart } from '../interface/spare_part.interface';

const sparePartSchema = new Schema<ISparePart>(
    {
        name: { type: String, required: true },
        type: { type: String, required: true },
        device_type: { type: String, required: true },
        description: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    },
    { timestamps: { createdAt: 'created_at' } }
);

export const SparePart = model<ISparePart>('SparePart', sparePartSchema);
