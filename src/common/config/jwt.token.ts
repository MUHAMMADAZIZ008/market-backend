import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from '../interface';
import { config } from './config';

@Injectable()
export class JwtTokenService {
  constructor(private jwtService: JwtService) {}

  async createAccessToken(payload: UserPayload) {
    const accessToken = await this.jwtService.sign(payload, {
      secret: config.ACCESS_TOKEN_KEY,
      expiresIn: config.ACCESS_TOKEN_TIME,
    });
    return accessToken;
  }

  async createRefreshToken(payload: UserPayload) {
    const refreshToken = await this.jwtService.sign(payload, {
      secret: config.REFRESH_TOKEN_KEY,
      expiresIn: config.REFRESH_TOKEN_TIME,
    });
    return refreshToken;
  }

  async verifyAccessToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: config.ACCESS_TOKEN_KEY,
      });
      if (!payload) {
        throw new UnauthorizedException();
      }
      return payload;
    } catch {
      throw new UnauthorizedException();
    }
  }

  async verifyRefreshToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: config.REFRESH_TOKEN_KEY,
      });
      if (!payload) {
        throw new UnauthorizedException();
      }
      return payload;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
