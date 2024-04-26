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
import { CategoryBodyWithFilms } from 'src/interfaces/category.interface';
import { CategoryDto, CategoryPutDto } from 'src/schemas/category.schema';
import { CategoryService } from 'src/services/category.service';
import { AuthGuard } from 'src/utils/authGuard';
import { ApiTags, ApiResponse, ApiHeader, ApiBody } from '@nestjs/swagger';
@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(AuthGuard)
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Retorna o a lista de categorias cadastrada',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Token de autorização JWT',
  })
  async findAll(): Promise<CategoryBodyWithFilms[]> {
    return this.categoryService.findAll();
  }

  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Retorna as informações da categoria selecionado',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Token de autorização JWT',
  })
  @Get(':id')
  async findById(@Param('id') id: string): Promise<CategoryBodyWithFilms> {
    return this.categoryService.findById(id);
  }

  @UseGuards(AuthGuard)
  @Post()
  @ApiResponse({
    status: 200,
    description: 'Retorna a categoria criada.',
  })
  @ApiBody({
    type: CategoryDto,
    description: 'Dados para criar uma nova categoria',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Token de autorização JWT',
  })
  async create(@Body() category: CategoryDto): Promise<any> {
    return this.categoryService.create(category);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'Retorna a categoria atualizada',
  })
  @ApiBody({
    type: CategoryPutDto,
    description: 'Dados para atualizar uma categoria',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Token de autorização JWT',
  })
  async update(
    @Param('id') id: string,
    @Body() category: CategoryPutDto,
  ): Promise<any> {
    return this.categoryService.update(id, category);
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
    return this.categoryService.delete(id);
  }
}
