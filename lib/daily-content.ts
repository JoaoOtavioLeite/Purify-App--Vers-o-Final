// Citações bíblicas para o card "Citação do dia"
export const dailyBibleQuotes = [
  {
    text: "Porque Deus não nos deu espírito de covardia, mas de poder, amor e equilíbrio.",
    author: "2 Timóteo 1:7"
  },
  {
    text: "Tudo posso naquele que me fortalece.",
    author: "Filipenses 4:13"
  },
  {
    text: "O Senhor é o meu pastor; nada me faltará.",
    author: "Salmos 23:1"
  },
  {
    text: "Entrega o teu caminho ao Senhor; confia nele, e ele o fará.",
    author: "Salmos 37:5"
  },
  {
    text: "Não temas, porque eu sou contigo.",
    author: "Isaías 41:10"
  },
  {
    text: "Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.",
    author: "Mateus 11:28"
  },
  {
    text: "Mas os que esperam no Senhor renovarão as suas forças.",
    author: "Isaías 40:31"
  },
  {
    text: "O Senhor é a minha luz e a minha salvação; a quem temerei?",
    author: "Salmos 27:1"
  },
  {
    text: "Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento.",
    author: "Provérbios 3:5"
  },
  {
    text: "Porque para Deus nada é impossível.",
    author: "Lucas 1:37"
  },
  {
    text: "Alegrai-vos na esperança, sede pacientes na tribulação, perseverai na oração.",
    author: "Romanos 12:12"
  },
  {
    text: "Mas graças a Deus que nos dá a vitória por nosso Senhor Jesus Cristo.",
    author: "1 Coríntios 15:57"
  },
  {
    text: "O Senhor é bom, uma fortaleza no dia da angústia.",
    author: "Naum 1:7"
  },
  {
    text: "Porque eu, o Senhor teu Deus, te seguro pela tua mão direita.",
    author: "Isaías 41:13"
  },
  {
    text: "Bendito seja o Deus e Pai de nosso Senhor Jesus Cristo.",
    author: "2 Coríntios 1:3"
  }
]

// Frases motivacionais para o card "Motivação do dia"
export const dailyMotivations = [
  {
    text: "Cada dia é uma nova oportunidade para ser melhor do que ontem.",
    author: "Desafio Diário"
  },
  {
    text: "A força não vem da capacidade física, mas de uma vontade indomável.",
    author: "Mahatma Gandhi"
  },
  {
    text: "O sucesso não é final, o fracasso não é fatal: é a coragem de continuar que conta.",
    author: "Winston Churchill"
  },
  {
    text: "Acredite que você pode e você já está no meio do caminho.",
    author: "Theodore Roosevelt"
  },
  {
    text: "A persistência é o caminho do êxito.",
    author: "Charles Chaplin"
  },
  {
    text: "Você é mais forte do que qualquer desafio que a vida apresente.",
    author: "Motivação Diária"
  },
  {
    text: "Cada passo que você dá é um passo em direção ao seu objetivo.",
    author: "Jornada de Superação"
  },
  {
    text: "A mudança começa quando você decide que merece algo melhor.",
    author: "Transformação Pessoal"
  },
  {
    text: "Seu futuro é criado pelo que você faz hoje, não amanhã.",
    author: "Robert Kiyosaki"
  },
  {
    text: "A disciplina é a ponte entre metas e realizações.",
    author: "Jim Rohn"
  },
  {
    text: "Você tem dentro de si a força para superar qualquer obstáculo.",
    author: "Poder Interior"
  },
  {
    text: "Cada recaída é uma lição, cada tentativa é um progresso.",
    author: "Aprendizado Contínuo"
  },
  {
    text: "A verdadeira força vem de dentro, não de fora.",
    author: "Força Interior"
  },
  {
    text: "Você é capaz de muito mais do que imagina.",
    author: "Potencial Ilimitado"
  },
  {
    text: "A jornada de mil milhas começa com um único passo.",
    author: "Lao Tzu"
  }
]

// Função para obter conteúdo baseado no dia do ano
export function getDailyContent() {
  const today = new Date()
  const start = new Date(today.getFullYear(), 0, 0)
  const diff = today.getTime() - start.getTime()
  const dayOfYear = Math.floor(diff / 86400000)
  
  const bibleQuote = dailyBibleQuotes[dayOfYear % dailyBibleQuotes.length]
  const motivation = dailyMotivations[dayOfYear % dailyMotivations.length]
  
  return {
    bibleQuote,
    motivation
  }
} 