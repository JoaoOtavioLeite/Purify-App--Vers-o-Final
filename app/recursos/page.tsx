"use client"

import { useState } from "react"
import { useAddiction } from "@/contexts/AddictionContext"
import { 
  BookOpen, 
  Play, 
  Headphones, 
  FileText, 
  ExternalLink,
  Clock,
  Star,
  TrendingUp,
  Brain,
  Heart,
  Shield,
  Target,
  Users,
  Lightbulb,
  Award,
  Search,
  Filter,
  Eye,
  Download
} from "lucide-react"
import { BottomNavigation } from "@/components/ui/BottomNavigation"

interface Resource {
  id: string
  title: string
  description: string
  type: "article" | "video" | "podcast" | "tool" | "book"
  category: "science" | "recovery" | "motivation" | "techniques" | "stories"
  duration: string
  difficulty: "beginner" | "intermediate" | "advanced"
  rating: number
  views: number
  content?: string
  url?: string
  author: string
  tags: string[]
}

interface Category {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  color: string
  count: number
}

export default function RecursosPage() {
  const { data } = useAddiction()
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [favoriteResources, setFavoriteResources] = useState<string[]>([])

  const categories: Category[] = [
    {
      id: "all",
      name: "Todos",
      description: "Todos os recursos disponíveis",
      icon: <BookOpen className="text-blue-500" size={20} />,
      color: "bg-blue-100 border-blue-300",
      count: 24
    },
    {
      id: "science",
      name: "Neurociência",
      description: "Como funcionam os vícios no cérebro",
      icon: <Brain className="text-purple-500" size={20} />,
      color: "bg-purple-100 border-purple-300",
      count: 8
    },
    {
      id: "recovery",
      name: "Recuperação",
      description: "Estratégias e métodos de recuperação",
      icon: <Heart className="text-red-500" size={20} />,
      color: "bg-red-100 border-red-300",
      count: 6
    },
    {
      id: "techniques",
      name: "Técnicas",
      description: "Ferramentas práticas do dia a dia",
      icon: <Target className="text-green-500" size={20} />,
      color: "bg-green-100 border-green-300",
      count: 5
    },
    {
      id: "motivation",
      name: "Motivação",
      description: "Histórias inspiradoras e motivação",
      icon: <Star className="text-yellow-500" size={20} />,
      color: "bg-yellow-100 border-yellow-300",
      count: 3
    },
    {
      id: "stories",
      name: "Histórias",
      description: "Experiências reais de recuperação",
      icon: <Users className="text-indigo-500" size={20} />,
      color: "bg-indigo-100 border-indigo-300",
      count: 2
    }
  ]

  const resources: Resource[] = [
    {
      id: "dopamine-science",
      title: "A Ciência da Dopamina e Vícios",
      description: "Entenda como a dopamina afeta nosso cérebro e comportamento viciante",
      type: "article",
      category: "science",
      duration: "8 min",
      difficulty: "beginner",
      rating: 4.8,
      views: 1250,
      author: "Dr. João Silva",
      tags: ["dopamina", "neurociência", "comportamento"],
      content: `A dopamina é frequentemente chamada de "hormônio do prazer", mas na verdade é muito mais complexa...

**O que é a Dopamina?**
A dopamina é um neurotransmissor que desempenha um papel crucial no sistema de recompensa do cérebro. Ela não é exatamente o "prazer" em si, mas sim a antecipação do prazer.

**Como os Vícios Afetam a Dopamina**
• **Liberação excessiva**: Vícios causam liberação anormal de dopamina
• **Tolerância**: Com o tempo, precisamos de mais estímulo para o mesmo efeito  
• **Redução natural**: Atividades normais se tornam menos prazerosas

**Estratégias de Recuperação**
1. **Jejum de dopamina**: Períodos sem estímulos intensos
2. **Atividades naturais**: Exercício, música, socialização
3. **Paciência**: O cérebro precisa de tempo para se reequilibrar

**Fatos Importantes**
• A recuperação da dopamina pode levar de 90 dias a 2 anos
• Exercícios físicos aumentam naturalmente a dopamina
• Meditação ajuda a regular o sistema de recompensa

**Conclusão**
Entender a ciência por trás do vício nos dá poder para combatê-lo de forma mais eficaz.`
    },
    {
      id: "breathing-techniques",
      title: "Técnicas de Respiração para Ansiedade",
      description: "Métodos científicos de respiração para controlar ansiedade e impulsos",
      type: "video",
      category: "techniques",
      duration: "12 min",
      difficulty: "beginner",
      rating: 4.9,
      views: 890,
      author: "Ana Mindfulness",
      tags: ["respiração", "ansiedade", "técnicas"],
      url: "https://example.com/breathing-video"
    },
    {
      id: "neuroplasticity",
      title: "Neuroplasticidade: Seu Cérebro Pode Mudar",
      description: "Como o cérebro se adapta e como podemos usar isso a nosso favor",
      type: "article",
      category: "science",
      duration: "10 min",
      difficulty: "intermediate",
      rating: 4.7,
      views: 2100,
      author: "Dra. Marina Neurociência",
      tags: ["neuroplasticidade", "mudança", "recuperação"],
      content: `A neuroplasticidade é a capacidade do cérebro de se reorganizar e formar novas conexões neurais...

**O que é Neuroplasticidade?**
É a habilidade do cérebro de se modificar e adaptar, tanto estrutural quanto funcionalmente, ao longo da vida.

**Como Funciona na Recuperação**
• **Novas conexões**: Formação de novos caminhos neurais
• **Fortalecimento**: Conexões saudáveis se tornam mais fortes
• **Enfraquecimento**: Caminhos viciantes se enfraquecem com desuso

**Estratégias para Estimular**
1. **Aprendizado novo**: Idiomas, instrumentos, habilidades
2. **Exercício físico**: Aumenta BDNF (fator neurotrófico)
3. **Meditação**: Fortalece córtex pré-frontal
4. **Sono adequado**: Consolida mudanças neurais

**Timeframes de Mudança**
• **Primeiras semanas**: Conexões começam a mudar
• **2-3 meses**: Mudanças se estabilizam
• **6 meses+**: Novas estruturas se consolidam

**Exercícios Práticos**
- Pratique novas habilidades diariamente
- Medite por 10-20 minutos
- Durma 7-9 horas regularmente
- Mantenha-se fisicamente ativo

**Lembre-se**: Mudança é possível em qualquer idade!`
    },
    {
      id: "habit-formation",
      title: "Formação de Hábitos Saudáveis",
      description: "Como criar e manter hábitos positivos que substituem comportamentos viciantes",
      type: "article",
      category: "recovery",
      duration: "6 min",
      difficulty: "beginner",
      rating: 4.6,
      views: 1580,
      author: "Carlos Hábitos",
      tags: ["hábitos", "rotina", "mudança"],
      content: `A formação de hábitos é fundamental na recuperação, pois nos permite substituir comportamentos destrutivos...

**Anatomia de um Hábito**
Todo hábito tem três componentes:
1. **Gatilho**: O que inicia o comportamento
2. **Rotina**: O comportamento em si
3. **Recompensa**: O benefício obtido

**Estratégia de Substituição**
Em vez de tentar eliminar um hábito ruim, substitua-o:
• **Identifique o gatilho**: Quando você sente vontade?
• **Mude a rotina**: Substitua por algo saudável
• **Mantenha a recompensa**: Mesmo benefício emocional

**Técnicas Comprovadas**
1. **Comece pequeno**: 2 minutos por dia
2. **Seja consistente**: Mesmo horário, mesmo local
3. **Use lembretes visuais**: Notes, alarmes
4. **Celebre pequenas vitórias**: Reconheça progresso

**Hábitos Recomendados**
- **Manhã**: Meditação, exercício, leitura
- **Tarde**: Caminhada, hobby, socialização  
- **Noite**: Reflexão, gratidão, relaxamento

**Tempo para Consolidação**
• **21 dias**: Mito comum
• **66 dias**: Média real para automatização
• **Varia**: De 18 a 254 dias dependendo da complexidade

**Dicas Práticas**
- Empilhe hábitos: Após X, farei Y
- Use ambiente a seu favor
- Tenha um plano para falhas
- Foque em um hábito por vez`
    },
    {
      id: "recovery-podcast",
      title: "Podcast: Jornada de Recuperação",
      description: "Episódio sobre os altos e baixos da recuperação com especialistas",
      type: "podcast",
      category: "motivation",
      duration: "45 min",
      difficulty: "beginner",
      rating: 4.8,
      views: 750,
      author: "Recovery Stories",
      tags: ["podcast", "recuperação", "histórias"],
      url: "https://example.com/recovery-podcast"
    },
    {
      id: "mindfulness-guide",
      title: "Guia Completo de Mindfulness",
      description: "Práticas de atenção plena para autocontrole e consciência",
      type: "article",
      category: "techniques",
      duration: "15 min",
      difficulty: "intermediate",
      rating: 4.9,
      views: 1890,
      author: "Mestre Zen",
      tags: ["mindfulness", "meditação", "consciência"],
      content: `Mindfulness é a prática de estar presente e consciente do momento atual, sem julgamento...

**O que é Mindfulness?**
É a capacidade de manter consciência momento a momento de nossos pensamentos, sentimentos, sensações corporais e ambiente ao redor.

**Benefícios para Recuperação**
• **Autorregulação**: Melhor controle sobre impulsos
• **Consciência**: Reconhecer gatilhos antes de agir
• **Redução do estresse**: Menos ansiedade e tensão
• **Clareza mental**: Decisões mais conscientes

**Práticas Básicas**
1. **Respiração consciente**: Foque na respiração por 5-10 minutos
2. **Body scan**: Escaneie o corpo da cabeça aos pés
3. **Observação dos pensamentos**: Note sem julgar
4. **Mindful walking**: Caminhada com total atenção

**Exercícios de 5 Minutos**
- **Manhã**: Respiração antes de levantar
- **Trabalho**: Pausa consciente a cada hora
- **Refeições**: Comer com atenção plena
- **Noite**: Reflexão sobre o dia

**Lidando com Dificuldades**
• **Mente agitada**: Normal, continue praticando
• **Pensamentos intrusivos**: Observe e deixe passar
• **Sonolência**: Ajuste postura, abra os olhos
• **Impaciência**: Comece com períodos curtos

**Aplicação na Recuperação**
- Use antes de situações de risco
- Pratique quando sentir impulsos
- Desenvolva consciência dos gatilhos
- Crie espaço entre impulso e ação

**Recursos Adicionais**
- Apps: Insight Timer, Headspace
- Livros: "Onde Você Está?" de Jon Kabat-Zinn
- Grupos: Busque comunidades locais
- Retiros: Experiências intensivas

**Lembre-se**: A prática leva à perfeição!`
    },
    {
      id: "success-story-1",
      title: "História: 2 Anos Limpo",
      description: "Relato pessoal de superação e as estratégias que funcionaram",
      type: "article",
      category: "stories",
      duration: "7 min",
      difficulty: "beginner",
      rating: 4.7,
      views: 980,
      author: "João Recuperação",
      tags: ["história", "sucesso", "inspiração"],
      content: `Meu nome é João e hoje completo 2 anos limpo. Quero compartilhar minha jornada...

**O Fundo do Poço**
Há 3 anos, eu estava completamente perdido. Meu vício havia consumido minha vida, relacionamentos e autoestima. Cada tentativa de parar falhava em poucos dias.

**O Momento de Virada**
O ponto de inflexão veio quando percebi que estava perdendo as pessoas que mais amava. Minha esposa estava se afastando, meus filhos me viam diferente.

**Estratégias que Funcionaram**
1. **Accountability**: Encontrei um parceiro de responsabilidade
2. **Terapia**: Busquei ajuda profissional
3. **Exercícios**: Academia se tornou meu refúgio
4. **Meditação**: 20 minutos todas as manhãs
5. **Diário**: Escrevi sobre sentimentos e gatilhos

**Os Primeiros 90 Dias**
• **Dias 1-30**: Pura força de vontade, muito difícil
• **Dias 31-60**: Começaram novos hábitos, menos urges
• **Dias 61-90**: Senti uma virada real na mentalidade

**Desafios Principais**
- **Solidão**: O vício era minha "companhia"
- **Tédio**: Precisei encontrar novos hobbies
- **Gatilhos**: Identificar e evitar situações de risco
- **Recaídas**: Tive 3 recaídas antes do sucesso final

**O que Mudou**
• **Relacionamentos**: Minha família voltou a confiar em mim
• **Autoestima**: Me sinto orgulhoso de quem sou
• **Energia**: Muito mais energia para a vida
• **Foco**: Melhor concentração no trabalho
• **Sono**: Durmo muito melhor

**Conselhos para Quem Está Começando**
1. **Seja paciente**: Mudança leva tempo
2. **Busque ajuda**: Não faça sozinho
3. **Celebre pequenas vitórias**: Cada dia conta
4. **Perdoe-se**: Recaídas fazem parte do processo
5. **Foque no hoje**: Um dia de cada vez

**Hoje em Dia**
A vida não é perfeita, mas é muito melhor. Tenho propósito, relacionamentos saudáveis e, acima de tudo, autorespeitо.

**Para Você que Está Lendo**
Se eu consegui, você também pode. A jornada é difícil, mas vale cada esforço. Você é mais forte do que imagina!

*"A coragem não é a ausência do medo, mas a ação apesar dele."*`
    }
  ]

  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const toggleFavorite = (resourceId: string) => {
    setFavoriteResources(prev => 
      prev.includes(resourceId)
        ? prev.filter(id => id !== resourceId)
        : [...prev, resourceId]
    )
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "article": return <FileText className="text-blue-500" size={16} />
      case "video": return <Play className="text-red-500" size={16} />
      case "podcast": return <Headphones className="text-purple-500" size={16} />
      case "tool": return <Target className="text-green-500" size={16} />
      case "book": return <BookOpen className="text-orange-500" size={16} />
      default: return <FileText className="text-gray-500" size={16} />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-800"
      case "intermediate": return "bg-yellow-100 text-yellow-800"
      case "advanced": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  if (!data.addictionType) return null

  if (selectedResource) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-20">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
          <button
            onClick={() => setSelectedResource(null)}
            className="text-white mb-4 flex items-center gap-2 hover:text-indigo-200"
          >
            ← Voltar aos recursos
          </button>
          <h1 className="text-2xl font-bold text-white mb-2">{selectedResource.title}</h1>
          <div className="flex items-center gap-3 text-indigo-100">
            {getTypeIcon(selectedResource.type)}
            <span>{selectedResource.duration}</span>
            <span>•</span>
            <span>{selectedResource.author}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Star className="text-yellow-400" size={16} />
              <span>{selectedResource.rating}</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            {selectedResource.content ? (
              <div className="prose max-w-none">
                <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                  {selectedResource.content}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  {getTypeIcon(selectedResource.type)}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{selectedResource.type === "video" ? "Vídeo" : selectedResource.type === "podcast" ? "Podcast" : "Recurso"} Externo</h3>
                <p className="text-gray-600 mb-6">{selectedResource.description}</p>
                {selectedResource.url && (
                  <a
                    href={selectedResource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                  >
                    <ExternalLink size={20} />
                    Acessar Recurso
                  </a>
                )}
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {selectedResource.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <BottomNavigation />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <BookOpen className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Centro de Recursos</h1>
            <p className="text-indigo-100">Conhecimento para sua jornada</p>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar recursos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-white/50 focus:bg-white/90 bg-white/80"
          />
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Categories */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Categorias</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  selectedCategory === category.id
                    ? category.color + " ring-2 ring-purple-300"
                    : "bg-gray-50 border-gray-200 hover:border-purple-300"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {category.icon}
                  <span className="font-semibold text-gray-800">{category.name}</span>
                </div>
                <p className="text-gray-600 text-sm mb-2">{category.description}</p>
                <span className="text-purple-600 text-xs font-medium">{category.count} recursos</span>
              </button>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              {selectedCategory === "all" ? "Todos os Recursos" : categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <span className="text-gray-600">{filteredResources.length} recursos</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredResources.map((resource) => (
              <div
                key={resource.id}
                className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all cursor-pointer hover:scale-105"
                onClick={() => setSelectedResource(resource)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(resource.type)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(resource.difficulty)}`}>
                      {resource.difficulty === "beginner" && "Iniciante"}
                      {resource.difficulty === "intermediate" && "Intermediário"}  
                      {resource.difficulty === "advanced" && "Avançado"}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(resource.id)
                    }}
                    className={`p-1 rounded-full transition-all ${
                      favoriteResources.includes(resource.id)
                        ? "text-red-500"
                        : "text-gray-400 hover:text-red-500"
                    }`}
                  >
                    <Heart size={16} fill={favoriteResources.includes(resource.id) ? "currentColor" : "none"} />
                  </button>
                </div>
                
                <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">{resource.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{resource.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {resource.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye size={14} />
                    {resource.views.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-500" />
                    {resource.rating}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">por {resource.author}</span>
                  <div className="flex flex-wrap gap-1">
                    {resource.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Favorites */}
        {favoriteResources.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-red-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Heart className="text-red-500" size={24} />
              Seus Favoritos ({favoriteResources.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {resources.filter(r => favoriteResources.includes(r.id)).map((resource) => (
                <div
                  key={resource.id}
                  className="bg-red-50 border border-red-200 rounded-lg p-3 cursor-pointer hover:bg-red-100 transition-all"
                  onClick={() => setSelectedResource(resource)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {getTypeIcon(resource.type)}
                    <span className="font-medium text-gray-800 text-sm">{resource.title}</span>
                  </div>
                  <p className="text-gray-600 text-xs">{resource.duration} • {resource.author}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  )
}