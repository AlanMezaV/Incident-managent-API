import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { DeviceService } from './devices.service';
import { CreateDeviceDTO, DeviceSearchParamsDTO, UpdateDeviceDTO } from './dto/device.dto';

export class DeviceController {
    private deviceService: DeviceService;

    constructor() {
        this.deviceService = new DeviceService();
    }

    //Obtener dispositivos
    getDevices = async (req: Request, res: Response) => {
        try {
            const devices = await this.deviceService.getDevices();
            res.status(StatusCodes.OK).json(devices);
        } catch (error) {
            console.error('Error getting devices:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    //Obtener dispositivo por id
    getDeviceById = async (req: Request, res: Response) => {
        try {
            const device = await this.deviceService.getDeviceById(req.params.id);
            if (device) {
                res.status(StatusCodes.OK).json(device);
            } else {
                res.status(StatusCodes.NOT_FOUND).json({ message: 'Device not found' });
            }
        } catch (error) {
            console.error('Error getting device:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    //Crear dispositivo
    createDevice = async (req: Request, res: Response) => {
        const deviceData: CreateDeviceDTO = req.body;
        try {
            const newDevice = await this.deviceService.createDevice(deviceData);
            res.status(StatusCodes.CREATED).json({
                message: 'Device created successfully',
                newDevice
            });
        } catch (error) {
            console.error('Error creating device:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    //Actualizar dispositivo
    updateDevice = async (req: Request, res: Response) => {
        const deviceId = req.params.id;
        const deviceData: UpdateDeviceDTO = req.body;
        try {
            const updatedDevice = await this.deviceService.updateDevice(deviceId, deviceData);
            if (updatedDevice) {
                res.status(StatusCodes.OK).json({
                    message: 'Device updated successfully',
                    updatedDevice
                });
            } else {
                res.status(StatusCodes.NOT_FOUND).json({ message: 'Device not found' });
            }
        } catch (error) {
            console.error('Error updating device:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    //Eliminar dispositivo
    deleteDevice = async (req: Request, res: Response) => {
        try {
            const deletedDevice = await this.deviceService.deleteDevice(req.params.id);
            if (deletedDevice) {
                res.status(StatusCodes.OK).json({
                    message: 'Device deleted successfully',
                    deletedDevice
                });
            } else {
                res.status(StatusCodes.NOT_FOUND).json({ message: 'Device not found' });
            }
        } catch (error) {
            console.error('Error deleting device:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    //Obtener dispositivos por criterios de busqueda
    searchDevices = async (req: Request, res: Response) => {
        const query: DeviceSearchParamsDTO = req.query;
        try {
            const devices = await this.deviceService.searchDevices(query);
            res.status(StatusCodes.OK).json(devices);
        } catch (error) {
            console.error('Error searching devices:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    //Obtener dispositivos por departamento con criterios de busqueda
    searchDevicesByDepartment = async (req: Request, res: Response) => {
        const query: DeviceSearchParamsDTO = req.query;
        try {
            const devices = await this.deviceService.searchDevicesByDepartment(query);
            res.status(StatusCodes.OK).json(devices);
        } catch (error) {
            console.error('Error getting devices by department:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    //Obtener numero de dispositivos por ubicacion
    getNumberDevicesByDepartment = async (req: Request, res: Response) => {
        const departmentId = req.params.department_id;
        try {
            const totalDevices = await this.deviceService.getNumberDevicesByDepartment(
                departmentId
            );
            res.status(StatusCodes.OK).json({ totalDevices });
        } catch (error) {
            console.error('Error getting number of devices by department:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };

    //Obtener numero de dispositivos
    getNumberDevices = async (req: Request, res: Response) => {
        try {
            const totalDevices = await this.deviceService.getNumberDevices();
            res.status(StatusCodes.OK).json({ totalDevices });
        } catch (error) {
            console.error('Error getting number of devices:', error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal server error'
            });
        }
    };
}
