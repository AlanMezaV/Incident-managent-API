import { SparePart } from './schema/spare_part.schema';
import { CreateSparePartsDto, UpdateSparePartsDto } from './dto/spare_parts.dto';

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
}
