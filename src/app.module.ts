import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production' ? undefined : '.env.local',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        let retries = 5;
        const retryDelay = 3000; // 3 seconds

        while (retries) {
          try {
            return {
              type: 'postgres',
              url: process.env.DATABASE_URL,
              ssl: {
                rejectUnauthorized: false, // ✅ required for Neon
              },
              autoLoadEntities: true,
              synchronize: process.env.NODE_ENV !== 'production',
            };
          } catch (error) {
            retries -= 1;
            console.error(
              `❌ Database connection failed. Retrying (${5 - retries}/5)...`,
            );
            console.error(error);
            if (!retries) throw error;
            await new Promise((res) => setTimeout(res, retryDelay));
          }
        }

        throw new Error(
          'Could not connect to the database after several attempts.',
        );
      },
    }),
    AuthModule,
    ContactModule,
    BlogModule,
    CloudinaryModule, // ✅ Handles UploadController & CloudinaryService internally
  ],
})
export class AppModule {}
