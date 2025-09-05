# Příběhy ZeMě – Audio Web App (MVP)

Stack: Next.js 14 (App Router), Supabase (auth, DB, storage), Stripe (subscriptce).

## Rychlý start
1) Vytvoř repo na GitHubu a nahraj sem tenhle projekt (obsah složky, nikoliv ZIP).  
2) Na Vercelu -> Import Project -> vyber repo -> Deploy.  
3) V Project Settings -> Environment Variables doplň:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (jen pro webhook)
   - `NEXT_PUBLIC_APP_URL` (např. https://zeme-audio-app.vercel.app)
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PRICE_ID`
   - `STRIPE_WEBHOOK_SECRET` (až vytvoříš webhook ve Stripe)

4) Supabase: vytvoř bucket `audio` (Private), nahraj MP3 (např. `ukazka1.mp3`).  
5) V tabulce `tracks` nastav `storage_path` na název souboru uvnitř bucketu `audio` (např. `ukazka1.mp3`).  
6) Hotovo. Na homepage uvidíš seznam příběhů. Free lze přehrát, PRO odemkne vše po úspěšné platbě.

## Poznámka
- Přehrávání z privátního bucketu řešíme přes **podepsané URL** (60 s).  
- Webhook Stripe nastaví `profiles.is_pro = true` pro uživatele po úspěšné platbě.

