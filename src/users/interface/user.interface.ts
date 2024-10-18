import { Document, Types } from 'mongoose';
import { UserRoles } from '../../utils/enum/userRoles';

export interface IUser extends Document {
    name: string;
    username: string;
    email: string;
    password: string;
    role: UserRoles;
    position: string;
    department_id: Types.ObjectId;
    imageUrl: string;
}
