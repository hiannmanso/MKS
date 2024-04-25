import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  FilmBodyResponse,
  FilmBodyWithCategories,
} from 'src/interfaces/film.interface';
import { FilmDto, FilmPutDto } from 'src/schemas/film.schema';

import { FilmService } from 'src/services/film.service';
import { AuthGuard } from 'src/utils/authGuard';

@Controller('film')
export class FilmController {
  constructor(private readonly filmService: FilmService) {}

  @UseGuards(AuthGuard)
  @Get()
  async findAll(): Promise<FilmBodyWithCategories[]> {
    return this.filmService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findById(@Param('id') id: string): Promise<FilmBodyWithCategories> {
    return this.filmService.findById(id);
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() film: FilmDto): Promise<FilmBodyResponse> {
    return this.filmService.create(film);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() film: FilmPutDto,
  ): Promise<any> {
    return this.filmService.update(id, film);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<any> {
    return this.filmService.delete(id);
  }
}
