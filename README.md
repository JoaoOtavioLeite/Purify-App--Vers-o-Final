# 🚀 Purify App

Aplicativo para acompanhar sua jornada de purificação e recuperação de vícios.

## 📱 Funcionalidades

- ✅ **Onboarding completo** - Configuração inicial personalizada
- ✅ **Acompanhamento de progresso** - Tempo de abstinência em tempo real
- ✅ **Sistema de conquistas** - Milestones e metas
- ✅ **Motivação diária** - Citações e frases motivacionais
- ✅ **Persistência de dados** - localStorage robusto
- ✅ **Interface responsiva** - Funciona em mobile e desktop
- ✅ **PWA ready** - Pode ser instalado como app

## 🛠️ Tecnologias

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Lucide React** - Ícones
- **localStorage** - Persistência de dados

## 🚀 Como Deployar

### **Opção 1: Vercel (Mais Fácil)**

1. **Fork este repositório** no GitHub
2. **Acesse [vercel.com](https://vercel.com)**
3. **Conecte sua conta GitHub**
4. **Importe o projeto**
5. **Clique em "Deploy"**

✅ **Vantagens:** Deploy automático, SSL gratuito, CDN global

### **Opção 2: Netlify**

1. **Fork este repositório**
2. **Acesse [netlify.com](https://netlify.com)**
3. **Conecte sua conta GitHub**
4. **Selecione o repositório**
5. **Configure:**
   - Build command: `npm run build`
   - Publish directory: `.next`

### **Opção 3: Railway**

1. **Acesse [railway.app](https://railway.app)**
2. **Conecte sua conta GitHub**
3. **Selecione o repositório**
4. **Railway detectará automaticamente o Next.js**

### **Opção 4: Deploy Manual (VPS)**

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/purify-app.git
cd purify-app

# Instale dependências
npm install

# Build para produção
npm run build

# Inicie o servidor
npm start
```

### **Opção 5: Docker**

```bash
# Build da imagem
docker build -t purify-app .

# Execute o container
docker run -p 3000:3000 purify-app
```

## 📋 Pré-requisitos

- **Node.js 18+**
- **npm ou pnpm**

## 🔧 Configuração Local

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/purify-app.git
cd purify-app

# Instale dependências
npm install

# Execute em desenvolvimento
npm run dev

# Build para produção
npm run build

# Inicie em produção
npm start
```

## 📱 Como Usar

1. **Acesse o app** no navegador
2. **Complete o onboarding** - Escolha seu vício e data da última recaída
3. **Acompanhe seu progresso** - Tempo de abstinência em tempo real
4. **Explore as funcionalidades** - Motivação, estatísticas, configurações

## 🔒 Privacidade

- ✅ **Dados locais** - Tudo salvo no localStorage do navegador
- ✅ **Sem servidor** - Não há coleta de dados
- ✅ **100% privado** - Seus dados ficam apenas no seu dispositivo

## 📄 Licença

MIT License - Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## 📞 Suporte

Se tiver dúvidas ou problemas, abra uma issue no GitHub.

---

**Desenvolvido com ❤️ para ajudar na jornada de purificação**