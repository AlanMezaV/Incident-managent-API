import mongoose from 'mongoose';

export interface IComputerSpecs {
    os?: string;
    motherboard?: string;
    cpu?: string;
    gpu?: string;
    ram?: string;
    ramType?: string;
    storage?: string;
    powerSupply?: string;
    ipAddress?: string;
    macAddress?: string;
    connectedPort?: string;
    isShared?: boolean;
    user_id?: mongoose.Types.ObjectId;
}

export interface ILaptop {
    os?: string;
    storage?: string;
    cpu?: string;
    gpu?: string;
    ram?: string;
    ramType?: string;
    wifiConnection?: boolean;
    ipAddress?: string;
    macAddress?: string;
    connectedPort?: string;
    user_id?: mongoose.Types.ObjectId;
}

export interface IPrinter {
    printerType?: string;
    tonerType?: string;
    printerInk?: string;
    scanner?: boolean;
    wifiConnection?: boolean;
    ipAddress?: string;
    macAddress?: string;
}

export interface ISwitch {
    ports?: number;
    macAddress?: string;
}

export interface IRouter {
    routerType?: string;
    ipAddress?: string;
    macAddress?: string;
    ports?: number;
    connectivity?: string;
    capacity?: string;
}

export interface INoBreak {
    powerCapacity?: string;
    ports?: number;
    backupTime?: string;
}

export interface IVoltageRegulator {
    powerCapacity?: string;
    ports?: number;
}

export interface IProjector {
    resolution?: string;
    connectivity?: string;
    brightness?: string;
    scope?: string;
    control?: boolean;
}
