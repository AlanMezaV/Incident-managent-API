import { Types } from 'mongoose';

export interface IIncident {
    folio: number;
    device_id: Types.ObjectId;
    start_date: Date;
    end_date: Date;
    arrival_time: string;
    time_duration: string;
    status: string;
    incident_type: string;
    work: string;
    technician_specialty: string;
    diagnostic: string;
    description: string;
    priority: string;
    rejected_reason: string;
    qualification: number;
    comments: string;
    period: number;
    isProblem: boolean;
    root_cause: string;
    problem_solution: string;
    technician_id: Types.ObjectId;
    department_id: Types.ObjectId;
}
