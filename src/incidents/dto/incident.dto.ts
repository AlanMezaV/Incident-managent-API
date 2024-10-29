import { Types } from 'mongoose';

export class CreateIncidentDto {
    device_id!: Types.ObjectId;
    date!: Date;
    status!: string;
    incident_type!: string;
    work!: string;
    period!: number;
    description!: string;
    department_id!: Types.ObjectId;
}

export class UpdateIncidentDto {
    start_date?: Date;
    end_date?: Date;
    time_duration?: string;
    arrival_time?: string;
    status?: string;
    incident_type?: string;
    work?: string;
    description?: string;
    priority?: string;
    rejected_reason?: string;
    qualification?: number;
    comments?: string;
    technician_id?: Types.ObjectId;
}

export class SearchIncidentDto {
    folio?: number;
    device_id?: Types.ObjectId;
    date?: Date;
    status?: string;
    incident_type?: string;
    work?: string;
    priority?: string;
    department_id?: Types.ObjectId;
    technician_id?: Types.ObjectId;
    period?: number;
}
