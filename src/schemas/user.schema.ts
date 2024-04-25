import { IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name: string;

  @IsString({ message: 'email must be a string' })
  @IsNotEmpty({ message: 'email cannot be empty' })
  email: string;

  @IsString({ message: 'password must be a string' })
  @IsNotEmpty({ message: 'password cannot be empty' })
  password: string;
}
export class SignInDto {
  @IsString({ message: 'email must be a string' })
  @IsNotEmpty({ message: 'email cannot be empty' })
  email: string;

  @IsString({ message: 'password must be a string' })
  @IsNotEmpty({ message: 'password cannot be empty' })
  password: string;
}
