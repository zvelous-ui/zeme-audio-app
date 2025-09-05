export const metadata = {
  title: 'Příběhy ZeMě – Audio',
  description: 'Audio přehrávač příběhů ZeMě'
}
export default function RootLayout({ children }) {
  return (
    <html lang="cs">
      <body style={{fontFamily:'system-ui, sans-serif', margin:0}}>
        <header style={{padding:'12px 16px', background:'#2e7d32', color:'white'}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <strong>Příběhy ZeMě</strong>
            <a href="/signin" style={{color:'white'}}>Přihlášení</a>
          </div>
        </header>
        <main style={{maxWidth:900, margin:'0 auto', padding:16}}>
          {children}
        </main>
      </body>
    </html>
  )
}
