import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { PublicationsRepository } from './publications.repository';
import { MediasService } from '../medias/medias.service';
import { PostsService } from '../posts/posts.service';

@Injectable()
export class PublicationsService {
  @Inject(forwardRef(() => MediasService))
  private readonly mediasService: MediasService;
  @Inject(forwardRef(() => PostsService))
  private readonly postsService: PostsService;
  constructor(
    private readonly publicationsRepository: PublicationsRepository,
  ) {}

  async create(createPublicationDto: CreatePublicationDto) {
    const { mediaId, postId, date } = createPublicationDto;
    if (!mediaId || !postId || !date)
      throw new HttpException('Bad Request!', HttpStatus.BAD_REQUEST);
    const media = await this.mediasService.findOne(mediaId);
    const post = await this.postsService.findOne(postId);
    if (!media || !post) throw new NotFoundException();
    return await this.publicationsRepository.createPublication(
      createPublicationDto,
    );
  }

  async findAll() {
    return await this.publicationsRepository.getPublications();
  }

  async findOne(id: number) {
    const publication =
      await this.publicationsRepository.getPublicationById(id);
    if (!publication) throw new NotFoundException();
    return publication;
  }

  async update(id: number, updatePublicationDto: UpdatePublicationDto) {
    const now = new Date();
    const pub = await this.findOne(id);
    const media = await this.mediasService.findOne(
      updatePublicationDto.mediaId,
    );
    const post = await this.postsService.findOne(updatePublicationDto.postId);

    if (now > pub.date) throw new ForbiddenException();
    if (!media || !post || !pub) throw new NotFoundException();
    return await this.publicationsRepository.updatePublication(
      id,
      updatePublicationDto,
    );
  }

  async remove(id: number) {
    const publication = await this.findOne(id);
    if (!publication) throw new NotFoundException();
    return await this.publicationsRepository.deletPublication(id);
  }
}
