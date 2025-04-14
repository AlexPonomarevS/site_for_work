import {Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {StatusApplication} from "@prisma/client";
import {EmailService} from "../email/email.service";

@Injectable()
export class ApplicationService {
    constructor(private readonly prisma: PrismaService,
                private readonly emailService: EmailService) {
    }

// application.service.ts
    async createApplication(name: string, description: string, client: string) {
        const application = await this.prisma.getPrismaClient().application.create({
            data: {
                name: name,
                description: description,
                username: client, // здесь хранится имя клиента, можно если нужно добавлять дополнительные данные
            },
        });

        // Отправляем уведомление на основную почту компании о новой заявке
        await this.emailService.sendNewApplicationNotification(application);

        return application;
    }


    async getAllApplications() {
        return this.prisma.getPrismaClient().application.findMany();
    }

    async getMyApplications(client: string) {
        return this.prisma.getPrismaClient().application.findMany({
            where: { username: client },
        });
    }

    async getApplicationById(applicationId: string) {
        const application = await this.prisma.getPrismaClient().application.findUnique({
            where: {id: parseInt(applicationId)},
            include: { notes: true },
        });

        return application;
    }

    async deleteApplication(applicationId: number) {
        return this.prisma.getPrismaClient().application.delete({
            where: {
                id: applicationId,
            },
        });
    }

    // Метод для создания новой заметки в заявке
    async createNote(applicationId: number, content: string, createdBy: string) {
        return this.prisma.getPrismaClient().note.create({
            data: {
                content: content,
                createdBy: createdBy,
                application: {
                    connect: { id: applicationId },
                },
            },
        });
    }

    // Метод для получения заметок конкретной заявки (если не используем include в getApplicationById)
    async getApplicationNotes(applicationId: number) {
        return this.prisma.getPrismaClient().note.findMany({
            where: { applicationId: applicationId },
            orderBy: { createdAt: 'asc' },
        });
    }

    async updateStatus(applicationId: number, status: string) {
        return this.prisma.getPrismaClient().application.update({
            where: { id: applicationId },
            data: { status: status as StatusApplication },
        });
    }
}
