import {Body, Controller, Delete, Get, Param, Post, Put, Render, Req, Res, UnauthorizedException} from '@nestjs/common';
import {ApplicationService} from "./application.service";
import {Response} from "express";
import * as Excel from 'exceljs';
import {EmailService} from "../email/email.service";

@Controller('applications')
export class ApplicationController {
    constructor(private readonly applicationService: ApplicationService, private readonly emailService: EmailService) {
    }

    @Post('create-application')
    async createApplication(
        @Body() body: { name: string; description: string },
        @Req() req: Request,
    ) {
        const clientName = (req as any).user?.name || 'Неизвестный пользователь';
        return this.applicationService.createApplication(
            body.name,
            body.description,
            clientName,
        );
    }


    @Get()
    async getAllApplications(@Req() req: Request) {
        const user = (req as any).user;
        if (user && user.role === 'ADMIN') {
            return this.applicationService.getAllApplications();
        } else if (user) {
            return this.applicationService.getMyApplications(user.name);
        } else {
            // Если пользователь не авторизован (например, guard не применён), можно вернуть пустой массив или ошибку
            return [];
        }
    }

    @Delete('delete/:applicationId')
    async deleteReview(@Param('applicationId') applicationId: number) {
        return this.applicationService.deleteApplication(+applicationId);
    }

    @Get('export-to-excel/:applicationId')
    async exportApplicationToExcel(@Param('applicationId') applicationId: string, @Res() res: Response) {
        const application = await this.applicationService.getApplicationById(applicationId);

        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet('Application Details');

        worksheet.mergeCells('A1:I1');
        worksheet.getCell('A1').value = 'Заголовок';
        worksheet.getCell('A1').alignment = { horizontal: 'center' };

        worksheet.addRow([]);

        worksheet.addRow(['Номер заявки:', applicationId]);
        worksheet.addRow(['Дата заявки', application!.createdAt]);

        worksheet.addRow(['Заводской номер КСА:', 'Пример']);

        worksheet.addRow(['ФИО и должность составителя заявки:', 'Пример']);

        worksheet.addRow([]);

        worksheet.mergeCells('A8:I8');
        worksheet.getCell('A8').value = 'Перечень неисправных учетных единиц:';

        worksheet.addRow([]);

        const tableData = [['Значение 1', 'Значение 2', 'Значение 3', 'Значение 4', 'Значение 5', 'Значение 6', 'Значение 7', 'Значение 8', application!.createdAt]];
        worksheet.addTable({
            name: 'Table',
            ref: 'A9',
            headerRow: true,
            totalsRow: false,
            columns: [
                { name: '№ п/п' },
                { name: 'Тип' },
                { name: 'Название' },
                { name: 'Инвентарный номер' },
                { name: 'Серийный номер' },
                { name: 'Кол-во' },
                { name: 'Местоположение(Заводской номер КСА)' },
                { name: 'Описание неисправности' },
                { name: 'Дата и время возникновения неисправности' }
            ],
            rows: tableData
        });
        worksheet.addRow([]);

        worksheet.addRow(['Должность']);
        worksheet.getCell('E12').border = {
            bottom: { style: 'thin' },
        };
        worksheet.getCell('D12').value = 'Подпись: ';

        const buffer = await workbook.xlsx.writeBuffer();
        res.set('Content-Disposition', `attachment; filename=application_${applicationId}.xlsx`);
        res.type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);
    }

    // Новый маршрут: детальная страница заявки с заметками
    @Get(':applicationId')
    @Render('application-detail')
    async getApplicationDetail(
        @Param('applicationId') applicationId: string,
        @Req() req: Request,
    ) {
        const application = await this.applicationService.getApplicationById(applicationId);
        if (!application) {
            // Можно отобразить страницу с ошибкой или перенаправить пользователя
            return { error: 'Заявка не найдена' };
        }
        const isAdmin = (req as any).user?.role === 'ADMIN';
        return {
            title: 'Детали заявки',
            application,
            user: (req as any).user, // Передаём данные авторизованного пользователя
            isAdmin,
        };
    }

    // Новый маршрут: создание заметки для заявки
    @Post(':applicationId/notes')
    async createNote(
        @Param('applicationId') applicationId: string,
        @Body() body: { content: string },
        @Req() req: Request,
    ) {
        const createdBy = (req as any).user?.name || 'Неизвестный пользователь';
        return this.applicationService.createNote(+applicationId, body.content, createdBy);
    }

    @Put(':applicationId/status')
    async updateStatus(
        @Param('applicationId') applicationId: string,
        @Body() body: { status: string },
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const user = (req as any).user;
        if (!user || user.role !== 'ADMIN') {
            throw new UnauthorizedException('Нет доступа для изменения статуса');
        }
        try {
            const updated = await this.applicationService.updateStatus(parseInt(applicationId), body.status);
            // Отправляем уведомление владельцу заявки
            // Предполагается, что у владельца заявки email можно получить (например, если он хранится в req.user.email)
            if (updated && user.email) {
                await this.emailService.sendApplicationUpdateNotification(
                    user.email,
                    { id: updated.id, name: updated.name, status: updated.status },
                    'status'
                );
            }
            return res.status(200).json(updated);
        } catch (error) {
            return res.status(500).json({ error: 'Не удалось обновить статус заявки' });
        }
    }
}