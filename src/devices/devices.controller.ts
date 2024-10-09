import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Device from './device.model';
import Location from '../locations/location.model';
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

const validateSpecs = (type: string, specs: any): boolean => {
    switch (type) {
        case 'PC':
            const {
                os: pcOs,
                motherboard: pcMotherboard,
                cpu: pcCpu,
                ram: pcRam,
                ramType: pcRamType,
                storage: pcStorage,
                powerSupply: pcPowerSupply
            } = specs as IComputerSpecs;
            if (
                !pcOs ||
                !pcMotherboard ||
                !pcCpu ||
                !pcRam ||
                !pcRamType ||
                !pcStorage ||
                !pcPowerSupply
            ) {
                return false;
            }
            break;
        case 'LAPTOP':
            const {
                os: laptopOs,
                storage: laptopStorage,
                cpu: laptopCpu,
                ram: laptopRam,
                ramType: laptopRamType
            } = specs as ILaptop;
            if (!laptopOs || !laptopStorage || !laptopCpu || !laptopRam || !laptopRamType) {
                return false;
            }
            break;
        case 'PRINTER':
            const {
                printerType,
                tonerType,
                printerInk,
                scanner: printerScanner,
                wifiConnection: printerWifiConnection
            } = specs as IPrinter;
            if (
                !printerType ||
                !tonerType ||
                !printerInk ||
                !printerScanner ||
                !printerWifiConnection
            ) {
                return false;
            }
            break;
        case 'SWITCH':
            const { ports: switchPorts, macAddress: switchMacAddress } = specs as ISwitch;
            if (!switchPorts || !switchMacAddress) {
                return false;
            }
            break;
        case 'ROUTER':
            const { routerType, ports: routerPorts } = specs as IRouter;
            if (!routerType || !routerPorts) {
                return false;
            }
            break;
        case 'NO-BREAK':
            const { powerCapacity, ports: noBreakPorts, backupTime } = specs as INoBreak;
            if (!powerCapacity || !noBreakPorts || !backupTime) {
                return false;
            }
            break;
        case 'VOLTAGE-REGULATOR':
            const { powerCapacity: vrPowerCapacity, ports: vrPorts } = specs as IVoltageRegulator;
            if (!vrPowerCapacity || !vrPorts) {
                return false;
            }
            break;
        case 'PROJECTOR':
            const { resolution, connectivity } = specs as IProjector;
            if (!resolution || !connectivity) {
                return false;
            }
            break;
        default:
            return false;
    }
    return true;
};

// Get all devices
export const getDevices = async (req: Request, res: Response): Promise<void> => {
    try {
        const devices = await Device.find();
        res.status(StatusCodes.OK).json(devices);
    } catch (error) {
        console.error('Error getting devices:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};

// Get a device by id
export const getDeviceById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const device = await Device.findById(id).populate('location_id');
        if (device) {
            res.status(StatusCodes.OK).json(device);
        } else {
            res.status(StatusCodes.NOT_FOUND).json({ message: 'Device not found' });
        }
    } catch (error) {
        console.error('Error getting device:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};
export const createDevice = async (req: Request, res: Response) => {
    const {
        name,
        type,
        status,
        specs,
        purchaseDate,
        warrantyYears,
        deviceModel,
        brand,
        location_id
    } = req.body;

    if (!validateSpecs(type, specs)) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: 'Invalid device specifications for the type provided' });
    }

    try {
        const device = new Device({
            name,
            type,
            specs,
            status,
            purchaseDate,
            warrantyYears,
            deviceModel,
            brand,
            location_id
        });

        const newDevice = await device.save();
        return res.status(StatusCodes.CREATED).json(newDevice);
    } catch (error) {
        console.error('Error creating device:', error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: 'Internal server error' });
    }
};

export const updateDevice = async (req: Request, res: Response) => {
    const { id } = req.params;
    const {
        name,
        type,
        specs,
        status,
        purchaseDate,
        warrantyYears,
        deviceModel,
        brand,
        location_id
    } = req.body;

    try {
        const device = await Device.findById(id);

        if (!device) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Device not found' });
        }

        device.name = name || device.name;
        device.type = type || device.type;
        device.status = status || device.status;
        device.purchaseDate = purchaseDate || device.purchaseDate;
        device.warrantyYears = warrantyYears || device.warrantyYears;
        device.deviceModel = deviceModel || device.deviceModel;
        device.brand = brand || device.brand;
        device.location_id = location_id || device.location_id;

        if (specs) {
            device.specs = { ...device.specs, ...specs };
        }

        if (device.type && device.specs && !validateSpecs(device.type, device.specs)) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: 'Invalid device specifications for the type provided' });
        }

        const updatedDevice = await device.save();
        return res.status(StatusCodes.OK).json(updatedDevice);
    } catch (error) {
        console.error('Error updating device:', error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: 'Internal server error' });
    }
};

// Delete a device by id
export const deleteDevice = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const device = await Device.findByIdAndDelete(id);
        if (device) {
            return res.status(StatusCodes.OK).json({ message: 'Device deleted successfully' });
        } else {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Device not found' });
        }
    } catch (error) {
        console.error('Error deleting device:', error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: 'Internal server error' });
    }
};

// Get devices by location id
export const getDevicesByLocationId = async (req: Request, res: Response) => {
    const { location_id } = req.params;
    try {
        const devices = await Device.find({ location_id });
        res.status(StatusCodes.OK).json(devices);
    } catch (error) {
        console.error('Error getting devices by location id:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};

// Search method
export const searchDevices = async (req: Request, res: Response) => {
    const { name, type, status, deviceModel, brand, locationId } = req.query;
    try {
        const filters: any = {};
        if (name) filters.name = { $regex: new RegExp(name as string, 'i') };
        if (type) filters.type = type;
        if (status) filters.status = status;
        if (deviceModel) filters.deviceModel = deviceModel;
        if (brand) filters.brand = brand;
        if (locationId) filters.location_id = locationId;

        const devices = await Device.find(filters);

        if (devices.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Devices not found' });
        }

        return res.status(StatusCodes.OK).json(devices);
    } catch (error) {
        console.error('Error searching devices:', error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: 'Internal server error' });
    }
};

export const getDevicesByDepartmentId = async (req: Request, res: Response) => {
    const { department_id } = req.params;
    try {
        const locations = await Location.find({ department_id });

        if (!locations || locations.length === 0) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: 'No locations found for the given department' });
        }

        const locationIds = locations.map(location => location._id);

        // Busca los dispositivos y popula el campo location_id
        const devices = await Device.find({ location_id: { $in: locationIds } }).populate(
            'location_id'
        );

        if (devices.length === 0) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: 'No devices found for the given department' });
        }

        return res.status(StatusCodes.OK).json(devices);
    } catch (error) {
        console.error('Error fetching devices by department_id:', error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: 'Internal server error' });
    }
};
