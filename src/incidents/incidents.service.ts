import { Incident } from './schema/incident.schema';
import { Device } from '../devices/schema/device.schema';
import { DeviceStatus } from '../utils/enum/deviceStatus';
import { PeriodService } from '../periods/periods.service';
import { CreateIncidentDto, UpdateIncidentDto, SearchIncidentDto } from './dto/incident.dto';
import moment from 'moment';

export class IncidentService {
    private periodService: PeriodService;

    constructor() {
        this.periodService = new PeriodService();
    }

    //Obtener todos los Incidents
    async getIncidents() {
        return await Incident.find();
    }

    //Obtener Incident por Id
    async getIncidentById(incidentId: string) {
        return await Incident.findById(incidentId)
            .populate({
                path: 'device_id',
                populate: {
                    path: 'location_id',
                    populate: {
                        path: 'building_id'
                    }
                }
            })
            .populate('department_id');
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

        const device = await Device.findById(incidentData.device_id);

        if (!device) {
            throw new Error('Device not found');
        }

        if (incidentData.incident_type === 'MAINTANCE') {
            device.status = DeviceStatus.MAINTENANCE;
        } else {
            device.status = DeviceStatus.REPAIR;
        }

        device.save();

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
            throw new Error('Incident not found');
        }

        incident.folio = incident.folio;
        incident.department_id = incident.department_id;
        incident.period = incident.period;
        incident.device_id = incident.device_id;
        incident.start_date = data.start_date ?? incident.start_date;
        incident.end_date = data.end_date ?? incident.end_date;
        incident.time_duration = data.time_duration ?? incident.time_duration;
        incident.arrival_time = data.arrival_time ?? incident.arrival_time;
        incident.status = data.status ?? incident.status;
        incident.incident_type = data.incident_type ?? incident.incident_type;
        incident.work = data.work ?? incident.work;
        incident.technician_specialty = data.technician_specialty ?? incident.technician_specialty;
        incident.diagnostic = data.diagnostic ?? incident.diagnostic;
        incident.description = data.description ?? incident.description;
        incident.priority = data.priority ?? incident.priority;
        incident.rejected_reason = data.rejected_reason ?? incident.rejected_reason;
        incident.qualification = data.qualification ?? incident.qualification;
        incident.comments = data.comments ?? incident.comments;
        incident.technician_id = data.technician_id ?? incident.technician_id;

        if (incident.status === 'REJECTED') {
            const device = await Device.findById(incident.device_id);

            if (!device) {
                throw new Error('Device not found');
            }

            if (device.status === DeviceStatus.REPAIR) {
                device.status = DeviceStatus.INACTIVE;
            } else if (device.status === DeviceStatus.MAINTENANCE) {
                device.status = DeviceStatus.ACTIVE;
            }

            device.save();
        }

        if (incident.status === 'RELEASED') {
            const device = await Device.findById(incident.device_id);

            if (!device) {
                throw new Error('Device not found');
            }

            device.status = DeviceStatus.ACTIVE;

            device.save();
        }

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

    async getDashboardStats(departmentId: string, technicianId: string) {
        const filter: any = {};
        if (departmentId) {
            filter.department_id = departmentId;
        }

        if (technicianId) {
            filter.technician_id = technicianId;
        }

        const currentMonthStart = moment().startOf('month').toDate();
        const lastMonthStart = moment().subtract(1, 'months').startOf('month').toDate();
        const lastMonthEnd = moment().subtract(1, 'months').endOf('month').toDate();

        const totalIncidents = await Incident.countDocuments({
            ...filter,
            created_at: { $gte: currentMonthStart }
        });

        const incidentsLastMonth = await Incident.countDocuments({
            ...filter,
            created_at: { $gte: lastMonthStart, $lte: lastMonthEnd }
        });

        const totalRepairs = await Incident.countDocuments({
            ...filter,
            incident_type: 'REPAIR',
            created_at: { $gte: currentMonthStart }
        });

        const repairsLastMonth = await Incident.countDocuments({
            ...filter,
            incident_type: 'REPAIR',
            status: { $ne: 'REJECTED' },
            created_at: { $gte: lastMonthStart, $lte: lastMonthEnd }
        });

        const ongoingRepairs = await Incident.countDocuments({
            ...filter,
            incident_type: 'REPAIR',
            status: { $ne: 'RELEASED' }
        });

        const totalMaintenances = await Incident.countDocuments({
            ...filter,
            incident_type: 'MAINTANCE',
            status: { $ne: 'REJECTED' },
            created_at: { $gte: currentMonthStart }
        });

        const maintenancesLastMonth = await Incident.countDocuments({
            ...filter,
            incident_type: 'MAINTANCE',
            created_at: { $gte: lastMonthStart, $lte: lastMonthEnd }
        });

        const incidentsDifference = totalIncidents - incidentsLastMonth;
        const repairsDifference = totalRepairs - repairsLastMonth;
        const maintenancesDifference = totalMaintenances - maintenancesLastMonth;

        return {
            incidents: {
                total: totalIncidents,
                difference: incidentsDifference > 0 ? incidentsDifference : 0
            },
            repairs: {
                total: totalRepairs,
                difference: repairsDifference > 0 ? repairsDifference : 0
            },
            ongoingRepairs: {
                total: ongoingRepairs
            },
            maintenances: {
                total: totalMaintenances,
                difference: maintenancesDifference > 0 ? maintenancesDifference : 0
            }
        };
    }

    // Obtener promedio de calificación de un técnico
    async getTechnicianAverageQualification(technicianId?: string) {
        const completedIncidents = await Incident.find({
            technician_id: technicianId,
            status: 'RELEASED'
        });

        if (completedIncidents.length === 0) {
            return { technicianId, averageQualification: 0 };
        }

        const totalQualification = completedIncidents.reduce((sum, incident) => {
            return sum + (incident.qualification || 0);
        }, 0);

        const qualification = totalQualification / completedIncidents.length;

        return { qualification };
    }
}
