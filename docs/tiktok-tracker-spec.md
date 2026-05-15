# TikTok Viral Tracker — Spécification complète

## Vue d'ensemble

Application web progressive (PWA) permettant de collecter rapidement des liens TikTok (vidéos virales et commentaires associés) au fur et à mesure de la navigation, puis d'exporter un rapport formaté à destination d'un client.

**Utilisatrice cible** : une personne travaillant sur tablette Android/iPad, naviguant sur TikTok et ayant besoin de centraliser des liens sans friction.

**Principe clé** : zéro saisie manuelle, zéro perte de données, export en un clic.

---

## Contexte métier

L'utilisatrice effectue une veille virale sur TikTok pour le compte d'un client. Sa mission :

- Identifier des vidéos récentes (de la journée) ayant un fort engagement (ex. +4 000 likes)
- Repérer les threads de commentaires intéressants (commentaires ayant des réponses)
- Transmettre régulièrement ces liens au client sous forme de rapport

### Critères de sélection des vidéos (à la discrétion de l'utilisatrice)

| Critère | Valeur indicative |
|---|---|
| Ancienneté | Moins de 24h |
| Likes minimum | +4 000 |
| Commentaires | Threads avec réponses |

> Ces critères sont appliqués manuellement par l'utilisatrice lors de sa navigation. L'appli ne filtre pas automatiquement.

---

## Stack technique

| Élément | Choix | Justification |
|---|---|---|
| Framework | React (Vite) | Léger, rapide à bootstrapper |
| Styling | Tailwind CSS | Dark mode natif, utilitaires rapides |
| Persistance | `localStorage` | 100% local, pas de backend, pas de compte |
| PWA | `manifest.json` + Service Worker | Installable sur tablette, icône écran d'accueil |
| Déploiement | Vercel | Gratuit, pas besoin de repo public, HTTPS automatique |
| Routing | State React (pas de router) | App simple 2 vues, pas besoin de react-router |

---

## Architecture des données

### Structure localStorage

```json
{
  "entries": [
    {
      "id": "uuid-v4",
      "url": "https://vt.tiktok.com/ZSxRj53sa/",
      "type": "video",
      "createdAt": "2025-05-15T08:32:00.000Z",
      "exported": false
    },
    {
      "id": "uuid-v4",
      "url": "https://vt.tiktok.com/ZS9FwJSLmXwcR-upqVV/",
      "type": "comment",
      "createdAt": "2025-05-15T09:10:00.000Z",
      "exported": false
    }
  ],
  "lastExportDate": "2025-05-14T18:00:00.000Z",
  "lastMode": "video"
}
```

### Champs d'un entry

| Champ | Type | Description |
|---|---|---|
| `id` | string (uuid) | Identifiant unique généré à la création |
| `url` | string | Lien TikTok collé par l'utilisatrice |
| `type` | `"video"` ou `"comment"` | Déterminé par le switch au moment de la saisie |
| `createdAt` | ISO 8601 string | Datetime de la saisie |
| `exported` | boolean | Passe à `true` après un export |

### Clés localStorage annexes

| Clé | Type | Description |
|---|---|---|
| `lastExportDate` | ISO 8601 string | Date du dernier export — sert de borne pour les exports suivants |
| `lastMode` | `"video"` ou `"comment"` | Mémorise le dernier mode choisi par l'utilisatrice |

---

## Fonctionnalités détaillées

### 1. Vue Saisie (vue principale)

#### Champ de saisie

- Input texte pleine largeur
- Placeholder : `"Colle un lien TikTok..."`
- Focus automatique à l'ouverture de l'app
- Vide automatiquement après chaque save réussi
- Bouton **Envoyer** (ou touche Entrée) pour valider

#### Switch de mode (vidéo / commentaire)

- Positionné à droite du champ, discret
- Un seul bouton icône qui toggle entre les deux modes
- **Mode vidéo** : icône caméra (`ti-video`) + bordure/accent rose TikTok (`#ff2d55`)
- **Mode commentaire** : icône bulle (`ti-message-circle`) + bordure/accent cyan (`#00c8ff`)
- La couleur de la bordure du champ change instantanément au toggle
- Le dernier mode utilisé est mémorisé dans `localStorage` (`lastMode`)

#### Logique de validation à la soumission

```
1. Trim du contenu saisi
2. Vérification que c'est non vide
3. Vérification que l'URL contient "tiktok.com" (validation basique)
4. Recherche de doublon dans entries (comparaison URL exacte)
   → Si doublon : notification "⚠️ Déjà enregistré" (toast rouge, 2s)
   → Si nouveau : création entry + save localStorage + notification "✅ Enregistré" (toast vert, 1.5s) + vide le champ
```

#### Notifications (toasts)

| Cas | Message | Couleur | Durée |
|---|---|---|---|
| Nouveau lien sauvegardé | "✅ Enregistré !" | Vert | 1.5s |
| Doublon détecté | "⚠️ Déjà dans la liste" | Orange | 2s |
| URL invalide | "❌ Lien TikTok invalide" | Rouge | 2s |

---

### 2. Vue Historique & Export

Accessible via un bouton de navigation (icône horloge ou liste) en bas ou en haut de l'écran.

#### Affichage par jour

- Les entrées sont groupées par date (format `"Aujourd'hui"`, `"Hier"`, `"14 mai 2025"`, etc.)
- Dans chaque groupe, ordre chronologique décroissant (plus récent en premier)
- Chaque entrée affiche :
  - Badge type (`VIDÉO` en rose / `COMMENTAIRE` en cyan)
  - L'URL (tronquée si trop longue, cliquable)
  - L'heure de saisie
  - Badge `Exporté` si `exported: true`

#### Bouton Export

- Label : `"Exporter les nouveaux liens"`
- Exporte uniquement les entries où `exported === false`
- Si aucun nouveau lien : affiche un toast `"Rien de nouveau à exporter"`

#### Format du fichier TXT exporté

```
TikTok Viral Tracker — Export du 15/05/2025 à 10:32
Nouveaux liens depuis : 14/05/2025 à 18:00
================================================

VIDÉOS
------
https://vt.tiktok.com/ZSxRj53sa/
https://vt.tiktok.com/ZSxRj12ab/

================================================

COMMENTAIRES
------------
https://vt.tiktok.com/ZS9FwJSLmXwcR-upqVV/
https://vt.tiktok.com/ZS9FwJSLmXwcR-abc123/
```

#### Après l'export

1. Tous les entries exportés passent à `exported: true`
2. `lastExportDate` est mis à jour avec la datetime actuelle
3. Toast `"✅ Export réussi — X liens exportés"`

#### Bouton "Tout afficher"

- Toggle qui affiche/masque les entries déjà exportés
- Par défaut : tous les entries sont visibles (pas de filtre)
- Permet de tout voir en cas de bug ou besoin de vérification

---

## PWA — Configuration

### manifest.json

```json
{
  "name": "TikTok Tracker",
  "short_name": "TT Tracker",
  "description": "Collecteur de liens TikTok viraux",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f0f0f",
  "theme_color": "#0f0f0f",
  "orientation": "portrait",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### Service Worker (basique)

- Cache les assets statiques au premier chargement
- Permet l'utilisation offline (les données sont dans localStorage)
- Stratégie : Cache First pour les assets, Network First pour les requêtes externes

---

## Design & UI

### Palette dark mode

| Rôle | Valeur |
|---|---|
| Fond principal | `#0f0f0f` |
| Fond carte/surface | `#1a1a1a` |
| Fond input | `#222222` |
| Texte principal | `#f0f0f0` |
| Texte secondaire | `#888888` |
| Accent vidéo | `#ff2d55` (rose TikTok) |
| Accent commentaire | `#00c8ff` (cyan) |
| Succès | `#22c55e` |
| Avertissement | `#f59e0b` |
| Erreur | `#ef4444` |

### Typographie

- Font : système (`-apple-system, BlinkMacSystemFont, 'Segoe UI'`)
- Taille base : 16px
- Pas de font externe (performance, offline)

### Navigation

- Deux icônes en bas de l'écran (style tab bar mobile)
  - `ti-plus-circle` → Vue Saisie
  - `ti-history` → Vue Historique

---

## Structure du projet

```
tiktok-tracker/
├── public/
│   ├── manifest.json
│   ├── icon-192.png
│   ├── icon-512.png
│   └── sw.js                  # Service worker
├── src/
│   ├── main.jsx
│   ├── App.jsx                # State global, navigation entre vues
│   ├── hooks/
│   │   └── useEntries.js      # Logique localStorage (CRUD + export)
│   ├── views/
│   │   ├── InputView.jsx      # Vue saisie
│   │   └── HistoryView.jsx    # Vue historique + export
│   ├── components/
│   │   ├── ModeToggle.jsx     # Switch vidéo/commentaire
│   │   ├── Toast.jsx          # Notifications temporaires
│   │   ├── EntryCard.jsx      # Carte d'une entrée dans l'historique
│   │   └── DayGroup.jsx       # Groupe d'entrées par jour
│   └── utils/
│       ├── storage.js         # Wrappers localStorage
│       ├── export.js          # Génération du fichier TXT
│       └── validators.js      # Validation URL TikTok
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## Déploiement Vercel

### Étapes

```bash
# 1. Créer le projet
npm create vite@latest tiktok-tracker -- --template react
cd tiktok-tracker
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 2. Coder l'application (voir fichiers src/)

# 3. Build
npm run build

# 4. Déployer sur Vercel
npm install -g vercel
vercel deploy --prod
```

### Config Vercel (vercel.json)

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

> Pas besoin de repo public. Vercel CLI déploie directement depuis la machine locale.

---

## Limites connues & évolutions possibles

| Limite actuelle | Evolution possible |
|---|---|
| Pas de détection auto du type via l'URL (les deux formats sont similaires) | Si TikTok expose des URLs différentes pour commentaires, auto-détecter |
| localStorage limité à ~5MB | Très largement suffisant pour des liens texte |
| Pas de sync multi-appareils | Ajouter un backend léger (Supabase free tier) si besoin |
| Pas de catégorisation | Ajouter un champ tag optionnel (niche, langue, thème) |
| Export TXT uniquement | Ajouter export CSV si le client veut exploiter les données |
