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

  @Column({ type: 'text', default: '' })
  content: string; // HTML from React-Quill

  // Optional featured image
  @Column({ nullable: true })
  imageUrl?: string;

  // Author relationship
  @ManyToOne(() => User)
  author: User;

  @CreateDateColumn()
  createdAt: Date;
}
