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
    return await this.prisma.publications.findMany();
  }

  async getPublicationById(id: number) {
    return await this.prisma.publications.findFirst({
      where: { id: id },
    });
  }

  async getPublishedPublications() {
    return await this.prisma.publications.findMany({
      where: {
        date: {
          lte: new Date('2022-12-12').toISOString(),
        },
      },
      orderBy: { id: 'asc' },
    });
  }

  async getAfterPublications(after: Date) {
    return await this.prisma.publications.findMany({
      where: {
        date: {
          gt: new Date('2023-01-01'),
        },
      },
      orderBy: { id: 'asc' },
    });
  }

  async getPublishedAfterPublications(after: Date) {
    return await this.prisma.publications.findMany({
      where: {
        date: {
          lte: new Date(),
          gte: after,
        },
      },
      orderBy: { id: 'asc' },
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
