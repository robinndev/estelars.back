import { Module } from '@nestjs/common';
import { CreateSiteController } from 'src/controller/create-site.controller';
import { CreateSiteService } from 'src/services/create-site.service';
import { PrismaService } from 'src/services/prisma.service';
import { SupabaseService } from 'src/services/supabase.service';

@Module({
  controllers: [CreateSiteController],
  providers: [CreateSiteService, SupabaseService, PrismaService],
})
export class CreateSiteModule {}
