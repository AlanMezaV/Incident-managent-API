import { Document, Types } from 'mongoose';
import {
    IComputerSpecs,
    ILaptop,
    IPrinter,
    ISwitch,
    IRouter,
    INoBreak,
    IVoltageRegulator,
    IProjector
} from '../../utils/interfaces/devicesSpecs';
import { DeviceStatus } from '../../utils/enum/deviceStatus';

export interface IDevice extends Document {
    name: string;
    type: string;
    status: DeviceStatus;
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
    location_id: Types.ObjectId;
}
