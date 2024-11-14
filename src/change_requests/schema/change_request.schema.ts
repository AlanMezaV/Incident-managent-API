import { Schema, model } from 'mongoose';
import { IChangeRequest } from '../interface/change_request.interface';

const changeRequestSchema = new Schema<IChangeRequest>(
    {
        piece_to_change: { type: String },
        spare_part: { type: String },
        device_type: { type: String },
        make_request: { type: Boolean },
        name: { type: String },
        price: { type: Number },
        piece_type: { type: String },
        description: { type: String },
        status: { type: String },
        approval_date: { type: Date },
        incident: { type: Schema.Types.ObjectId, ref: 'Incident', required: true }
    },
    { timestamps: { createdAt: 'created_at' } }
);

export const ChangeRequest = model<IChangeRequest>('ChangeRequest', changeRequestSchema);
