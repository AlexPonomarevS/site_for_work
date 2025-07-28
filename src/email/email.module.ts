import { Module } from '@nestjs/common';
import { EmailService } from './email.service';

@Module({
  providers: [EmailService],
  exports: [EmailService], // экспортируем, чтобы другие модули могли использовать EmailService
})
export class EmailModule {}
