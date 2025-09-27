# Boutique Fraîche - E-commerce de Produits Frais

Une boutique en ligne moderne pour vendre des produits frais directement des fermes partenaires.

## 🚀 Déploiement sur Vercel

### 1. Configuration de la Base de Données PostgreSQL

Pour résoudre les erreurs 500 liées à la base de données, vous devez configurer une base de données PostgreSQL sur Vercel :

#### Option A: Vercel Postgres (Recommandé)
1. Allez sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Sélectionnez votre projet
3. Allez dans l'onglet "Storage"
4. Cliquez sur "Create Database" → "Postgres"
5. Donnez un nom à votre base de données (ex: `boutique-db`)
6. Créez la base de données

#### Option B: Base de Données Externe
Vous pouvez utiliser :
- **Supabase** (gratuit jusqu'à 500MB)
- **Railway** (gratuit jusqu'à 1GB)
- **Neon** (gratuit jusqu'à 3GB)
- **PlanetScale** (gratuit jusqu'à 5GB)

### 2. Variables d'Environnement sur Vercel

Ajoutez ces variables dans votre projet Vercel (Settings → Environment Variables) :

```env
# Base de données (obtenue automatiquement avec Vercel Postgres)
DATABASE_URL="postgresql://..."

# Cloudflare R2 (pour le stockage de fichiers)
CLOUDFLARE_ACCOUNT_ID="your_account_id"
CLOUDFLARE_ACCESS_KEY_ID="your_access_key_id"
CLOUDFLARE_SECRET_ACCESS_KEY="your_secret_access_key"
CLOUDFLARE_BUCKET_NAME="your_bucket_name"
CLOUDFLARE_PUBLIC_URL="https://your-public-url.com"

# Next.js
NEXTAUTH_SECRET="your-secret-key-here"
```

### 3. Initialisation de la Base de Données

Après avoir configuré PostgreSQL, vous devez :

1. **Créer les tables** (fait automatiquement par Prisma)
2. **Ajouter des données d'exemple** :

```bash
# En local
npm run db:setup

# Ou manuellement sur Vercel
# Le seed se fait automatiquement au premier déploiement
```

## 🛠️ Développement Local

```bash
# Installation
npm install

# Configuration de la base de données locale
cp .env.example .env
# Éditez .env avec vos paramètres locaux

# Génération du client Prisma
npx prisma generate

# Création et population de la base de données
npm run db:setup

# Démarrage du serveur de développement
npm run dev
```

## 📁 Structure du Projet

```
src/
├── app/
│   ├── admin/           # Panel d'administration
│   ├── api/            # Routes API
│   └── globals.css     # Styles globaux
├── components/         # Composants React
├── lib/               # Utilitaires (Prisma, Cloudflare, etc.)
└── types/             # Types TypeScript
```

## 🎯 Fonctionnalités

### Panel d'Administration
- ✅ Gestion des produits (nom, description, images, prix)
- ✅ Gestion des catégories (nom)
- ✅ Gestion des fermes (nom)
- ✅ Gestion des réseaux sociaux (nom, URL)
- ✅ Configuration du site (logo, titre, informations de contact)

### Boutique
- ✅ Affichage des produits par catégorie
- ✅ Panier d'achat avec Zustand
- ✅ Intégration WhatsApp pour les commandes
- ✅ Design responsive noir et blanc

## 🔧 Technologies Utilisées

- **Next.js 15** - Framework React
- **TypeScript** - Typage statique
- **Prisma** - ORM pour PostgreSQL
- **Tailwind CSS** - Framework CSS
- **Zustand** - Gestion d'état
- **Cloudflare R2** - Stockage de fichiers
- **Vercel** - Déploiement

## 🐛 Résolution des Erreurs 500

Les erreurs 500 étaient causées par :
1. **SQLite non compatible** avec l'environnement serverless de Vercel
2. **Client Prisma non généré** lors du build
3. **Base de données non initialisée**

**Solution appliquée :**
- ✅ Migration vers PostgreSQL
- ✅ Génération automatique du client Prisma
- ✅ Script de seed avec données d'exemple
- ✅ Configuration Vercel optimisée

## 📞 Support

Pour toute question ou problème :
1. Vérifiez que `DATABASE_URL` est correctement configurée
2. Assurez-vous que la base de données PostgreSQL est active
3. Vérifiez les logs Vercel pour plus de détails

---

**Note :** Après le déploiement, l'application sera entièrement fonctionnelle avec des données d'exemple (produits, catégories, fermes, etc.) que vous pourrez modifier via le panel d'administration.