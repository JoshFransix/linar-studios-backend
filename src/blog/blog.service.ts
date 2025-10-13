import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './blog.entity/blog.entity';
import { User } from '../auth/user.entity/user.entity';
import { CreateBlogDto } from './dto/create-blog.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepo: Repository<Blog>,
  ) {}

  // ✅ Create blog post
  async create(createBlogDto: CreateBlogDto, author: User) {
    const { title, content, imageUrl } = createBlogDto;

    const blog = this.blogRepo.create({
      title,
      content, // can be JSON (Editor.js output)
      imageUrl,
      author,
    });

    return await this.blogRepo.save(blog);
  }

  // ✅ Paginated get all blogs
  async findAll(page = 1, limit = 10) {
    const [data, total] = await this.blogRepo.findAndCount({
      relations: ['author'],
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'DESC' },
    });

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  // ✅ Single blog by ID
  async findOne(id: number) {
    return await this.blogRepo.findOne({
      where: { id },
      relations: ['author'],
    });
  }
}
