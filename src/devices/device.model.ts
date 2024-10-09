import mongoose, { Document, Schema, Model } from 'mongoose';
import {
    IComputerSpecs,
    ILaptop,
    IPrinter,
    ISwitch,
    IRouter,
    INoBreak,
    IVoltageRegulator,
    IProjector
} from '../utils/enum/devicesTypes';

interface IDevice extends Document {
    name: string;
    type: string;
    status: string;
    specs:
        | IComputerSpecs
        | ILaptop
        | IPrinter
        | ISwitch
        | IRouter
        | INoBreak
        | IVoltageRegulator
        | IProjector;
    purchaseDate: Date;
    warrantyYears: number;
    deviceModel: string;
    brand: string;
    location_id: mongoose.Types.ObjectId;
}

const deviceSchema = new Schema<IDevice>(
    {
        name: { type: String, required: true },
        type: { type: String, required: true },
        status: { type: String },
        specs: { type: Object, required: true },
        purchaseDate: { type: Date, required: true },
        warrantyYears: { type: Number, required: true },
        deviceModel: { type: String },
        brand: { type: String },
        location_id: { type: Schema.Types.ObjectId, ref: 'Location', required: true }
    },
    { timestamps: { createdAt: 'created_at' } }
);

const Device: Model<IDevice> = mongoose.model<IDevice>('Device', deviceSchema);

export default Device;
