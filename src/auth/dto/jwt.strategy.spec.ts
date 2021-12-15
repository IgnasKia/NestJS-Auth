import { UsersRepository } from '../users.repository';
import { JwtStrategy } from './jwt.strategy';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../user.schema';

const mockUsersRepository = () => ({
    findOne: jest.fn(),
})

describe('JwtStrategy', () => {
    let jwtStrategy: JwtStrategy;
    let usersRepository: UsersRepository;


    beforeEach( async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                JwtStrategy,
                { provide: UsersRepository, useFactory: mockUsersRepository },
            ],
        }).compile();

        jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
        usersRepository = module.get<UsersRepository>(UsersRepository);
    });

    describe('validate', () => {
        it('validates and returns the user based on JWT payload',async () => {
            // const user = new User();
            // user.username = 'TestUser';

            // usersRepository.userModel.findOne(user);
            // const result = await jwtStrategy.validate({ username: 'TestUser'});
            // expect(usersRepository.userModel.findOne).toHaveBeenCalledWith({username: 'TestUser'});
            // expect(result).toEqual({});
        });

        it('Throws Unauthorized Exception as user cannot be found', () => {
            
        })
    })

});