# Webhook GitHub - Auto Deploy

Ce projet démontre l'utilisation des webhooks GitHub pour automatiser le déploiement d'une application React.

## Structure du projet

```
├── src/                  # Application React (Vite)
├── server.js            # Serveur webhook Node.js
├── deploy.ps1           # Script de déploiement (Windows)
├── .env.example         # Exemple de configuration
├── package.json         # Dépendances React
└── index.html           # Point d'entrée HTML
```

## Fonctionnement

1. **Push sur GitHub** → GitHub envoie un webhook
2. **ngrok** → Redirige le webhook vers le serveur local
3. **server.js** → Vérifie la signature HMAC et déclenche le déploiement
4. **deploy.ps1** → `git pull` + `npm install` + démarrage de l'app

## Installation

### 1. Configuration du webhook listener

```bash
npm install express dotenv
cp .env.example .env
# Modifier .env avec vos valeurs
node server.js
```

### 2. Exposer avec ngrok

```bash
ngrok http 9000
```

### 3. Configurer le webhook GitHub

- Settings → Webhooks → Add webhook
- Payload URL: `https://votre-url-ngrok.ngrok-free.dev/webhook/github`
- Content type: `application/json`
- Secret: (même valeur que GITHUB_WEBHOOK_SECRET dans .env)
- Events: Just the push event

## Test

1. Modifier un fichier
2. Commit et push
3. L'app se met à jour automatiquement!

## Technologies

- Node.js / Express
- React / Vite
- GitHub Webhooks
- ngrok
- HMAC SHA-256 (vérification de signature)
