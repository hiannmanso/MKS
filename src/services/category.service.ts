import { Injectable } from '@nestjs/common';

import { throwUnauthorizedException } from '../helper/error.helper';
import { CategoryRepository } from '../repositories/category.repository';
import {
  CategoryBody,
  CategoryBodyWithFilms,
  CategoryPostBody,
  DeleteBody,
} from '../interfaces/category.interface';
import { getClientRedis, isRedisOnline } from '../redisClient';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async findAll(): Promise<CategoryBodyWithFilms[]> {
    const cacheKey = 'categories:all';
    if (isRedisOnline()) {
      const redisClient = getClientRedis();
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        console.log(`Cached data: ${cachedData}`);
        return JSON.parse(cachedData);
      }
    }
    const categories = await this.categoryRepository.findAll();
    if (isRedisOnline()) {
      const redisClient = getClientRedis();
      await redisClient.set(cacheKey, JSON.stringify(categories), 'EX', 60);
    }
    return categories;
  }

  async findById(id: string): Promise<CategoryBodyWithFilms> {
    const cacheKey = `categories:${id}`;
    if (isRedisOnline()) {
      const redisClient = getClientRedis();
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        console.log(`Cached data: ${cachedData}`);
        return JSON.parse(cachedData);
      }
    }
    const category = await this.categoryRepository.findById(id);
    if (isRedisOnline()) {
      const redisClient = getClientRedis();
      await redisClient.set(cacheKey, JSON.stringify(category), 'EX', 60);
    }
    return category;
  }

  async create(category: CategoryPostBody): Promise<CategoryBody> {
    const existingCategory = await this.categoryRepository
      .findByName(category.name)
      .catch((error) => {
        throwUnauthorizedException(
          `An error occurred while finding the category by name: ${error}`,
        );
      });

    if (existingCategory) {
      throwUnauthorizedException(
        'This category already exists, please try other name.',
      );
    }

    const categoryData = await this.categoryRepository
      .create(category)
      .catch((error) => {
        throwUnauthorizedException(
          `An error occurred while creating the category: ${error}`,
        );
      });
    if (isRedisOnline()) {
      const redisClient = getClientRedis();
      await redisClient.del('categories:all');
    }
    return categoryData;
  }

  async update(id: string, category: CategoryBody): Promise<CategoryBody> {
    const existingCategory = await this.categoryRepository.findById(id);

    if (!existingCategory)
      throwUnauthorizedException(
        'This category does not exist. please try other id.',
      );

    const updateCategory = await this.categoryRepository.update(id, category);
    if (isRedisOnline()) {
      const redisClient = getClientRedis();
      await redisClient.del('categories:all');
    }
    return updateCategory;
  }

  async delete(id: string): Promise<DeleteBody> {
    const existingCategory = await this.categoryRepository.findById(id);
    if (!existingCategory)
      throwUnauthorizedException(
        'This category does not exist. please try other id.',
      );
    const deleteCategory = await this.categoryRepository.delete(id);
    if (isRedisOnline()) {
      const redisClient = getClientRedis();
      await redisClient.del('categories:all');
      await redisClient.del(`categories:${id}`);
    }
    return deleteCategory;
  }
}
