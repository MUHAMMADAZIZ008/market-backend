import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { DeleteResult, Model, ObjectId } from 'mongoose';
import { CreateBcryptPassword } from 'src/common/config/bcrypt';
import { UserStatus } from 'src/common/enum';
import { VerifyOtpDto } from 'src/auth/dto/verify-otp-dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const currentUsername = await this.findUsername(createUserDto.username);
    const currentEmail = await this.findEmail(createUserDto.email);
    if (
      currentUsername &&
      currentEmail &&
      currentUsername.status === UserStatus.INACTIVE
    ) {
      return {
        status: 201,
        message: 'success',
        data: currentUsername,
      };
    }
    if (currentUsername) {
      throw new ConflictException('Username already exists');
    }

    if (currentEmail) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await CreateBcryptPassword(createUserDto.password);
    createUserDto.password = hashedPassword;

    const newUser = await this.UserModel.create(createUserDto);
    return {
      status: 201,
      message: 'success',
      data: newUser.toObject(),
    };
  }

  async findAll() {
    const users = await this.UserModel.find();
    return users;
  }

  async findOne(id: string) {
    const user = await this.UserModel.findById(id);
    if (!user) {
      throw new NotFoundException('not fount exception!');
    }
    return user;
  }

  findUsername(username: string) {
    return this.UserModel.findOne({ username: username });
  }

  findEmail(email: string) {
    return this.UserModel.findOne({ email: email });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);
    const updateUser = await this.UserModel.updateOne({ id }, updateUserDto);
    return {
      status: 200,
      message: 'success',
      data: updateUser,
    };
  }

  async remove(
    id: string,
  ): Promise<{ status: number; message: string; data: DeleteResult }> {
    await this.findOne(id);
    const deleteUser = await this.UserModel.deleteOne({ _id: id });
    return {
      status: 200,
      message: 'success',
      data: deleteUser as unknown as DeleteResult,
    };
  }

  async saveOtp(otp: string, id: ObjectId) {
    try {
      const otpTime = Date.now() + 3000;
      await this.UserModel.updateOne(
        { _id: id },
        { otp_code: otp, otp_time: otpTime },
      );
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }
  async verifyOtp(otp: VerifyOtpDto) {
    
    const user = await this.UserModel.findOne({ otp_code: otp.otp });
    
    if (!user) {
      throw new BadRequestException('wrong otp!');
    }
    const dateNow = Date.now();
    if (user.otp_time > dateNow) {
      throw new BadRequestException('OTP timeout!');
    }
    await this.UserModel.updateOne(
      { _id: user._id },
      { status: UserStatus.ACTIVE, otp_code: '', otp_time: 0 },
    );
    return {
      status: 200,
      message: 'success',
    };
  }
}
