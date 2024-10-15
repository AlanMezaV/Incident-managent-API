import { Document, Types } from 'mongoose';

export interface IUser extends Document {
    name: string;
    username: string;
    email: string;
    password: string;
    role: string;
    position: string;
    department_id: Types.ObjectId;
    imageUrl: string;
}
