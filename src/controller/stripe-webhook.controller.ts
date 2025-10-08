import {
  Controller,
  Post,
  Req,
  Res,
  HttpStatus,
  Headers,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { CreateSiteService } from 'src/services/create-site.service';
import Stripe from 'stripe';

@Controller('stripe-webhook')
export class StripeWebhookController {
  private stripe: Stripe;

  constructor(private readonly createSiteService: CreateSiteService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-09-30.clover',
    });
  }

  @Post()
  async handleWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        req.body,
        signature,
        webhookSecret,
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(`Webhook Error: ${err.message}`);
    }

    // 🎯 Tratar evento de pagamento concluído
    if (
      event.type === 'checkout.session.completed' ||
      event.type === 'payment_intent.succeeded'
    ) {
      const session: Stripe.Checkout.Session = event.data
        .object as Stripe.Checkout.Session;

      const siteId = session.metadata?.siteId;
      if (siteId) {
        try {
          await this.createSiteService.markAsPaid(siteId);
        } catch (err) {
          console.error('Erro ao atualizar site para paid:', err);
        }
      }
    }

    res.status(HttpStatus.OK).json({ received: true });
  }
}
