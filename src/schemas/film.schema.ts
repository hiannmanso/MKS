import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class FilmDto {
  @ApiProperty({
    example: 'MKS Film',
    description: 'Name of the film',
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name: string;

  @ApiProperty({
    example: 'Sinopse exemple',
    description: 'Synopsis fron this film',
  })
  @IsString({ message: 'Synopsis must be a string' })
  @IsNotEmpty({ message: 'Synopsis cannot be empty' })
  synopsis: string;

  @ApiProperty({
    example: 'MKS Author',
    description: 'Name of the author',
  })
  @IsString({ message: 'author must be a string' })
  @IsNotEmpty({ message: 'author cannot be empty' })
  author: string;

  @ApiProperty({
    example: '1998',
    description: 'year of film release',
  })
  @IsNumber()
  @IsNotEmpty({ message: 'year cannot be empty' })
  year: number;

  @ApiProperty({
    example: '[{"id":1},{"id":2},{"id":3},{"id":4}]',
    description: 'CategoriesId associated with this film',
  })
  @IsArray({ message: 'Categories must be an array' })
  @ArrayNotEmpty({ message: 'Categories array cannot be empty' })
  categories: { id: number }[];
}
export class FilmPutDto {
  @ApiProperty({
    example: 'MKS Film 2',
    description: 'Name of the film',
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name: string;

  @ApiProperty({
    example: 'Nova Sinopse exemple',
    description: 'Synopsis fron this film',
  })
  @IsString({ message: 'Synopsis must be a string' })
  @IsNotEmpty({ message: 'Synopsis cannot be empty' })
  synopsis: string;

  @ApiProperty({
    example: 'MKS Author atualizado',
    description: 'Name of the author',
  })
  @IsString({ message: 'author must be a string' })
  @IsNotEmpty({ message: 'author cannot be empty' })
  author: string;

  @ApiProperty({
    example: '2001',
    description: 'year of film release',
  })
  @IsNumber()
  @IsNotEmpty({ message: 'year cannot be empty' })
  year: number;
}
