import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRoleEnum } from 'src/common/enum';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop()
  full_name: string;

  @Prop({ unique: true })
  email: string;

  @Prop({ unique: true })
  username: string;

  @Prop()
  password: string;

  @Prop()
  address: string;

  @Prop()
  avatar: string;

  @Prop({
    type: String,  // ✅ ENUM uchun String qilib qo‘ydik
    enum: UserRoleEnum,
    default: UserRoleEnum.USER,
  })
  role: UserRoleEnum;
}

export const UserSchema = SchemaFactory.createForClass(User);
