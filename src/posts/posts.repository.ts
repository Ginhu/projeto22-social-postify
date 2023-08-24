import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createPost(body: CreatePostDto) {
    if (!body.image)
      return this.prisma.posts.create({
        data: {
          title: body.title,
          text: body.text,
        },
      });
    return this.prisma.posts.create({
      data: {
        title: body.title,
        text: body.text,
        image: body.image,
      },
    });
  }

  async findPosts() {
    return await this.prisma.posts.findMany();
  }

  async findPostById(id: number) {
    return await this.prisma.posts.findFirst({
      where: { id: id },
    });
  }

  async updatePost(id: number, updatePostDto: UpdatePostDto) {
    if (!updatePostDto.image)
      return await this.prisma.posts.update({
        where: { id: id },
        data: {
          title: updatePostDto.title,
          text: updatePostDto.text,
        },
      });
    return await this.prisma.posts.update({
      where: { id: id },
      data: {
        title: updatePostDto.title,
        text: updatePostDto.text,
        image: updatePostDto.image,
      },
    });
  }

  async deletPost(id: number) {
    return await this.prisma.posts.delete({
      where: {
        id: id,
      },
    });
  }
}
