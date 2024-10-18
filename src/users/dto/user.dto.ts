import { UserRoles } from '../../utils/enum/userRoles';

export class CreateUserDTO {
    name!: string;
    email!: string;
    username!: string;
    password!: string;
    role!: UserRoles;
    position!: string;
    department_id!: string;
    imageUrl?: string;
}

export class UpdateUserDTO {
    name?: string;
    email?: string;
    username?: string;
    password?: string;
    role?: UserRoles;
    position?: string;
    department_id?: string;
    imageUrl?: string;
}

export class UserSearchParamsDTO {
    name?: string;
    email?: string;
    username?: string;
    role?: UserRoles;
    position?: string;
    department_id?: string;
}
