import { Schema, model } from 'mongoose';
import { IIncident } from '../interface/incident.interface';

const incidentSchema = new Schema<IIncident>(
    {
        folio: { type: Number, required: true },
        device_id: { type: Schema.Types.ObjectId, ref: 'Device', required: true },
        date: { type: Date, required: true },
        start_date: { type: Date },
        end_date: { type: Date },
        time_duration: { type: String },
        status: { type: String, required: true },
        incident_type: { type: String, required: true },
        work: { type: String, required: true },
        description: { type: String, required: true },
        priority: { type: String },
        rejected_reason: { type: String },
        qualification: { type: Number },
        comments: { type: String },
        period: { type: Number, required: true },
        technician_id: { type: Schema.Types.ObjectId, ref: 'User' },
        department_id: { type: Schema.Types.ObjectId, ref: 'Department', required: true }
    },
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export const Incident = model<IIncident>('Incident', incidentSchema);
