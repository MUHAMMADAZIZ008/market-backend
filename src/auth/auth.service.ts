import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UsersService } from 'src/users/users.service';
import { JwtTokenService } from 'src/common/config/jwt.token';
import { MatchPassword } from 'src/common/config/bcrypt';
import { UserPayload } from 'src/common/interface';
import { config } from 'src/common/config/config';
import { UserStatus } from 'src/common/enum';
import { MailerProvider } from 'src/mailer/mailer.provider';
import { OtpGenerator } from 'src/common/config/otp-generator';

@Injectable()
export class AuthService {
  constructor(
    private readonly userModel: UsersService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly mailProvider: MailerProvider,
  ) {}

  async register(registerAuthDto: RegisterAuthDto) {
    const newUser = await this.userModel.create(registerAuthDto);
    
    const otp = await OtpGenerator(6);
    

    await this.userModel.saveOtp(otp, String(newUser.data._id));
    await this.mailProvider.sendMail(newUser.data.email, otp);
    return {
      status: 200,
      message: 'success',
    };
  }

  async login(loginAuthDto: LoginAuthDto) {
    const currentUser = await this.userModel.findEmail(loginAuthDto.email);
    if (!currentUser) {
      throw new UnauthorizedException('Email or password wrong!');
    }

    if (currentUser?.status === UserStatus.INACTIVE) {
      throw new UnauthorizedException('You are not active!');
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
