import { Address } from "../../types/address.type";

export interface SignupDTO {
    email: string;
    name: string;
    password: string;
    address: Address;
}