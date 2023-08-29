import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './users.entity';
import * as bcrypt from 'bcrypt';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    fakeUsersService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) => Promise.resolve({id: 1, email, password} as User)
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('create a new user with hash', async () => {
      const user = await service.signup('asdasd@gmail.com', 'asdf');
      const isMatch = await bcrypt.compare('asdf', user.password);

      expect(user.password).not.toEqual('asdf');
      expect(isMatch).toEqual(true);
    });

    it('throw an error if user sign up with email in user', async () => {
      fakeUsersService.find = () => Promise.resolve([{id: 1, email: 'a', password: 'b'} as User])

      await expect(service.signup('asdasd@gmail.com', 'asdf')).rejects.toThrow(BadRequestException);
    })
  })

  describe('signin', () => {
    it('throws error if signin is call with unused email', async () => {;
      await expect(service.signin('asdasd@gmail.com', 'asdf')).rejects.toThrow(NotFoundException)
    })

    it('when signin success', async () => {
      const hashPassword = await bcrypt.hash('bcd', 10);
      fakeUsersService.find = () => Promise.resolve([{id: 1, email: 'a', password: hashPassword} as User]);

      expect(await service.signin('asdasd@gmail.com', 'bcd')).toBeDefined();
    })

    it('throw erros when password is wrong', async () => {
      fakeUsersService.find = () => Promise.resolve([{id: 1, email: 'a', password: 'hashPassword'} as User]);

      await expect(service.signin('asdasd@gmail.com', 'bcd')).rejects.toThrow(BadRequestException);
    })
  })
});
