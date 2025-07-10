import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoClient, Db } from 'mongodb';
import { DatabaseService } from './db.service';

@Global()
@Module({
    providers: [
        {
            provide: 'DATABASE_CONNECTION',
            useFactory: async (configService: ConfigService): Promise<Db> => {
                try {

                    const uri = configService.get<string>('MONGOCONFIG.URI')!;
                    const dbName = configService.get<string>('MONGOCONFIG.DATABASE_NAME');
                    const client = await MongoClient.connect(uri, {
                    });

                    return client.db(dbName);
                } catch (e) {
                    console.error(`Something went wrong while connecting mongodb..!`)
                    throw e;
                }
            },
            inject: [ConfigService],

        },
        DatabaseService
    ],
    exports: ['DATABASE_CONNECTION', DatabaseService],
})
export class DatabaseModule { }