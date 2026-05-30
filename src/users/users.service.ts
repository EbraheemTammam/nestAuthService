import { Injectable, NotImplementedException } from '@nestjs/common';
import { UserDto } from './dtos/user.dto';

@Injectable()
export class UsersService {
    async findOne(email: string): Promise<UserDto> {
        throw new NotImplementedException()
    }
}
