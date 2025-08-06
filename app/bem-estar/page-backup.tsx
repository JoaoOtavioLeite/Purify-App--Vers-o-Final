"use client"

import { useState, useEffect } from "react"
import { useAddiction } from "@/contexts/AddictionContext"
import { 
  Heart, 
  Brain, 
  Moon, 
  Sun, 
  Activity, 
  Smile,
  Meh,
  Frown,
  Zap,
  Droplets,
  Wind,
  TreePine,
  Music,
  Book,
  Coffee,
  Utensils,
  Timer,
  Calendar,
  TrendingUp,
  Plus,
  CheckCircle,
  Cross,
  BookOpen,
  Shield,
  Star,
  Sunrise,
  Sparkles,
  Target,
  Award,
  Gift,
  Users,
  HandHeart,
  Crown,
  Eye,
  EyeOff
} from "lucide-react"
import { BottomNavigation } from "@/components/ui/BottomNavigation"

interface MoodEntry {
  date: string
  mood: 1 | 2 | 3 | 4 | 5
  energy: 1 | 2 | 3 | 4 | 5
  stress: 1 | 2 | 3 | 4 | 5
  notes: string
}

interface Habit {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  completed: boolean
  streakDays: number
}

interface Exercise {
  id: string
  title: string
  description: string
  duration: string
  type: "breathing" | "meditation" | "physical" | "mental"
  icon: React.ReactNode
  color: string
}

export default function BemEstarPage() {
  const { data } = useAddiction()
  const [currentMood, setCurrentMood] = useState<1 | 2 | 3 | 4 | 5>(3)
  const [currentEnergy, setCurrentEnergy] = useState<1 | 2 | 3 | 4 | 5>(3)
  const [currentStress, setCurrentStress] = useState<1 | 2 | 3 | 4 | 5>(3)
  const [moodNotes, setMoodNotes] = useState("")
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([])
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: "prayer",
      name: "Oração matinal",
      icon: <Cross className="text-purple-500" size={20} />,
      color: "bg-purple-100 border-purple-300",
      completed: false,
      streakDays: 7
    },
    {
      id: "bible",
      name: "Leitura bíblica",
      icon: <BookOpen className="text-blue-500" size={20} />,
      color: "bg-blue-100 border-blue-300",
      completed: false,
      streakDays: 4
    },
    {
      id: "worship",
      name: "Louvor e adoração",
      icon: <Music className="text-indigo-500" size={20} />,
      color: "bg-indigo-100 border-indigo-300",
      completed: false,
      streakDays: 2
    },
    {
      id: "gratitude",
      name: "Gratidão diária",
      icon: <Heart className="text-red-500" size={20} />,
      color: "bg-red-100 border-red-300",
      completed: false,
      streakDays: 5
    },
    {
      id: "meditation",
      name: "Meditação cristã",
      icon: <Brain className="text-green-500" size={20} />,
      color: "bg-green-100 border-green-300",
      completed: false,
      streakDays: 1
    },
    {
      id: "service",
      name: "Ato de bondade",
      icon: <HandHeart className="text-orange-500" size={20} />,
      color: "bg-orange-100 border-orange-300",
      completed: false,
      streakDays: 3
    }
  ])

  const exercises: Exercise[] = [
    {
      id: "prayer-breathing",
      title: "Respiração de Oração",
      description: "Inspire: 'Jesus', Expire: 'Eu confio em Ti'",
      duration: "5 min",
      type: "breathing",
      icon: <Wind className="text-blue-500" size={24} />,
      color: "from-blue-400 to-cyan-500"
    },
    {
      id: "scripture-meditation",
      title: "Meditação Bíblica",
      description: "Contemple e reflita na Palavra de Deus",
      duration: "10 min",
      type: "meditation",
      icon: <BookOpen className="text-purple-500" size={24} />,
      color: "from-purple-400 to-pink-500"
    },
    {
      id: "gratitude-prayer",
      title: "Oração de Gratidão",
      description: "Agradeça a Deus por 5 bênçãos específicas",
      duration: "3 min",
      type: "mental",
      icon: <Heart className="text-red-500" size={24} />,
      color: "from-red-400 to-pink-500"
    },
    {
      id: "praise-worship",
      title: "Louvor Energizante",
      description: "Adore a Deus com música e movimento",
      duration: "8 min",
      type: "physical",
      icon: <Music className="text-yellow-500" size={24} />,
      color: "from-yellow-400 to-orange-500"
    },
    {
      id: "peace-meditation",
      title: "Meditação da Paz",
      description: "Descanso na presença do Senhor",
      duration: "15 min",
      type: "meditation",
      icon: <Shield className="text-indigo-500" size={24} />,
      color: "from-indigo-400 to-purple-500"
    },
    {
      id: "contemplative-walk",
      title: "Caminhada com Deus",
      description: "Comunhão com o Criador na natureza",
      duration: "12 min",
      type: "physical",
      icon: <TreePine className="text-green-500" size={24} />,
      color: "from-green-400 to-emerald-500"
    }
  ]

  const saveMoodEntry = () => {
    const entry: MoodEntry = {
      date: new Date().toISOString().split('T')[0],
      mood: currentMood,
      energy: currentEnergy,
      stress: currentStress,
      notes: moodNotes
    }
    
    const updatedHistory = [entry, ...moodHistory.filter(h => h.date !== entry.date)]
    setMoodHistory(updatedHistory)
    
    // Salvar no localStorage
    localStorage.setItem('mood-history', JSON.stringify(updatedHistory))
    setMoodNotes("")
  }

  const toggleHabit = (habitId: string) => {
    setHabits(habits.map(habit => 
      habit.id === habitId 
        ? { ...habit, completed: !habit.completed }
        : habit
    ))
  }

  // Carregar dados salvos
  useEffect(() => {
    const savedHistory = localStorage.getItem('mood-history')
    if (savedHistory) {
      setMoodHistory(JSON.parse(savedHistory))
    }
  }, [])

  const getMoodIcon = (mood: number) => {
    if (mood <= 2) return <Frown className="text-red-500" size={24} />
    if (mood <= 3) return <Meh className="text-yellow-500" size={24} />
    return <Smile className="text-green-500" size={24} />
  }

  const getMoodColor = (mood: number) => {
    if (mood <= 2) return "bg-red-100 border-red-300"
    if (mood <= 3) return "bg-yellow-100 border-yellow-300"
    return "bg-green-100 border-green-300"
  }

  const completedHabits = habits.filter(h => h.completed).length
  const habitCompletionRate = (completedHabits / habits.length) * 100

  if (!data.addictionType) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 pb-20">
      {/* Header Cristão */}
      <div className="bg-gradient-to-r from-purple-400 to-indigo-500 p-6 rounded-b-3xl shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shadow-lg">
                <Cross className="text-white" size={28} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Moon className="text-purple-200" size={20} />
                  <span className="text-white/90 text-sm font-medium">Bem-estar Espiritual</span>
                </div>
                <h1 className="text-2xl font-bold text-white">Cuidado da Alma</h1>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl mb-1">{data.addictionType.icon}</div>
              <div className="text-xs text-white/80">Cuidado integral</div>
            </div>
          </div>
          
          {/* Card de Progresso */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 border border-white/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-white" size={20} />
                <span className="text-white font-semibold">Disciplinas Espirituais</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold">{completedHabits}/{habits.length}</span>
                <Crown className="text-yellow-300" size={16} />
              </div>
            </div>
            
            <div className="relative mb-3">
              <div className="bg-white/20 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-white to-yellow-200 h-full transition-all duration-700 relative"
                  style={{ width: `${habitCompletionRate}%` }}
                >
                  <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-white/90 text-sm">{habitCompletionRate.toFixed(0)}% completo hoje</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((star) => (
                  <Star 
                    key={star} 
                    className={completedHabits >= star * 2 ? 'text-yellow-300' : 'text-white/40'} 
                    size={12} 
                    fill={completedHabits >= star * 2 ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Check-in Espiritual */}
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-xl border border-blue-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-200/30 rounded-full -translate-y-12 translate-x-12"></div>
          
          <div className="relative z-10">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Heart className="text-blue-600" size={24} />
              Como Seu Coração Está Hoje?
            </h2>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="text-blue-600" size={16} />
                <span className="font-medium text-blue-800 text-sm">Reflexão Espiritual</span>
              </div>
              <p className="text-blue-700 text-sm italic">
                "Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento." - Provérbios 3:5
              </p>
            </div>
          
            <div className="space-y-4">
              {/* Humor */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Humor</label>
                <div className="flex gap-3 justify-center">
                  {[1, 2, 3, 4, 5].map(value => (
                    <button
                      key={value}
                      onClick={() => setCurrentMood(value as 1 | 2 | 3 | 4 | 5)}
                      className={`w-12 h-12 rounded-full border-2 transition-all ${
                        currentMood === value 
                          ? getMoodColor(value) + " ring-2 ring-blue-300"
                          : "bg-gray-100 border-gray-300 hover:border-blue-300"
                      }`}
                    >
                      {getMoodIcon(value)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Energia */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Energia</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(value => (
                    <button
                      key={value}
                      onClick={() => setCurrentEnergy(value as 1 | 2 | 3 | 4 | 5)}
                      className={`flex-1 py-2 rounded-lg border-2 transition-all ${
                        currentEnergy >= value 
                          ? "bg-orange-100 border-orange-300 text-orange-700"
                          : "bg-gray-100 border-gray-300 text-gray-500"
                      }`}
                    >
                      <Zap size={16} className="mx-auto" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Estresse */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Nível de Estresse</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(value => (
                    <button
                      key={value}
                      onClick={() => setCurrentStress(value as 1 | 2 | 3 | 4 | 5)}
                      className={`flex-1 py-2 rounded-lg border-2 transition-all ${
                        currentStress >= value 
                          ? "bg-red-100 border-red-300 text-red-700"
                          : "bg-gray-100 border-gray-300 text-gray-500"
                      }`}
                    >
                      <Activity size={16} className="mx-auto" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Notas */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Notas (opcional)</label>
                <textarea
                  value={moodNotes}
                  onChange={(e) => setMoodNotes(e.target.value)}
                  placeholder="Como você se sente hoje? O que está acontecendo?"
                  className="w-full p-3 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                  rows={3}
                />
              </div>

              <button
                onClick={saveMoodEntry}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-all"
              >
                Salvar Registro do Dia
              </button>
            </div>
          </div>
        </div>

        {/* Disciplinas Espirituais */}
        <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-6 shadow-xl border border-purple-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200/30 rounded-full -translate-y-16 translate-x-16"></div>
          
          <div className="relative z-10">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Cross className="text-purple-600" size={24} />
              Disciplinas Espirituais
            </h2>
            
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-4 border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="text-purple-600" size={16} />
                <span className="font-medium text-purple-800 text-sm">Crescimento na Fé</span>
              </div>
              <p className="text-purple-700 text-sm">
                Pratique diariamente essas disciplinas para fortalecer sua comunhão com Deus.
              </p>
            </div>
          
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {habits.map((habit) => (
                <div
                  key={habit.id}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    habit.completed
                      ? habit.color + " ring-2 ring-green-300"
                      : "bg-gray-50 border-gray-200 hover:border-green-300"
                  }`}
                  onClick={() => toggleHabit(habit.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {habit.icon}
                      <span className="font-medium text-gray-800">{habit.name}</span>
                    </div>
                    {habit.completed && (
                      <CheckCircle className="text-green-500" size={20} />
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    🔥 {habit.streakDays} dias consecutivos
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Exercícios Espirituais */}
        <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl p-6 shadow-xl border border-indigo-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-200/30 rounded-full -translate-y-16 translate-x-16"></div>
          
          <div className="relative z-10">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Shield className="text-indigo-600" size={24} />
              Exercícios Espirituais
            </h2>
            
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-4 mb-4 border border-indigo-200">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="text-indigo-600" size={16} />
                <span className="font-medium text-indigo-800 text-sm">Renovação da Mente</span>
              </div>
              <p className="text-indigo-700 text-sm">
                Pratique estes exercícios para fortalecer sua mente e espírito em Cristo.
              </p>
            </div>
          
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="bg-gradient-to-r p-4 rounded-xl shadow-md cursor-pointer hover:scale-105 transition-all"
                  style={{
                    background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                    backgroundImage: `linear-gradient(135deg, ${exercise.color.split(' ')[1]}, ${exercise.color.split(' ')[2]})`
                  }}
                  onClick={() => setSelectedExercise(exercise)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      {exercise.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{exercise.title}</h3>
                      <p className="text-white/80 text-sm">{exercise.duration}</p>
                    </div>
                  </div>
                  <p className="text-white/90 text-sm">{exercise.description}</p>
                  <div className="mt-3">
                    <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {exercise.type === "breathing" && "🙏 Oração"}
                      {exercise.type === "meditation" && "📖 Meditação"}
                      {exercise.type === "physical" && "🎵 Louvor"}
                      {exercise.type === "mental" && "💝 Gratidão"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Jornada do Coração */}
        {moodHistory.length > 0 && (
          <div className="bg-gradient-to-br from-white to-rose-50 rounded-2xl p-6 shadow-xl border border-rose-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-200/30 rounded-full -translate-y-16 translate-x-16"></div>
            
            <div className="relative z-10">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp className="text-rose-600" size={24} />
                Jornada do Coração
              </h2>
              
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl p-4 mb-4 border border-rose-200">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="text-rose-600" size={16} />
                  <span className="font-medium text-rose-800 text-sm">Reflexão Semanal</span>
                </div>
                <p className="text-rose-700 text-sm">
                  Acompanhe como Deus tem trabalhado em seu coração nos últimos dias.
                </p>
              </div>
            
              <div className="space-y-3">
                {moodHistory.slice(0, 7).map((entry) => (
                  <div key={entry.date} className="bg-rose-50 border border-rose-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-800">
                        {new Date(entry.date).toLocaleDateString('pt-BR')}
                      </span>
                      <div className="flex items-center gap-2">
                        {getMoodIcon(entry.mood)}
                        <span className="text-sm text-gray-600">
                          Energia: {entry.energy}/5 | Estresse: {entry.stress}/5
                        </span>
                      </div>
                    </div>
                    {entry.notes && (
                      <p className="text-gray-600 text-sm">{entry.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  )
}