import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Film } from '../entity/film.entity';
import {
  FilmBodyResponse,
  FilmBodyWithCategories,
} from '../interfaces/film.interface';
import { FilmDto, FilmPutDto } from '../schemas/film.schema';
import { DeleteBody } from 'src/interfaces/category.interface';

@Injectable()
export class FilmRepository {
  constructor(
    @InjectRepository(Film)
    private readonly filmRepository: Repository<Film>,
  ) {}

  async findAll(): Promise<FilmBodyWithCategories[]> {
    return this.filmRepository.find({
      relations: ['categories'],
    });
  }

  async findById(id: string): Promise<FilmBodyWithCategories | null> {
    const category = await this.filmRepository.findOne({
      where: { id: Number(id) },
      relations: ['categories'],
    });
    if (!category) {
      throw new NotFoundException(`Film with ID ${id} not found`);
    }
    return category;
  }

  async findByName(name: string): Promise<FilmBodyWithCategories | null> {
    return this.filmRepository.findOne({ where: { name } });
  }

  async create(film: FilmDto): Promise<FilmBodyResponse> {
    const newFilm = this.filmRepository.create(film);
    return this.filmRepository.save(newFilm);
  }

  async update(id: string, category: FilmPutDto): Promise<any> {
    await this.filmRepository.update(id, category);
    return this.findById(id);
  }

  async delete(id: string): Promise<DeleteBody> {
    const result = await this.filmRepository.delete(id);
    return result;
  }
}
