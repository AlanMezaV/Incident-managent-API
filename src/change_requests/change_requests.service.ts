import { ChangeRequest } from './schema/change_request.schema';
import { Incident } from '../incidents/schema/incident.schema';
import { Device } from '../devices/schema/device.schema';
import { SparePart } from '../spare_parts/schema/spare_part.schema';
import {
    CreateChangeRequestDTO,
    UpdateChangeRequestDTO,
    ChangeRequestSearchParamsDTO
} from './dto/change_request.dto';

export class ChangeRequestService {
    // Obtener ChangeRequest por id
    async getChangeRequestById(changeRequestId: string) {
        return await ChangeRequest.findById(changeRequestId).populate({
            path: 'incident',
            populate: {
                path: 'device_id',
                model: 'Device'
            }
        });
    }

    //Crear ChangeRequest
    async createChangeRequest(data: CreateChangeRequestDTO) {
        const changeRequest = new ChangeRequest(data);

        const sparePartRequest = await SparePart.find({ name: data.spare_part });

        if (!data.price && sparePartRequest) {
            data.price = sparePartRequest[0].price;
        }

        if (data.price && data.price > 1000) {
            changeRequest.make_request = true;
            changeRequest.price = data.price;
            changeRequest.status = 'SENT';
            return await changeRequest.save();
        }

        const incident = await Incident.findById(data.incident);

        if (!incident) {
            throw new Error('Incident not found');
        }

        const device = await Device.findById(incident.device_id);

        if (!device) {
            throw new Error('Device not found');
        }

        if (data.make_request && data.price && data.price < 1000) {
            data.spare_part = data.name;
            if (
                data.spare_part &&
                data.piece_to_change &&
                device.specs.hasOwnProperty(data.piece_to_change)
            ) {
                (device.specs as any)[data.piece_to_change] = data.spare_part;
                device.markModified('specs');
            }
            await device.save();
        } else {
            if (
                data.spare_part &&
                data.piece_to_change &&
                device.specs.hasOwnProperty(data.piece_to_change)
            ) {
                (device.specs as any)[data.piece_to_change] = data.spare_part;
                device.markModified('specs');
            }
            await device.save();

            const sparePart = sparePartRequest[0];
            sparePart.quantity -= 1;
            await sparePart.save();
        }
        changeRequest.price = data.price ?? 0;
        changeRequest.status = 'APPROVED';
        changeRequest.approval_date = new Date();
        return await changeRequest.save();
    }

    // Actualizar ChangeRequest
    async updateChangeRequest(changeRequestId: string, data: UpdateChangeRequestDTO) {
        const changeRequest = await ChangeRequest.findById(changeRequestId);

        if (!changeRequest) {
            return null;
        }

        changeRequest.piece_to_change = data.piece_to_change ?? changeRequest.piece_to_change;
        changeRequest.spare_part = data.spare_part ?? changeRequest.spare_part;
        changeRequest.name = data.name ?? changeRequest.name;
        changeRequest.price = data.price ?? changeRequest.price;
        changeRequest.piece_type = data.piece_type ?? changeRequest.piece_type;
        changeRequest.description = data.description ?? changeRequest.description;
        changeRequest.status = data.status ?? changeRequest.status;
        changeRequest.approval_date = data.approval_date ?? changeRequest.approval_date;

        return await changeRequest.save();
    }

    //Aprobar ChangeRequest
    async approveChangeRequest(changeRequestId: string) {
        const changeRequest = await ChangeRequest.findById(changeRequestId);

        if (!changeRequest) {
            return null;
        }

        const incident = await Incident.findById(changeRequest.incident);

        if (!incident) {
            throw new Error('Incident not found');
        }

        const device = await Device.findById(incident.device_id);

        if (!device) {
            throw new Error('Device not found');
        }

        if (
            changeRequest.name &&
            changeRequest.piece_type &&
            device.specs.hasOwnProperty(changeRequest.piece_type)
        ) {
            changeRequest.spare_part = changeRequest.name;
            if (
                changeRequest.spare_part &&
                changeRequest.piece_to_change &&
                device.specs.hasOwnProperty(changeRequest.piece_to_change)
            ) {
                (device.specs as any)[changeRequest.piece_to_change] = changeRequest.spare_part;
                device.markModified('specs');
            }
            await device.save();
        } else {
            if (
                changeRequest.spare_part &&
                changeRequest.piece_to_change &&
                device.specs.hasOwnProperty(changeRequest.piece_to_change)
            ) {
                (device.specs as any)[changeRequest.piece_to_change] = changeRequest.spare_part;
                device.markModified('specs');
            }
            await device.save();

            const spareParts = await SparePart.find({ name: changeRequest.spare_part });

            if (spareParts.length === 0) {
                throw new Error('Spare part not found');
            }

            const sparePart = spareParts[0];
            sparePart.quantity -= 1;
            await sparePart.save();
        }

        changeRequest.status = 'APPROVED';
        changeRequest.approval_date = new Date();
        return await changeRequest.save();
    }

    //Rechazar ChangeRequest
    async rejectChangeRequest(changeRequestId: string) {
        const changeRequest = await ChangeRequest.findById(changeRequestId);

        if (!changeRequest) {
            return null;
        }

        changeRequest.status = 'REJECTED';

        return await changeRequest.save();
    }

    //Eliminar ChangeRequest
    async deleteChangeRequest(changeRequestId: string) {
        return await ChangeRequest.findByIdAndDelete(changeRequestId);
    }

    //Buscar ChangeRequest por criterios de busqueda
    async searchChangeRequests(query: ChangeRequestSearchParamsDTO) {
        const { piece_to_change, spare_part, device_type, status, approval_date, technician_id } =
            query;

        const filter: any = {};

        if (piece_to_change) filter.piece_to_change = { $regex: piece_to_change, $options: 'i' };
        if (spare_part) filter.spare_part = { $regex: spare_part, $options: 'i' };
        if (device_type) filter.device_type = { $regex: device_type, $options: 'i' };
        if (status) filter.status = { $regex: status, $options: 'i' };
        if (approval_date) filter.approval_date = approval_date;

        if (technician_id) {
            filter.incident = await Incident.find({ technician_id }).select('_id');
        }

        return await ChangeRequest.find(filter).populate({
            path: 'incident',
            populate: {
                path: 'device_id',
                model: 'Device'
            }
        });
    }
}
