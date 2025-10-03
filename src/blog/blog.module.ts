import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './blog.entity/blog.entity';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Blog]),
    AuthModule, // 👈 brings JwtService from AuthModule
  ],
  providers: [BlogService],
  controllers: [BlogController],
})
export class BlogModule {}
