import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UsersService } from 'src/users/users.service';
import { JwtTokenService } from 'src/common/config/jwt.token';
import { MatchPassword } from 'src/common/config/bcrypt';
import { UserPayload } from 'src/common/interface';
import { config } from 'src/common/config/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userModel: UsersService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async register(registerAuthDto: RegisterAuthDto) {
    const newUser = await this.userModel.create(registerAuthDto);
    return newUser;
  }

  async login(loginAuthDto: LoginAuthDto) {
    const currentUser = await this.userModel.findEmail(loginAuthDto.email);
    if (!currentUser) {
      throw new UnauthorizedException('Email or password wrong!');
    }

    const isMatch = await MatchPassword(
      loginAuthDto.password,
      currentUser.password,
    );
    if (!isMatch) {
      throw new UnauthorizedException('Email or password wrong!');
    }

    const payload: UserPayload = {
      id: String(currentUser._id),
      email: currentUser.email,
      username: currentUser.username,
      role: currentUser.role,
    };
    const accessToken = await this.jwtTokenService.createAccessToken(payload);
    const refreshToken = await this.jwtTokenService.createRefreshToken(payload);
    return {
      accessToken: {
        token: accessToken,
        expiresIn: config.ACCESS_TOKEN_TIME,
      },
      refreshToken: {
        token: refreshToken,
        expiresIn: config.REFRESH_TOKEN_TIME,
      },
      user: currentUser,
    };
  }
}
