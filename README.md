# Purify - App de Purificação de Vícios 📱

Um Progressive Web App (PWA) para acompanhar sua jornada de purificação e recuperação de vícios.

## 🌟 Funcionalidades PWA

- ✅ **Instalável**: Pode ser instalado como app nativo no celular
- ✅ **Funciona Offline**: Cache inteligente para acesso sem internet
- ✅ **Notificações Push**: Lembretes e motivação diária
- ✅ **Responsivo**: Interface otimizada para mobile
- ✅ **Rápido**: Carregamento otimizado com Service Worker
- ✅ **Seguro**: HTTPS obrigatório e headers de segurança

## 🚀 Deploy no Vercel

### 1. Preparação
```bash
pnpm install
pnpm build
```

### 2. Deploy
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente (se necessário)
3. O deploy será automático com as configurações PWA

### 3. Verificar PWA
Após o deploy, teste:
- Chrome DevTools > Lighthouse > PWA Score
- Teste de instalação em dispositivos móveis
- Funcionalidade offline

## 🛠️ Tecnologias

- **Framework**: Next.js 15
- **PWA**: next-pwa
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Icons**: Lucide React

## 📱 Como Instalar o App

### No Android:
1. Abra o site no Chrome
2. Toque em "Adicionar à tela inicial"
3. Confirme a instalação

### No iOS:
1. Abra o site no Safari
2. Toque no ícone de compartilhar
3. Selecione "Adicionar à Tela de Início"

## 🔧 Comandos

```bash
# Desenvolvimento
pnpm dev

# Build
pnpm build

# Produção
pnpm start

# Lint
pnpm lint
```

## 📁 Estrutura PWA

```
public/
├── sw.js                    # Service Worker principal
├── workbox-*.js            # Cache strategies
├── manifest.webmanifest    # App manifest
├── robots.txt              # SEO
├── _headers                # Cache headers
└── icons/                  # App icons
```

## 🎯 Funcionalidades do App

- Dashboard de progresso
- Controle de objetivos
- Estatísticas detalhadas
- Conteúdo motivacional
- Sistema de recompensas
- Acompanhamento de recaídas

## 🔒 Segurança e Performance

- Headers de segurança configurados
- Cache otimizado para assets
- Compressão automática
- Service Worker com estratégias inteligentes
- Manifesto PWA completo

---

**Desenvolvido com ❤️ para ajudar na sua jornada de superação**