import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { AppModule } from './../src/app.module';
import * as pactum from 'pactum';
import { DatabaseService } from './../src/database/database.service';
import { CreateUserDto } from 'src/auth/dto';

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

  describe('Health Check', () => {
    it('should return 200', async () => {
      await pactum
        .spec()
        .get('/health')
        .expectStatus(200)
        .expectBodyContains('All systems are operational');
    });
  });

  describe('Authentication Module', () => {
    describe('Register', () => {
      describe('Email-Password Registration', () => {
        const credentials: CreateUserDto = {
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
            .expectBodyContains('Registration successful');
        });
      });
      describe('Social Registration', () => {});
    });
    describe('Login', () => {
      describe('Email-Password Login', () => {
        const credentials = {
          email: 'johndoe@test.com',
          password: 'JohnDoe@123',
        };
        it.each([
          ['missing email', { ...credentials, email: '' }],
          ['invalid email format', { ...credentials, email: 'invalid-email' }],
          ['missing password', { ...credentials, password: '' }],
          [
            'weak password',
            {
              ...credentials,
              password: 'weakpassword',
            },
          ],
        ])('%s', async (testName, testCredentials) => {
          await pactum
            .spec()
            .post('/auth/login')
            .withJson(testCredentials)
            .expectStatus(400);
        });
        it('successful login', async () => {
          await pactum
            .spec()
            .post('/auth/login')
            .withJson(credentials)
            .expectStatus(200)
            .expectBodyContains('Login successful')
            .stores('userAt', 'access_token');
        });
        it('return access and refresh tokens', async () => {
          await pactum
            .spec()
            .post('/auth/login')
            .withJson(credentials)
            .expectStatus(200)
            .expectJsonLike({
              message: 'Login successful',
              access_token: /.+/,
              refresh_token: /.+/,
            })
            .stores('userRt', 'refresh_token');
        });
      });
      describe('Social Login', () => {});
    });
  });
  describe('User Module', () => {
    describe('User Profile', () => {
      describe('Get Profile', () => {
        it('should return 401', async () => {
          await pactum.spec().get('/user/profile').expectStatus(401);
        });
        it('should return user profile', async () => {
          await pactum
            .spec()
            .withBearerToken('$S{userAt}')
            .get('/user/profile')
            .expectStatus(200)
            .expectBodyContains('User profile fetched successfully');
        });
      });
      describe('Update Profile', () => {
        const credentials: CreateUserDto = {
          email: 'johndoherty@test.com',
          firstName: 'Johny',
          lastName: 'Drille',
          password: 'JohnDoe$123',
          confirmPassword: 'JohnDoe$123',
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
            .patch('/user/update-profile')
            .withJson(testCredentials)
            .expectStatus(400);
        });
      });
    });
  });
  describe('Brand Module', () => {
    describe('Create Brand', () => {
      const brandDetails = {
        niche: 'Defi',
        industry: 'Finance',
      };
      it('should return list of brands names', async () => {
        await pactum
          .spec()
          .get('/brand/name')
          .withQueryParams(brandDetails)
          .expectStatus(200)
          .expectBodyContains('Brand fetched successfully').inspect();
      });

      it('should create a ', async () => {
        await pactum
          .spec()
          .post('/brand/name')
          .withBody(brandDetails.industry)
          .expectStatus(201)
          .expectBodyContains('Brand created successfully').inspect();
      });
    });

    describe('Update Brand', () => {});
    describe('Delete Brand', () => {});
  });
  describe('Link Sharing Module', () => {});
});
