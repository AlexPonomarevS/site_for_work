import { Module } from '@nestjs/common';
import { TrainerService } from './trainer.service';
import { TrainerController } from './trainer.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [TrainerService, PrismaService],
  controllers: [TrainerController],
})
export class TrainerModule {}
