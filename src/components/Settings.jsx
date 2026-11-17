import { useState, useEffect } from 'react'
import { Check, X } from 'lucide-react'
import Icon3D from './Icon3D'
import PinPad from './PinPad'
import { useSettings } from '../hooks/useSettings'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useSpiritualContext } from '../context/SpiritualContext'
import { downloadDailyReminder, downloadMercyReminder } from '../utils/reminders'
import {
  LOCK_KEY, setPin, verifyPin, disableLock, setAutoLock,
  biometricAvailable, enableBiometric, disableBiometric,
} from '../utils/lock'

const Section = ({ icon, title, children }) => (
  <section>
    <h2 className="text-lg font-semibold text-slate-100 mb-3 flex items-center gap-2">
      <Icon3D name={icon} size={24} /> {title}
    </h2>
    <div className="rounded-3xl bg-white/[0.03] border border-white/5 p-4 space-y-4">{children}</div>
  </section>
)

function Choice({ options, value, onChange, label }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex gap-1 p-1 bg-white/[0.04] rounded-2xl">
      {options.map(o => (
        <button key={o.id} role="radio" aria-checked={value === o.id} onClick={() => onChange(o.id)}
          className={`flex-1 min-h-[44px] rounded-xl text-sm transition-all ${
            value === o.id ? 'bg-navy-600 text-slate-50 font-semibold shadow' : 'text-slate-400'}`}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

// ─── Affichage ────────────────────────────────────────────────────────────────
export function DisplaySettings() {
  const [settings, update] = useSettings()
  return (
    <Section icon="sun" title="Affichage">
      <div>
        <p className="text-sm text-slate-400 mb-2">Thème</p>
        <Choice label="Thème" value={settings.theme} onChange={(theme) => update({ theme })} options={[
          { id: 'auto', label: 'Auto' }, { id: 'light', label: 'Clair' }, { id: 'dark', label: 'Sombre' },
        ]} />
        <p className="text-xs text-slate-500 mt-1.5">« Auto » suit le réglage de votre téléphone.</p>
      </div>
      <div>
        <p className="text-sm text-slate-400 mb-2">Taille du texte</p>
        <Choice label="Taille du texte" value={settings.textSize} onChange={(textSize) => update({ textSize })} options={[
          { id: 'normal', label: 'A' }, { id: 'large', label: 'A+' }, { id: 'xlarge', label: 'A++' },
        ]} />
        <p className="font-serif text-slate-200 mt-3 leading-relaxed">« Le Seigneur est mon berger, je ne manque de rien. »</p>
      </div>
    </Section>
  )
}

// ─── Rappels ──────────────────────────────────────────────────────────────────
export function ReminderSettings() {
  const [settings, update] = useSettings()
  const { profile } = useSpiritualContext()
  const [done, setDone] = useState(null)
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent)

  return (
    <Section icon="bell" title="Rappels">
      <p className="text-sm text-slate-400 leading-relaxed">
        L'appli crée un rappel quotidien dans le calendrier de votre téléphone, avec une alerte à l'heure choisie.
        Rien n'est envoyé sur internet.
      </p>
      <label className="flex items-center justify-between gap-3">
        <span className="text-slate-200">Mon moment avec Dieu</span>
        <input type="time" value={settings.reminderTime} onChange={e => e.target.value && update({ reminderTime: e.target.value })}
          className="input w-32 text-center" />
      </label>
      <button onClick={() => { downloadDailyReminder(settings.reminderTime, profile.dailyMinutes); setDone('moment') }}
        className="btn-primary w-full min-h-[48px]">
        Ajouter à mon calendrier
      </button>
      <button onClick={() => { downloadMercyReminder(); setDone('misericorde') }}
        className="btn-secondary w-full min-h-[48px] flex items-center justify-center gap-2">
        <Icon3D name="blood" size={20} /> Heure de la Miséricorde (15 h)
      </button>
      {done && (
        <p role="status" className="text-sm text-emerald-400 leading-relaxed">
          Fichier de rappel créé ✓ {isIOS
            ? 'Touchez « Ajouter tout » dans la fenêtre du calendrier qui s’ouvre.'
            : 'Ouvrez-le pour l’ajouter à votre calendrier.'}
          <span className="block text-slate-500 mt-1">Pour changer l'heure plus tard : supprimez l'ancien évènement dans le calendrier, puis recréez-le ici.</span>
        </p>
      )}
    </Section>
  )
}

// ─── Verrou ───────────────────────────────────────────────────────────────────
export function LockSettings() {
  const [lock] = useLocalStorage(LOCK_KEY, null) // relu en direct à chaque changement
  const enabled = !!lock?.enabled
  const [mode, setMode] = useState(null) // 'create' | 'confirm' | 'disable' | 'change'
  const [pin, setPinValue] = useState('')
  const [first, setFirst] = useState('')
  const [msg, setMsg] = useState('')
  const [error, setError] = useState(false)
  const [bioOk, setBioOk] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => { biometricAvailable().then(setBioOk) }, [])

  const reset = () => { setMode(null); setPinValue(''); setFirst(''); setMsg(''); setError(false) }
  const fail = (m) => { setMsg(m); setError(true); setPinValue(''); setTimeout(() => setError(false), 400) }

  const submit = async () => {
    if (mode === 'create') {
      if (!/^\d{4,6}$/.test(pin)) return fail('Choisissez 4 à 6 chiffres.')
      setFirst(pin); setPinValue(''); setMsg(''); setMode('confirm')
    } else if (mode === 'confirm') {
      if (pin !== first) { setFirst(''); setMode('create'); return fail('Les deux codes sont différents. Recommencez.') }
      setBusy(true); await setPin(pin); setBusy(false); reset()
    } else if (mode === 'disable' || mode === 'change') {
      setBusy(true)
      const res = await verifyPin(pin)
      setBusy(false)
      if (!res.ok) return fail(res.waitMs ? 'Trop d’essais, patientez un instant.' : 'Code incorrect.')
      if (mode === 'disable') { disableLock(); reset() } else { setPinValue(''); setMsg(''); setMode('create') }
    }
  }

  const toggleBio = async () => {
    setMsg('')
    try {
      if (lock?.credentialId) disableBiometric()
      else await enableBiometric()
    } catch {
      setMsg('Face ID n’a pas pu être activé sur cet appareil.')
    }
  }

  const titles = {
    create: 'Choisissez un code (4 à 6 chiffres)',
    confirm: 'Confirmez le code',
    disable: 'Entrez votre code pour désactiver le verrou',
    change: 'Entrez votre code actuel',
  }

  return (
    <Section icon="anchor" title="Confidentialité">
      {mode ? (
        <div className="flex flex-col items-center gap-4 py-2">
          <div className="w-full flex items-start justify-between gap-3">
            <p className="text-slate-200 font-medium">{titles[mode]}</p>
            <button onClick={reset} aria-label="Annuler" className="w-10 h-10 -m-2 flex items-center justify-center text-slate-500"><X size={18} /></button>
          </div>
          <PinPad value={pin} onChange={(v) => { setMsg(''); setPinValue(v) }} length={mode === 'confirm' ? first.length : 4}
            maxLength={mode === 'confirm' ? first.length : 6} error={error} disabled={busy} />
          {msg && <p role="alert" className="text-sm text-red-400">{msg}</p>}
          <button onClick={submit} disabled={busy || pin.length < 4} className="btn-primary w-full min-h-[48px] disabled:opacity-40">
            {busy ? 'Un instant…' : mode === 'create' ? 'Continuer' : 'Valider'}
          </button>
        </div>
      ) : !enabled ? (
        <>
          <p className="text-sm text-slate-400 leading-relaxed">
            Protégez votre journal et vos intentions par un code{bioOk ? ' et Face ID' : ''}, demandé à l'ouverture de l'appli.
          </p>
          <button onClick={() => setMode('create')} className="btn-primary w-full min-h-[48px]">Activer le verrou</button>
        </>
      ) : (
        <>
          <p className="text-sm text-emerald-400 flex items-center gap-2"><Check size={16} /> Verrou activé</p>
          {bioOk && (
            <label className="flex items-center justify-between gap-3 min-h-[44px] cursor-pointer">
              <span className="text-slate-200">Face ID / empreinte</span>
              <input type="checkbox" checked={!!lock.credentialId} onChange={toggleBio} className="w-6 h-6 accent-amber-400" />
            </label>
          )}
          <div>
            <p className="text-sm text-slate-400 mb-2">Verrouiller quand je quitte l'appli</p>
            <Choice label="Délai de verrouillage" value={lock.autoLockMinutes ?? 1} onChange={setAutoLock} options={[
              { id: 0, label: 'Tout de suite' }, { id: 1, label: '1 min' }, { id: 5, label: '5 min' }, { id: 15, label: '15 min' },
            ]} />
          </div>
          {msg && <p role="alert" className="text-sm text-amber-400">{msg}</p>}
          <div className="flex gap-2">
            <button onClick={() => setMode('change')} className="btn-secondary flex-1 min-h-[48px]">Changer le code</button>
            <button onClick={() => setMode('disable')} className="btn-secondary flex-1 min-h-[48px]">Désactiver</button>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Le verrou empêche une autre personne d'ouvrir l'appli sur votre téléphone. Pensez à faire une sauvegarde :
            en cas d'oubli du code, il faudra effacer les données de l'appli.
          </p>
        </>
      )}
    </Section>
  )
}
