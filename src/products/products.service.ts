import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './entities/product.entity';
import { Model } from 'mongoose';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    private readonly categoryModel: CategoriesService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const currentCategory = await this.categoryModel
      .findOne(createProductDto.category)
      .then((res) => res?.data);

    const newProduct = new this.productModel({
      ...createProductDto,
      category: currentCategory._id,
    });
    await newProduct.save();
    return {
      status: 201,
      message: 'success',
      data: newProduct.toObject(),
    };
  }

  async findAll() {
    const products = await this.productModel.find().populate('category').exec();
    return {
      status: 200,
      message: 'success',
      data: products,
    };
  }

  async findOne(id: string) {
    const product = await this.productModel
      .findOne({ _id: id })
      .populate('category')
      .exec();
    if (product) {
      throw new NotFoundException('Product not found!');
    }
    return {
      status: 200,
      message: 'success',
      data: product,
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id);
    await this.productModel.updateOne({ _id: id }, updateProductDto);
    return {
      status: 200,
      message: 'success',
    };
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.productModel.deleteOne({ _id: id });
    return {
      status: 200,
      message: 'success',
    };
  }
}
