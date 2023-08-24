import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MediasRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMedia(title: string, username: string) {
    return await this.prisma.medias.findFirst({
      where: {
        title: title,
        username: username,
      },
    });
  }

  async createMidia(title: string, username: string) {
    await this.prisma.medias.create({
      data: {
        title: title,
        username: username,
      },
    });
  }

  async findAllMedias() {
    return await this.prisma.medias.findMany();
  }

  async findFirstById(id: number) {
    return await this.prisma.medias.findFirst({
      where: {
        id: id,
      },
    });
  }

  async updateMedia(id: number, title: string, username: string) {
    return await this.prisma.medias.update({
      where: { id: id },
      data: {
        title: title,
        username: username,
      },
    });
  }

  async deleteMedia(id: number) {
    return await this.prisma.medias.delete({
      where: {
        id: id,
      },
    });
  }
}
