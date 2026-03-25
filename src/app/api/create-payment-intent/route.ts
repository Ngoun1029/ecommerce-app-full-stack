import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '../../../../lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = 'usd' } = await req.json();

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error('Stripe PaymentIntent creation error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}