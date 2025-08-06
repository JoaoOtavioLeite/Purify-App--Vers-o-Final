# 🔥 Configuração Firebase para Purify PWA

## 📋 Pré-requisitos

- Conta Google/Firebase
- Node.js 18+ instalado
- Firebase CLI instalado globalmente

## 🚀 Setup Inicial

### 1. Criar Projeto Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Clique em "Criar projeto"
3. Nome: `purify-app` (ou outro nome)
4. Habilite Google Analytics (opcional)
5. Aguarde criação do projeto

### 2. Configurar Firebase Hosting

```bash
# Instalar Firebase CLI (se não tiver)
npm install -g firebase-tools

# Login no Firebase
firebase login

# Inicializar projeto (executar na raiz do projeto)
firebase init

# Selecione:
# ✅ Hosting
# ✅ Firestore
# ✅ Storage (opcional)
```

### 3. Configurar Web App

1. No Firebase Console > Configurações do Projeto
2. Clique em "Adicionar app" > ícone Web
3. Nome: "Purify PWA"
4. ✅ Configure Firebase Hosting
5. Copie as configurações fornecidas

### 4. Configurar Variáveis de Ambiente

1. Copie `.env.example` para `.env.local`:
```bash
cp .env.example .env.local
```

2. Substitua os valores no `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_projeto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=seu_measurement_id
```

### 5. Configurar Cloud Messaging (Push Notifications)

1. Firebase Console > Configurações do Projeto > Cloud Messaging
2. Gere um novo par de chaves em "Certificados Web Push"
3. Copie a "Chave" e adicione no `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_VAPID_KEY=sua_vapid_key
```

### 6. Configurar Firestore

1. Firebase Console > Firestore Database
2. Clique em "Criar banco de dados"
3. Escolha "Iniciar no modo de teste" (ou produção)
4. Selecione a localização (nam5 para Brasil)

### 7. Atualizar Service Worker

Edite `public/firebase-messaging-sw.js` com suas configurações:
```javascript
const firebaseConfig = {
  // Cole suas configurações aqui
};
```

## 🚀 Deploy

### Comando Completo:
```bash
# Build e deploy
npm run firebase:deploy
```

### Ou passo a passo:
```bash
# Build para produção
npm run build

# Export para arquivos estáticos
npm run export

# Deploy para Firebase Hosting
firebase deploy --only hosting
```

## 📱 Configurar PWA

### Manifest automatizado
O manifest será gerado automaticamente em `/manifest.webmanifest`

### Service Worker
- PWA: `/sw.js` (next-pwa)
- FCM: `/firebase-messaging-sw.js` (notificações)

## 🔒 Configurar Regras de Segurança

### Firestore Rules (já configurado)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if userId.matches('user_.*');
    }
    // ... outras regras
  }
}
```

### Storage Rules (se usar)
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if userId.matches('user_.*');
    }
  }
}
```

## 🧪 Testar Localmente

```bash
# Emuladores Firebase (opcional)
firebase emulators:start

# Servidor local
npm run firebase:serve
```

## 📊 Configurar Analytics

1. Firebase Console > Analytics
2. Habilite Enhanced measurement
3. Configure eventos personalizados se necessário

## 🔔 Testar Notificações

1. Acesse o app implantado
2. Permita notificações quando solicitado
3. Firebase Console > Cloud Messaging > Enviar primeira mensagem
4. Teste notificações em foreground e background

## 🎯 URLs Importantes

- **Console Firebase**: https://console.firebase.google.com
- **Documentação**: https://firebase.google.com/docs
- **App implantado**: https://SEU_PROJETO.web.app

## 🚨 Troubleshooting

### Erro: "Firebase project not found"
```bash
firebase use --add
# Selecione seu projeto
```

### PWA não instalando
- Verifique HTTPS
- Confirme manifest.webmanifest
- Teste Lighthouse PWA score

### Notificações não funcionam
- Verifique VAPID key
- Confirme permissões do navegador
- Teste em modo incógnito

## ✅ Checklist Final

- [ ] Projeto Firebase criado
- [ ] Variáveis de ambiente configuradas
- [ ] Firestore rules deployed
- [ ] FCM configurado
- [ ] App deployed e funcionando
- [ ] PWA instalável
- [ ] Notificações funcionando
- [ ] Analytics coletando dados

---

**Pronto! Seu Purify PWA está rodando no Firebase! 🎉** 