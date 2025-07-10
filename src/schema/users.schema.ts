import { ROLES } from "../enums/roles.enum";
import { STATUS } from "../enums/status.enum";


export class Users {
    userId: number;
    accountId: number;
    status: STATUS;
    name: string;
    email: string;
    role: ROLES;
    password: string;
}