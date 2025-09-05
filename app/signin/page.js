'use client'
import { supabase } from '../../lib/supabaseClient'
import { useState } from 'react'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')

  async function sendMagicLink(e){
    e.preventDefault()
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } })
    if (error) setMsg(error.message)
    else setMsg('Odkaz byl odeslán na e-mail. Zkontroluj schránku.')
  }

  return (
    <div style={{maxWidth:420, margin:'32px auto'}}>
      <h1>Přihlášení</h1>
      <p>Zadej e-mail, pošleme kouzelný odkaz.</p>
      <form onSubmit={sendMagicLink}>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email@example.com" type="email" required style={{width:'100%', padding:8}}/>
        <button type="submit" style={{marginTop:8}}>Odeslat odkaz</button>
      </form>
      <div style={{marginTop:8}}>{msg}</div>
    </div>
  )
}
