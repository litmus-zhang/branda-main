import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { AppModule } from './../src/app.module';
import * as pactum from 'pactum';
import { DatabaseService } from './../src/database/database.service';
import { CreateUserDto } from '../src/auth/dto';

describe('Branda Server E2E testng', () => {
  let app: INestApplication;
  let db: DatabaseService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      // .overrideProvider(BrandService)
      // .useValue({
      //   getBrandNames: jest.fn(),
      //   getBrandMessaging: jest.fn(),
      //   getBrandPattern: jest.fn(),
      //   getBrandFront: jest.fn(),
      //   getBrandStrategy: jest.fn(),
      //   // Add other methods if needed
      // })
      .compile();

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
        .expectBodyContains('ok');
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
            .withBearerToken('$S{userAt}')
            .patch('/user/update-profile')
            .withJson(testCredentials)
            .expectStatus(400);
        });
        it('successful profile update', async () => {
          await pactum
            .spec()
            .withBearerToken('$S{userAt}')
            .patch('/user/update-profile')
            .withJson(credentials)
            .expectStatus(206)
            .expectBodyContains('User profile updated successfully');
        });
      });
      it('should refresh access token', async () => {
        await pactum
          .spec()
          .post('/auth/refresh-token')
          .withJson({ refresh_token: '$S{userRt}' })
          .expectStatus(200)
          .expectJsonLike({
            message: 'Token refreshed successfully',
            access_token: /.+/,
            refresh_token: /.+/,
          })
          .stores('userAt', 'access_token')
          .stores('userRt', 'refresh_token');
      });
    });
  });
  describe('Brand Module', () => {
    describe('Create Brand', () => {
      const brandDetails = {
        niche: 'Defi',
        industry: 'Finance',
      };
      it('should return 401 if not authenticated', async () => {
        await pactum
          .spec()
          .post('/brand/name')
          .withBody(brandDetails.industry)
          .expectStatus(401);
      });
      // describe('Fetching Data from Third Party', () => {
      //   it('should return list of brands names', async () => {
      //     await pactum
      //       .spec()
      //       .withBearerToken('$S{userAt}')
      //       .get('/brand/name')
      //       .withQueryParams(brandDetails)
      //       .expectStatus(200)
      //       .expectJsonLike({
      //         message: 'Brand names fetched successfully',
      //         data: [/.+/],
      //       });
      //   });
      //   it('should get a list brand messaging', async () => {
      //     await pactum
      //       .spec()
      //       .withBearerToken('$S{userAt}')
      //       .get('/brand/messaging')
      //       .withQueryParams(brandDetails)
      //       .expectStatus(200)
      //       .expectBodyContains('Brand messaging fetched successfully');
      //   });
      //   // it('should get a list brand fonts', async () => {
      //   //   await pactum
      //   //     .spec()
      //   //     .withBearerToken('$S{userAt}')
      //   //     .get('/brand/fonts')
      //   //     .withQueryParams(brandDetails)
      //   //     .expectStatus(200)
      //   //     .expectBodyContains('Brand fonts fetched successfully');
      //   // }, 10000);
      //   // it('should get a list brand color', async () => {
      //   //   await pactum
      //   //     .spec()
      //   //     .withBearerToken('$S{userAt}')
      //   //     .get('/brand/color')
      //   //     .withQueryParams(brandDetails)
      //   //     .expectStatus(200)
      //   //     .expectBodyContains('Brand color fetched successfully');
      //   // }, 20000);
      //   // it('should get a list brand logo', async () => {
      //   //   await pactum
      //   //     .spec()
      //   //     .withBearerToken('$S{userAt}')
      //   //     .get('/brand/logo')
      //   //     .withQueryParams(brandDetails)
      //   //     .expectStatus(200)
      //   //     .expectBodyContains('Brand logo fetched successfully');
      //   // });
      //   // it('should get a list brand strategy', async () => {
      //   //   brandDetails['country'] = 'Nigeria';
      //   //   await pactum
      //   //     .spec()
      //   //     .withBearerToken('$S{userAt}')
      //   //     .get('/brand/strategy')
      //   //     .withQueryParams(brandDetails)
      //   //     .expectStatus(200)
      //   //     .expectBodyContains('Brand strategy fetched successfully');
      //   // }, 1000000);
      //   // it('should get a list brand photography', async () => {
      //   //   await pactum
      //   //     .spec()
      //   //     .withBearerToken('$S{userAt}')
      //   //     .get('/brand/photography')
      //   //     .withQueryParams(brandDetails)
      //   //     .expectStatus(200)
      //   //     .expectBodyContains('Brand photography fetched successfully');
      //   // });
      //   // it('should get a list brand patterns', async () => {
      //   //   await pactum
      //   //     .spec()
      //   //     .withBearerToken('$S{userAt}')
      //   //     .get('/brand/patterns')
      //   //     .withQueryParams(brandDetails)
      //   //     .expectStatus(200)
      //   //     .expectBodyContains('Brand patterns fetched successfully');
      //   // });
      // });

      describe('should create a brand', () => {
        it('should store brand name and return brandId', async () => {
          await pactum
            .spec()
            .withBearerToken('$S{userAt}')
            .post('/brand/name')
            .withBody(brandDetails.industry)
            .expectStatus(201)
            .expectBodyContains('Brand created successfully')
            .expectJsonLike({
              message: 'Brand created successfully',
              data: {
                brandID: /.+/,
              },
            })
            .stores('brandId', 'data.brandID');
        });
        it('should store brand messaging', async () => {
          await pactum
            .spec()
            .withBearerToken('$S{userAt}')
            .post('/brand/$S{brandId}/messaging')
            .withBody(brandDetails.niche)
            .expectStatus(201)
            .expectBodyContains('Brand messaging created successfully');
        });
        it('should store brand logo', async () => {
          await pactum
            .spec()
            .withBearerToken('$S{userAt}')
            .post('/brand/$S{brandId}/logo')
            .withBody(brandDetails.niche)
            .expectStatus(201)
            .expectBodyContains('Brand logo created successfully');
        });
        it('should store brand font', async () => {
          await pactum
            .spec()
            .withBearerToken('$S{userAt}')
            .post('/brand/$S{brandId}/font')
            .withBody(brandDetails.niche)
            .expectStatus(201)
            .expectBodyContains('Brand font created successfully');
        });
        it('should store brand color', async () => {
          await pactum
            .spec()
            .withBearerToken('$S{userAt}')
            .post('/brand/$S{brandId}/color')
            .withBody(brandDetails.niche)
            .expectStatus(201)
            .expectBodyContains('Brand color created successfully');
        });
        it('should store brand strategy', async () => {
          await pactum
            .spec()
            .withBearerToken('$S{userAt}')
            .post('/brand/$S{brandId}/strategy')
            .withBody(brandDetails.niche)
            .expectStatus(201)
            .expectBodyContains('Brand strategy created successfully');
        });
        it('should store brand photography', async () => {
          await pactum
            .spec()
            .withBearerToken('$S{userAt}')
            .post('/brand/$S{brandId}/photography')
            .withBody(brandDetails.niche)
            .expectStatus(201)
            .expectBodyContains('Brand photography created successfully');
        });
        it('should store brand patterns', async () => {
          await pactum
            .spec()
            .withBearerToken('$S{userAt}')
            .post('/brand/$S{brandId}/pattern')
            .withBody(brandDetails.niche)
            .expectStatus(201)
            .expectBodyContains('Brand pattern created successfully');
        });
      });
    });
    describe('Get all Brands', () => {
      it('should return 401 if not authenticated', async () => {
        await pactum.spec().get('/brand/all').expectStatus(401);
      });
      it('should return list of brands with pagination', async () => {
        await pactum
          .spec()
          .withBearerToken('$S{userAt}')
          .get('/brand/all')
          .expectStatus(200)
          .expectBodyContains('Brands fetched successfully')
          .expectJsonLike({
            message: 'Brands fetched successfully',
            data: {
              results: [{ id: /.+/ }],
              total: /.+/,
              limit: /.+/,
              page: /.+/,
            },
          });
      });
    });
    describe('Update Brand', () => {
      it('should get a single brand and return it', async () => {
        await pactum
          .spec()
          .withBearerToken('$S{userAt}')
          .get('/brand/$S{brandId}')
          .expectStatus(200)
          .expectBodyContains('Brand fetched successfully')
          .expectJsonLike({
            message: 'Brand fetched successfully',
            data: {
              id: /.+/,
            },
          });
      });
    });
    describe('Delete Brand', () => {});
  });
  describe('Systems Module', () => {
    describe('Create a system', () => {});
    describe('Get all systems', () => {});
    describe('Get a system', () => {});
    describe('Update a system', () => {});
    describe('Delete a system', () => {});
  });
  describe('Integrations Module', () => {
    describe('Get all integrations', () => {});
    describe('Add new integrations', () => {});
    describe('Remove an integrations', () => {});
  });
  describe('Link Sharing Module', () => {});
});
