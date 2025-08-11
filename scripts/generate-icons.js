/**
 * Script para gerar todos os ícones do PWA a partir de uma imagem original
 * 
 * Como usar:
 * 1. Coloque sua logo original como "logo-original.png" na pasta public/
 * 2. Execute: node scripts/generate-icons.js
 * 3. Todos os ícones serão gerados automaticamente
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Tamanhos necessários para o PWA
const iconSizes = [
  // Favicons
  { size: 16, name: '16.png' },
  { size: 32, name: '32.png' },
  
  // iOS Apple Touch Icons
  { size: 57, name: '57.png' },
  { size: 60, name: '60.png' },
  { size: 72, name: '72.png' },
  { size: 76, name: '76.png' },
  { size: 114, name: '114.png' },
  { size: 120, name: '120.png' },
  { size: 144, name: '144.png' },
  { size: 152, name: '152.png' },
  { size: 180, name: '180.png' },
  
  // Android/PWA
  { size: 192, name: '192.png' },
  { size: 512, name: '512.png' },
  
  // Adicionais
  { size: 128, name: '128.png' },
  { size: 256, name: '256.png' },
  { size: 1024, name: '1024.png' }
];

async function generateIcons() {
  const inputPath = path.join(__dirname, '../public/logo-original.png');
  const outputDir = path.join(__dirname, '../public');
  
  // Verificar se o arquivo original existe
  if (!fs.existsSync(inputPath)) {
    console.log('❌ Arquivo logo-original.png não encontrado na pasta public/');
    console.log('💡 Coloque sua logo como "logo-original.png" na pasta public/ e tente novamente');
    return;
  }
  
  console.log('🎨 Iniciando geração de ícones...');
  console.log(`📁 Arquivo original: ${inputPath}`);
  
  try {
    // Verificar se sharp está instalado
    const sharpVersion = sharp.versions;
    console.log(`📦 Sharp versão: ${sharpVersion.sharp}`);
    
    let generated = 0;
    let errors = 0;
    
    // Gerar cada tamanho
    for (const { size, name } of iconSizes) {
      try {
        const outputPath = path.join(outputDir, name);
        
        await sharp(inputPath)
          .resize(size, size, {
            fit: 'contain',
            background: { r: 0, g: 0, b: 0, alpha: 0 } // Fundo transparente
          })
          .png({
            quality: 100,
            compressionLevel: 0
          })
          .toFile(outputPath);
        
        console.log(`✅ Gerado: ${name} (${size}x${size})`);
        generated++;
        
      } catch (error) {
        console.log(`❌ Erro ao gerar ${name}:`, error.message);
        errors++;
      }
    }
    
    console.log(`\n🎉 Processo concluído!`);
    console.log(`✅ Ícones gerados: ${generated}`);
    console.log(`❌ Erros: ${errors}`);
    
    if (errors === 0) {
      console.log(`\n🚀 Próximos passos:`);
      console.log(`1. Teste o app no navegador (force refresh: Ctrl+F5)`);
      console.log(`2. Teste "Adicionar à tela inicial" no mobile`);
      console.log(`3. Verifique os ícones em diferentes dispositivos`);
      console.log(`\n💡 Dica: Limpe o cache do navegador se os ícones antigos ainda aparecerem`);
    }
    
  } catch (error) {
    console.log('❌ Erro geral:', error.message);
    
    if (error.message.includes('sharp')) {
      console.log('\n💡 Parece que o Sharp não está instalado.');
      console.log('📦 Instale com: npm install sharp');
      console.log('🔄 Ou use uma ferramenta online como:');
      console.log('   • https://www.pwabuilder.com/imageGenerator');
      console.log('   • https://realfavicongenerator.net/');
    }
  }
}

// Verificar se estamos rodando diretamente
if (require.main === module) {
  generateIcons();
}

module.exports = { generateIcons, iconSizes };
