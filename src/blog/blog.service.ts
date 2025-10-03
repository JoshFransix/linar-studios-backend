import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from './blog.entity/blog.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/user.entity/user.entity';

@Injectable()
export class BlogService {
  constructor(@InjectRepository(Blog) private blogRepo: Repository<Blog>) {}

  create(title: string, content: string, imageUrl: string, author: User) {
    const blog = this.blogRepo.create({ title, content, imageUrl, author });
    return this.blogRepo.save(blog);
  }

  async findAll(page = 1, limit = 10) {
    const [data, total] = await this.blogRepo.findAndCount({
      relations: ['author'],
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'DESC' }, // newest first
    });

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  findOne(id: number) {
    return this.blogRepo.findOne({ where: { id }, relations: ['author'] });
  }
}
