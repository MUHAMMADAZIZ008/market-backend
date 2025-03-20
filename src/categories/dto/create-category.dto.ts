import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateCategoryDto {
  @IsString({ message: 'The name must be a string' })
  @IsNotEmpty({ message: 'Category name is required' })
  name: string;

  @IsString({ message: 'The description must be a string' })
  @IsOptional()
  description?: string;

  @IsArray({ message: 'Tags must be an array' })
  @ArrayNotEmpty({ message: 'Tags list cannot be empty' })
  @IsString({ each: true, message: 'Each tag must be a string' })
  tags: string[];
}
