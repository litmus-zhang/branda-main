import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { AppModule } from './../src/app.module';
import * as pactum from 'pactum';
import { DatabaseService } from './../src/database/database.service';

describe('Branda Server E2E testng', () => {
  let app: INestApplication;
  let db: DatabaseService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.setGlobalPrefix('api');
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: ['1', '2'],
    });
    await app.init();
    await app.listen(3001);
    db = app.get<DatabaseService>(DatabaseService);
    await db.cleanDB();
    pactum.request.setBaseUrl('http://localhost:3001/api/v1');
  });
  afterAll(async () => {
    app.close();
  });

  describe('Authentication Module', () => {
    describe('Register', () => {
      describe('Email-Password Registration', () => {
        const credentials = {
          email: 'johndoe@test.com',
          firstName: 'John',
          lastName: 'Doe',
          password: 'JohnDoe@123',
          confirmPassword: 'JohnDoe@123',
        };
        it.each([
          ['missing email', { ...credentials, email: '' }],
          ['invalid email format', { ...credentials, email: 'invalid-email' }],
          ['missing first name', { ...credentials, firstName: '' }],
          ['missing last name', { ...credentials, lastName: '' }],
          ['missing password', { ...credentials, password: '' }],
          ['missing confirm password', { ...credentials, confirmPassword: '' }],
          [
            'passwords do not match',
            { ...credentials, confirmPassword: 'DifferentPassword' },
          ],
          [
            'weak password',
            {
              ...credentials,
              password: 'weakpassword',
              confirmPassword: 'weakpassword',
            },
          ],
        ])('%s', async (testName, testCredentials) => {
          await pactum
            .spec()
            .post('/auth/register')
            .withJson(testCredentials)
            .expectStatus(400);
        });
        it('successful registration', async () => {
          await pactum
            .spec()
            .post('/auth/register')
            .withJson(credentials)
            .expectStatus(201)
            .expectJson({
              message: 'Registration successful',
            });
        });
      });
      describe('Social Registration', () => {});
    });
    describe('Login', () => {});
  });
  describe('User Module', () => {
    describe('User Profile', () => {});
  });
  describe('Brand Module', () => {
    describe('Create Brand', () => {});
    describe('Update Brand', () => {});
    describe('Delete Brand', () => {});
  });
  describe('Link Sharing Module', () => {});
});
