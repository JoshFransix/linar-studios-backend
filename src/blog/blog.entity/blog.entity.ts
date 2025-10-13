import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../auth/user.entity/user.entity';

@Entity()
export class Blog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  // ✅ Store Editor.js JSON content properly
  @Column({ type: 'jsonb', default: {} })
  content: any;

  // Optional featured image
  @Column({ nullable: true })
  imageUrl?: string;

  // Author relationship
  // @ManyToOne(() => User, (user) => user.blogs, { eager: true })
  @ManyToOne(() => User)
  author: User;

  @CreateDateColumn()
  createdAt: Date;
}
