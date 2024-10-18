import { Schema, model } from 'mongoose';
import { IPeriod } from '../interface/period.interface';

const periodSchema = new Schema<IPeriod>(
    {
        period: { type: Number, required: true },
        description: { type: String },
        start_date: { type: Date, required: true },
        end_date: { type: Date, required: true },
        status: { type: Boolean, required: true }
    },
    { timestamps: { createdAt: 'created_at' } }
);

export const Period = model<IPeriod>('Period', periodSchema);
