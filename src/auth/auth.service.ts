import { Injectable } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly userModel: UsersService) {}

  async register(registerAuthDto: RegisterAuthDto) {
    const newUser = await this.userModel.create(registerAuthDto);
    return newUser;
  }
}
