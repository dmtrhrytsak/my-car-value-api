import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];

    fakeUsersService = {
      findByEmail: (email: string) => {
        const user = users.find((user) => user.email === email) || null;

        return Promise.resolve(user);
      },
      create: (email: string, password: string) => {
        const user = { id: Date.now(), email, password };

        users.push(user);

        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('mymail@gmail.com', 'mypassword');

    expect(user.password).not.toEqual('mypassword');

    const [salt, hash] = user.password.split('.');

    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await service.signup('mymail@gmail.com', 'mypassword');

    await expect(
      service.signup('mymail@gmail.com', 'mypassword'),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws an error if user signs in with incorrect email', async () => {
    await expect(
      service.signin('notexists@gmail.com', 'mypassword'),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws an error if an invalid password is provided', async () => {
    await service.signup('mymail@gmail.com', 'mypassword');

    await expect(
      service.signin('mymail@gmail.com', 'incorrectpassword'),
    ).rejects.toThrow(BadRequestException);
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup('mymail@gmail.com', 'mypassword');

    const user = await service.signin('mymail@gmail.com', 'mypassword');

    expect(user).toBeDefined();
  });
});
