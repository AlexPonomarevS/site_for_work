// src/auth/guards/authenticated.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        // Если пользователь аутентифицирован, req.isAuthenticated() возвращает true.
        if (request.isAuthenticated && request.isAuthenticated()) {
            return true;
        }
        // Если пользователь не аутентифицирован, перенаправляем его на страницу авторизации.
        const response = context.switchToHttp().getResponse();
        response.redirect('/authorization');
        return false;
    }
}
