import { SparePart } from './schema/spare_part.schema';
import {
    CreateSparePartsDto,
    UpdateSparePartsDto,
    SearchSparePartsDto
} from './dto/spare_parts.dto';

export class SparePartsService {
    // Obtener todas las piezas de repuesto
    async getSpareParts() {
        return await SparePart.find().exec();
    }

    // Obtener pieza de repuesto por id
    async getSparePartById(sparePartId: string) {
        return await SparePart.findById(sparePartId);
    }

    // Crear pieza de repuesto
    async createSparePart(sparePartData: CreateSparePartsDto) {
        const newSparePart = new SparePart({
            ...sparePartData
        });

        return await newSparePart.save();
    }

    // Actualizar pieza de repuesto
    async updateSparePart(sparePartId: string, data: UpdateSparePartsDto) {
        const updatedSparePart = await SparePart.findByIdAndUpdate(
            sparePartId,
            { ...data },
            { new: true }
        ).exec();

        if (!updatedSparePart) {
            throw new Error('Spare part not found');
        }

        return updatedSparePart;
    }

    // Eliminar pieza de repuesto
    async deleteSparePart(sparePartId: string) {
        return await SparePart.findByIdAndDelete(sparePartId);
    }

    //Buscar piezas por criterios de busqueda
    async searchSpareParts(searchData: SearchSparePartsDto) {
        const { name, type, device_type, description, price } = searchData;

        const filter: any = {};
        if (name) filter.name = { $regex: name, $options: 'i' };
        if (type) filter.type = { $regex: type, $options: 'i' };
        if (device_type && device_type !== 'ALL')
            filter.device_type = { $regex: device_type, $options: 'i' };
        if (description) filter.description = { $regex: description, $options: 'i' };
        if (price) filter.price = price;

        // Solo muestra las piezas de repuesto con cantidad mayor a 0
        filter.quantity = { $gt: 0 };
        return await SparePart.find(filter);
    }
}
