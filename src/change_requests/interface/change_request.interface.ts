import { Document } from 'mongoose';
import { Types } from 'mongoose';

export interface IChangeRequest extends Document {
    piece_to_change: string;
    spare_part: string;
    device_type: string;
    make_request: boolean;
    name: string;
    price: number;
    piece_type: string;
    description: string;
    status: string;
    approval_date: Date;
    incident: Types.ObjectId;
}
