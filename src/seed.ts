import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Blog } from './blog/blog.entity/blog.entity';
import { User } from './auth/user.entity/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userRepo = app.get<Repository<User>>(getRepositoryToken(User));
  const blogRepo = app.get<Repository<Blog>>(getRepositoryToken(Blog));

  // create admin user if not exists
  let admin = await userRepo.findOne({ where: { username: 'admin' } });
  if (!admin) {
    admin = userRepo.create({
      username: 'admin',
      password: 'test123', // ⚠️ should be hashed if real
      profilePhoto: 'https://i.pravatar.cc/150?u=admin',
    });
    await userRepo.save(admin);
  }

  // create sample blog
  const blogExists = await blogRepo.findOne({
    where: { title: 'My First Blog Post 🎉' },
  });
  if (!blogExists) {
    const blog = blogRepo.create({
      title: 'My First Blog Post 🎉',
      content: '<p>This is a seeded blog post for testing your UI.</p>',
      imageUrl: 'https://picsum.photos/800/400',
      author: admin,
    });
    await blogRepo.save(blog);
  }

  console.log('✅ Seeding complete');
  await app.close();
}
bootstrap();
