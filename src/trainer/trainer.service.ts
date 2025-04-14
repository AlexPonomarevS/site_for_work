import {Injectable, UseGuards} from '@nestjs/common';
import {Question} from "./question.model";
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class TrainerService {
    constructor(private readonly prisma: PrismaService) {
    }

    async getQuestions() {
        return this.prisma.getPrismaClient().question.findMany();
    }

    async getQuestion(id: string) {
        return this.prisma.getPrismaClient().question.findUnique({
            where: {id: parseInt(id)},
        });
    }

    async createQuestion(question: Question) {
        return this.prisma.getPrismaClient().question.create({data: question});
    }

    async getTotalQuestions() {
        const count = await this.prisma.getPrismaClient().question.count();
        return count !== null ? count : 0;
    }
}