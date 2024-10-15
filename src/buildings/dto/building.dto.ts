import { Types } from 'mongoose';

export class CreateBuildingDTO {
    name!: string;
    description?: string;
    isShared?: boolean;
    departments!: {
        department_id: Types.ObjectId;
        build_manager: Types.ObjectId;
    };
}

export class UpdateBuildingDTO {
    name?: string;
    description?: string;
    isShared?: boolean;
    departments?: {
        department_id: Types.ObjectId;
        build_manager: Types.ObjectId;
    };
}

export class AddDepartmentToBuildingDTO {
    department_id!: Types.ObjectId;
    build_manager!: Types.ObjectId;
}

export class BuildingSearchParamsDTO {
    name?: string;
    description?: string;
    isShared?: boolean;
    department_id?: string;
    build_manager?: string;
}
