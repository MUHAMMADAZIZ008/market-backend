import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Category } from 'src/categories/entities/category.entity';

@Schema({ timestamps: true })
export class Product {
  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category: Category;

  @Prop()
  title: string;

  @Prop({
    type: [String],
  })
  image: string[];

  @Prop()
  description: string;

  @Prop()
  price: number;

  @Prop()
  discount: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
