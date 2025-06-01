// src/auth/session.serializer.ts
import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UserService } from '../user/user.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
    constructor(private readonly usersService: UserService) {
        super();
    }

    serializeUser(user: any, done: (err: any, id?: any) => void) {
        done(null, user.id);
    }

    async deserializeUser(id: any, done: (err: any, user?: any) => void) {
        try {
            const user = await this.usersService.findById(id);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    }
}
