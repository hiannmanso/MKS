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
import { ApiBody, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  FilmBodyResponse,
  FilmBodyWithCategories,
} from 'src/interfaces/film.interface';
import { FilmDto, FilmPutDto } from 'src/schemas/film.schema';

import { FilmService } from 'src/services/film.service';
import { AuthGuard } from 'src/utils/authGuard';
@ApiTags('Films')
@Controller('film')
export class FilmController {
  constructor(private readonly filmService: FilmService) {}

  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Retorna o a lista de filmes cadastrada',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Token de autorização JWT',
  })
  @Get()
  async findAll(): Promise<FilmBodyWithCategories[]> {
    return this.filmService.findAll();
  }

  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Retorna as informações do filme selecionado',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Token de autorização JWT',
  })
  @Get(':id')
  async findById(@Param('id') id: string): Promise<FilmBodyWithCategories> {
    return this.filmService.findById(id);
  }

  @UseGuards(AuthGuard)
  @Post()
  @ApiResponse({
    status: 200,
    description: 'Retorna o filme criado',
  })
  @ApiBody({
    type: FilmDto,
    description: 'Dados para criar um novo filme',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Token de autorização JWT',
  })
  async create(@Body() film: FilmDto): Promise<FilmBodyResponse> {
    return this.filmService.create(film);
  }

  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Retorna o filme atualizado',
  })
  @ApiBody({
    type: FilmPutDto,
    description: 'Dados para atualizar um filme',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Token de autorização JWT',
  })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() film: FilmPutDto,
  ): Promise<any> {
    return this.filmService.update(id, film);
  }

  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Retorna a quantidade de itens deletado',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Token de autorização JWT',
  })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<any> {
    return this.filmService.delete(id);
  }
}
