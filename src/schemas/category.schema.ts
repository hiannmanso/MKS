import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CategoryDto {
  @IsString({ message: 'Name must be a string' })
  @ValidateIf((o) => !!o.name)
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name: string;

  @IsString({ message: 'Description must be a string' })
  @ValidateIf((o) => !!o.description)
  @IsNotEmpty({ message: 'Description cannot be empty' })
  description: string;

  @IsArray({ message: 'films must be an array' })
  @ValidateIf((o) => !!o.films)
  @ArrayNotEmpty({ message: 'films array cannot be empty' })
  films: { id: number }[];
}
