// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
  });

  // ⚠️ Stripe exige raw body para validar assinatura
  app.use('/stripe-webhook', bodyParser.raw({ type: 'application/json' }));

  await app.listen(process.env.PORT ?? 3002);
  console.log('⚡️[server]: Server is running at', process.env.PORT ?? 3002);
  console.log(
    `🚀 Application running on: http://localhost:${process.env.PORT ?? 3002}`,
  );
}
bootstrap();
