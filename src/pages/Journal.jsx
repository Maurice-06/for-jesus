import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  NotebookPen, Plus, Trash2, ChevronDown, X, Sparkles, Heart,
  Sun, Cloud, CloudRain, Anchor, Star, Search, Edit3
} from 'lucide-react'
import { useSpiritualContext } from '../context/SpiritualContext'
import ConfirmButton from '../components/ConfirmButton'
import Icon3D from '../components/Icon3D'
import PageHeader from '../components/PageHeader'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

const MOODS = [
  { id: 'joyful', label: 'Joyeux/se', icon3d: 'sun', icon: Sun, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
  { id: 'peaceful', label: 'En paix', icon3d: 'dove', icon: Anchor, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  { id: 'grateful', label: 'Reconnaissant(e)', icon3d: 'star', icon: Star, color: 'text-gold-400 bg-gold-500/10 border-gold-500/20' },
  { id: 'seeking', label: 'En quête', icon3d: 'bulb', icon: Cloud, color: 'text-slate-400 bg-slate-500/10 border-slate-500/20' },
  { id: 'struggling', label: 'Dans l\'épreuve', icon3d: 'anchor', icon: CloudRain, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
  { id: 'renewed', label: 'Renouvelé(e)', icon3d: 'sparkles', icon: Sparkles, color: 'text-spirit-400 bg-spirit-500/10 border-spirit-500/20' },
]

const REFLECTION_PROMPTS = [
  'Qu\'est-ce que Dieu m\'a montré aujourd\'hui ?',
  'Pour quoi suis-je reconnaissant(e) envers Dieu ?',
  'Quelle vertu dois-je travailler cette semaine ?',
  'Comment ai-je vu la main de Dieu dans ma journée ?',
  'Quelle promesse biblique veux-je m\'approprier ?',
  'Dans quels domaines dois-je faire davantage confiance à Dieu ?',
  'Comment puis-je mieux servir Dieu et mon prochain ?',
]

function EntryCard({ entry, onDelete, onEdit }) {
  const [expanded, setExpanded] = useState(false)
  const mood = MOODS.find(m => m.id === entry.mood)
  const MoodIcon = mood?.icon || Sun
  const dateStr = format(parseISO(entry.date + 'T00:00:00'), 'EEEE d MMMM yyyy', { locale: fr })

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
      className="card hover:border-navy-500 transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <Icon3D name={mood?.icon3d || 'writing'} size={34} />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-500 capitalize">{dateStr}</p>
            {entry.mood && <p className={`text-xs font-medium mt-0.5 ${mood?.color?.split(' ')[0]}`}>{mood?.label}</p>}
            {entry.verse && (
              <p className="text-xs text-gold-500 mt-1 italic">"{entry.verse}"</p>
            )}
            {entry.content && (
              <p className={`text-sm text-slate-300 mt-2 leading-relaxed ${!expanded ? 'line-clamp-3' : ''}`}>
                {entry.content}
              </p>
            )}
            {entry.content && entry.content.length > 150 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-xs text-slate-500 hover:text-slate-300 mt-1 transition-colors"
              >
                {expanded ? 'Réduire ▲' : 'Lire plus ▼'}
              </button>
            )}
          </div>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          <button onClick={() => onEdit(entry)} aria-label="Modifier" className="min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-600 hover:text-slate-400 transition-colors rounded-lg hover:bg-navy-700">
            <Edit3 size={15} />
          </button>
          <ConfirmButton onConfirm={() => onDelete(entry.id)} size={15} />
        </div>
      </div>

      {/* Gratitude list */}
      {entry.gratitude && entry.gratitude.length > 0 && (
        <div className="mt-3 pt-3 border-t border-navy-600">
          <p className="text-xs text-slate-600 mb-1.5">Gratitudes :</p>
          <div className="flex flex-wrap gap-1.5">
            {entry.gratitude.map((g, i) => (
              <span key={i} className="badge bg-gold-500/8 text-gold-400 border border-gold-500/15 text-xs">
                {g}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

function JournalForm({ initial, onSave, onCancel }) {
  const [mood, setMood] = useState(initial?.mood || '')
  const [content, setContent] = useState(initial?.content || '')
  const [verse, setVerse] = useState(initial?.verse || '')
  const [gratitudeInput, setGratitudeInput] = useState('')
  const [gratitude, setGratitude] = useState(initial?.gratitude || [])
  const prompt = REFLECTION_PROMPTS[new Date().getDate() % REFLECTION_PROMPTS.length]

  const addGratitude = () => {
    if (gratitudeInput.trim() && !gratitude.includes(gratitudeInput.trim())) {
      setGratitude(prev => [...prev, gratitudeInput.trim()])
      setGratitudeInput('')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!content.trim() && !mood) return
    onSave({ mood, content: content.trim(), verse: verse.trim(), gratitude })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="card border-gold-500/20 bg-navy-700 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-200">{initial ? 'Modifier' : 'Nouvelle entrée'}</h3>
        <button onClick={onCancel} aria-label="Fermer" className="min-w-[40px] min-h-[40px] -m-2 flex items-center justify-center text-slate-600 hover:text-slate-400"><X size={16} /></button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Mood */}
        <div>
          <label className="text-xs text-slate-500 mb-2 block">Comment vous sentez-vous spirituellement ?</label>
          <div className="flex flex-wrap gap-2">
            {MOODS.map(m => {
              const MoodIcon = m.icon
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMood(mood === m.id ? '' : m.id)}
                  className={`flex items-center gap-1.5 px-3 min-h-[40px] rounded-xl border text-sm font-medium transition-all ${
                    mood === m.id ? m.color : 'bg-navy-800 border-navy-600 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Icon3D name={m.icon3d} size={18} muted={mood !== m.id} />
                  {m.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Verset */}
        <div>
          <label className="text-xs text-slate-500 mb-2 block">Verset qui vous touche aujourd'hui</label>
          <input
            type="text"
            placeholder="Ex: Jean 3:16 — Car Dieu a tant aimé..."
            value={verse}
            onChange={e => setVerse(e.target.value)}
            className="input text-sm"
          />
        </div>

        {/* Journal content */}
        <div>
          <label className="text-xs text-slate-500 mb-2 block">
            Réflexion du jour
            <span className="ml-2 italic text-slate-600">— {prompt}</span>
          </label>
          <textarea
            placeholder="Écrivez librement ce que Dieu a mis sur votre cœur..."
            value={content}
            onChange={e => setContent(e.target.value)}
            className="input text-[1rem] leading-relaxed resize-none h-40"
          />
        </div>

        {/* Gratitude */}
        <div>
          <label className="text-xs text-slate-500 mb-2 block">Liste de gratitudes</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Ajouter une gratitude..."
              value={gratitudeInput}
              onChange={e => setGratitudeInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addGratitude())}
              className="input text-sm flex-1"
            />
            <button
              type="button"
              onClick={addGratitude}
              className="btn-secondary text-sm px-3"
            >
              +
            </button>
          </div>
          {gratitude.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {gratitude.map((g, i) => (
                <span
                  key={i}
                  className="badge bg-gold-500/8 text-gold-400 border border-gold-500/15 cursor-pointer hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all"
                  onClick={() => setGratitude(prev => prev.filter((_, j) => j !== i))}
                >
                  {g} ×
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button type="submit" className="btn-primary flex-1">
            {initial ? 'Enregistrer' : 'Écrire dans mon journal'}
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary">Annuler</button>
        </div>
      </form>
    </motion.div>
  )
}

export default function Journal() {
  const { journalEntries, addJournalEntry, updateJournalEntry, deleteJournalEntry } = useSpiritualContext()
  const [showForm, setShowForm] = useState(false)
  const [editEntry, setEditEntry] = useState(null)
  const [search, setSearch] = useState('')

  const filtered = journalEntries.filter(e =>
    !search || e.content?.toLowerCase().includes(search.toLowerCase()) ||
    MOODS.find(m => m.id === e.mood)?.label.toLowerCase().includes(search.toLowerCase()) ||
    e.verse?.toLowerCase().includes(search.toLowerCase()) ||
    e.gratitude?.some(g => g.toLowerCase().includes(search.toLowerCase()))
  )

  const handleSave = (data) => {
    if (editEntry) {
      updateJournalEntry(editEntry.id, data)
      setEditEntry(null)
    } else {
      addJournalEntry(data)
      setShowForm(false)
    }
  }

  const handleEdit = (entry) => {
    setEditEntry(entry)
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <PageHeader icon="journal" title="Journal" subtitle="Ce que Dieu met sur votre cœur"
        right={!showForm && !editEntry && (
          <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2 min-h-[44px] px-4">
            <Plus size={16} /> Écrire
          </button>
        )} />

      {/* Form */}
      <AnimatePresence>
        {(showForm && !editEntry) && (
          <JournalForm
            onSave={handleSave}
            onCancel={() => setShowForm(false)}
          />
        )}
        {editEntry && (
          <JournalForm
            initial={editEntry}
            onSave={handleSave}
            onCancel={() => setEditEntry(null)}
          />
        )}
      </AnimatePresence>

      {/* Search */}
      {journalEntries.length > 0 && (
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Rechercher dans mon journal..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-10 text-sm"
          />
        </div>
      )}

      {/* Entries */}
      {filtered.length === 0 ? (
        <div className="card text-center py-14">
          <Icon3D name="writing" size={56} className="mx-auto mb-3" muted={!!search} />
          <p className="text-slate-400 font-medium mb-1">
            {search ? 'Aucun résultat' : 'Votre journal est vide'}
          </p>
          <p className="text-slate-600 text-sm">
            {!search && 'Commencez à documenter votre parcours spirituel.'}
          </p>
          {!search && (
            <button onClick={() => setShowForm(true)} className="btn-primary mt-5 text-sm">
              Écrire ma première entrée
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-slate-600">{filtered.length} entrée{filtered.length > 1 ? 's' : ''}</p>
          <AnimatePresence>
            {filtered.map(entry => (
              <EntryCard
                key={entry.id}
                entry={entry}
                onDelete={deleteJournalEntry}
                onEdit={handleEdit}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
