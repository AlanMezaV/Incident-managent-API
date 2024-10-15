export class createLocationDTO {
    name!: string;
    type!: string;
    description?: string;
    building_id!: string;
    department_id!: string;
    location_manager?: string;
}

export class updateLocationDTO {
    name?: string;
    type?: string;
    description?: string;
    building_id?: string;
    department_id?: string;
    location_manager?: string;
}

export class LocationSearchParamsDTO {
    name?: string;
    type?: string;
    building_id?: string;
    department_id?: string;
    location_manager?: string;
}
