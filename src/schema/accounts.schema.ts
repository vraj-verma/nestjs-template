import { STATUS } from "../enums/status.enum";
import { Address } from "../types/address.type";

export class Accounts {
    accountId: number;
    status: STATUS;
    address: Address;
}