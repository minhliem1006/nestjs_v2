import { Category } from 'src/category/entities/category.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  title: string;

  @Column({type:"longtext"})
  description: string;

  @Column()
  summary: string;

  @Column()
  thumbnail: string;
  
  @Column({type:"int", default:1})
  status: number;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  @ManyToOne(()=> User, (user)=> user.posts)
  user:User

  @ManyToOne(() => Category, (category)=> category.posts)
  category: Category
}