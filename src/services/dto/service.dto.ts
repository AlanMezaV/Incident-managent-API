export class CreateServiceDto {
    service!: string;
    type!: string;
    device_type!: string;
    description!: string;
    duration!: number;
}

export class UpdateServiceDto {
    service?: string;
    type?: string;
    device_type?: string;
    description?: string;
    duration?: number;
}
