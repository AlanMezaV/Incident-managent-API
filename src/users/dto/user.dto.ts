export class CreateUserDTO {
    name!: string;
    email!: string;
    username!: string;
    password!: string;
    role!: string;
    position!: string;
    department_id!: string;
    imageUrl?: string;
}

export class UpdateUserDTO {
    name?: string;
    email?: string;
    username?: string;
    password?: string;
    role?: string;
    position?: string;
    department_id?: string;
    imageUrl?: string;
}

export class UserSearchParamsDTO {
    name?: string;
    email?: string;
    username?: string;
    role?: string;
    position?: string;
    department_id?: string;
}
