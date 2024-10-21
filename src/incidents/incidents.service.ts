import { Incident } from './schema/incident.schema';
import { PeriodService } from '../periods/periods.service';
import { CreateIncidentDto, UpdateIncidentDto, SearchIncidentDto } from './dto/incident.dto';

export class IncidentService {
    private periodService: PeriodService;

    constructor() {
        this.periodService = new PeriodService();
    }

    //Obtener todos los Incidents
    async getIncidents() {
        return await Incident.find();
    }

    //Obtener Incident por id
    async getIncidentById(incidentId: string) {
        return await Incident.findById(incidentId);
    }

    async getNewFolio() {
        const lastIncident = await Incident.findOne().sort({ folio: -1 }).exec();
        const lastFolio = lastIncident ? lastIncident.folio : 0;
        return lastFolio + 1;
    }

    //Crear Incident
    async createIncident(incidentData: CreateIncidentDto) {
        const lastIncident = await Incident.findOne().sort({ folio: -1 }).exec();
        const lastFolio = lastIncident ? lastIncident.folio : 0;
        const newFolio = lastFolio + 1;
        const period = await this.periodService.getLastPeriod();

        const newIncident = new Incident({
            ...incidentData,
            folio: newFolio,
            period: period
        });

        return await newIncident.save();
    }

    // Actualizar Incident
    async updateIncident(incidentId: string, data: UpdateIncidentDto) {
        const incident = await Incident.findById(incidentId);

        if (!incident) {
            return null;
        }

        incident.start_date = data.start_date ?? incident.start_date;
        incident.end_date = data.end_date ?? incident.end_date;
        incident.time_duration = data.time_duration ?? incident.time_duration;
        incident.status = data.status ?? incident.status;
        incident.incident_type = data.incident_type ?? incident.incident_type;
        incident.work = data.work ?? incident.work;
        incident.description = data.description ?? incident.description;
        incident.priority = data.priority ?? incident.priority;
        incident.rejected_reason = data.rejected_reason ?? incident.rejected_reason;
        incident.qualification = data.qualification ?? incident.qualification;
        incident.comments = data.comments ?? incident.comments;
        incident.technician_id = data.technician_id ?? incident.technician_id;

        return await incident.save();
    }

    //Eliminar Incident
    async deleteIncident(incidentId: string) {
        return await Incident.findByIdAndDelete(incidentId);
    }

    //Obtener incidentes por criterios de busqueda
    async searchIncidents(query: SearchIncidentDto) {
        const filter: any = {};

        if (query.folio) filter.folio = query.folio;
        if (query.device_id) filter.device_id = query.device_id;
        if (query.date) filter.date = query.date;
        if (query.status) filter.status = { $regex: query.status, $options: 'i' };
        if (query.incident_type)
            filter.incident_type = { $regex: query.incident_type, $options: 'i' };
        if (query.work) filter.work = { $regex: query.work, $options: 'i' };
        if (query.priority) filter.priority = query.priority;
        if (query.department_id) filter.department_id = query.department_id;
        if (query.technician_id) filter.technician_id = query.technician_id;
        if (query.period) filter.period = query.period;

        return await Incident.find(filter);
    }
}
