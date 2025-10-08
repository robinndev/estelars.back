import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './modules/prisma.module';
import { CreateSiteModule } from './modules/create-site.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    PrismaModule,
    CreateSiteModule,
    MulterModule.register({
      dest: './uploads', // pasta temporária
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
