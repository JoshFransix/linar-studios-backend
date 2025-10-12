import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { JwtService } from '@nestjs/jwt';
import { CreateBlogDto } from './dto/create-blog.dto';

@Controller('blogs')
export class BlogController {
  constructor(
    private readonly blogService: BlogService,
    private readonly jwtService: JwtService,
  ) {}

  // ✅ Get all blogs (paginated)
  @Get()
  async getAll(@Query('page') page = '1', @Query('limit') limit = '10') {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    return this.blogService.findAll(pageNum, limitNum);
  }

  // ✅ Get single blog by ID
  @Get(':id')
  async getOne(@Param('id') id: number) {
    return this.blogService.findOne(id);
  }

  // ✅ Create new blog post (auth required)
  @Post()
  async create(@Body() body: CreateBlogDto, @Req() req) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.split(' ')[1];
    const decoded: any = this.jwtService.decode(token);

    if (!decoded?.sub) {
      throw new UnauthorizedException('Invalid token');
    }

    // ✅ body.content is JSON string from frontend (Editor.js)
    let parsedContent: any;
    try {
      parsedContent =
        typeof body.content === 'string'
          ? JSON.parse(body.content)
          : body.content;
    } catch {
      throw new Error('Invalid content format');
    }

    return this.blogService.create({ ...body, content: parsedContent }, {
      id: decoded.sub,
    } as any);
  }
}
