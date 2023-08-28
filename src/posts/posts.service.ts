import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsRepository } from './posts.repository';
import { PublicationsRepository } from '../publications/publications.repository';

@Injectable()
export class PostsService {
  constructor(
    @Inject(forwardRef(() => PublicationsRepository))
    private readonly publicationsRepository: PublicationsRepository,
    private readonly postsRepository: PostsRepository,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const { title, text } = createPostDto;
    if (!title || !text)
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);

    return await this.postsRepository.createPost(createPostDto);
  }

  async findAll() {
    return await this.postsRepository.findPosts();
  }

  async findOne(id: number) {
    const post = await this.postsRepository.findPostById(id);
    if (!post) throw new NotFoundException();
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.findOne(id);
    if (!post) throw new NotFoundException();
    return await this.postsRepository.updatePost(id, updatePostDto);
  }

  async remove(id: number) {
    const post = await this.findOne(id);
    if (!post) throw new NotFoundException();
    const publication = await this.publicationsRepository.findByPostId(id);
    if (publication) throw new ForbiddenException();
    return await this.postsRepository.deletPost(id);
  }
}
