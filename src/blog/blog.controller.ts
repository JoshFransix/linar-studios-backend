import { Controller, Get, Post, Body, Param, Req, Query } from '@nestjs/common';
import { BlogService } from './blog.service';
import { JwtService } from '@nestjs/jwt';

@Controller('blogs')
export class BlogController {
  constructor(
    private blogService: BlogService,
    private jwt: JwtService,
  ) {}

  @Get()
  getAll(@Query('page') page: string, @Query('limit') limit: string) {
    return this.blogService.findAll(parseInt(page) || 1, parseInt(limit) || 10);
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.blogService.findOne(id);
  }

  @Post()
  async create(
    @Body() body: { title: string; content: string; imageUrl?: string },
    @Req() req,
  ) {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded: any = this.jwt.decode(token);

    return this.blogService.create(
      body.title,
      body.content,
      body.imageUrl ?? '',
      { id: decoded.sub } as any,
    );
  }
}
