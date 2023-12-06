import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { FilterPostDto } from './dto/filter-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
    constructor(@InjectRepository(User) private useRespository: Repository<User>,
    @InjectRepository(Post) private postRespository: Repository<Post>
    ){

    }
    async create(userId:number,createPostDto:CreatePostDto):Promise<Post> {
        const user = await this.useRespository.findOneBy({id:userId});
        try {
            const res = await this.postRespository.save({
                ...createPostDto,user
            })
            return await this.postRespository.findOneBy({id:res.id});
        } catch (error) {
            console.log("error:",error)
            throw new HttpException('Can not create post', HttpStatus.BAD_REQUEST);
        }
    }
    async findAll(query:FilterPostDto):Promise<any> {
        const items_per_page = Number(query.items_per_page) || 10;
        const page = Number(query.page) || 1;
        const search = query.search || "";
        const category = Number(query.category) || null;
        const skip = (page-1)*items_per_page;
        const [res,total] = await this.postRespository.findAndCount({
            where:[
                {title:Like("%"+search+"%"),category:{id:category}},
                {description:Like("%"+search+"%"),category:{id:category}},
                
            ],
            order:{created_at:"DESC"},
            take:items_per_page,
            skip:skip,
            relations:{
                user:true,
                category:true,
            },
            select: {
                category : {
                    id:true,
                    name:true,
                },
                user: {
                    id:true,
                    first_name:true,
                    last_name:true,
                    email:true,
                    avatar:true,
                }
            },
            
        })
        const lastPage = Math.ceil(total/items_per_page);
        const nextPage = page+1 > total ? null : page+1;
        const prevPage = page-1 < 1 ? null : page-1;
        return {
            data:res,
            total,
            currentPage:page,
            nextPage,
            prevPage,
            lastPage
        }
    }

    async findDetail(id:number):Promise<Post>{
        return await this.postRespository.findOne({
            where:{id},
            relations:['user','category'],
            select: {
                user: {
                    id:true,
                    first_name:true,
                    last_name:true,
                    email:true,
                    avatar:true,
                },
                category: {
                    id:true,
                    name:true,
                }
            },
        })
    }

    async update(id:number, updatePostDto:UpdatePostDto):Promise<UpdateResult> {
        return await this.postRespository.update(id,updatePostDto);
    }

    async delete(id:number):Promise<DeleteResult> {
        return await this.postRespository.delete(id);
    }
}
