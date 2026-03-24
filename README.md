# For Jesus — Compagnon Spirituel

> Une application web moderne pour vous aider à vous rapprocher de Dieu chaque jour — quelle que soit votre situation spirituelle, que vous ayez cessé de prier, de lire la Bible, ou que vous traversiez une période difficile. **For Jesus** vous accompagne avec douceur, sans jugement, avec des outils concrets pour renouer, grandir et persévérer dans votre foi.

**Application en ligne :** [for-jesus.vercel.app](https://for-jesus.vercel.app)

---

## Ce que fait l'application

For Jesus est un compagnon spirituel quotidien qui réunit en un seul endroit tout ce dont vous avez besoin pour entretenir et approfondir votre relation avec Dieu :

- **Lire la Bible complète** (66 livres, Ancien et Nouveau Testament) en français ou en anglais, rechercher un passage précis, marquer votre avancement et enregistrer vos versets favoris.
- **Prier avec structure** grâce à un minuteur de prière, des prières guidées pour chaque situation (repentance, épreuve, louange, renouveau) et une liste de demandes de prière.
- **Prier le chapelet** du Rosaire (4 séries de mystères avec méditations) et le Chapelet de la Divine Miséricorde, guidé étape par étape.
- **Tenir un journal spirituel** pour noter vos réflexions, vos gratitudes et ce que Dieu vous dit chaque jour.
- **Suivre votre progression** : séries consécutives de prière et de lecture, heatmap d'activité, graphiques hebdomadaires, pourcentage de la Bible lu.
- **Utiliser des outils spirituels** : plans de lecture structurés, examen de conscience avant confession, méditations thématiques par sujet (paix, pardon, force...) et gestion de vos signets.

Toutes les données sont stockées localement sur votre appareil — rien n'est envoyé sur un serveur.

---

## Fonctionnalités détaillées

### Tableau de bord
- Verset du jour (rotation quotidienne de 15 versets clés en français)
- Message d'encouragement contextuel selon votre activité du jour
- Checklist quotidienne : ai-je prié ? ai-je lu la Bible ?
- Séries de jours consécutifs (prière et lecture)
- Statistiques hebdomadaires (jours priés, chapitres lus, minutes de prière)
- Accès rapide à toutes les sections

### Bible
- Les **66 livres** complets (Ancien et Nouveau Testament)
- **4 traductions françaises** : Louis Segond 1910, Nouvelle Bible Segond 2002, Parole de Vie 2017, Bible du Semeur 2015
- **2 traductions anglaises** : WEB (World English Bible), KJV (King James Version)
- **Recherche de passage** : tapez `Jean 3:16`, `Ps 23`, `Ap 1:1`, `1 Jn 4:8`... navigation directe avec verset surligné
- Navigation livre par livre, chapitre par chapitre
- Marquage des chapitres lus (indicateurs verts)
- Ajout de signets sur n'importe quel verset
- Copie d'un verset avec sa référence

### Prière
- **Minuteur** : chronométrez vos sessions de prière (temps enregistré automatiquement)
- **Prières guidées** : Repentance, Renouer avec Dieu, Prière du matin, Dans l'épreuve
- **Demandes de prière** : ajout, catégorisation (Pétition, Intercession, Louange, Confession, Adoration), marquage comme exaucée
- Filtres : toutes / actives / exaucées

### Chapelet
- **Rosaire complet** : les 4 séries de mystères (Joyeux, Lumineux, Douloureux, Glorieux) avec suggestion automatique selon le jour de la semaine
- Chaque mystère guidé étape par étape : annonce + méditation → Notre Père → 10 Je vous salue Marie → Gloire au Père → Ô Jésus
- Perles animées, barre de progression globale
- **Chapelet de la Divine Miséricorde** : toutes les étapes complètes avec la prière "Père Éternel...", référence à sainte Faustine et l'Heure de la Miséricorde

### Journal spirituel
- Entrée quotidienne avec 6 états spirituels (Joyeux, En paix, Reconnaissant, En quête, Dans l'épreuve, Renouvelé)
- Verset du jour personnel, réflexion guidée par un prompt rotatif
- Liste de gratitudes (tags)
- Recherche dans les entrées passées
- Édition et suppression

### Progrès
- Statistiques clés : séries de prière/lecture, % de la Bible lue (sur 1189 chapitres), prières exaucées
- Barre de progression de la Bible (Genèse → Apocalypse)
- Graphiques d'activité quotidienne (barres) et de minutes de prière (courbe) — 7 ou 30 jours
- **Heatmap calendrier** : 12 semaines d'activité visualisées
- Badges d'accomplissements (débloqués selon seuils)
- Objectifs hebdomadaires modifiables

### Outils spirituels
- **Plans de lecture** : 5 plans structurés avec lecture du jour et suivi de progression
  - Bible en 1 an (3-4 ch/jour)
  - Nouveau Testament en 90 jours
  - Psaumes en 30 jours
  - Évangiles en 40 jours
  - Proverbes en 31 jours
- **Signets** : tous vos versets favoris avec recherche et suppression
- **Méditations thématiques** : 6 thèmes (Paix, Pardon, Force, Amour de Dieu, Confiance, Guérison) avec 4 versets chacun
- **Examen de conscience** : 4 catégories (Envers Dieu, Envers les autres, Envers soi-même, Béatitudes) + acte de contrition guidé

---

## Stack technique

| Technologie | Usage |
|---|---|
| React 18 + Vite 5 | Framework frontend |
| Tailwind CSS 3 | Design et mise en page |
| Framer Motion | Animations et transitions |
| Recharts | Graphiques de progression |
| React Router 6 | Navigation entre pages |
| Lucide React | Icônes |
| bolls.life API | Bible en français (LSG, NBS, PDV, BDS) |
| bible-api.com | Bible en anglais (WEB, KJV) |
| localStorage | Stockage local des données |
| Vercel | Hébergement et déploiement |

---

## Installation locale

```bash
# Cloner le projet
git clone <url-du-repo>
cd For_JESUS

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
# → http://localhost:3000

# Build de production
npm run build
```

---

## Déploiement

L'application est déployée sur Vercel. Chaque `vercel deploy --prod` met à jour la production.

```bash
vercel deploy --prod
```

Le fichier `vercel.json` redirige toutes les routes vers `index.html` pour que React Router fonctionne correctement.

---

## APIs Bible utilisées

### bolls.life (traductions françaises)
- Base URL : `https://bolls.life/get-chapter/{translation}/{bookNum}/{chapter}/`
- Traductions : `FRLSG`, `NBS`, `FRPDV17`, `BDS`
- Libre d'accès, CORS ouvert, aucune clé API requise

### bible-api.com (traductions anglaises)
- Base URL : `https://bible-api.com/{book}+{chapter}?translation={id}`
- Traductions : `web`, `kjv`
- Libre d'accès, aucune clé API requise

---

## Structure du projet

```
src/
├── components/
│   ├── Layout.jsx        # Structure principale (sidebar + bottom nav)
│   ├── Sidebar.jsx       # Navigation desktop
│   └── BottomNav.jsx     # Navigation mobile (6 items)
├── context/
│   └── SpiritualContext.jsx  # Context React global
├── data/
│   ├── bibleBooks.js     # Les 66 livres + parseReference()
│   └── readingPlans.js   # 5 plans de lecture
├── hooks/
│   ├── useLocalStorage.js
│   └── useSpiritual.js   # Toute la logique métier
└── pages/
    ├── Dashboard.jsx     # Tableau de bord
    ├── Bible.jsx         # Lecteur Bible
    ├── Prayer.jsx        # Prière
    ├── Chapelet.jsx      # Rosaire + Divine Miséricorde
    ├── Journal.jsx       # Journal spirituel
    ├── Progress.jsx      # Graphiques et stats
    └── Outils.jsx        # Plans, signets, méditations, examen
```
