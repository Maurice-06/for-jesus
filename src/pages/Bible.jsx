import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, ChevronLeft, ChevronRight, Search, Bookmark, BookmarkCheck,
  CheckCircle2, Loader2, AlertCircle, X, ChevronDown, Copy
} from 'lucide-react'
import { OLD_TESTAMENT, NEW_TESTAMENT, ALL_BOOKS, parseReference } from '../data/bibleBooks'
import { useSpiritualContext } from '../context/SpiritualContext'

// ─── Traductions disponibles ───────────────────────────────────────────────────
const TRANSLATIONS = [
  { id: 'FRLSG',  label: '🇫🇷 LSG 1910 — Louis Segond',  lang: 'fr', api: 'bolls' },
  { id: 'NBS',    label: '🇫🇷 NBS 2002 — Nouvelle Segond', lang: 'fr', api: 'bolls' },
  { id: 'FRPDV17',label: '🇫🇷 Parole de Vie 2017',         lang: 'fr', api: 'bolls' },
  { id: 'BDS',    label: '🇫🇷 Bible du Semeur 2015',        lang: 'fr', api: 'bolls' },
  { id: 'web',    label: '🇬🇧 WEB — World English',        lang: 'en', api: 'bible-api' },
  { id: 'kjv',    label: '🇬🇧 KJV — King James',           lang: 'en', api: 'bible-api' },
]

// ─── Fetching ──────────────────────────────────────────────────────────────────
async function fetchChapterData(bookId, bookIndex, chapter, translationId) {
  const trans = TRANSLATIONS.find(t => t.id === translationId)
  const bookNum = bookIndex + 1 // canonical 1-66

  if (trans?.api === 'bolls') {
    const url = `https://bolls.life/get-chapter/${translationId}/${bookNum}/${chapter}/`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Erreur réseau (${res.status}) — réessayez`)
    const data = await res.json()
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Ce chapitre est introuvable dans cette traduction.')
    }
    return data.map(v => ({ verse: v.verse, text: (v.text || '').trim() }))
  } else {
    // bible-api.com for English translations
    const url = `https://bible-api.com/${bookId}+${chapter}?translation=${translationId}`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Erreur réseau (${res.status}) — réessayez`)
    const data = await res.json()
    if (data.error) throw new Error(data.error)
    if (!data.verses || data.verses.length === 0) throw new Error('Chapitre introuvable.')
    return data.verses.map(v => ({ verse: v.verse, text: (v.text || '').trim() }))
  }
}

// ─── Book selector overlay ─────────────────────────────────────────────────────
function BookSelector({ selected, onSelect, onClose }) {
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('nt')
  const list = (tab === 'ot' ? OLD_TESTAMENT : NEW_TESTAMENT).filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.nameEn.toLowerCase().includes(search.toLowerCase())
  )
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-slate-200">Choisir un livre</h3>
        <button onClick={onClose} className="btn-ghost p-1.5 rounded-lg"><X size={16} /></button>
      </div>
      <input type="text" placeholder="Rechercher un livre..."
        value={search} onChange={e => setSearch(e.target.value)}
        className="input mb-3 text-sm" autoFocus
      />
      <div className="flex gap-2 mb-3">
        {[['ot', 'Ancien T.'], ['nt', 'Nouveau T.']].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === id ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20' : 'bg-navy-700 text-slate-400'
            }`}
          >{label}</button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-1.5 content-start">
        {list.map(book => (
          <button key={book.id} onClick={() => { onSelect(book); onClose() }}
            className={`text-left px-3 py-2.5 rounded-xl text-sm transition-all min-h-[44px] ${
              selected?.id === book.id
                ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20'
                : 'bg-navy-700 text-slate-300 hover:bg-navy-600'
            }`}
          >
            <span className="font-medium">{book.name}</span>
            <span className="block text-xs text-slate-500">{book.chapters} ch.</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Page principale ───────────────────────────────────────────────────────────
export default function Bible() {
  const { markBibleRead, addBookmark, isBookmarked, readingProgress } = useSpiritualContext()

  const [selectedBook, setSelectedBook] = useState(NEW_TESTAMENT[3]) // Jean (John)
  const [chapter, setChapter] = useState(3)
  const [translation, setTranslation] = useState('FRLSG')
  const [verses, setVerses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showBookSelector, setShowBookSelector] = useState(false)
  const [selectedVerse, setSelectedVerse] = useState(null)
  const [showTranslation, setShowTranslation] = useState(false)
  const [highlightVerse, setHighlightVerse] = useState(null)
  const [searchInput, setSearchInput] = useState('')
  const [searchError, setSearchError] = useState('')
  const [copied, setCopied] = useState(false)

  const verseRefs = useRef({})
  const bookIndex = ALL_BOOKS.findIndex(b => b.id === selectedBook.id)
  const isRead = readingProgress[`${selectedBook.id}-${chapter}`]

  const loadChapter = async (book, chap, trans) => {
    setLoading(true)
    setError(null)
    setVerses([])
    try {
      const idx = ALL_BOOKS.findIndex(b => b.id === book.id)
      const result = await fetchChapterData(book.id, idx, chap, trans)
      setVerses(result)
    } catch (err) {
      setError(err.message || 'Impossible de charger ce chapitre.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadChapter(selectedBook, chapter, translation)
    setSelectedVerse(null)
    setHighlightVerse(null)
  }, [selectedBook, chapter, translation])

  // Scroll to highlighted verse
  useEffect(() => {
    if (highlightVerse && verseRefs.current[highlightVerse]) {
      setTimeout(() => {
        verseRefs.current[highlightVerse]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 400)
    }
  }, [highlightVerse, verses])

  const navigate = (dir) => {
    const newChap = chapter + dir
    if (newChap >= 1 && newChap <= selectedBook.chapters) {
      setChapter(newChap)
    } else if (dir > 0 && bookIndex < ALL_BOOKS.length - 1) {
      setSelectedBook(ALL_BOOKS[bookIndex + 1])
      setChapter(1)
    } else if (dir < 0 && bookIndex > 0) {
      const prev = ALL_BOOKS[bookIndex - 1]
      setSelectedBook(prev)
      setChapter(prev.chapters)
    }
    setSelectedVerse(null)
    setHighlightVerse(null)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchError('')
    const result = parseReference(searchInput)
    if (!result) {
      setSearchError('Non reconnu. Essayez : Jean 3:16 · Ps 23 · Ap 1:1 · Mt 5:3')
      return
    }
    setSelectedBook(result.book)
    setChapter(result.chapter)
    setSearchInput('')
    if (result.verse) setHighlightVerse(result.verse)
  }

  const handleCopyVerse = (v) => {
    const text = `« ${v.text} » — ${selectedBook.name} ${chapter}:${v.verse}`
    navigator.clipboard.writeText(text).then(() => {
      setCopied(v.verse)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {})
  }

  const currentTrans = TRANSLATIONS.find(t => t.id === translation)

  // Pagination numbers
  const pageNums = () => {
    const total = selectedBook.chapters
    const base = Math.max(1, Math.min(chapter - 3, total - 6))
    const count = Math.min(7, total)
    return Array.from({ length: count }, (_, i) => base + i).filter(n => n >= 1 && n <= total)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Book selector overlay */}
      <AnimatePresence>
        {showBookSelector && (
          <>
            <motion.div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowBookSelector(false)}
            />
            <motion.div
              className="fixed inset-y-0 left-0 z-50 w-[min(320px,90vw)] bg-navy-800 border-r border-navy-600 p-4 flex flex-col"
              initial={{ x: -320 }} animate={{ x: 0 }} exit={{ x: -320 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            >
              <BookSelector
                selected={selectedBook}
                onSelect={(b) => { setSelectedBook(b); setChapter(1) }}
                onClose={() => setShowBookSelector(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Recherche de passage ── */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Jean 3:16 · Ps 23 · Ap 1:1 · 1 Jn 4:8..."
            value={searchInput}
            onChange={e => { setSearchInput(e.target.value); setSearchError('') }}
            className="input pl-10 text-sm h-11"
          />
        </div>
        <button type="submit" className="btn-primary text-sm px-4 h-11 flex-shrink-0">Aller</button>
      </form>
      <AnimatePresence>
        {searchError && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="text-xs text-amber-400 flex items-center gap-1.5 -mt-2 px-1">
            <AlertCircle size={12} /> {searchError}
          </motion.p>
        )}
      </AnimatePresence>

      {/* ── Contrôles livre + chapitre + traduction ── */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Livre */}
        <button onClick={() => setShowBookSelector(true)}
          className="flex items-center gap-2 bg-navy-700 hover:bg-navy-600 border border-navy-500 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-200 transition-all min-h-[44px]">
          <BookOpen size={15} className="text-gold-400 flex-shrink-0" />
          <span className="truncate max-w-[100px] sm:max-w-none">{selectedBook.name}</span>
          <ChevronDown size={13} className="flex-shrink-0" />
        </button>

        {/* Chapitre */}
        <div className="flex items-center gap-1 bg-navy-700 border border-navy-500 rounded-xl px-1.5 py-1 min-h-[44px]">
          <button onClick={() => navigate(-1)}
            className="p-1.5 rounded-lg hover:bg-navy-600 text-slate-400 hover:text-slate-200 transition-all min-w-[32px] min-h-[32px] flex items-center justify-center">
            <ChevronLeft size={15} />
          </button>
          <span className="text-sm font-semibold text-slate-200 px-2 min-w-[80px] text-center whitespace-nowrap">
            Ch. {chapter}
          </span>
          <button onClick={() => navigate(1)}
            className="p-1.5 rounded-lg hover:bg-navy-600 text-slate-400 hover:text-slate-200 transition-all min-w-[32px] min-h-[32px] flex items-center justify-center">
            <ChevronRight size={15} />
          </button>
        </div>

        {/* Traduction */}
        <div className="relative ml-auto">
          <button onClick={() => setShowTranslation(!showTranslation)}
            className="flex items-center gap-1.5 bg-navy-700 border border-navy-500 px-3 py-2.5 rounded-xl text-xs text-slate-400 hover:text-slate-200 transition-all min-h-[44px] max-w-[140px] sm:max-w-none">
            <span className="truncate">{currentTrans?.label.split(' — ')[0]}</span>
            <ChevronDown size={12} className="flex-shrink-0" />
          </button>
          <AnimatePresence>
            {showTranslation && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowTranslation(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="absolute right-0 top-full mt-1 bg-navy-700 border border-navy-500 rounded-xl shadow-2xl z-20 min-w-[230px] overflow-hidden"
                >
                  <p className="px-3 pt-2 pb-1 text-[10px] text-slate-600 font-semibold uppercase tracking-wider">Français</p>
                  {TRANSLATIONS.filter(t => t.lang === 'fr').map(t => (
                    <button key={t.id} onClick={() => { setTranslation(t.id); setShowTranslation(false) }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        translation === t.id ? 'text-gold-400 bg-gold-500/10' : 'text-slate-300 hover:bg-navy-600'
                      }`}
                    >{t.label}</button>
                  ))}
                  <p className="px-3 pt-2 pb-1 text-[10px] text-slate-600 font-semibold uppercase tracking-wider border-t border-navy-600 mt-1">English</p>
                  {TRANSLATIONS.filter(t => t.lang === 'en').map(t => (
                    <button key={t.id} onClick={() => { setTranslation(t.id); setShowTranslation(false) }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        translation === t.id ? 'text-gold-400 bg-gold-500/10' : 'text-slate-300 hover:bg-navy-600'
                      }`}
                    >{t.label}</button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Infos + Marquer comme lu ── */}
      <div className="flex items-center justify-between px-1 -mt-1">
        <p className="text-sm text-slate-500">
          {selectedBook.name} {chapter}/{selectedBook.chapters}
        </p>
        <button onClick={() => markBibleRead(selectedBook.id, chapter)}
          className={`flex items-center gap-2 text-xs px-3 py-2 rounded-xl transition-all min-h-[36px] ${
            isRead
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-navy-700 text-slate-400 hover:text-slate-200 border border-navy-500'
          }`}
        >
          <CheckCircle2 size={13} />
          {isRead ? 'Lu ✓' : 'Marquer lu'}
        </button>
      </div>

      {/* ── Contenu du chapitre ── */}
      <div className="card-glass min-h-[400px]">
        {loading && (
          <div className="flex flex-col items-center justify-center h-48 gap-3">
            <Loader2 size={28} className="text-gold-400 animate-spin" />
            <p className="text-xs text-slate-500">Chargement en cours...</p>
          </div>
        )}
        {error && (
          <div className="flex flex-col items-center justify-center h-48 gap-3 px-4 text-center">
            <AlertCircle size={28} className="text-red-400" />
            <p className="text-slate-400 text-sm">{error}</p>
            <button onClick={() => loadChapter(selectedBook, chapter, translation)} className="btn-secondary text-sm">
              Réessayer
            </button>
          </div>
        )}
        {!loading && !error && verses.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div key={`${selectedBook.id}-${chapter}-${translation}`}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="font-serif text-lg sm:text-xl font-semibold text-slate-200 mb-5">
                {selectedBook.name} — Chapitre {chapter}
                <span className="block text-xs text-slate-600 font-sans font-normal mt-1">{currentTrans?.label}</span>
              </h2>
              <div className="space-y-2">
                {verses.map((v) => {
                  const isSelected = selectedVerse === v.verse
                  const isHighlighted = highlightVerse === v.verse
                  return (
                    <div key={v.verse}
                      ref={el => verseRefs.current[v.verse] = el}
                      onClick={() => setSelectedVerse(isSelected ? null : v.verse)}
                      className={`group relative flex gap-3 p-3 rounded-xl cursor-pointer transition-all duration-150 ${
                        isHighlighted
                          ? 'bg-gold-500/12 border border-gold-500/35 shadow-lg shadow-gold-500/10'
                          : isSelected
                          ? 'bg-navy-700/70 border border-navy-500'
                          : 'hover:bg-navy-800/50'
                      }`}
                    >
                      <span className="text-[11px] text-gold-500 font-bold min-w-[20px] mt-1 flex-shrink-0 leading-tight">
                        {v.verse}
                      </span>
                      <p className="text-slate-200 leading-relaxed flex-1 text-[15px]">{v.text}</p>
                    </div>
                  )
                })}
              </div>
              {/* Verse action bar (appears when verse is selected) */}
              <AnimatePresence>
                {selectedVerse !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                    className="sticky bottom-0 left-0 right-0 mt-4 -mx-5 px-5 py-3 bg-navy-800/95 backdrop-blur border-t border-navy-600 flex items-center gap-2"
                  >
                    <span className="text-xs text-slate-500 mr-1">
                      v.{selectedVerse}
                    </span>
                    <button
                      onClick={() => {
                        const v = verses.find(v => v.verse === selectedVerse)
                        if (v && !isBookmarked(selectedBook.id, chapter, v.verse)) {
                          addBookmark(selectedBook.id, selectedBook.name, chapter, v.verse, v.text)
                        }
                        setSelectedVerse(null)
                      }}
                      className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border transition-all min-h-[36px] ${
                        isBookmarked(selectedBook.id, chapter, selectedVerse)
                          ? 'bg-gold-500/10 text-gold-400 border-gold-500/20'
                          : 'bg-navy-700 text-slate-400 border-navy-500 hover:text-gold-400'
                      }`}
                    >
                      {isBookmarked(selectedBook.id, chapter, selectedVerse)
                        ? <><BookmarkCheck size={12} /> Signet</>
                        : <><Bookmark size={12} /> Ajouter</>}
                    </button>
                    <button
                      onClick={() => { const v = verses.find(v => v.verse === selectedVerse); if (v) handleCopyVerse(v) }}
                      className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border bg-navy-700 text-slate-400 border-navy-500 hover:text-slate-200 transition-all min-h-[36px]"
                    >
                      <Copy size={12} /> {copied === selectedVerse ? 'Copié !' : 'Copier'}
                    </button>
                    <button onClick={() => setSelectedVerse(null)} className="ml-auto text-slate-600 hover:text-slate-400 p-1">
                      <X size={16} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* ── Navigation bas ── */}
      <div className="flex items-center justify-between gap-2">
        <button onClick={() => navigate(-1)} className="btn-secondary flex items-center gap-1.5 text-sm min-h-[44px]">
          <ChevronLeft size={16} /> <span className="hidden sm:inline">Préc.</span>
        </button>
        <div className="flex gap-1 overflow-x-auto py-1">
          {pageNums().map(chap => (
            <button key={chap} onClick={() => setChapter(chap)}
              className={`min-w-[34px] h-8 rounded-lg text-xs font-medium flex-shrink-0 transition-all ${
                chap === chapter
                  ? 'bg-gold-500 text-navy-950 font-bold'
                  : readingProgress[`${selectedBook.id}-${chap}`]
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-navy-700 text-slate-400 hover:bg-navy-600'
              }`}
            >{chap}</button>
          ))}
        </div>
        <button onClick={() => navigate(1)} className="btn-secondary flex items-center gap-1.5 text-sm min-h-[44px]">
          <span className="hidden sm:inline">Suiv.</span> <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
