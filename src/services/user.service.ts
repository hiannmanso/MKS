import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { throwUnauthorizedException } from '../helper/error.helper';
import { UserRepository } from 'src/repositories/user.repository';
import { SignInBody, Token, UserBody } from 'src/interfaces/user.interface';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signIn(user: SignInBody): Promise<Token> {
    const isEmailUsed = await this.userRepository.findByEmail(user.email);
    if (!isEmailUsed) {
      throwUnauthorizedException('This email is not registered');
    }
    if (!bcrypt.compareSync(user.password, isEmailUsed.password)) {
      throwUnauthorizedException('Invalid password.');
    }

    const payload = { sub: isEmailUsed.id, username: isEmailUsed.name };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(user: UserBody): Promise<UserBody> {
    const isEmailUsed = await this.userRepository.findByEmail(user.email);
    if (isEmailUsed) {
      throwUnauthorizedException('This email is already registered');
    }
    const registerUser = await this.userRepository.create({
      ...user,
      password: bcrypt.hashSync(user.password, 10),
    });
    return registerUser;
  }
}
