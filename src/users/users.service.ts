import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { DeleteResult, Model } from 'mongoose';
import { CreateBcryptPassword } from 'src/common/config/bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const currentUsername = await this.findUsername(createUserDto.username);
    if (currentUsername) {
      throw new ConflictException('Username already exists');
    }

    const currentEmail = await this.findEmail(createUserDto.email);
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
}
