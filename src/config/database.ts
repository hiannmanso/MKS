import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Film } from '../entity/film.entity';
import { Category } from '../entity/category.entity';
import * as dotenv from 'dotenv';
dotenv.config();
let databaseConfig: TypeOrmModuleOptions;

if (process.env.STATUS == 'PROD') {
  databaseConfig = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User, Film, Category],
    ssl: true,
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
    synchronize: true,
  };
} else {
  databaseConfig = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User, Film, Category],
    synchronize: true,
  };
}

export default databaseConfig;
