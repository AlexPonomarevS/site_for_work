import  { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ApplicationModule} from "./application/application.module";
import {ApplicationController} from "./application/application.controller";
import {ApplicationService} from "./application/application.service";
import {PrismaService} from "./prisma/prisma.service";
import { TrainerModule } from './trainer/trainer.module';
import { UserModule } from './user/user.module';
import {AuthModule} from "./auth/auth.module";
import {EmailModule} from "./email/email.module";

@Module({
  controllers: [AppController, ApplicationController],
  imports: [ApplicationModule, TrainerModule, UserModule, AuthModule, EmailModule],
  providers: [AppService, ApplicationService, PrismaService]
})
export class AppModule {}
