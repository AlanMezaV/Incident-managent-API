import { Document } from 'mongoose';

export interface ISparePart extends Document {
    name: string;
    type: string;
    device_type: string;
    description: string;
    quantity: number;
    price: number;
}
