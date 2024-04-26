import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Film } from './entity/film.entity';
import { Category } from './entity/category.entity';
import { CategoryController } from './controllers/category.controller';
import { CategoryService } from './services/category.service';
import { CategoryRepository } from './repositories/category.repository';
import { FilmController } from './controllers/film.controller';
import { FilmService } from './services/film.service';
import { FilmRepository } from './repositories/film.repository';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';
import { JwtModule } from '@nestjs/jwt';

import * as dotenv from 'dotenv';
import databaseConfig from './config/database';

dotenv.config();
@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([User, Film, Category]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_KEY,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  exports: [TypeOrmModule],
  controllers: [CategoryController, FilmController, UserController],
  providers: [
    CategoryService,
    CategoryRepository,
    FilmService,
    FilmRepository,
    UserService,
    UserRepository,
  ],
})
export class AppModule {}
