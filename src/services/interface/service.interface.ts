import { Document } from 'mongoose';

export interface IService extends Document {
    service: string;
    type: string;
    device_type: string;
    description: string;
    duration: number;
}
