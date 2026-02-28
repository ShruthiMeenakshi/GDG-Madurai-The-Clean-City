import React, { useEffect, useRef, useState } from 'react'

type Props = { src: string }

export default function LegacyPage({ src }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function load() {
      setLoading(true)
      try {
        const res = await fetch(src)
        let html = await res.text()

        // Rewrite references to point into /legacy/ so bundled assets are served from public/legacy
        html = html.replace(/(href|src)="\/pages\//g, '$1="/legacy/pages/')

        if (!mounted) return
        if (containerRef.current) {
          containerRef.current.innerHTML = html

          // Execute script tags
          const scripts = Array.from(containerRef.current.querySelectorAll('script'))
          for (const s of scripts) {
            const newScript = document.createElement('script')
            if (s.src) {
              newScript.src = s.src
              newScript.async = false
              document.body.appendChild(newScript)
              // wait for load to preserve order
              await new Promise<void>(resolve => { newScript.onload = () => resolve(); newScript.onerror = () => resolve() })
            } else {
              newScript.text = s.textContent || ''
              document.body.appendChild(newScript)
            }
            s.parentNode?.removeChild(s)
          }

          // Re-dispatch DOMContentLoaded in case legacy scripts registered listeners earlier
          document.dispatchEvent(new Event('DOMContentLoaded'))
        }
      } catch (err) {
        console.error('Failed to load legacy page', err)
        if (containerRef.current) containerRef.current.innerHTML = '<div style="padding:20px;color:#f88;background:#200">Failed to load page</div>'
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => { mounted = false }
  }, [src])

  return (
    <div className="legacy-page-root">
      {loading && <div style={{ padding: 20, color: '#9fd6e8' }}>Loading…</div>}
      <div ref={containerRef}></div>
    </div>
  )
}
