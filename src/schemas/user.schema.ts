import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
  @ApiProperty({
    example: 'MKS User',
    description: 'Name of the user',
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name: string;

  @ApiProperty({
    example: 'mksUser@example.com',
    description: 'Email address of the user',
  })
  @IsString({ message: 'email must be a string' })
  @IsNotEmpty({ message: 'email cannot be empty' })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Password for the user account',
  })
  @IsString({ message: 'password must be a string' })
  @IsNotEmpty({ message: 'password cannot be empty' })
  password: string;
}
export class SignInDto {
  @ApiProperty({
    example: 'mksUser@example.com',
    description: 'Email address of the user',
  })
  @IsString({ message: 'email must be a string' })
  @IsNotEmpty({ message: 'email cannot be empty' })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Password for the user account',
  })
  @IsString({ message: 'password must be a string' })
  @IsNotEmpty({ message: 'password cannot be empty' })
  password: string;
}
