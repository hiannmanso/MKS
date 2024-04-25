import { UserService } from '../services/user.service';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { Token, UserBody } from 'src/interfaces/user.interface';
import { SignInDto, UserDto } from 'src/schemas/user.schema';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async Login(@Body() user: SignInDto): Promise<Token> {
    return this.userService.signIn(user);
  }

  @Post()
  async Create(@Body() user: UserDto): Promise<UserBody> {
    return this.userService.signUp(user);
  }
}
