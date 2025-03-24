import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { VerifyOtpDto } from './dto/verify-otp-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerAuthDto: RegisterAuthDto) {
    return this.authService.register(registerAuthDto);
  }
  @Post('/login')
  async login(@Body() loginAuthDot: LoginAuthDto) {
    return this.authService.login(loginAuthDot);
  }
  @Post('/verify-otp')
  async verifyOtp(@Body() otp: VerifyOtpDto) {
    return this.authService.verifyOtp(otp)
  }
  
}
