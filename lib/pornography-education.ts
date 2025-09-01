// Conteúdo educativo especializado sobre recuperação da pornografia

export interface EducationalContent {
  id: string
  title: string
  category: "neurociencia" | "relacionamentos" | "saude" | "recuperacao" | "prevencao"
  content: string
  isPremium: boolean
  readTime: number
}

export const PORNOGRAPHY_EDUCATION: EducationalContent[] = [
  {
    id: "dopamine-system",
    title: "Como a Pornografia Sequestra Seu Sistema de Dopamina",
    category: "neurociencia",
    content: `A pornografia cria um ciclo viciante ao sobrecarregar os receptores de dopamina no cérebro. 
    
Cada visualização libera doses massivas de dopamina - mais do que sexo real, comida ou outras recompensas naturais. Com o tempo, seu cérebro reduz a sensibilidade natural à dopamina, exigindo estímulos cada vez mais intensos.

**Consequências:**
• Anedonia (incapacidade de sentir prazer em atividades normais)
• Necessidade de conteúdo mais extremo
• Dificuldade de concentração
• Depressão e ansiedade
• Perda de motivação

**A boa notícia:** O cérebro pode se recuperar! A neuroplasticidade permite que novas conexões saudáveis se formem quando você para de consumir pornografia.`,
    isPremium: false,
    readTime: 3
  },
  {
    id: "90-day-reboot",
    title: "O Reboot de 90 Dias: Ciência por Trás da Recuperação",
    category: "recuperacao",
    content: `O período de 90 dias não é arbitrário - é baseado em pesquisas sobre neuroplasticidade e recuperação de vícios.

**Fases da Recuperação:**

**Dias 1-7: Desintoxicação Inicial**
• Picos intensos de desejo
• Ansiedade e irritabilidade
• Início da regulação da dopamina

**Dias 8-30: Reequilíbrio**
• Estabilização do humor
• Melhora gradual da concentração
• Redução da frequência de urges

**Dias 31-60: Reconexão**
• Aumento da energia e motivação
• Melhora na qualidade do sono
• Interesse renovado em atividades reais

**Dias 61-90: Renascimento**
• Confiança restaurada
• Sensibilidade sexual natural retorna
• Nova perspectiva sobre relacionamentos

**Após 90 dias:** Seu cérebro desenvolveu novas conexões saudáveis e você se libertou do ciclo de dependência.`,
    isPremium: true,
    readTime: 5
  },
  {
    id: "relationship-impact",
    title: "Como a Pornografia Afeta Seus Relacionamentos",
    category: "relacionamentos",
    content: `A pornografia cria expectativas irreais e prejudica a capacidade de intimidade genuína.

**Impactos Documentados:**

**Na Percepção:**
• Objetificação do parceiro(a)
• Expectativas irreais sobre corpos e performance
• Comparações constantes com atores pornô

**Na Intimidade:**
• Dificuldade de excitação com estímulos naturais
• Problemas de ereção ou sensibilidade
• Desconexão emocional durante o sexo

**No Relacionamento:**
• Traição emocional (consumo secreto)
• Perda de confiança
• Diminuição da satisfação sexual mútua
• Isolamento emocional

**Recuperação:**
Parar de consumir pornografia permite:
• Reconexão com a sensualidade natural
• Maior presença e intimidade
• Expectativas mais realistas e saudáveis
• Relacionamentos mais profundos e satisfatórios`,
    isPremium: false,
    readTime: 4
  },
  {
    id: "urge-management",
    title: "Estratégias Científicas para Gerenciar Urges",
    category: "prevencao",
    content: `Urges são normais durante a recuperação. O segredo é saber como responder a elas.

**Entendendo as Urges:**
• Duração média: 10-20 minutos
• Intensidade: Pico nos primeiros 5 minutos, depois diminui
• Frequência: Maior nas primeiras semanas, depois reduz

**Técnicas Comprovadas:**

**1. Técnica dos 20 Minutos**
• Quando sentir uma urge, aguarde 20 minutos
• Pratique respiração profunda
• A urge naturalmente diminuirá

**2. Exercício Físico**
• 10 flexões ou abdominais
• Caminhada de 5 minutos
• Alongamento
• Libera endorfinas naturais

**3. Técnica do STOP**
• **S**uspenda o que está fazendo
• **T**ome uma respiração profunda
• **O**bserve seus pensamentos e sensações
• **P**rossiga com uma atividade saudável

**4. Redirecionamento Mental**
• Liste 5 consequências negativas da pornografia
• Visualize seus objetivos de recuperação
• Lembre-se de seus "porquês" para parar

**5. Técnica da Água Fria**
• Lave o rosto com água fria
• Tome um banho frio
• Reseteia o sistema nervoso`,
    isPremium: true,
    readTime: 6
  },
  {
    id: "physical-health",
    title: "Impactos da Pornografia na Saúde Física",
    category: "saude",
    content: `A pornografia não afeta apenas a mente - tem consequências físicas reais.

**Problemas Físicos Documentados:**

**Sistema Sexual:**
• Disfunção erétil em homens jovens (PIED - Porn-Induced Erectile Dysfunction)
• Ejaculação precoce ou retardada
• Diminuição da sensibilidade genital
• Dificuldade para atingir orgasmo com parceiro(a)

**Sistema Nervoso:**
• Fadiga crônica
• Dificuldade de concentração
• Insônia e distúrbios do sono
• Dores de cabeça frequentes

**Sistema Hormonal:**
• Redução da testosterona
• Desequilíbrio de cortisol (hormônio do stress)
• Alterações nos neurotransmissores

**Outros Sintomas:**
• Olheiras e aparência cansada
• Diminuição da energia física
• Postura curvada (pelo tempo em dispositivos)
• Problemas de visão

**Recuperação Física:**
Muitos relatam melhorias em:
• Energia e vitalidade
• Qualidade do sono
• Postura e presença física
• Saúde sexual natural
• Aparência geral mais saudável`,
    isPremium: false,
    readTime: 4
  }
]

export const getTriggerManagement = () => {
  return {
    commonTriggers: [
      "Estresse e ansiedade",
      "Tédio e solidão", 
      "Insônia e madrugadas",
      "Problemas no relacionamento",
      "Gatilhos visuais nas redes sociais",
      "Momentos de baixa autoestima"
    ],
    preventionStrategies: [
      "Identificar padrões de gatilhos",
      "Criar rotinas saudáveis",
      "Estabelecer accountability",
      "Usar filtros e bloqueadores",
      "Desenvolver hobbies alternativos",
      "Buscar apoio profissional quando necessário"
    ]
  }
}

export const getRecoveryBenefits = (days: number) => {
  const benefits = []
  
  if (days >= 1) benefits.push("Sistema nervoso começando a se acalmar")
  if (days >= 3) benefits.push("Dopamina iniciando processo de reequilíbrio")
  if (days >= 7) benefits.push("Redução significativa da ansiedade")
  if (days >= 14) benefits.push("Melhora na qualidade do sono")
  if (days >= 30) benefits.push("Aumento notável da energia e foco")
  if (days >= 45) benefits.push("Reconexão com prazeres simples da vida")
  if (days >= 60) benefits.push("Melhora na autoestima e confiança")
  if (days >= 90) benefits.push("Transformação completa - você é uma nova pessoa!")
  
  return benefits
}

