import { FilmRepository } from './../repositories/film.repository';
import { Injectable } from '@nestjs/common';
import { throwUnauthorizedException } from '../helper/error.helper';
import {
  FilmBody,
  FilmBodyResponse,
  FilmBodyWithCategories,
  FilterOptions,
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

  async findAll(filters: FilterOptions): Promise<FilmBodyWithCategories[]> {
    const cacheKey = this.generateCacheKey(filters);
    console.log(cacheKey);
    const redisClient = getClientRedis();
    if (isRedisOnline()) {
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
    }

    const films = await this.filmRepository.findAll(filters);

    if (isRedisOnline()) {
      const redisClient = getClientRedis();
      await redisClient.set(cacheKey, JSON.stringify(films), 'EX', 60);
    }

    return films;
  }

  private generateCacheKey(filters: FilterOptions): string {
    const keys = Object.keys(filters);
    if (keys.length === 0) {
      return 'films:all';
    }
    const cacheKeyParts = keys.map((key) => `${key}:${filters[key]}`);
    return `films:${cacheKeyParts.join('&')}`;
  }

  async findById(id: string): Promise<FilmBodyWithCategories | null> {
    const cacheKey = `films:${id}`;
    const redisClient = getClientRedis();
    if (isRedisOnline()) {
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
    }
    const films = await this.filmRepository.findById(id);

    if (isRedisOnline()) {
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
    const redisClient = getClientRedis();
    if (isRedisOnline()) {
      await redisClient.del('films:all');
      await redisClient.del(`films:year:${filmData.year}`);
      await redisClient.del(`films:author:${filmData.author}`);
      await redisClient.del(`films:name:${filmData.name}`);
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
    const redisClient = getClientRedis();
    const updatedFilm = await this.filmRepository.update(id, film);

    if (isRedisOnline()) {
      await redisClient.del('films:all');
      await redisClient.del(`films:${updatedFilm.id}`);
      await redisClient.del(`films:year:${film.year}`);
      await redisClient.del(`films:author:${film.author}`);
      await redisClient.del(`films:name:${film.name}`);
      await redisClient.del(`films:year:${updatedFilm.year}`);
      await redisClient.del(`films:author:${updatedFilm.author}`);
      await redisClient.del(`films:name:${updatedFilm.name}`);
    }
    return updatedFilm;
  }

  async delete(id: string): Promise<DeleteBody> {
    const existingFilm = await this.filmRepository.findById(id);

    if (!existingFilm)
      throwUnauthorizedException(
        'This film does not exist. please try other id.',
      );
    const redisClient = getClientRedis();
    const deleteFilm = await this.filmRepository.delete(id);

    if (isRedisOnline()) {
      await redisClient.del('films:all');
      await redisClient.del(`films:${id}`);
      await redisClient.del(`films:year:${existingFilm.year}`);
      await redisClient.del(`films:author:${existingFilm.author}`);
      await redisClient.del(`films:name:${existingFilm.name}`);
    }
    return deleteFilm;
  }
}
