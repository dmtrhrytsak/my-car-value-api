import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findAll: () =>
        Promise.resolve([
          { id: 1, email: 'mymail1@gmail.com', password: 'salt1.hash1' },
          { id: 2, email: 'mymail2@gmail.com', password: 'salt2.hash2' },
          { id: 3, email: 'mymail3@gmail.com', password: 'salt3.hash3' },
        ]),
      find: (id: number) =>
        Promise.resolve({
          id,
          email: 'mymail@gmail.com',
          password: 'salt.hash',
        }),
      remove: (id: number) =>
        Promise.resolve({
          id,
          email: 'mymail@gmail.com',
          password: 'salt.hash',
        }),
      update: (id: number, attrs: Partial<User>) =>
        Promise.resolve({
          id,
          email: 'mymail@gmail.com',
          password: 'salt.hash',
        }),
    };

    fakeAuthService = {
      // signup: (email: string, password: string) => {},
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password: 'salt.hash' });
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of all users', async () => {
    const users = await controller.findAllUsers();

    expect(users.length).toBeGreaterThanOrEqual(1);
  });

  it('findUser returns a single user with the given id', async () => {
    const userId = 10;

    const user = await controller.findUser(userId);

    expect(user).toBeDefined();
    expect(user.id).toEqual(userId);
  });

  it('findUser throws an error if user with the given id is not found', async () => {
    fakeUsersService.find = (id: number) => Promise.resolve(null);

    const user = controller.findUser(333);

    await expect(user).rejects.toThrow(NotFoundException);
  });

  it('signin updates the session object and returns a user', async () => {
    const session = { userId: null };

    const user = await controller.signin(
      { email: 'mymail@gmail.com', password: 'mypassword' },
      session,
    );

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
