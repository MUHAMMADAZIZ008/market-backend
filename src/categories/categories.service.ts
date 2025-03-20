import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './entities/category.entity';
import { Model } from 'mongoose';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private readonly CategoryModel: Model<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const newCategory = await this.CategoryModel.create(createCategoryDto);
    return {
      status: 201,
      message: 'success',
      data: newCategory.toObject(),
    };
  }

  async findAll() {
    const allCategories = await this.CategoryModel.find();
    return {
      status: 200,
      message: 'success',
      data: allCategories,
    };
  }

  async findOne(id: string) {
    const category = await this.CategoryModel.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found!');
    }
    return {
      status: 200,
      message: 'success',
      data: category,
    };
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id);

    const updatedCategory = await this.CategoryModel.updateOne(
      { id },
      updateCategoryDto,
    );

    return {
      status: 200,
      message: 'success',
      data: updatedCategory,
    };
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.CategoryModel.deleteOne({ _id: id });
    return {
      status: 200,
      message: 'success',
    };
  }
}
