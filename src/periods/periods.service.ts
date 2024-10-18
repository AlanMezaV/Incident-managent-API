import { Period } from './schema/period.schema';
import { CreatePeriodDto, UpdatePeriodDto } from './dto/period.dto';

export class PeriodService {
    // Obtener el periodo activo
    async getActivePeriod() {
        const activePeriod = await Period.findOne({ status: true }).exec();
        if (!activePeriod) {
            throw new Error('No active period found');
        }
        return activePeriod;
    }

    //Obtener el ultimo periodo
    async getLastPeriod() {
        const lastPeriod = await Period.findOne().sort({ period: -1 }).exec();

        const lastPeriodNumber = lastPeriod ? lastPeriod.period : 0;
        const newPeriod = lastPeriodNumber + 1;

        return newPeriod;
    }

    // Establecer un nuevo periodo activo
    async setActivePeriod(periodId: string) {
        await Period.updateMany({ status: true }, { status: false }).exec();

        // Activar el nuevo periodo
        const updatedPeriod = await Period.findByIdAndUpdate(
            periodId,
            { status: true },
            { new: true }
        ).exec();

        if (!updatedPeriod) {
            throw new Error('Period not found');
        }

        return updatedPeriod;
    }

    // Obtener periodo por id
    async getPeriodById(periodId: string) {
        return await Period.findById(periodId);
    }

    // Crear periodo
    async createPeriod(periodData: CreatePeriodDto) {
        const lastPeriod = await this.getLastPeriod();

        const newPeriod = new Period({
            ...periodData,
            period: lastPeriod
        });

        return await newPeriod.save();
    }

    // Actualizar periodo
    async updatePeriod(periodId: string, data: UpdatePeriodDto) {
        const period = await Period.findById(periodId);

        if (!period) {
            throw new Error('Period not found');
        }

        if (data.description) period.description = data.description;
        if (data.start_date) period.start_date = data.start_date;
        if (data.end_date) period.end_date = data.end_date;

        return await period.save();
    }

    // Eliminar periodo
    async deletePeriod(periodId: string) {
        return await Period.findByIdAndDelete(periodId);
    }
}
