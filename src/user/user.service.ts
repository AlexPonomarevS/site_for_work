import {forwardRef, Inject, Injectable} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
// import {AuthService} from '../auth/auth.service';
import {PrismaService} from "../prisma/prisma.service";
import {User} from "@prisma/client";


@Injectable()
export class UserService {
    constructor(
        // @Inject(forwardRef(() => AuthService))
        // private authService: AuthService,
        private prisma: PrismaService,
    ) {
    }

    async createUser(name: string, email: string, password: string) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const createdUser = await this.prisma.getPrismaClient().user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });
        return createdUser.id;
    }


    async findById(id: number): Promise<User | null> {
        return this.prisma.getPrismaClient().user.findFirst({
            where: {
                id,
            },
        });
    }

    async findByUsername(name: string): Promise<User | null> {
        return this.prisma.getPrismaClient().user.findFirst({
            where: {
                name,  // то же самое, что username: username
            },
        });
    }
}
