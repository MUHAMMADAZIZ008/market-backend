import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtTokenService } from 'src/common/config/jwt.token';
import { MailerProvider } from 'src/mailer/mailer.provider';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService, JwtTokenService, MailerProvider],
})
export class AuthModule {}
