import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helpers/config';
import { AuthGuard } from 'src/auth/auth.guard';
import { extname } from 'path';
import { PostService } from './post.service';
import { FilterPostDto } from './dto/filter-post.dto';
import { Post as PostEntity} from './entities/post.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UpdatePostDto } from './dto/update-post.dto';
@Controller('posts')
export class PostController {
    constructor(private postService:PostService){
    }
    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    @Post()
    @UseInterceptors(FileInterceptor('thumbnail',{
        storage:storageConfig('post'),
        fileFilter:(req,file,cb) => {
            const ext = extname(file.originalname);
            const allowedExtArr = ['.jpg','.pnp','.jpeg'];
            if(!allowedExtArr.includes(ext)){
                req.fileValidationError = `Wrong extension type. Accepted file ext are : ${allowedExtArr.toString()}`;
                cb(null,false);
            } else {
                const fileSize =  parseInt(req.headers['content-length']);
                if(fileSize > 1024*1025*5) {
                  req.fileValidationError = `File size is too large. Accepted file size is less than 5 MB`;
                  cb(null,false);
                } else {
                    cb(null, true);
                }
            }
        }
    }))
    create(@Req () req:any, @Body() createPostDto:CreatePostDto,@UploadedFile() file) {
        console.log("req:",req)
        console.log("createPostDto:",createPostDto)
        console.log("file:",file)
        if(req.fileValidationError){
            throw new BadRequestException(req.fileValidationError);    
        }
        if(!file){
            throw new BadRequestException("File is require");    
        }
        return this.postService.create(req['user_data'].id,{...createPostDto,thumbnail:"post"+"/"+file.filename});
    } 
    @UseGuards(AuthGuard)
    @Get()
    findAll(@Query() query:FilterPostDto):Promise<any> {
        return this.postService.findAll(query);
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    findDetail(@Param('id') id:string):Promise<PostEntity> {
        return this.postService.findDetail(Number(id));
    }
    @UseGuards(AuthGuard)
    @Put(':id')
    @UseInterceptors(FileInterceptor('thumbnail',{
        storage:storageConfig('post'),
        fileFilter:(req,file,cb) => {
            const ext = extname(file.originalname);
            const allowedExtArr = ['.jpg','.pnp','.jpeg'];
            if(!allowedExtArr.includes(ext)){
                req.fileValidationError = `Wrong extension type. Accepted file ext are : ${allowedExtArr.toString()}`;
                cb(null,false);
            } else {
                const fileSize =  parseInt(req.headers['content-length']);
                if(fileSize > 1024*1025*5) {
                  req.fileValidationError = `File size is too large. Accepted file size is less than 5 MB`;
                  cb(null,false);
                } else {
                    cb(null, true);
                }
            }
        }
    }))
    update(@Param('id') id:string, @Req() req:any,@Body() updatePostDto:UpdatePostDto , @UploadedFile() file:Express.Multer.File):Promise<UpdateResult> {
        if(req.fileValidationError){
            throw new BadRequestException(req.fileValidationError);    
        }
        if(file){
            console.log("filelele:",file);
            
            updatePostDto.thumbnail ="post"+"/"+file.filename;

        }
        return this.postService.update(Number(id),updatePostDto);
    }

    @UseGuards(AuthGuard)
    @Delete(":id")
    delete(@Param("id") id:string):Promise<DeleteResult> {
        return this.postService.delete(Number(id));
    }
}
