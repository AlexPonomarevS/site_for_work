import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {UserService} from "../user/user.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UserService,
    ) {}
    // Этот метод должен получать пользователя из базы (например, используя Prisma).
    // Пример ниже предполагает, что поиск выполняется по username.
    async validateUser(username: string, password: string): Promise<any> {
        // Замените этот вызов на фактический запрос к БД с использованием Prisma
        const user = await this.usersService.findByUsername(username);

        if (!user) {
            return null;
        }

        // Используем bcrypt.compare для проверки совпадения пароля
        // const isPasswordValid = await bcrypt.compare(password, user.password);
        const isPasswordValid = password == user.password;
        if (!isPasswordValid) {
            return null;
        }

        // Убираем пароль из возвращаемого объекта (если не нужен в req.user)
        const { password: _, ...result } = user;
        return result;
    }
}
