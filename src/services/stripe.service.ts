import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-09-30.clover',
    });
  }

  // Cria Checkout Session
  async createCheckoutSession(amount: number, siteId: string) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card', 'boleto'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: `Site ${siteId}`,
            },
            unit_amount: Math.round(amount * 100), // em centavos
          },
          quantity: 1,
        },
      ],
      metadata: {
        siteId, // pra usar no webhook
      },
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    return { url: session.url };
  }
}
