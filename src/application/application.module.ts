import { Module } from '@nestjs/common';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';
import {PrismaService} from "../prisma/prisma.service";
import {EmailModule} from "../email/email.module";

@Module({
  imports: [EmailModule],
  controllers: [ApplicationController],
  providers: [ApplicationService, PrismaService]
})
export class ApplicationModule {}
