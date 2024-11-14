export class CreateSparePartsDto {
    name!: string;
    type!: string;
    device_type!: string;
    description!: string;
    quantity!: number;
    price!: number;
}

export class UpdateSparePartsDto {
    name?: string;
    type?: string;
    device_type?: string;
    description?: string;
    quantity?: number;
    price?: number;
}
