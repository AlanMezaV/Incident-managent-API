import { Types } from 'mongoose';
import { DeviceStatus } from '../../utils/enum/deviceStatus';
import {
    IComputerSpecs,
    ILaptop,
    IPrinter,
    INoBreak,
    IProjector,
    IRouter,
    ISwitch,
    IVoltageRegulator
} from '../../utils/interfaces/devicesSpecs';

export class CreateDeviceDTO {
    name!: string;
    type!: string;
    status!: string;
    specs!:
        | IComputerSpecs
        | ILaptop
        | IPrinter
        | ISwitch
        | IRouter
        | INoBreak
        | IVoltageRegulator
        | IProjector;
    purchaseDate!: Date;
    warrantyYears!: number;
    deviceModel!: string;
    brand!: string;
    location_id!: Types.ObjectId;
}

export class UpdateDeviceDTO {
    name?: string;
    type?: string;
    status?: DeviceStatus;
    specs?:
        | IComputerSpecs
        | ILaptop
        | IPrinter
        | ISwitch
        | IRouter
        | INoBreak
        | IVoltageRegulator
        | IProjector;
    purchaseDate?: Date;
    warrantyYears?: number;
    deviceModel?: string;
    brand?: string;
    location_id?: Types.ObjectId;
}

export class DeviceSearchParamsDTO {
    name?: string;
    type?: string;
    status?: string;
    location_id?: Types.ObjectId;
    department_id?: Types.ObjectId;
    building_id?: Types.ObjectId | string;
}
