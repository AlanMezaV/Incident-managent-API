import { Document, Types } from 'mongoose';

export interface ILocation extends Document {
    name: string;
    type: string;
    description: string;
    building_id: Types.ObjectId;
    department_id: Types.ObjectId;
    location_manager: Types.ObjectId;
}
