export class CreateChangeRequestDTO {
    piece_to_change?: string;
    spare_part?: string;
    device_type?: string;
    make_request!: boolean;
    name?: string;
    price?: number;
    piece_type?: string;
    description?: string;
    incident!: string;
}

export class UpdateChangeRequestDTO {
    piece_to_change?: string;
    spare_part?: string;
    name?: string;
    price?: number;
    piece_type?: string;
    description?: string;
    status?: string;
    approval_date?: Date;
}

export class ChangeRequestSearchParamsDTO {
    piece_to_change?: string;
    spare_part?: string;
    device_type?: string;
    status?: string;
    approval_date?: Date;
    technician_id?: string;
}
