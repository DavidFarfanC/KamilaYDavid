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
 * - Estrategia móvil (iOS Safari): el navegador NO permite autoplay con sonido,
 *   pero SÍ permite autoplay EN SILENCIO. Por eso el reproductor arranca mudo
 *   en cuanto carga y, en el primer gesto del usuario (toque/scroll/tecla),
 *   solo le quitamos el silencio (unMute) — operación que iOS sí acepta y es
 *   instantánea porque el video ya viene reproduciéndose. Así suena de forma
 *   fiable en el primer toque, en vez de depender de iniciar la reproducción
 *   justo dentro del gesto (lo que fallaba "a veces").
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
  const pausedByUserRef = useRef(false) // el usuario pausó a mano: no auto-reanudar
  const audibleRef = useRef(false) // ya quitamos el silencio y se escucha
  const [playing, setPlaying] = useState(false) // true solo cuando suena CON sonido

  const playingRef = useRef(false)
  useEffect(() => {
    playingRef.current = playing
  }, [playing])

  // Quita el silencio y asegura la reproducción. Es lo que se ejecuta en el
  // primer gesto del usuario (y al pulsar el botón). Idempotente.
  const goAudible = () => {
    if (pausedByUserRef.current) return
    if (useYouTube) {
      const p = ytPlayerRef.current
      if (!readyRef.current || !p || typeof p.unMute !== 'function') return
      p.unMute()
      p.setVolume(Math.round(VOLUME * 100))
      p.playVideo()
      audibleRef.current = true
      // Tras desmutear no siempre llega un onStateChange, así que confirmamos.
      setTimeout(() => {
        if (ytPlayerRef.current) setPlaying(!ytPlayerRef.current.isMuted())
      }, 150)
    } else {
      const audio = audioRef.current
      if (!audio) return
      audio.muted = false
      audio.volume = VOLUME
      audio
        .play()
        .then(() => {
          audibleRef.current = true
          setPlaying(true)
        })
        .catch(() => {
          /* aún bloqueado: esperará a otro gesto */
        })
    }
  }

  // Inicializa el reproductor de YouTube oculto (autoplay EN SILENCIO).
  useEffect(() => {
    if (!useYouTube) return
    let cancelled = false
    loadYouTubeApi()
      .then((YT) => {
        if (cancelled || !ytHolderRef.current) return
        ytPlayerRef.current = new YT.Player(ytHolderRef.current, {
          videoId: WEDDING_YOUTUBE_ID,
          playerVars: {
            autoplay: 1,
            mute: 1, // imprescindible: iOS solo permite autoplay en silencio
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
              // El iframe necesita permiso explícito de autoplay para que el
              // navegador respete tanto el autoplay mudo como el unMute posterior.
              try {
                e.target.getIframe()?.setAttribute('allow', 'autoplay; encrypted-media')
              } catch {
                /* noop */
              }
              // Arranca EN SILENCIO (permitido en todos lados) y se queda mudo.
              // NO desmuteamos aquí: si lo hiciéramos, la API quedaría como
              // "unmuted" e iOS trataría el unMute() del primer gesto como un
              // no-op, dejando la animación encendida pero SIN sonido. El primer
              // gesto real del usuario hará la única transición muted→unmuted.
              e.target.mute()
              e.target.playVideo()
            },
            onStateChange: (e) => {
              if (e.data === YT.PlayerState.PLAYING) {
                // Solo lo marcamos "sonando" si de verdad no está en silencio.
                setPlaying(audibleRef.current && !e.target.isMuted())
              } else if (
                e.data === YT.PlayerState.PAUSED ||
                e.data === YT.PlayerState.ENDED
              ) {
                setPlaying(false)
              }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useYouTube])

  // Arranque del audio local en silencio (cuando no se usa YouTube).
  useEffect(() => {
    if (useYouTube) return
    const audio = audioRef.current
    if (!audio) return
    audio.muted = true
    audio.volume = VOLUME
    readyRef.current = true // el <audio> ya puede recibir el gesto único
    audio.play().catch(() => {
      /* algún navegador no deja ni el autoplay mudo: el gesto lo arrancará */
    })
    // No desmuteamos aquí: el primer gesto del usuario hará la transición.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useYouTube])

  // Arranque automático: UNA sola vez, en el primer gesto válido del usuario.
  // En iOS, "desplazar hacia abajo" termina en un `touchend` al levantar el
  // dedo, y ese touchend SÍ cuenta como activación de audio → el scroll arranca
  // la música. Solo escuchamos gestos que el navegador acepta como activación
  // (toque/clic/tecla); NADA de scroll/wheel, que en Safari no activa el audio
  // y solo "envenenaría" el estado dejando la animación sin sonido.
  //
  // Es de una sola acción: tras el primer gesto válido quitamos los listeners,
  // así si el usuario vuelve a subir y bajar ya no pasa nada. A partir de ahí
  // solo el botón pone o quita la música.
  useEffect(() => {
    const events = ['pointerup', 'touchend', 'click', 'keydown']
    const onGesture = () => {
      // Si el reproductor aún no está listo, NO gastamos el único intento:
      // esperamos al siguiente gesto.
      if (!readyRef.current) return
      goAudible()
      cleanup() // acción única: a partir de aquí manda el botón
    }
    const cleanup = () => events.forEach((ev) => window.removeEventListener(ev, onGesture))
    events.forEach((ev) => window.addEventListener(ev, onGesture, { passive: true }))
    return cleanup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggle = () => {
    if (playing) {
      // Pausa manual: recordarlo para no auto-reanudar.
      pausedByUserRef.current = true
      if (useYouTube) ytPlayerRef.current?.pauseVideo?.()
      else audioRef.current?.pause()
      setPlaying(false)
      return
    }
    // Reanudar / activar el sonido manualmente.
    pausedByUserRef.current = false
    goAudible()
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
          muted
          playsInline
          preload="auto"
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
