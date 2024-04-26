import { UserService } from '../services/user.service';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Token, UserBody } from 'src/interfaces/user.interface';
import { SignInDto, UserDto } from 'src/schemas/user.schema';
@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Retorna o seu token de acesso',
  })
  async Login(@Body() user: SignInDto): Promise<Token> {
    return this.userService.signIn(user);
  }

  @Post()
  @ApiResponse({
    status: 200,
    description: 'Retorna a sua conta criada',
  })
  @ApiBody({
    type: UserDto,
    description: 'Dados para criar uma nova categoria',
  })
  async Create(@Body() user: UserDto): Promise<UserBody> {
    return this.userService.signUp(user);
  }
}
