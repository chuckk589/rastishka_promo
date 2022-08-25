import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { agent as supertest, SuperAgentTest } from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let request: SuperAgentTest;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    request = supertest(app.getHttpServer());
    request.auth(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjYxNDI4MjkzLCJleHAiOjE2NzAwNjgyOTN9.0cpeEcBnLFHOfrspnFnTJHzYKImQMzBGSXHd_l42MPg',
      { type: 'bearer' },
    );
  });
  it('/check (GET)', () => {
    return request.get('/check').expect(200);
  });
  it('/check/1 (PUT)', () => {
    return request.put('/check').expect(200);
  });
});
