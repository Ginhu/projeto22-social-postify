import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaModule } from '../src/prisma/prisma.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Posts Controller (e2e)', () => {
  let app: INestApplication;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, PrismaModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    prisma = app.get(PrismaService);
    await prisma.publications.deleteMany();
    await prisma.posts.deleteMany();
    await prisma.medias.deleteMany();
    await app.init();
  });

  it('/ POST => Should return statusCode 201', async () => {
    await request(app.getHttpServer())
      .post('/posts')
      .send({
        title: 'teste',
        text: 'teste.com.br',
      })
      .expect(HttpStatus.CREATED);
  });

  it('/ POST => Should return statusCode 400 missing title', async () => {
    await request(app.getHttpServer())
      .post('/posts')
      .send({
        text: 'teste.com.br',
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('/ POST => Should return statusCode 400 missing text', async () => {
    await request(app.getHttpServer())
      .post('/posts')
      .send({
        title: 'teste',
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('/ GET => Should return statusCode 200 with the post infos', async () => {
    const media = await prisma.posts.create({
      data: {
        title: 'teste',
        text: 'teste.com.br',
      },
    });

    await request(app.getHttpServer())
      .get('/posts')
      .expect(HttpStatus.OK)
      .expect([media]);
  });

  it('/ GET => Should return statusCode 200 with empty array if no media is registered', async () => {
    await request(app.getHttpServer())
      .get('/posts')
      .expect(HttpStatus.OK)
      .expect([]);
  });

  it('/:id GET => Should return statusCode 200 with the media infos', async () => {
    const post = await prisma.posts.create({
      data: {
        title: 'teste',
        text: 'teste.com.br',
      },
    });

    await request(app.getHttpServer())
      .get(`/posts/${post.id}`)
      .expect(HttpStatus.OK)
      .expect(post);
  });

  it('/:id GET => Should return statusCode 404 when register is not found', async () => {
    await request(app.getHttpServer())
      .get(`/posts/1`)
      .expect(HttpStatus.NOT_FOUND);
  });

  it('/:id PUT => Should return statusCode 200 with the media infos', async () => {
    const post = await prisma.posts.create({
      data: {
        title: 'teste',
        text: 'teste.com.br',
      },
    });

    await request(app.getHttpServer())
      .put(`/posts/${post.id}`)
      .send({
        title: 'teste2',
        text: 'teste2.com.br',
      })
      .expect(HttpStatus.OK);

    const newRegister = await prisma.posts.findFirst({
      where: {
        id: post.id,
      },
    });

    expect(newRegister.id).toBe(post.id);
    expect(newRegister.title).toBe('teste2');
    expect(newRegister.text).toBe('teste2.com.br');
  });

  it('/:id PUT => Should return statusCode 404 when there is no register with that id', async () => {
    await request(app.getHttpServer())
      .put(`/posts/1`)
      .send({
        title: 'teste2',
        text: 'teste2.com.br',
      })
      .expect(HttpStatus.NOT_FOUND);
  });

  it('/:id DELETE => Should return statusCode 200', async () => {
    const post = await prisma.posts.create({
      data: {
        title: 'teste',
        text: 'teste.com.br',
      },
    });

    await request(app.getHttpServer())
      .delete(`/posts/${post.id}`)
      .expect(HttpStatus.OK);
  });

  it('/:id DELETE => Should return statusCode 404', async () => {
    await request(app.getHttpServer())
      .delete(`/posts/1`)
      .expect(HttpStatus.NOT_FOUND);
  });

  it('/:id DELETE => Should return statusCode 403 if the media belongs to a publication', async () => {
    const media = await prisma.medias.create({
      data: {
        title: 'teste',
        username: 'teste.com.br',
      },
    });
    const post = await prisma.posts.create({
      data: {
        title: 'teste',
        text: 'teste.com.br',
      },
    });
    await prisma.publications.create({
      data: {
        mediaId: media.id,
        postId: post.id,
        date: new Date(),
      },
    });

    await request(app.getHttpServer())
      .delete(`/posts/${post.id}`)
      .expect(HttpStatus.FORBIDDEN);
  });
});
