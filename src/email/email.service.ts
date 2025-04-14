import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter: Transporter;
    private readonly logger = new Logger(EmailService.name);

    constructor() {
        // Настройте параметры SMTP через переменные окружения
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: process.env.SMTP_SECURE === 'true', // true для 465 порта и т.п.
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    // Метод для уведомления основной почты компании о новой заявке
    async sendNewApplicationNotification(application: {
        id: number;
        name: string;
        description: string;
        // можно добавить другие поля, если нужно показать дату и т.п.
    }): Promise<void> {
        const mailOptions = {
            from: process.env.EMAIL_FROM, // адрес отправителя (например, noreply@company.com)
            to: process.env.MAIN_COMPANY_EMAIL, // основной адрес компании, куда отправляем оповещение
            subject: `Новая заявка №${application.id}: ${application.name}`,
            text: `Создана новая заявка.\n\nНазвание: ${application.name}\nОписание: ${application.description}`,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            this.logger.log(`Уведомление о новой заявке отправлено на ${process.env.MAIN_COMPANY_EMAIL}`);
        } catch (error) {
            this.logger.error('Ошибка при отправке email для новой заявки', error);
            throw error;
        }
    }

    // Метод для уведомления владельца заявки об обновлении (изменение статуса, добавление заметки)
    async sendApplicationUpdateNotification(
        recipientEmail: string,
        application: { id: number; name: string; status: string },
        updateType: 'status' | 'note',
        extraText?: string,
    ): Promise<void> {
        let subject = '';
        let text = '';

        if (updateType === 'status') {
            subject = `Изменён статус заявки №${application.id}`;
            text = `Статус заявки "${application.name}" изменён на: ${application.status}\n`;
        } else if (updateType === 'note') {
            subject = `Добавлена заметка к заявке №${application.id}`;
            text = `В заявку "${application.name}" добавлена новая заметка.\n`;
        }

        // Если передан дополнительный текст, добавим его в тело письма
        if (extraText) {
            text += `\n${extraText}`;
        }

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: recipientEmail,
            subject,
            text,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            this.logger.log(`Уведомление отправлено владельцу заявки (${recipientEmail}).`);
        } catch (error) {
            this.logger.error('Ошибка при отправке email-уведомления владельцу заявки', error);
            throw error;
        }
    }
}
