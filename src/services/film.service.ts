import { FilmRepository } from './../repositories/film.repository';
import { Injectable } from '@nestjs/common';
import { throwUnauthorizedException } from '../helper/error.helper';
import {
  FilmBody,
  FilmBodyResponse,
  FilmBodyWithCategories,
} from '../interfaces/film.interface';
import { FilmDto } from '../schemas/film.schema';
import { CategoryRepository } from '../repositories/category.repository';
import { DeleteBody } from '../interfaces/category.interface';
import { getClientRedis, isRedisOnline } from '../redisClient';

@Injectable()
export class FilmService {
  constructor(
    private readonly filmRepository: FilmRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async findAll(): Promise<FilmBodyWithCategories[]> {
    const cacheKey = 'films:all';
    if (isRedisOnline()) {
      const redisClient = getClientRedis();
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
    }
    const films = await this.filmRepository.findAll();
    if (isRedisOnline()) {
      const redisClient = getClientRedis();
      await redisClient.set(cacheKey, JSON.stringify(films), 'EX', 60);
    }
    return films;
  }

  async findById(id: string): Promise<FilmBodyWithCategories | null> {
    const cacheKey = `films:${id}`;
    if (isRedisOnline()) {
      const redisClient = getClientRedis();
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        console.log(`Cached data: ${cachedData}`);
        return JSON.parse(cachedData);
      }
    }
    const films = await this.filmRepository.findById(id);
    if (isRedisOnline()) {
      const redisClient = getClientRedis();
      await redisClient.set(cacheKey, JSON.stringify(films), 'EX', 60);
    }
    return films;
  }

  async create(film: FilmDto): Promise<FilmBodyResponse> {
    const existingFilm = await this.filmRepository
      .findByName(film.name)
      .catch((error) => {
        console.log(error);
        throwUnauthorizedException(
          `An error occurred while finding the film by name: ${error}`,
        );
      });

    if (existingFilm) {
      throwUnauthorizedException(
        'This Film already exists, please try other name.',
      );
    }
    const filmData = await this.filmRepository.create(film).catch((error) => {
      console.log(error);
      throwUnauthorizedException(
        `An error occurred while creating the films: ${error}`,
      );
    });
    if (isRedisOnline()) {
      const redisClient = getClientRedis();
      await redisClient.del('films:all');
    }

    return filmData;
  }

  async update(id: string, film: FilmBody): Promise<FilmBody> {
    const existingFilm = await this.filmRepository.findById(id);

    if (!existingFilm)
      throwUnauthorizedException(
        'This film does not exist. please try other id.',
      );
    console.log(id, film);

    const updatedFilm = await this.filmRepository.update(id, film);
    if (isRedisOnline()) {
      const redisClient = getClientRedis();
      await redisClient.del('films:all');
      await redisClient.del(`films:${updatedFilm.id}`);
    }
    return updatedFilm;
  }

  async delete(id: string): Promise<DeleteBody> {
    const existingFilm = await this.filmRepository.findById(id);
    if (!existingFilm)
      throwUnauthorizedException(
        'This film does not exist. please try other id.',
      );
    const deleteFilm = await this.filmRepository.delete(id);
    if (isRedisOnline()) {
      const redisClient = getClientRedis();
      await redisClient.del('films:all');
      await redisClient.del(`films:${id}`);
    }
    return deleteFilm;
  }
}
