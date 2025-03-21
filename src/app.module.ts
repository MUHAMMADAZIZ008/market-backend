import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { config } from './common/config/config';
import { JwtModule } from '@nestjs/jwt';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    MongooseModule.forRoot(config.MONGO_URL),
    AuthModule,
    CategoriesModule,
    ProductsModule,
  ],
})
export class AppModule {}
