import { useEffect, useRef, useState } from 'react'
import { useLang } from '../i18n/LanguageContext'
import { WEDDING_YOUTUBE_ID, WEDDING_AUDIO_SRC } from '../config'

const VOLUME = 0.22 // 0–1 para <audio>; se escala a 0–100 para YouTube
const BAR_DELAYS = ['-0.2s', '0s', '-0.4s']

// Carga (una sola vez) la API IFrame de YouTube y resuelve con window.YT
let ytApiPromise
function loadYouTubeApi() {
  if (ytApiPromise) return ytApiPromise
  ytApiPromise = new Promise((resolve) => {
    if (window.YT && window.YT.Player) return resolve(window.YT)
    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      if (typeof prev === 'function') prev()
      resolve(window.YT)
    }
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    tag.async = true
    document.head.appendChild(tag)
  })
  return ytApiPromise
}

/**
 * Control de música discreto y flotante (inferior izquierda).
 *
 * - Fuente principal: reproductor OFICIAL de YouTube (la canción se transmite
 *   desde YouTube; no se descarga ni se copia el archivo). Se mantiene oculto
 *   y se controla con este botón. Requiere conexión a internet.
 * - Si WEDDING_YOUTUBE_ID está vacío, usa el archivo local WEDDING_AUDIO_SRC.
 * - Nunca reproduce con sonido hasta que el usuario toca el botón.
 * - Loop, volumen bajo (0.22), respeta safe-area del iPhone.
 * - Tolerante a errores: si algo falla, console.warn y la página sigue intacta.
 */
export default function MusicControl() {
  const { t } = useLang()
  const m = t.music
  const useYouTube = !!WEDDING_YOUTUBE_ID

  const audioRef = useRef(null)
  const ytHolderRef = useRef(null)
  const ytPlayerRef = useRef(null)
  const readyRef = useRef(false)
  const wantsPlayRef = useRef(false) // hay intención de sonar pero aún no arranca
  const pausedByUserRef = useRef(false) // el usuario pausó a mano: no auto-reanudar
  const [playing, setPlaying] = useState(false)

  // Arranca la reproducción (idempotente). Si el reproductor aún no está listo,
  // deja la intención registrada para reproducir en cuanto lo esté.
  const startPlayback = () => {
    if (pausedByUserRef.current) return
    wantsPlayRef.current = true
    if (useYouTube) {
      const p = ytPlayerRef.current
      if (readyRef.current && p && typeof p.playVideo === 'function') p.playVideo()
    } else if (audioRef.current) {
      audioRef.current.play().catch(() => {
        /* bloqueado por el navegador: esperará al primer gesto */
      })
    }
  }

  // Inicializa el reproductor de YouTube oculto
  useEffect(() => {
    if (!useYouTube) {
      if (audioRef.current) audioRef.current.volume = VOLUME
      return
    }
    let cancelled = false
    loadYouTubeApi()
      .then((YT) => {
        if (cancelled || !ytHolderRef.current) return
        ytPlayerRef.current = new YT.Player(ytHolderRef.current, {
          videoId: WEDDING_YOUTUBE_ID,
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            loop: 1,
            playlist: WEDDING_YOUTUBE_ID, // necesario para que loop funcione con un solo video
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
          },
          events: {
            onReady: (e) => {
              readyRef.current = true
              e.target.setVolume(Math.round(VOLUME * 100))
              // Intento de autoplay al cargar; si el navegador lo bloquea,
              // el primer gesto del usuario lo iniciará (ver efecto de gestos).
              if (wantsPlayRef.current || !pausedByUserRef.current) e.target.playVideo()
            },
            onStateChange: (e) => {
              if (e.data === YT.PlayerState.PLAYING) setPlaying(true)
              else if (
                e.data === YT.PlayerState.PAUSED ||
                e.data === YT.PlayerState.ENDED
              )
                setPlaying(false)
            },
            onError: () =>
              console.warn('[MusicControl] El reproductor de YouTube no pudo cargar la canción.'),
          },
        })
      })
      .catch(() => console.warn('[MusicControl] No se pudo cargar la API de YouTube.'))

    return () => {
      cancelled = true
      try {
        ytPlayerRef.current?.destroy()
      } catch {
        /* noop */
      }
    }
  }, [useYouTube])

  // Arranque en el primer gesto del usuario (toque, scroll o tecla) por si el
  // navegador bloquea el autoplay con sonido. Se ejecuta una sola vez.
  useEffect(() => {
    const events = ['pointerdown', 'touchstart', 'keydown', 'scroll']
    const onFirst = () => {
      cleanup()
      startPlayback()
    }
    const cleanup = () => events.forEach((ev) => window.removeEventListener(ev, onFirst))
    events.forEach((ev) => window.addEventListener(ev, onFirst, { once: true, passive: true }))
    // Intento inmediato (funciona en algunos navegadores de escritorio)
    startPlayback()
    return cleanup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggle = async () => {
    pausedByUserRef.current = playing // si estaba sonando y lo pausa, recuérdalo

    if (useYouTube) {
      const p = ytPlayerRef.current
      if (!p || typeof p.playVideo !== 'function') return
      if (playing) p.pauseVideo()
      else p.playVideo()
      return
    }
    // Fallback a archivo local
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
      return
    }
    try {
      await audio.play()
      setPlaying(true)
    } catch {
      console.warn(
        `[MusicControl] No se pudo reproducir "${WEDDING_AUDIO_SRC}". ` +
          'Coloca el archivo en public/audio/wedding-song.mp3.'
      )
      setPlaying(false)
    }
  }

  return (
    <>
      {/* Reproductor oculto de YouTube (transmite el audio en segundo plano) */}
      {useYouTube && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed bottom-0 left-0 -z-10 h-px w-px overflow-hidden opacity-0"
        >
          <div ref={ytHolderRef} />
        </div>
      )}

      {/* Fallback de audio local si no se usa YouTube */}
      {!useYouTube && (
        <audio
          ref={audioRef}
          src={WEDDING_AUDIO_SRC}
          loop
          preload="none"
          onError={() =>
            console.warn(
              `[MusicControl] Audio no encontrado en "${WEDDING_AUDIO_SRC}". ` +
                'La página sigue funcionando; añade public/audio/wedding-song.mp3.'
            )
          }
        />
      )}

      <div
        className="fixed left-[max(0.75rem,env(safe-area-inset-left))] z-40"
        style={{ bottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}
      >
        <button
          type="button"
          onClick={toggle}
          aria-pressed={playing}
          aria-label={playing ? m.pause : m.play}
          className={`${
            playing ? 'eq-playing' : ''
          } flex h-11 items-center justify-center gap-2 rounded-full border border-line bg-ivory/80 px-4 text-ink shadow-soft backdrop-blur-md transition-all duration-300 ease-editorial hover:bg-ivory active:scale-[0.96] sm:h-auto sm:py-2.5`}
        >
          <span aria-hidden="true" className="flex h-3.5 items-end gap-[2px]">
            {BAR_DELAYS.map((delay, i) => (
              <span
                key={i}
                className="eq-bar h-full w-[2px] rounded-full bg-stone"
                style={{ animationDelay: delay }}
              />
            ))}
          </span>
          <span className="hidden text-xs font-medium tracking-wide sm:inline">{m.label}</span>
        </button>
      </div>
    </>
  )
}
