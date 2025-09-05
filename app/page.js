'use client'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import AudioPlayer from '../components/AudioPlayer'

export default function Home() {
  const [session, setSession] = useState(null)
  const [tracks, setTracks] = useState([])
  const [current, setCurrent] = useState(null)
  const isPro = session?.user?.user_metadata?.is_pro || false

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session || null))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s)=> setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => { (async () => {
    const { data, error } = await supabase.from('tracks').select('*').order('created_at', { ascending:false })
    if (!error) setTracks(data || [])
  })() }, [])

  async function getSignedUrl(storage_path){
    // storage_path je název souboru uvnitř bucketu 'audio', např. 'ukazka1.mp3'
    const { data, error } = await supabase.storage.from('audio').createSignedUrl(storage_path, 60)
    if (error) { console.error(error); return null }
    return data.signedUrl
  }

  async function playTrack(t){
    if (!t.is_free && !isPro) { alert('Tento příběh je pro předplatitele.'); return }
    const url = await getSignedUrl(t.storage_path)
    setCurrent({ ...t, url })
  }

  async function goCheckout(){
    const r = await fetch('/api/checkout', { method:'POST' })
    const j = await r.json()
    if (j.url) window.location.href = j.url
  }

  const visible = useMemo(
    () => tracks.map(t => ({...t, locked: !t.is_free && !isPro })),
    [tracks, isPro]
  )

  return (
    <div>
      <section style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16}}>
        <h1>Audio knihovna</h1>
        {!isPro && <button onClick={goCheckout} style={{background:'#E8B679', border:'none', padding:'8px 12px', borderRadius:8}}>Odemknout vše (PRO)</button>}
      </section>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:12}}>
        {visible.map(t => (
          <div key={t.id} style={{border:'1px solid #ddd', borderRadius:12, padding:12}}>
            <img src={t.image_url} alt="" style={{width:'100%', aspectRatio:'1/1', objectFit:'cover', borderRadius:8}}/>
            <div style={{fontWeight:600, marginTop:8}}>{t.title} {t.locked ? '🔒' : ''}</div>
            <div style={{fontSize:14, opacity:0.8}}>{t.description}</div>
            <button onClick={()=>playTrack(t)} style={{marginTop:8, width:'100%'}}>▶︎ Přehrát</button>
          </div>
        ))}
      </div>

      <div style={{marginTop:24}}>
        {current && <AudioPlayer src={current.url} title={current.title} imageUrl={current.image_url}
          onPrev={()=>{}} onNext={()=>{}} />}
      </div>
    </div>
  )
}
