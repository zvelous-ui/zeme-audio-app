import Stripe from 'stripe'

export async function POST() {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const priceId = process.env.STRIPE_PRICE_ID

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/?canceled=true`,
    // customer_email: optional, Stripe vezme email z přihlášení/Checkoutu
  })

  return new Response(JSON.stringify({ url: session.url }), { status: 200 })
}
