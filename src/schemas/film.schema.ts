import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class FilmDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name: string;

  @IsString({ message: 'Synopsis must be a string' })
  @IsNotEmpty({ message: 'Synopsis cannot be empty' })
  synopsis: string;

  @IsString({ message: 'author must be a string' })
  @IsNotEmpty({ message: 'author cannot be empty' })
  author: string;

  @IsNumber()
  @IsNotEmpty({ message: 'year cannot be empty' })
  year: number;

  @IsArray({ message: 'Categories must be an array' })
  @ArrayNotEmpty({ message: 'Categories array cannot be empty' })
  categories: { id: number }[];
}
export class FilmPutDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name: string;

  @IsString({ message: 'Synopsis must be a string' })
  @IsNotEmpty({ message: 'Synopsis cannot be empty' })
  synopsis: string;

  @IsString({ message: 'author must be a string' })
  @IsNotEmpty({ message: 'author cannot be empty' })
  author: string;

  @IsNumber()
  @IsNotEmpty({ message: 'year cannot be empty' })
  year: number;
}
