import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('e2e', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('AuthModule', () => {
    it('should properly log in in /auth/login', () => {
      return request(app.getHttpServer())
        .post('/v1/auth/login')
        .send({ username: 'Weston46', password: 'password' })
        .expect(200);
    });

    it('should properly sign up in /auth/signup', () => {
      return request(app.getHttpServer())
        .post('/v1/auth/signup')
        .send({ username: 'rbbu', password: 'password' })
        .expect(200);
    });
  });

  describe('TweetModule', () => {
    it('should properly fetch many tweets', async () => {
      return request(app.getHttpServer())
        .get('/v1/tweets')
        .expect(200)
        .expect((res) => {
          const tweets = JSON.parse(res.text);
          expect(tweets).toBeDefined();
          expect(Array.isArray(tweets)).toBe(true);
        });
    });
    it('should properly fetch tweet by ID', async () => {
      const mockTweet = {
        id: 1,
        content:
          'Angelus asperiores ultio. Usitas autem creber aut error ater volup adinventitias.',
        userId: 1,
        createdAt: new Date(1719932255336).toISOString(),
        updatedAt: null,
        deletedAt: null,
      };

      return request(app.getHttpServer())
        .get('/v1/tweets/1')
        .expect(200)
        .expect((res) => {
          const tweet = JSON.parse(res.text);
          expect(tweet).toEqual(mockTweet);
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
