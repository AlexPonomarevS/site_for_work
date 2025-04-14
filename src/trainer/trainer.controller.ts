import {Body, Controller, Get, Param, Post, UseGuards} from '@nestjs/common';
import {TrainerService} from "./trainer.service";
import {Question} from "./question.model";
// import {JwtAuthGuard} from "../auth/jwt-auth.guard";

@Controller('trainer')
export class TrainerController {
    constructor(private readonly trainerService: TrainerService) {}

    // @UseGuards(JwtAuthGuard)
    @Get('questions')
    getQuestions() {
        return this.trainerService.getQuestions();
    }

    // @UseGuards(JwtAuthGuard)
    @Get('question/:id')
    getQuestion(@Param('id') id: string) {
        return this.trainerService.getQuestion(id);
    }

    // @UseGuards(JwtAuthGuard)
    @Post('question')
    createQuestion(@Body() question: Question) {
        return this.trainerService.createQuestion(question);
    }

    // @UseGuards(JwtAuthGuard)
    @Get('total')
    getTotalQuestions() {
        return this.trainerService.getTotalQuestions();
    }

}