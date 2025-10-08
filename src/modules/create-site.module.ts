import { Module } from '@nestjs/common';
import { CreateSiteController } from 'src/controller/create-site.controller';
import { StripeWebhookController } from 'src/controller/stripe-webhook.controller';
import { CreateSiteService } from 'src/services/create-site.service';
import { PrismaService } from 'src/services/prisma.service';
import { StripeService } from 'src/services/stripe.service';
import { SupabaseService } from 'src/services/supabase.service';

@Module({
  controllers: [CreateSiteController, StripeWebhookController],
  providers: [CreateSiteService, SupabaseService, PrismaService, StripeService],
})
export class CreateSiteModule {}
