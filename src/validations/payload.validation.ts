import * as joi from 'joi';
import { ROLES } from 'src/enums/roles.enum';

export class JoiValidationSchema {

    static signupSchema = joi.object({
        name: joi.string().min(2).max(50).required(),
        email: joi.string().email().required(),
        password: joi.string().min(8).max(100).required(),
    });

    static signinSchema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(8).max(100).required(),
    });


    static addUserchema = joi.object({
        name: joi.string().min(2).max(100).required(),
        email: joi.string().email().required(),
        password: joi.string().min(8).max(100).required(),
        role: joi.string().valid(...Object.values(ROLES)).required(),
        status: joi.number().integer().required(),
    });

    static updateUserchema = joi.object({
        name: joi.string().min(2).max(100).required(),
        role: joi.string().valid(...Object.values(ROLES)).required(),
        status: joi.number().integer().required(),
    });

    static Pagination = joi.object({
        offset: joi.number().integer().optional().default(1),
        limit: joi.number().integer().optional().default(10),
    });
}