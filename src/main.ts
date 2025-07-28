import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as hbs from 'express-handlebars';
import * as session from 'express-session';
import * as passport from 'passport';
import * as process from 'node:process';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = process.env.PORT || 3000;

  // Настройка статических файлов, папок для представлений и движка шаблонов
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  app.engine(
    'hbs',
    hbs.engine({
      extname: 'hbs',
      partialsDir: join(__dirname, '..', 'views/partials'),
      defaultLayout: 'main',
      layoutsDir: join(__dirname, '..', 'views/layout'),
      helpers: {
        eq: (a, b) => a === b,
      },
    }),
  );

  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'my-session-secret',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 24 * 60 * 60 * 1000, secure: false },
    }),
  );

  // Инициализируем Passport
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
}
bootstrap();
