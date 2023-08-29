import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './users.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({id, email: 'asd@gmail.com', password: 'abcd'} as User)
      },
      find: (email: string) => {
        return Promise.resolve([{id: 1, email, password: "abcd"} as User]);
      },
      // remove: (id: number) => {

      // },
      // update: () => {}
    };
    fakeAuthService = {
      // signup: () => {},
      signin: (email: string, password: string) => {
        return Promise.resolve({id: 1, email, password} as User)
      }
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService
        },
        {
          provide: AuthService,
          useValue: fakeAuthService
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAllUsers', () => {
    it('return a list of users with the given email', async () => {
      const users = await controller.findAllUsers('asdf@gmail.com');
      expect(users.length).toEqual(1);
      expect(users[0].email).toEqual('asdf@gmail.com');
    })
  })

  describe('findUser', () => {
    it('findUser throws an errors', async () => {
      fakeUsersService.findOne = () => null

      await expect(controller.findUser('1')).toBeNull();
    })
  })

  describe('signIn', () => {
    it('signin update session', async () => {
      const session = { userId: null };
      const user = await controller.signIn({email: 'asd@gmail.com', password: 'abc'}, session)

      expect(user.id).toEqual(1);
      expect(session.userId).toEqual(1)
    })
  })
});
