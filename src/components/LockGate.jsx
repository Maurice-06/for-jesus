import { useState, useEffect, useRef } from 'react'
import PinPad from './PinPad'
import Icon3D from './Icon3D'
import { readLock, verifyPin, verifyBiometric, blockedFor, LOCK_KEY } from '../utils/lock'
import { STORAGE_KEYS } from '../hooks/useSpiritual'

const fmtWait = (ms) => {
  const s = Math.ceil(ms / 1000)
  return s >= 60 ? `${Math.ceil(s / 60)} min` : `${s} s`
}

function LockScreen({ onUnlock }) {
  const lock = readLock()
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const [msg, setMsg] = useState('')
  const [checking, setChecking] = useState(false)
  const [wait, setWait] = useState(blockedFor())
  const [forgot, setForgot] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const length = lock?.pinLength || 4

  useEffect(() => {
    if (wait <= 0) return
    const id = setInterval(() => setWait(blockedFor()), 1000)
    return () => clearInterval(id)
  }, [wait])

  const tryPin = async (value) => {
    setChecking(true)
    const res = await verifyPin(value)
    setChecking(false)
    if (res.ok) return onUnlock()
    setError(true)
    setPin('')
    setWait(res.waitMs || 0)
    setMsg(res.waitMs ? '' : res.remaining > 0 && res.remaining <= 2
      ? `Code incorrect — encore ${res.remaining} essai${res.remaining > 1 ? 's' : ''} avant une pause`
      : 'Code incorrect')
    setTimeout(() => setError(false), 400)
  }

  const onChange = (v) => {
    setMsg('')
    setPin(v)
    if (v.length === length) tryPin(v)
  }

  const biometric = async () => {
    if (await verifyBiometric()) onUnlock()
    else setMsg('Face ID n’a pas abouti. Utilisez votre code.')
  }

  // Code oublié : la seule issue est d'effacer les données de l'appli sur cet appareil
  const eraseAll = () => {
    for (const k of [...STORAGE_KEYS, LOCK_KEY, 'fj_rosaryState', 'fj_mercyState', 'fj_prayerTimer']) localStorage.removeItem(k)
    window.location.replace('/')
  }

  if (forgot) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center gap-5 bg-navy-900">
        <Icon3D name="anchor" size={64} />
        <h1 className="text-xl font-semibold text-slate-50">Code oublié ?</h1>
        <p className="text-slate-400 max-w-sm leading-relaxed">
          Pour protéger votre journal, le code ne peut pas être récupéré. Vous pouvez effacer les données de l’appli
          sur ce téléphone, puis restaurer une sauvegarde si vous en avez une (Mon chemin → Sauvegarde).
        </p>
        <p className="text-sm text-red-400 max-w-sm">Cette action efface définitivement le journal, les intentions et la progression de cet appareil.</p>
        <input value={confirmText} onChange={e => setConfirmText(e.target.value)} placeholder="Tapez EFFACER pour confirmer"
          className="input max-w-xs text-center" autoCapitalize="characters" />
        <button onClick={eraseAll} disabled={confirmText.trim().toUpperCase() !== 'EFFACER'}
          className="min-h-[48px] px-6 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 font-semibold disabled:opacity-30">
          Effacer les données de l’appli
        </button>
        <button onClick={() => setForgot(false)} className="btn-secondary min-h-[48px]">Je m’en souviens finalement</button>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 px-6 bg-navy-900 bg-mesh"
      style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="text-center">
        <Icon3D name="cross" size={56} className="mx-auto" />
        <h1 className="text-xl font-semibold text-slate-50 mt-4">For Jesus</h1>
        <p className="text-sm text-slate-400 mt-1 min-h-[1.25rem]" role="status">
          {wait > 0 ? `Trop d’essais. Réessayez dans ${fmtWait(wait)}.` : msg || 'Entrez votre code'}
        </p>
      </div>
      <PinPad value={pin} onChange={onChange} length={length} maxLength={length} error={error}
        disabled={checking || wait > 0} onBiometric={lock?.credentialId ? biometric : undefined} />
      <button onClick={() => setForgot(true)} className="text-sm text-slate-500 min-h-[44px]">Code oublié ?</button>
    </div>
  )
}

/**
 * Affiche l'écran de verrouillage à l'ouverture et après un passage en arrière-plan
 * plus long que le délai choisi. Tant que l'appli n'a jamais été déverrouillée,
 * aucun contenu n'est rendu.
 */
export default function LockGate({ children }) {
  const [locked, setLocked] = useState(() => !!readLock()?.enabled)
  const [everUnlocked, setEverUnlocked] = useState(() => !readLock()?.enabled)
  const hiddenAt = useRef(null)

  useEffect(() => {
    const onVisibility = () => {
      const lock = readLock()
      if (!lock?.enabled) return
      if (document.visibilityState === 'hidden') hiddenAt.current = Date.now()
      else if (hiddenAt.current && Date.now() - hiddenAt.current >= (lock.autoLockMinutes ?? 1) * 60000) setLocked(true)
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  const unlock = () => { setLocked(false); setEverUnlocked(true); hiddenAt.current = null }

  return (
    <>
      {locked && <LockScreen onUnlock={unlock} />}
      {/* Une fois déverrouillée, l'appli reste montée (l'état en cours est conservé) mais masquée */}
      {everUnlocked && <div hidden={locked} inert={locked ? '' : undefined}>{children}</div>}
    </>
  )
}
