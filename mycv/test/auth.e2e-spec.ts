import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/signup (POST)', () => {
    const email = 'abcd@gmail.com';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({email: email, password: 'abcdfg'})
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(email);
      })
  });

  it('/auth/signin (POST) then logged in', async () => {
    const email = 'abcd@gmail.com';

    const res = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email, password: 'abcdfg' })
      .expect(201)

    const cookie = res.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200)

    expect(body.email).toEqual(email)
  })
});
