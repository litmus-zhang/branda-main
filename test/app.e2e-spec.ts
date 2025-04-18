import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { DatabaseService } from '../src/database/database.service';
import { CreateUserDto } from '../src/auth/dto';
import { CreateWorkspaceDto } from 'src/workspace/dto/create-workspace.dto';

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
    if (app) {
      await app.close();
    }
  });

  describe('Health Check', () => {
    it('should return 200', async () => {
      await pactum
        .spec()
        .get('/health')
        .expectStatus(200)
        .expectBodyContains('ok');
    }, 6000);
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
      describe('Social Registration', () => {
        // describe('Signup with Google', () => {
        //   it('should return 501', async () => {
        //     await pactum.spec().post('/auth/google').expectStatus(501);
        //   });
        //   it('should return profile data', async () => {
        //     await pactum
        //       .spec()
        //       .post('/auth/google')
        //       .withJson({
        //         access_token: 'google',
        //       })
        //       .expectStatus(200);
        //   });
        // });
        // describe('Signup with Linkedin', () => {
        //   it('should return 501', async () => {
        //     await pactum.spec().post('/auth/linkedin').expectStatus(501);
        //   });
        //   it('should return profile data', async () => {
        //     await pactum
        //       .spec()
        //       .post('/auth/linkedin')
        //       .withJson({
        //         access_token: 'linkedin',
        //       })
        //       .expectStatus(200);
        //   });
        // });
        // describe('Signup with X', () => {
        //   it('should return 501', async () => {
        //     await pactum.spec().post('/auth/x').expectStatus(501);
        //   });
        //   it('should return profile data', async () => {
        //     await pactum
        //       .spec()
        //       .post('/auth/x')
        //       .withJson({
        //         access_token: 'x',
        //       })
        //       .expectStatus(200);
        //   });
        // });
      });
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
  describe('Workspace Module', () => {
    describe('Create a workspace', () => {
      const workspaceDto: CreateWorkspaceDto = {
        name: "Branda's Workspace",
        description: 'Workspace for Branda',
      };
      it('should return 401 if not authenticated', async () => {
        await pactum
          .spec()
          .post('/workspace/create')
          .withBody(workspaceDto)
          .expectStatus(401);
      });
      it('should create a workspace', async () => {
        await pactum
          .spec()
          .withBearerToken('$S{userAt}')
          .post('/workspace/create')
          .withJson(workspaceDto)
          .expectStatus(201)
          .expectBodyContains('Workspace created successfully');
      });
    });
    describe('Get all workspace', () => {
      it('should return 401 if not authenticated', async () => {
        await pactum.spec().get('/workspace/all').expectStatus(401);
      });
      it('should return list of workspaces', async () => {
        await pactum
          .spec()
          .withBearerToken('$S{userAt}')
          .get('/workspace/all??limit=10&page=1')
          .expectStatus(200)
          .expectBodyContains('Workspaces fetched successfully')
          .stores('workspaceId', 'data.results[0].id')
          .expectJsonLike({
            message: 'Workspaces fetched successfully',
            data: {
              results: [{ id: /.+/ }],
              total: /.+/,
              size: /.+/,
              page: /.+/,
            },
          });
      });
    });
    describe('Get a workspace', () => {
      it('should return 401 if not authenticated', async () => {
        await pactum.spec().get('/workspace/$S{workspaceId}').expectStatus(401);
      });
      it('should return a single workspace', async () => {
        await pactum
          .spec()
          .withBearerToken('$S{userAt}')
          .get('/workspace/$S{workspaceId}')
          .expectStatus(200)
          .expectBodyContains('Workspace fetched successfully')
          .expectJsonLike({
            message: 'Workspace fetched successfully',
            data: {
              id: /.+/,
              name: /.+/,
            },
          });
      });
    });
    describe('Update a workspace', () => {
      it('should return 401 if not authenticated', async () => {
        await pactum
          .spec()
          .patch('/workspace/$S{workspaceId}')
          .expectStatus(401);
      });
      it('should return a single updated workspace', async () => {
        await pactum
          .spec()
          .withBearerToken('$S{userAt}')
          .patch('/workspace/$S{workspaceId}')
          .withBody({ name: "Branda's Updated Workspace" })
          .expectStatus(200)
          .expectBodyContains('Workspace updated successfully')
          .expectJsonLike({
            message: 'Workspace updated successfully',
            data: {
              id: /.+/,
              name: /.+/,
            },
          });
      });
    });
    describe('Delete a workspace', () => {
      it('should return 401 if not authenticated', async () => {
        await pactum
          .spec()
          .delete('/workspace/$S{workspaceId}')
          .expectStatus(401);
      });
      it('should delete a single workspace', async () => {
        await pactum
          .spec()
          .withBearerToken('$S{userAt}')
          .delete('/workspace/$S{workspaceId}')
          .expectStatus(200)
          .expectBodyContains('Workspace deleted successfully')
          .inspect();
      });
    });
  });
  describe('Brand Assets Module', () => {
    describe('Create Brand', () => {
      const brandDetails = {
        name: 'Sample Brand',
      };
      it('should return 401 if not authenticated', async () => {
        await pactum
          .spec()
          .post('/brand/new')
          .withBody(brandDetails.name)
          .expectStatus(401);
      });
      describe('should create a new brand', () => {
        it('should store brand name and return brandId', async () => {
          await pactum
            .spec()
            .withBearerToken('$S{userAt}')
            .post('/brand/new')
            .withBody(brandDetails.name)
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
      });
    });
    describe('Get all Brands', () => {
      it('should return 401 if not authenticated', async () => {
        await pactum.spec().get('/brand/all').expectStatus(401);
      });
      it('should make pagination start from 1', async () => {
        await pactum
          .spec()
          .withBearerToken('$S{userAt}')
          .withQueryParams('page', '0')
          .get('/brand/all')
          .expectStatus(200)
          .expectBodyContains('Brands fetched successfully');
      });
      it('should return list of brands with pagination props (limit, page, next and prev)', async () => {
        await pactum
          .spec()
          .withBearerToken('$S{userAt}')
          .get('/brand/all')
          .expectStatus(200)
          .expectBodyContains('Brands fetched successfully')
          .expectJsonLike({
            message: 'Brands fetched successfully',
            data: {
              data: [{ id: /.+/ }],
              meta: {
                total: /.+/,
                lastPage: /.+/,
                currentPage: /.+/,
                perPage: /.+/,
                prev: /.+/,
                next: /.+/,
              },
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
    describe('Delete Brand', () => {
      it('should delete a single brand and return a successful messae', async () => {
        await pactum
          .spec()
          .withBearerToken('$S{userAt}')
          .delete('/brand/$S{brandId}')
          .expectStatus(200)
          .expectBodyContains('Brand deleted successfully');
      });
    });
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
