import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class CategoryDto {
  @ApiProperty({
    example: 'Romance',
    description: 'Name of the category',
  })
  @IsString({ message: 'Name must be a string' })
  @ValidateIf((o) => !!o.name)
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name: string;

  @ApiProperty({
    example: 'Descrição da categoria',
    description: 'Description of this category',
  })
  @IsString({ message: 'Description must be a string' })
  @ValidateIf((o) => !!o.description)
  @IsNotEmpty({ message: 'Description cannot be empty' })
  description: string;

  @ApiProperty({
    example: '[{"id":1},{"id":2},{"id":3},{"id":4}]',
    description: 'Id associeted films (not required)',
  })
  films: { id: number }[];
}
export class CategoryPutDto {
  @ApiProperty({
    example: 'Terror',
    description: 'Name of the category',
  })
  @IsString({ message: 'Name must be a string' })
  @ValidateIf((o) => !!o.name)
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name: string;

  @ApiProperty({
    example: 'Descrição nova da categoria',
    description: 'Description of this category',
  })
  @IsString({ message: 'Description must be a string' })
  @ValidateIf((o) => !!o.description)
  @IsNotEmpty({ message: 'Description cannot be empty' })
  description: string;
}
