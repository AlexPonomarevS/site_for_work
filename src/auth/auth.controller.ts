// src/auth/auth.controller.ts
import {Controller, Post, Request, UseGuards, Res, Req} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(AuthGuard('local'))
    @Post('login')
    login(@Request() req, @Res() res: Response) {
        req.logIn(req.user, (err) => {
            if (err) {
                console.error('Ошибка логина:', err);
                return res.status(500).json({error: 'Ошибка логина'});
            }
            req.session.userId = req.user.id;
            return res.redirect('/application');
        });
    }

    @Post('logout')
    logout(@Req() req: any, @Res() res: Response) {
        // Если session не определена, просто перенаправляем пользователя
        if (!req.session) {
            return res.redirect('/authorization');
        }

        // Вызываем logout у Passport
        req.logout((err: any) => {
            if (err) {
                console.error('Ошибка logout:', err);
                return res.status(500).json({ error: 'Ошибка при выходе' });
            }
            // Разрушаем сессию, если она существует
            req.session.destroy((err: any) => {
                if (err) {
                    console.error('Ошибка уничтожения сессии:', err);
                    return res.status(500).json({ error: 'Ошибка уничтожения сессии' });
                }
                // Явно очищаем cookie
                res.clearCookie('connect.sid'); // Проверьте, что имя cookie совпадает с настройками express-session
                return res.redirect('/authorization');
            });
        });
    }
}
