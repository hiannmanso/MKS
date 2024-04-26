import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../services/user.service';
import { UserRepository } from '../repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { UserBody, SignInBody } from '../interfaces/user.interface';

const mockUserRepository = {
  findByEmail: jest.fn(),
  create: jest.fn(),
};

const mockJwtService = {
  signAsync: jest.fn().mockResolvedValue('fake_token'),
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: mockUserRepository },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signIn', () => {
    it('should sign in user successfully', async () => {
      const signInData: SignInBody = {
        email: 'test@example.com',
        password: 'password',
      };
      const mockUser: UserBody = {
        id: 1,
        name: 'Test User',
        email: signInData.email,
        password: bcrypt.hashSync(signInData.password, 10),
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      const result = await service.signIn(signInData);

      expect(result.access_token).toBeDefined();
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        signInData.email,
      );
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser.id,
        username: mockUser.name,
      });
    });

    it('should throw unauthorized error if email is not registered', async () => {
      const signInData: SignInBody = {
        email: 'nonexistent@example.com',
        password: 'password',
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(service.signIn(signInData)).rejects.toThrowError(
        UnauthorizedException,
      );
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        signInData.email,
      );
    });

    it('should throw unauthorized error if password is invalid', async () => {
      const signInData: SignInBody = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };
      const mockUser: UserBody = {
        id: 1,
        name: 'Test User',
        email: signInData.email,
        password: bcrypt.hashSync('password', 10),
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(service.signIn(signInData)).rejects.toThrowError(
        UnauthorizedException,
      );
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        signInData.email,
      );
    });
  });
});
