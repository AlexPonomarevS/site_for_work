import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
