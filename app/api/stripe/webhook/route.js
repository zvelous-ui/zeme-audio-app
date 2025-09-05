import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  let event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const email = session.customer_details?.email
    if (email) {
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
      // Najdi auth uživatele podle emailu a nastav is_pro
      const { data: { users }, error: usersErr } = await supabase.auth.admin.listUsers()
      if (!usersErr) {
        const user = users.find(u => u.email === email)
        if (user) {
          await supabase.from('profiles').upsert({ id: user.id, is_pro: true })
        }
      }
    }
  }

  return NextResponse.json({ received: true })
}

export const config = {
  api: { bodyParser: false }
}
