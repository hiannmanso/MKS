import { HttpStatus, UnauthorizedException } from '@nestjs/common';

export function throwUnauthorizedException(message: string): never {
  throw new UnauthorizedException({
    status: HttpStatus.UNAUTHORIZED,
    error: message,
  });
}
