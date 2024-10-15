import { Schema, model } from 'mongoose';
import { IBuilding } from '../interface/building.interface';

const buildingSchema = new Schema<IBuilding>(
    {
        name: { type: String, required: true },
        description: { type: String },
        isShared: { type: Boolean, default: false },
        departments: [
            {
                department_id: {
                    type: Schema.Types.ObjectId,
                    ref: 'Department',
                    required: true
                },
                build_manager: { type: Schema.Types.ObjectId, ref: 'User', required: true }
            }
        ]
    },
    { timestamps: { createdAt: 'created_at' } }
);

export const Building = model<IBuilding>('Building', buildingSchema);
