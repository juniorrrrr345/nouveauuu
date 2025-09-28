# 🛍️ CALIWHITE - Boutique E-commerce

## 🚀 Boutique moderne avec Next.js + Cloudflare

### ✨ Fonctionnalités
- 🎯 Panel admin complet
- 🖼️ Upload médias vers Cloudflare R2
- 💾 Base de données Cloudflare D1
- 📱 Design responsive
- 🛒 Panier WhatsApp
- 🎨 Thèmes personnalisables

### 🔧 Technologies
- **Frontend**: Next.js 15, React, TailwindCSS
- **Backend**: API Routes, Cloudflare D1
- **Storage**: Cloudflare R2
- **Hosting**: Vercel

### 📦 Installation

```bash
# Cloner le repo
git clone https://github.com/VOTRE-USERNAME/CALIWHITE.git
cd CALIWHITE

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

### 🌐 Déploiement Vercel

1. Pusher sur GitHub
2. Connecter à Vercel
3. Ajouter les variables d'environnement
4. Déployer !

### 📁 Structure

```
src/
├── app/
│   ├── admin/          # Panel administrateur
│   ├── api/            # Routes API
│   └── page.tsx        # Page d'accueil boutique
├── components/
│   ├── layout/         # Header, Footer
│   └── ui/             # Composants boutique
└── lib/                # Utilitaires
```

### 🔐 Variables d'environnement

```bash
# Cloudflare D1 Database
CLOUDFLARE_ACCOUNT_ID=7979421604bd07b3bd34d3ed96222512
CLOUDFLARE_DATABASE_ID=62ac2c0e-3422-4f4d-b51d-33008728c3e6
CLOUDFLARE_API_TOKEN=ijkVhaXCw6LSddIMIMxwPL5CDAWznxip5x9I1bNW

# Cloudflare R2 Storage
CLOUDFLARE_R2_BUCKET_NAME=news
CLOUDFLARE_R2_PUBLIC_URL=https://pub-b38679a01a274648827751df94818418.r2.dev

# Admin Panel
ADMIN_PASSWORD=votre_nouveau_mot_de_passe
```

Voir `.env.example` pour la configuration complète.

### 📞 Support

Pour toute question : contact@caliwhite.com

---

**🎉 CALIWHITE - Boutique de qualité supérieure**