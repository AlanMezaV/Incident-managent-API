import { Device } from './schema/device.schema';
import { Location } from '../locations/schema/location.schema';
import { CreateDeviceDTO, UpdateDeviceDTO, DeviceSearchParamsDTO } from './dto/device.dto';
import { validateSpecs } from '../utils/validations/devicesValidations';
import { DeviceStatus } from '../utils/enum/deviceStatus';

export class DeviceService {
    //Obtener dispositivos
    async getDevices() {
        return await Device.find().populate('location_id');
    }

    //Obtener dispositivo por id
    async getDeviceById(deviceId: string) {
        return await Device.findById(deviceId).populate('location_id');
    }

    //Crear dispositivo
    async createDevice(deviceData: CreateDeviceDTO) {
        if (!validateSpecs(deviceData.type, deviceData.specs)) {
            throw new Error('Invalid device specifications for the type provided');
        }
        return await Device.create(deviceData);
    }

    //Actualizar dispositivo
    async updateDevice(deviceId: string, data: UpdateDeviceDTO) {
        const device = await Device.findById(deviceId);

        if (!device) {
            throw new Error('Device not found');
        }

        device.name = data.name ? data.name : device.name;
        device.type = data.type ? data.type : device.type;
        device.status = data.status ? data.status : device.status;
        device.specs = data.specs ? data.specs : device.specs;
        device.purchaseDate = data.purchaseDate ? data.purchaseDate : device.purchaseDate;
        device.warrantyYears = data.warrantyYears ? data.warrantyYears : device.warrantyYears;
        device.deviceModel = data.deviceModel ? data.deviceModel : device.deviceModel;
        device.brand = data.brand ? data.brand : device.brand;
        device.location_id = data.location_id ? data.location_id : device.location_id;

        if (data.specs) {
            device.specs = { ...device.specs, ...data.specs };
        }

        if (data.type && data.specs && !validateSpecs(data.type, data.specs)) {
            throw new Error('Invalid device specifications for the type provided');
        }

        return await Device.findByIdAndUpdate(deviceId, data, { new: true });
    }

    //Eliminar dispositivo
    async deleteDevice(deviceId: string) {
        return await Device.findByIdAndDelete(deviceId);
    }

    //Obtener dispositivos por criterios de busqueda
    async searchDevices(query: DeviceSearchParamsDTO) {
        const { name, type, status, location_id, department_id, building_id } = query;
        const filter: any = {};

        if (name) filter.name = { $regex: name, $options: 'i' };
        if (type) filter.type = { $regex: type, $options: 'i' };
        if (status) filter.status = { $regex: status, $options: 'i' };
        if (location_id) filter.location_id = location_id;
        if (department_id) filter.department_id = department_id;
        if (building_id) filter.building_id = building_id;

        return await Device.find(filter);
    }

    //Obtener dispositivos por departamento con criterios de busqueda
    async searchDevicesByDepartment(query: DeviceSearchParamsDTO) {
        const { department_id, building_id } = query;
        let locations = await Location.find();
        let filteredLocations = await Location.find({ department_id });

        if (!locations || locations.length === 0) {
            throw new Error('Locations not found');
        }

        if (!department_id) {
            filteredLocations = locations;
        }

        if (building_id && building_id !== 'ALL') {
            filteredLocations = locations.filter(location =>
                location.building_id.equals(building_id as string)
            );
        }

        const locationIds = filteredLocations.map(location => location._id);

        return await Device.find({ location_id: { $in: locationIds } }).populate('location_id');
    }

    //Obtener numero de dispositivos por ubicacion
    async getNumberDevicesByDepartment(department_id: string) {
        const locations = await Location.find({ department_id });

        if (!locations || locations.length === 0) {
            throw new Error('Locations not found');
        }

        const locationIds = locations.map(location => location._id);

        const devicesWorking = await Device.find({
            status: DeviceStatus.ACTIVE,
            location_id: { $in: locationIds }
        }).countDocuments();

        const devicesNumber = await Device.find({
            location_id: { $in: locationIds }
        }).countDocuments();

        const activePercentage = (devicesWorking / devicesNumber) * 100;
        return { devicesNumber, activePercentage, devicesWorking };
    }

    //Obtener numero de dispositivos
    async getNumberDevices() {
        const devicesWorking = await Device.find({
            status: DeviceStatus.ACTIVE
        }).countDocuments();

        const devicesNumber = await Device.find().countDocuments();

        const activePercentage = (devicesWorking / devicesNumber) * 100;

        return { devicesNumber, activePercentage };
    }
}
