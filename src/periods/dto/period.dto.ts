export class CreatePeriodDto {
    description!: string;
    start_date!: Date;
    end_date!: Date;
    status!: boolean;
}

export class UpdatePeriodDto {
    description?: string;
    start_date?: Date;
    end_date?: Date;
}
