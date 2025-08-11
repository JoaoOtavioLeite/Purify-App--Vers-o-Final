# 🎨 Como Trocar a Logo do Purify - Guia Simples

## 🚀 **Método Mais Fácil (Recomendado)**

### **1. Use o Gerador Web Incluído**
1. Abra o arquivo: `scripts/generate-icons-web.html` no navegador
2. Arraste sua nova logo (PNG, 1024x1024 recomendado)
3. Clique em "Gerar Todos os Ícones"
4. Baixe o arquivo ZIP com todos os ícones
5. Substitua os arquivos na pasta `public/`

### **2. Ou Use Ferramentas Online**
- **PWA Builder:** https://www.pwabuilder.com/imageGenerator
- **Favicon Generator:** https://realfavicongenerator.net/

## 📱 **Onde Sua Logo Aparecerá**

### **🍎 iOS (iPhone/iPad)**
- **Safari "Adicionar à Tela Inicial"** → Usa `180.png`
- **Ícone na home screen** → Bordas arredondadas automáticas
- **Splash screen** → Fundo configurado no app

### **🤖 Android (Chrome)**
- **Chrome "Instalar app"** → Usa `192.png` e `512.png`
- **Ícone na home screen** → Forma adaptativa
- **Drawer de apps** → Ícone material design

### **🖥️ Desktop**
- **Favicon no navegador** → `32.png` (aba do navegador)
- **PWA instalado** → `512.png` (dock/taskbar)

## 📂 **Arquivos que Você Precisa Substituir**

Apenas substitua estes arquivos na pasta `public/`:

```
📁 public/
├── 16.png          (Favicon pequeno)
├── 32.png          (Favicon padrão)
├── 57.png          (iOS antigo)
├── 60.png          (iOS)
├── 72.png          (iOS/Android)
├── 76.png          (iPad)
├── 114.png         (iPhone Retina)
├── 120.png         (iPhone)
├── 144.png         (Windows Tile)
├── 152.png         (iPad Retina)
├── 180.png         (iPhone Plus) ⭐ PRINCIPAL iOS
├── 192.png         (Android) ⭐ PRINCIPAL ANDROID
├── 512.png         (PWA) ⭐ PRINCIPAL PWA
└── 1024.png        (App Store/Splash)
```

## ✅ **Checklist Rápido**

1. **✅ Prepare sua logo**
   - Formato: PNG com fundo transparente
   - Tamanho: 1024x1024px ou maior
   - Design: Simples e legível em tamanhos pequenos

2. **✅ Gere os ícones**
   - Use o gerador web incluído OU
   - Use ferramenta online OU
   - Faça manualmente no Photoshop

3. **✅ Substitua os arquivos**
   - Coloque na pasta `public/`
   - Mantenha os mesmos nomes
   - Não altere nenhum código

4. **✅ Teste**
   - Force refresh: Ctrl+F5 (limpa cache)
   - Teste no Chrome: "Instalar app"
   - Teste no Safari iOS: "Adicionar à Tela Inicial"
   - Verifique se o ícone aparece correto

## 🔧 **Não Precisa Alterar**

✅ **Estes arquivos JÁ estão configurados corretamente:**
- `app/layout.tsx` (links dos ícones)
- `app/manifest.ts` (configuração PWA)
- `next.config.mjs` (configuração Next.js)

## 🐛 **Problemas Comuns**

### **Ícone antigo ainda aparece?**
- **Solução:** Force refresh (Ctrl+F5) ou limpe cache do navegador
- **Chrome:** Configurações → Privacidade → Limpar dados
- **Safari:** Develop → Empty Caches

### **Ícone fica cortado/distorcido?**
- **Solução:** Use imagem quadrada (1:1) com padding interno
- **Evite:** Texto muito pequeno ou detalhes finos

### **Não aparece no "Adicionar à Tela Inicial"?**
- **Solução:** Aguarde alguns minutos e tente novamente
- **Verifique:** Se os arquivos foram salvos corretamente

## 🎯 **Dicas Pro**

1. **Design simples** funciona melhor em tamanhos pequenos
2. **Alto contraste** para boa visibilidade
3. **Teste em diferentes fundos** (claro/escuro)
4. **Sem texto pequeno** - pode ficar ilegível
5. **Use PNG** para melhor qualidade e transparência

---

**💡 Precisa de ajuda?** O gerador web em `scripts/generate-icons-web.html` faz tudo automaticamente! 🚀
