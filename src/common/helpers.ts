import { JwtService } from '@nestjs/jwt';
import { verify, hash } from 'argon2';
import { ValidationError } from 'sequelize';
import { jwtConstants } from '.';

export const getHash = (password: string) => {
  return hash(password);
};

export const verifyHash = (password: string, matchText: string) => {
  return verify(password, matchText);
};

export const signDataForToken = (data) => {
  return new JwtService().sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours expiration
      ...data,
    },
    { secret: jwtConstants.secret },
  );
};

export const errorHandler = (error) => {
  if (error instanceof ValidationError) {
    if (error.errors && error.errors[0]) {
      if (error.errors[0].validatorKey == 'not_unique') {
        return `${error.errors[0].path} ${error.errors[0].value} already exists.`;
      }
    }
  }
};
