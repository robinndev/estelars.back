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

  // Criar um Payment Intent
  async createPaymentIntent(amount: number, currency = 'usd') {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // em centavos
      currency,
    });
    return paymentIntent;
  }

  async createCheckoutSession(amount: number, siteId: string) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: `Site do casal ${siteId}` },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `https://seusite.com/sucesso?siteId=${siteId}`,
      cancel_url: `https://seusite.com/cancelado?siteId=${siteId}`,
      metadata: { siteId }, // útil pra depois atualizar status
    });

    return { url: session.url }; // frontend redireciona para aqui
  }
}
