import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './entities/product.entity';
import { Model, Types } from 'mongoose';
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
      discount_price:
        createProductDto.price -
        createProductDto.price * (createProductDto.discount / 100),
    });
    await newProduct.save();
    return {
      status: 201,
      message: 'success',
      data: newProduct.toObject(),
    };
  }

  async findAll(
    categoryId: string,
    page: number = 1,
    limit: number = 9,
    maxPrice: number,
    minPrice: number,
  ) {
    const skip = (page - 1) * limit; // Sahifalash formulası
    const [products, totalCount] = await Promise.all([
      this.productModel
        .find({ category: new Types.ObjectId(categoryId), price: { $lt: maxPrice, $gt: minPrice } })
        .populate('category')
        .skip(skip)
        .limit(limit),
      this.productModel.countDocuments({
        category: new Types.ObjectId(categoryId),
      }),
    ]);
    return {
      status: 200,
      message: 'success',
      data: products,
      totalCount,
    };
  }

  async findOne(id: string, categoryId: string) {
    const product = await this.productModel
      .findOne({ _id: id }, { category: new Types.ObjectId(categoryId) })
      .populate('category')
      .exec();
    if (!product) {
      throw new NotFoundException('Product not found!');
    }
    return {
      status: 200,
      message: 'success',
      data: product,
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productModel.findOne({ _id: id });
    if (!product) {
      throw new NotFoundException('Product not found!');
    }
    await this.productModel.updateOne({ _id: id }, updateProductDto);
    return {
      status: 200,
      message: 'success',
    };
  }

  async remove(id: string) {
    const product = await this.productModel.findOne({ _id: id });
    if (!product) {
      throw new NotFoundException('Product not found!');
    }
    await this.productModel.deleteOne({ _id: id });
    return {
      status: 200,
      message: 'success',
    };
  }
}
