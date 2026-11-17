import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Check } from 'lucide-react'
import { useSpiritualContext } from '../context/SpiritualContext'
import { STAGES, MINUTE_LADDER } from '../hooks/useSpiritual'
import Icon3D from '../components/Icon3D'
import PageHeader from '../components/PageHeader'
import { DisplaySettings, ReminderSettings, LockSettings } from '../components/Settings'

const TOOLS = [
  { to: '/progres', icon: 'chart', label: 'Mes statistiques', sub: 'Calendrier, minutes, lectures' },
  { to: '/outils?outil=plans', icon: 'calendar', label: 'Plans de lecture', sub: 'Lire la Bible pas à pas' },
  { to: '/outils?outil=bookmarks', icon: 'bookmark', label: 'Mes versets', sub: 'Les signets enregistrés' },
  { to: '/outils?outil=themes', icon: 'bulb', label: 'Méditer un thème', sub: 'Paix, pardon, force, confiance…' },
  { to: '/outils?outil=exam', icon: 'mirror', label: 'Examen de conscience', sub: 'Avant la confession' },
  { to: '/outils?outil=backup', icon: 'save', label: 'Sauvegarde', sub: 'Exporter ou restaurer mes données' },
]

export default function Chemin() {
  const { growth, milestones, profile, setDailyMinutes, totals, setName } = useSpiritualContext()
  const [nameDraft, setNameDraft] = useState(profile.name)
  const doneCount = milestones.filter(m => m.done).length

  return (
    <div className="space-y-7">
      <PageHeader icon={growth.stage.icon} title={profile.name ? `Le chemin de ${profile.name}` : 'Mon chemin'} subtitle="Le grain de sénevé — Matthieu 13, 31-32" />

      {/* Croissance */}
      <section className="rounded-3xl p-6 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent border border-emerald-400/15 text-center">
        <Icon3D name={growth.stage.icon} size={96} className="mx-auto" />
        <h2 className="text-2xl font-semibold text-slate-50 mt-3">{growth.stage.name}</h2>
        <p className="text-slate-300 mt-1 leading-relaxed">{growth.stage.text}</p>
        <p className="text-sm text-slate-400 mt-3">
          {growth.faithfulDays} jour{growth.faithfulDays > 1 ? 's' : ''} de rencontre avec Dieu · {totals.minutes} min de prière
        </p>
        {growth.nextStage && (
          <div className="mt-4">
            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300 transition-all" style={{ width: `${growth.pct}%` }} />
            </div>
            <p className="text-xs text-slate-500 mt-2">Encore {growth.toNext} jour{growth.toNext > 1 ? 's' : ''} avant « {growth.nextStage.name.toLowerCase()} »</p>
          </div>
        )}
        {/* Les 5 étapes */}
        <div className="flex justify-between mt-5 px-2">
          {STAGES.map((s, i) => (
            <div key={s.name} className="flex flex-col items-center gap-1 w-14">
              <Icon3D name={s.icon} size={30} muted={i > growth.stageIndex} />
              <span className={`text-[0.625rem] leading-tight text-center ${i <= growth.stageIndex ? 'text-slate-300' : 'text-slate-600'}`}>{s.min} j</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-4">Votre croissance ne recule jamais : chaque jour passé avec Dieu compte pour toujours.</p>
      </section>

      {/* Objectif quotidien */}
      <section>
        <h2 className="text-lg font-semibold text-slate-100">Mon temps de prière quotidien</h2>
        <p className="text-sm text-slate-400 mb-3">Commencez petit. L'appli vous proposera d'augmenter quand vous serez prêt(e).</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {MINUTE_LADDER.map(m => (
            <button key={m} onClick={() => setDailyMinutes(m)} aria-pressed={profile.dailyMinutes === m}
              className={`min-w-[60px] min-h-[52px] rounded-2xl border font-semibold transition-all ${
                profile.dailyMinutes === m ? 'bg-gold-500 text-navy-950 border-gold-400' : 'bg-white/[0.03] border-white/10 text-slate-300'}`}>
              {m}<span className="text-xs font-normal"> min</span>
            </button>
          ))}
        </div>
      </section>

      {/* Étapes du chemin : chaque onglet y participe */}
      <section>
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-lg font-semibold text-slate-100">Étapes du chemin</h2>
          <span className="text-sm text-slate-500">{doneCount}/{milestones.length}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {milestones.map(m => (
            <div key={m.id} className={`p-3.5 rounded-2xl border flex flex-col gap-2 ${
              m.done ? 'bg-gold-500/[0.07] border-gold-400/25' : 'bg-white/[0.02] border-white/5'}`}>
              <div className="flex items-center justify-between">
                <Icon3D name={m.icon} size={32} muted={!m.done} />
                {m.done && <span className="w-6 h-6 rounded-full bg-gold-500 text-navy-950 flex items-center justify-center"><Check size={14} strokeWidth={3} /></span>}
              </div>
              <p className={`text-sm leading-snug ${m.done ? 'text-slate-100 font-medium' : 'text-slate-400'}`}>{m.label}</p>
              <div className="flex items-center justify-between text-[0.6875rem] text-slate-500">
                <span>{m.tab}</span>
                {!m.done && m.progress && <span>{m.progress[0]}/{m.progress[1]}</span>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Prénom et guide */}
      <section>
        <h2 className="text-lg font-semibold text-slate-100 mb-3 flex items-center gap-2"><Icon3D name="writing" size={24} /> Moi</h2>
        <div className="rounded-3xl bg-white/[0.03] border border-white/5 p-4 space-y-3">
          <label className="block">
            <span className="text-sm text-slate-400">Mon prénom</span>
            <div className="flex gap-2 mt-1.5">
              <input value={nameDraft} onChange={e => setNameDraft(e.target.value)} maxLength={40}
                autoComplete="given-name" placeholder="Votre prénom" className="input flex-1" />
              <button onClick={() => setName(nameDraft)} disabled={nameDraft.trim() === profile.name}
                className="btn-secondary min-h-[44px] disabled:opacity-40">Enregistrer</button>
            </div>
          </label>
          <Link to="/bienvenue?revoir" className="flex items-center gap-3 min-h-[52px] text-slate-200">
            <Icon3D name="bulb" size={28} />
            <span className="flex-1">Revoir le guide de l'appli</span>
            <ChevronRight size={18} className="text-slate-600" />
          </Link>
        </div>
      </section>

      {/* Réglages */}
      <ReminderSettings />
      <DisplaySettings />
      <LockSettings />

      {/* Outils */}
      <section>
        <h2 className="text-lg font-semibold text-slate-100 mb-3">Outils</h2>
        <div className="rounded-3xl bg-white/[0.03] border border-white/5 divide-y divide-white/5 overflow-hidden">
          {TOOLS.map(t => (
            <Link key={t.to} to={t.to} className="flex items-center gap-3.5 px-4 min-h-[68px] active:bg-white/5">
              <Icon3D name={t.icon} size={32} />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-100">{t.label}</p>
                <p className="text-xs text-slate-500">{t.sub}</p>
              </div>
              <ChevronRight size={18} className="text-slate-600" />
            </Link>
          ))}
        </div>
      </section>

      <p className="text-center text-xs text-slate-600 pb-2">
        For Jesus · vos données restent sur cet appareil · icônes Fluent Emoji (Microsoft, MIT)
      </p>
    </div>
  )
}
