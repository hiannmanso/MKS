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
import { CategoryDto } from 'src/schemas/category.schema';
import { CategoryService } from 'src/services/category.service';
import { AuthGuard } from 'src/utils/authGuard';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(AuthGuard)
  @Get()
  async findAll(): Promise<CategoryBodyWithFilms[]> {
    return this.categoryService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findById(@Param('id') id: string): Promise<CategoryBodyWithFilms> {
    return this.categoryService.findById(id);
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() category: CategoryDto): Promise<any> {
    return this.categoryService.create(category);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() category: CategoryDto,
  ): Promise<any> {
    return this.categoryService.update(id, category);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<any> {
    return this.categoryService.delete(id);
  }
}
