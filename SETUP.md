# Configuration Supabase pour DAY Time & Vision

## Prérequis
1. Compte Supabase (créez-en un sur https://supabase.com)
2. Node.js installé

## Étapes de Configuration

### 1. Créer un Projet Supabase
1. Connectez-vous à https://supabase.com
2. Créez un nouveau projet
3. Notez l'URL et la clé publique (anon key) de votre projet

### 2. Configurer Google OAuth
1. Allez dans "Authentication" > "Providers" dans le dashboard Supabase
2. Activez "Google" comme fournisseur
3. Suivez les instructions pour créer des credentials OAuth Google:
   - Allez sur https://console.cloud.google.com
   - Créez un nouveau projet ou sélectionnez un existant
   - Activez l'API Google+
   - Créez des credentials OAuth 2.0
   - Ajoutez l'URL de callback Supabase (fournie dans le dashboard)
4. Copiez le Client ID et Client Secret dans Supabase

### 3. Configurer les Variables d'Environnement
1. Créez un fichier `.env` à la racine du projet
2. Ajoutez vos credentials Supabase:

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-publique
```

### 4. Lancer le Projet
```bash
npm install
npm run dev
```

## Fonctionnalités Implémentées

### Authentification Google
- Connexion via Google OAuth
- Affichage du nom d'utilisateur après connexion
- Message de bienvenue personnalisé
- Déconnexion

### Interface Utilisateur
- Logo DAY ajouté
- Message "Bienvenue [nom d'utilisateur]" dans l'en-tête
- Bouton de déconnexion
- Calcul correct des prix dans le panier

## Structure
- `/src/lib/supabase.ts` - Configuration du client Supabase
- `/src/contexts/AuthContext.tsx` - Gestion de l'état d'authentification
- `/src/components/Header.tsx` - En-tête avec authentification

## Support
Pour toute question, contactez l'équipe de développement.
