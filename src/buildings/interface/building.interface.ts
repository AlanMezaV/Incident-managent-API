import { Document, Types } from 'mongoose';

export interface IBuilding extends Document {
    name: string;
    description: string;
    isShared: boolean;
    departments: {
        department_id: Types.ObjectId;
        build_manager: Types.ObjectId;
    }[];
}
