import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule  } from "@nestjs/testing";
import { Model } from "mongoose";
import { User, UserDocument } from "./user.schema";
import { UsersRepository } from "./users.repository"

const mockCredentialsDto = { username: "testUsername", password: "testPassword", fullname: "testName", email: "testEmail"};

describe('UsersRepository', () => {
    let usersRepository: UsersRepository;
    let mockUserModel: Model<UserDocument>;

    beforeEach( async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UsersRepository,
                { 
                    provide: getModelToken(User.name), 
                    useValue: Model  // <-- Use the Model Class from Mongoose
                },],
        }).compile();

        usersRepository = module.get<UsersRepository>(UsersRepository);
    });

    describe('createUser', () => {

        let save;

        beforeEach(() => {
            save = jest.fn();
            usersRepository.userModel.create = jest.fn().mockReturnValue({ save });
        })

        it('successfully creates up the user', () => {
            save.mockReturnValue(undefined);
            expect(usersRepository.createUser(mockCredentialsDto)).resolves.not.toThrow();
        });

        it('Throws a conflic exception as username already exists', () => {
            save.mockRejectedValue({ code: '11000' });
            expect(usersRepository.createUser(mockCredentialsDto)).rejects.toThrow(ConflictException);
        });
    
        it('Throws a Internal Server Error Exception', () => {
            save.mockRejectedValue({ code: '1533515'});
            expect(usersRepository.createUser(mockCredentialsDto)).rejects.toThrow(InternalServerErrorException);
        });

    });

});