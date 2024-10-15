import { Schema, model } from 'mongoose';
import { IDevice } from '../interface/device.interface';

const deviceSchema = new Schema<IDevice>(
    {
        name: { type: String, required: true },
        type: { type: String, required: true },
        status: { type: String },
        specs: { type: Object, required: true },
        purchaseDate: { type: Date, required: true },
        warrantyYears: { type: Number, required: true },
        deviceModel: { type: String },
        brand: { type: String },
        location_id: { type: Schema.Types.ObjectId, ref: 'Location', required: true }
    },
    { timestamps: { createdAt: 'created_at' } }
);

export const Device = model<IDevice>('Device', deviceSchema);
