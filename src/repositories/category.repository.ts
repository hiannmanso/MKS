import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from '../entity/category.entity';
import {
  CategoryBodyWithFilms,
  CategoryPostBody,
  DeleteBody,
} from 'src/interfaces/category.interface';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<CategoryBodyWithFilms[]> {
    return this.categoryRepository.find({
      relations: ['films'],
    });
  }

  async findById(id: string): Promise<CategoryBodyWithFilms | null> {
    const category = await this.categoryRepository.findOne({
      where: { id: Number(id) },
      relations: ['films'],
    });

    return category;
  }

  async findByName(name: string): Promise<CategoryBodyWithFilms | null> {
    return this.categoryRepository.findOne({ where: { name } });
  }

  async create(category: CategoryPostBody): Promise<CategoryBodyWithFilms> {
    const newCategory = this.categoryRepository.create(category);
    return this.categoryRepository.save(newCategory);
  }

  async update(
    id: string,
    category: Partial<Category>,
  ): Promise<CategoryBodyWithFilms> {
    await this.categoryRepository.update(id, category);
    return this.findById(id);
  }

  async delete(id: string): Promise<DeleteBody> {
    const result = await this.categoryRepository.delete(id);
    return result;
  }
}
