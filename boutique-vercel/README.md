# Boutique Fraîche - E-commerce de Produits Frais

Une boutique en ligne moderne pour vendre des produits frais directement des fermes partenaires.

## 🚀 Configuration Optimale : Vercel + Cloudflare

### Architecture Recommandée
- **🏠 Vercel** : Hébergement de l'application Next.js
- **🗄️ Vercel Postgres** : Base de données (stable et performant)
- **☁️ Cloudflare R2** : Stockage d'images et vidéos (gratuit et rapide)

## 📋 Configuration Étape par Étape

### 1. Base de Données - Vercel Postgres

1. Allez sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Sélectionnez votre projet
3. Allez dans l'onglet "Storage"
4. Cliquez sur "Create Database" → "Postgres"
5. Donnez un nom à votre base de données (ex: `boutique-db`)
6. Créez la base de données
7. **Vercel génère automatiquement `DATABASE_URL`** ✅

### 2. Stockage - Cloudflare R2

1. Allez sur [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Allez dans "R2 Object Storage"
3. Créez un nouveau bucket (ex: `boutique-images`)
4. Configurez les permissions publiques pour les images
5. Récupérez vos clés API dans "Manage R2 API Tokens"

### 3. Variables d'Environnement sur Vercel

Ajoutez ces variables dans votre projet Vercel (Settings → Environment Variables) :

```env
# Base de données (générée automatiquement par Vercel Postgres)
DATABASE_URL="postgresql://..." # ← Ajoutée automatiquement

# Cloudflare R2 - Stockage d'images et vidéos
CLOUDFLARE_ACCOUNT_ID="votre_account_id"
CLOUDFLARE_ACCESS_KEY_ID="votre_access_key_id"
CLOUDFLARE_SECRET_ACCESS_KEY="votre_secret_access_key"
CLOUDFLARE_BUCKET_NAME="boutique-images"
CLOUDFLARE_PUBLIC_URL="https://pub-xxx.r2.dev"

# Next.js
NEXTAUTH_SECRET="votre-secret-key-ici"
```

### 4. Initialisation de la Base de Données

Après avoir configuré Vercel Postgres :

1. **Créer les tables** (fait automatiquement par Prisma)
2. **Ajouter des données d'exemple** :

```bash
# En local
npm run db:setup

# Ou manuellement sur Vercel
# Le seed se fait automatiquement au premier déploiement
```

### 5. Avantages de cette Configuration

**💰 Coût Optimisé :**
- Vercel : Gratuit jusqu'à 100GB/mois de bande passante
- Vercel Postgres : Gratuit jusqu'à 1GB de stockage
- Cloudflare R2 : Gratuit jusqu'à 10GB de stockage + 1M de requêtes/mois

**⚡ Performance :**
- Vercel : Edge functions ultra-rapides
- Cloudflare R2 : CDN mondial pour les images
- PostgreSQL : Base de données stable et performante

**🔧 Simplicité :**
- Déploiement automatique depuis GitHub
- Variables d'environnement gérées par Vercel
- Interface d'administration intégrée

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

## 🔧 Configuration Neon PostgreSQL

Pour utiliser votre base de données Neon existante, ajoutez ces variables dans Vercel :

```env
DATABASE_URL="postgres://neondb_owner:npg_kLdJyg6nDR4U@ep-icy-morning-adact1c6-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"
POSTGRES_PRISMA_URL="postgres://neondb_owner:npg_kLdJyg6nDR4U@ep-icy-morning-adact1c6-pooler.c-2.us-east-1.aws.neon.tech/neondb?connect_timeout=15&sslmode=require"
```