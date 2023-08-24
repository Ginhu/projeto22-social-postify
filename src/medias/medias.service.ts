import {
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediasRepository } from './medias.repository';
import { PublicationsRepository } from '../publications/publications.repository';

@Injectable()
export class MediasService {
  constructor(
    @Inject(forwardRef(() => PublicationsRepository))
    private readonly publicationsRepository: PublicationsRepository,
    private readonly mediasRepository: MediasRepository,
  ) {}
  async create(createMediaDto: CreateMediaDto) {
    const { title, username } = createMediaDto;
    if (!title || !username)
      throw new HttpException('Bad Request!', HttpStatus.BAD_REQUEST);

    const media = await this.mediasRepository.findMedia(title, username);
    if (media) throw new ConflictException();
    return await this.mediasRepository.createMidia(title, username);
  }

  async findAll() {
    return await this.mediasRepository.findAllMedias();
  }

  async findOne(id: number) {
    const media = await this.mediasRepository.findFirstById(id);
    if (!media) throw new NotFoundException();
    return media;
  }

  async update(id: number, updateMediaDto: UpdateMediaDto) {
    const media = await this.mediasRepository.findFirstById(id);
    if (!media) throw new NotFoundException();

    const { title, username } = updateMediaDto;
    if (!title || !username)
      throw new HttpException('Bad Request!', HttpStatus.BAD_REQUEST);

    const find = await this.mediasRepository.findMedia(title, username);
    if (find) throw new ConflictException();
    return await this.mediasRepository.updateMedia(id, title, username);
  }

  async remove(id: number) {
    const media = await this.findOne(id);
    if (!media) throw new NotFoundException();
    const publication = await this.publicationsRepository.findByMediaId(id);
    if (publication) throw new ForbiddenException();
    return await this.mediasRepository.deleteMedia(id);
  }
}
