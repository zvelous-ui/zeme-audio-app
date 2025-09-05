'use client'
import { useEffect, useRef, useState } from 'react'

export default function AudioPlayer({ src, title, imageUrl, onPrev, onNext }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!('mediaSession' in navigator)) return
    navigator.mediaSession.metadata = new window.MediaMetadata({
      title: title || 'Příběh',
      artist: 'Příběhy ZeMě',
      artwork: imageUrl ? [{ src: imageUrl, sizes: '512x512', type: 'image/png' }] : []
    })
    navigator.mediaSession.setActionHandler('previoustrack', () => onPrev && onPrev())
    navigator.mediaSession.setActionHandler('nexttrack', () => onNext && onNext())
    navigator.mediaSession.setActionHandler('seekbackward', () => { if (audioRef.current) audioRef.current.currentTime -= 10 })
    navigator.mediaSession.setActionHandler('seekforward',  () => { if (audioRef.current) audioRef.current.currentTime += 10 })
    navigator.mediaSession.setActionHandler('play', () => { audioRef.current?.play(); setPlaying(true)})
    navigator.mediaSession.setActionHandler('pause', () => { audioRef.current?.pause(); setPlaying(false)})
  }, [title, imageUrl, onPrev, onNext])

  useEffect(() => { setPlaying(false) }, [src])

  return (
    <div style={{border:'1px solid #ddd', padding:12, borderRadius:12}}>
      <div style={{display:'flex', gap:12, alignItems:'center'}}>
        {imageUrl ? <img src={imageUrl} alt="" width={64} height={64} style={{borderRadius:12}}/> : null}
        <div style={{fontWeight:600}}>{title}</div>
      </div>
      <audio ref={audioRef} src={src} onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} controls style={{width:'100%', marginTop:8}} />
      <div style={{display:'flex', gap:8, marginTop:8}}>
        <button onClick={()=> audioRef.current && (audioRef.current.currentTime -= 10)}>⏪ −10s</button>
        <button onClick={()=> audioRef.current && (audioRef.current.currentTime += 10)}>⏩ +10s</button>
      </div>
    </div>
  )
}
