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

// Create a device
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

    try {
        const device = new Device({
            name,
            type,
            status,
            specs,
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

// Update a device by id
export const updateDevice = async (req: Request, res: Response) => {
    const { id } = req.params;
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

    try {
        const device = await Device.findById(id);

        if (!device) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Device not found' });
        }

        // Actualizar los campos del dispositivo
        device.name = name || device.name;
        device.type = type || device.type;
        device.status = status || device.status;
        device.specs = { ...device.specs, ...specs }; // Actualizar specs
        device.purchaseDate = purchaseDate || device.purchaseDate;
        device.warrantyYears = warrantyYears || device.warrantyYears;
        device.deviceModel = deviceModel || device.deviceModel;
        device.brand = brand || device.brand;
        device.location_id = location_id || device.location_id;

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
