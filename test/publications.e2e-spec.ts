import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaModule } from '../src/prisma/prisma.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Publications Controller (e2e)', () => {
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

    await request(app.getHttpServer())
      .post('/publications')
      .send({
        mediaId: media.id,
        postId: post.id,
        date: new Date(),
      })
      .expect(HttpStatus.CREATED);
  });

  it('/ POST => Should return statusCode 400 missing mediaId', async () => {
    await prisma.medias.create({
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

    await request(app.getHttpServer())
      .post('/publications')
      .send({
        postId: post.id,
        date: new Date(),
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('/ POST => Should return statusCode 400 missing postId', async () => {
    const media = await prisma.medias.create({
      data: {
        title: 'teste',
        username: 'teste.com.br',
      },
    });

    await prisma.posts.create({
      data: {
        title: 'teste',
        text: 'teste.com.br',
      },
    });

    await request(app.getHttpServer())
      .post('/publications')
      .send({
        mediaId: media.id,
        date: new Date(),
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('/ POST => Should return statusCode 400 missing date', async () => {
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

    await request(app.getHttpServer())
      .post('/publications')
      .send({
        mediaId: media.id,
        postId: post.id,
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('/ POST => Should return statusCode 404 missing matching media', async () => {
    const post = await prisma.posts.create({
      data: {
        title: 'teste',
        text: 'teste.com.br',
      },
    });

    await request(app.getHttpServer())
      .post('/publications')
      .send({
        mediaId: 1,
        postId: post.id,
        date: new Date(),
      })
      .expect(HttpStatus.NOT_FOUND);
  });

  it('/ POST => Should return statusCode 404 missing matching post', async () => {
    const media = await prisma.medias.create({
      data: {
        title: 'teste',
        username: 'teste.com.br',
      },
    });

    await request(app.getHttpServer())
      .post('/publications')
      .send({
        mediaId: media.id,
        postId: 1,
        date: new Date(),
      })
      .expect(HttpStatus.NOT_FOUND);
  });

  it('/ GET => Should return ALL publications', async () => {
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

    await prisma.publications.createMany({
      data: [
        {
          mediaId: media.id,
          postId: post.id,
          date: new Date(),
        },
        {
          mediaId: media.id,
          postId: post.id,
          date: new Date(),
        },
      ],
    });

    await request(app.getHttpServer())
      .get('/publications')
      .expect(HttpStatus.OK);

    const publications = await prisma.publications.findMany();
    expect(publications.length).toBe(2);
  });

  it('/:id GET => Should return 200 ok with the publication data', async () => {
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
    const date = new Date('2023-01-01');
    const publication = await prisma.publications.create({
      data: {
        mediaId: media.id,
        postId: post.id,
        date: date,
      },
    });

    await request(app.getHttpServer())
      .get(`/publications/${publication.id}`)
      .expect(HttpStatus.OK);

    expect(publication.mediaId).toBe(media.id);
    expect(publication.postId).toBe(post.id);
  });

  it('/:id GET => Should return 404 if there is no data with that id', async () => {
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
    const date = new Date('2023-01-01');
    await prisma.publications.create({
      data: {
        mediaId: media.id,
        postId: post.id,
        date: date,
      },
    });

    await request(app.getHttpServer())
      .get(`/publications/-1`)
      .expect(HttpStatus.NOT_FOUND);
  });

  it('/ PUT => Should return 200 if publication is updated', async () => {
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
    const date = new Date('2024-01-01');
    const publication = await prisma.publications.create({
      data: {
        mediaId: media.id,
        postId: post.id,
        date: date,
      },
    });

    await request(app.getHttpServer())
      .put(`/publications/${publication.id}`)
      .send({
        id: publication.id,
        mediaId: media.id,
        postId: post.id,
        date: new Date('2024-02-02'),
      })
      .expect(HttpStatus.OK);
  });

  it('/ PUT => Should return 403 if publication have already been published', async () => {
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
    const date = new Date('2022-01-01');
    const publication = await prisma.publications.create({
      data: {
        mediaId: media.id,
        postId: post.id,
        date: date,
      },
    });

    await request(app.getHttpServer())
      .put(`/publications/${publication.id}`)
      .send({
        id: publication.id,
        mediaId: media.id,
        postId: post.id,
        date: new Date('2024-01-01'),
      })
      .expect(HttpStatus.FORBIDDEN);
  });

  it('/ PUT => Should return 404 if there is no publication with the provided id', async () => {
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
    const date = new Date('2024-01-01');
    const publication = await prisma.publications.create({
      data: {
        mediaId: media.id,
        postId: post.id,
        date: date,
      },
    });

    await request(app.getHttpServer())
      .put(`/publications/-1`)
      .send({
        id: publication.id,
        mediaId: media.id,
        postId: post.id,
        date: new Date('2024-02-02'),
      })
      .expect(HttpStatus.NOT_FOUND);
  });

  it('/ PUT => Should return 404 if there is no matching mediaId', async () => {
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
    const date = new Date('2024-01-01');
    const publication = await prisma.publications.create({
      data: {
        mediaId: media.id,
        postId: post.id,
        date: date,
      },
    });

    await request(app.getHttpServer())
      .put(`/publications/${publication.id}`)
      .send({
        id: publication.id,
        mediaId: -1,
        postId: post.id,
        date: new Date('2024-02-02'),
      })
      .expect(HttpStatus.NOT_FOUND);
  });

  it('/ PUT => Should return 404 if there is no matching postId', async () => {
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
    const date = new Date('2024-01-01');
    const publication = await prisma.publications.create({
      data: {
        mediaId: media.id,
        postId: post.id,
        date: date,
      },
    });

    await request(app.getHttpServer())
      .put(`/publications/${publication.id}`)
      .send({
        id: publication.id,
        mediaId: media.id,
        postId: -1,
        date: new Date('2024-02-02'),
      })
      .expect(HttpStatus.NOT_FOUND);
  });

  it('/:id DELETE => Should return statusCode 200 if register deleted', async () => {
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

    const date = new Date('2024-01-01');
    const publication = await prisma.publications.create({
      data: {
        mediaId: media.id,
        postId: post.id,
        date: date,
      },
    });

    await request(app.getHttpServer())
      .delete(`/publications/${publication.id}`)
      .expect(HttpStatus.OK);
  });

  it('/:id DELETE => Should return 404 if there is no publication with the provided id', async () => {
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

    const date = new Date('2024-01-01');
    await prisma.publications.create({
      data: {
        mediaId: media.id,
        postId: post.id,
        date: date,
      },
    });

    await request(app.getHttpServer())
      .delete(`/publications/-1`)
      .expect(HttpStatus.NOT_FOUND);
  });
});
