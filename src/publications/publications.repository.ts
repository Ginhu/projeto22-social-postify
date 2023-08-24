import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';

@Injectable()
export class PublicationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createPublication(createPublicationDto: CreatePublicationDto) {
    return await this.prisma.publications.create({
      data: {
        mediaId: createPublicationDto.mediaId,
        postId: createPublicationDto.postId,
        date: createPublicationDto.date,
      },
    });
  }

  async getPublications() {
    return this.prisma.publications.findMany();
  }

  async getPublicationById(id: number) {
    return this.prisma.publications.findFirst({
      where: { id: id },
    });
  }

  async updatePublication(
    id: number,
    updatePublicationDto: UpdatePublicationDto,
  ) {
    return await this.prisma.publications.update({
      where: { id: id },
      data: {
        mediaId: updatePublicationDto.mediaId,
        postId: updatePublicationDto.postId,
        date: updatePublicationDto.date,
      },
    });
  }

  async deletPublication(id: number) {
    return await this.prisma.publications.delete({
      where: { id: id },
    });
  }

  async findByMediaId(id: number) {
    return await this.prisma.publications.findFirst({
      where: {
        mediaId: id,
      },
    });
  }

  async findByPostId(id: number) {
    return await this.prisma.publications.findFirst({
      where: {
        postId: id,
      },
    });
  }
}
