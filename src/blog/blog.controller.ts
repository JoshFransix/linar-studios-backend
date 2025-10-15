/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  Query,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { JwtService } from '@nestjs/jwt';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

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
    const decoded = this.decodeToken(req);

    if (!body.content || typeof body.content !== 'string') {
      throw new Error('Invalid content format');
    }

    return this.blogService.create(
      { ...body, content: body.content, description: body.description },
      { id: decoded.sub } as any,
    );
  }

  // ✅ Update existing blog post (auth required)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() body: UpdateBlogDto,
    @Req() req,
  ) {
    const decoded = this.decodeToken(req);
    const existing = await this.blogService.findOne(id);

    if (!existing) throw new NotFoundException('Blog not found');
    if (existing.author.id !== decoded.sub)
      throw new UnauthorizedException('You can only edit your own posts');

    return this.blogService.update(id, body);
  }

  // ✅ Delete blog post (auth required)
  @Delete(':id')
  async delete(@Param('id') id: number, @Req() req) {
    const decoded = this.decodeToken(req);
    const existing = await this.blogService.findOne(id);

    if (!existing) throw new NotFoundException('Blog not found');
    if (existing.author.id !== decoded.sub)
      throw new UnauthorizedException('You can only delete your own posts');

    await this.blogService.remove(id);
    return { message: 'Blog deleted successfully' };
  }

  private decodeToken(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new UnauthorizedException('No token provided');
    const token = authHeader.split(' ')[1];
    const decoded: any = this.jwtService.decode(token);
    if (!decoded?.sub) throw new UnauthorizedException('Invalid token');
    return decoded;
  }
}
