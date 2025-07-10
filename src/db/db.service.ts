import { Inject, Injectable } from '@nestjs/common';
import { randomInt } from 'crypto';
import { Db } from 'mongodb';
import { Users } from 'src/schema/users.schema';

@Injectable()
export class DatabaseService {

    constructor(
        @Inject('DATABASE_CONNECTION') private readonly db: Db
    ) { }


    async FindOne(col: string, findOneopts: any, options?: { projection?: any }): Promise<Users | null> {
        try {
            const response = await this.db.collection(col).findOne(findOneopts, { maxTimeMS: 5000, ...options });

            return response ? (response as unknown as Users) : null;
        } catch (error) {
            console.error(`Something went wrong at database end`, error.message);
            throw new Error(`DB FindOne failed: ${error.message}`);
        }
    }

    async FindMany(col: string, findManyOpts: any, options?: { projection?: any; sort?: any; limit?: number; skip?: number }) {
        try {

            const cursor = this.db.collection(col).find(findManyOpts, {
                maxTimeMS: 5000,
                ...options
            });

            const response = await cursor.toArray();
            return response;

        } catch (error) {
            console.error(`Something went wrong at database end`, error.message);
            throw new Error(`DB FindMany failed: ${error.message}`);
        }
    }

    async InsertOne(col: string, payload: any, idName: string) {
        try {
            payload[idName] = randomInt(100000, 1000000);
            const response = await this.db.collection(col).insertOne(payload);

            if (!response?.insertedId) return null;

            return {
                _id: response.insertedId,
                ...payload,
            };
        } catch (error) {
            console.error(`Something went wrong at database end`, error.message);
            throw new Error(`DB InserOne failed: ${error.message}`);
        }
    }


    async UpdateOne(col: string, payload: any, filter: any, options?: { projection?: any }) {
        try {
            // payload[idName] = randomInt(100000, 1000000);
            const response = await this.db.collection(col).findOneAndUpdate(filter, { $set: payload }, { returnDocument: 'after', ...options });

            return response ? response : null
        } catch (error) {
            console.error(`Something went wrong at database end`, error.message);
            throw new Error(`DB UpdateOne failed: ${error.message}`);
        }
    }

    async DeleteOne(col: string, filter: any): Promise<number> {
        try {
            const response = await this.db.collection(col).deleteOne(filter);
            return response ? response.deletedCount : 0;
        } catch (error) {
            console.error(`Something went wrong at database end`, error.message);
            throw new Error(`DB DeleteOne failed: ${error.message}`);
        }
    }

    async DeleteMany(col: string, filter: any): Promise<number> {
        try {
            const response = await this.db.collection(col).deleteMany(filter);
            return response ? response.deletedCount : 0;
        } catch (error) {
            console.error(`Something went wrong at database end`, error.message);
            throw new Error(`DB DeleteMany failed: ${error.message}`);
        }
    }

    async Count(col: string, filter: any): Promise<number> {
        try {
            const response = await this.db.collection(col).countDocuments(filter);
            return response ? response : 0;
        } catch (error) {
            console.error(`Something went wrong at database end`, error.message);
            throw new Error(`DB InserOne failed: ${error.message}`);
        }
    }
}

