"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Star } from "lucide-react"
import { usePremium } from "@/contexts/PremiumContext"

interface QuizQuestion {
  id: string
  question: string
  options: Array<{
    id: string
    text: string
    score: number
  }>
}

const assessmentQuestions: QuizQuestion[] = [
  {
    id: "gender",
    question: "What is your gender?",
    options: [
      { id: "male", text: "Male", score: 0 },
      { id: "female", text: "Female", score: 0 }
    ]
  },
  {
    id: "frequency",
    question: "How often do you typically view pornography?",
    options: [
      { id: "daily-multiple", text: "More than once a day", score: 25 },
      { id: "daily", text: "Once a day", score: 20 },
      { id: "weekly", text: "A few times a week", score: 15 },
      { id: "less-weekly", text: "Less than once a week", score: 5 }
    ]
  },
  {
    id: "discovery-source",
    question: "Where did you hear about us?",
    options: [
      { id: "tv", text: "TV", score: 0 },
      { id: "facebook", text: "Facebook", score: 0 },
      { id: "tiktok", text: "TikTok", score: 0 },
      { id: "x", text: "X", score: 0 },
      { id: "instagram", text: "Instagram", score: 0 },
      { id: "google", text: "Google", score: 0 }
    ]
  },
  {
    id: "escalation",
    question: "Have you noticed a shift towards more extreme or graphic material?",
    options: [
      { id: "yes", text: "Yes", score: 25 },
      { id: "no", text: "No", score: 0 }
    ]
  },
  {
    id: "first-exposure",
    question: "At what age did you first come across explicit content?",
    options: [
      { id: "very-young", text: "12 or younger", score: 25 },
      { id: "teen-early", text: "13 to 16", score: 20 },
      { id: "teen-late", text: "17 to 24", score: 10 },
      { id: "adult", text: "25 or older", score: 5 }
    ]
  },
  {
    id: "sexual-arousal",
    question: "Do you find it difficult to achieve sexual arousal without pornography or fantasy?",
    options: [
      { id: "frequently", text: "Frequently", score: 25 },
      { id: "occasionally", text: "Occasionally", score: 15 },
      { id: "rarely", text: "Rarely or never", score: 0 }
    ]
  },
  {
    id: "emotional-coping",
    question: "Do you use pornography as a way to cope with emotional discomfort or pain?",
    options: [
      { id: "frequently", text: "Frequently", score: 25 },
      { id: "occasionally", text: "Occasionally", score: 15 },
      { id: "rarely", text: "Rarely or never", score: 0 }
    ]
  },
  {
    id: "stress-trigger",
    question: "Do you turn to pornography when feeling stressed?",
    options: [
      { id: "frequently", text: "Frequently", score: 25 },
      { id: "occasionally", text: "Occasionally", score: 15 },
      { id: "rarely", text: "Rarely or never", score: 0 }
    ]
  },
  {
    id: "boredom-trigger",
    question: "Do you watch pornography out of boredom?",
    options: [
      { id: "frequently", text: "Frequently", score: 25 },
      { id: "occasionally", text: "Occasionally", score: 15 },
      { id: "rarely", text: "Rarely or never", score: 0 }
    ]
  },
  {
    id: "paid-content",
    question: "Have you ever spent money on accessing explicit content?",
    options: [
      { id: "yes", text: "Yes", score: 20 },
      { id: "no", text: "No", score: 0 }
    ]
  }
]

export function SimpleQuittrAssessment() {
  const [currentStep, setCurrentStep] = useState<"intro" | "quiz" | "calculating" | "results">("intro")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [calculationProgress, setCalculationProgress] = useState(0)
  const [result, setResult] = useState<any>(null)
  const { updateUser } = usePremium()

  const currentQuestion = assessmentQuestions[currentQuestionIndex]
  const progressPercentage = ((currentQuestionIndex + 1) / assessmentQuestions.length) * 100

  const calculateResults = () => {
    const totalScore = Object.values(answers).reduce((sum: number, answer: any) => {
      return sum + (answer?.score || 0)
    }, 0)
    
    const maxPossibleScore = assessmentQuestions.reduce((sum, q) => 
      sum + Math.max(...q.options.map(o => o.score)), 0
    )
    
    const percentage = Math.round((totalScore / maxPossibleScore) * 100)
    
    let level = "low"
    if (percentage >= 70) level = "severe"
    else if (percentage >= 50) level = "high" 
    else if (percentage >= 30) level = "moderate"
    
    return { score: totalScore, percentage, level }
  }

  const handleAnswerSelect = (option: any) => {
    const newAnswers = { ...answers, [currentQuestion.id]: option }
    setAnswers(newAnswers)

    setTimeout(() => {
      if (currentQuestionIndex < assessmentQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1)
      } else {
        setCurrentStep("calculating")
        
        // Simular cálculo
        let progress = 0
        const interval = setInterval(() => {
          progress += Math.random() * 15 + 5
          setCalculationProgress(Math.min(progress, 100))
          
          if (progress >= 100) {
            clearInterval(interval)
            const calculatedResult = calculateResults()
            setResult(calculatedResult)
            
            // Salvar resultado E respostas específicas no contexto premium
            updateUser({
              assessmentCompleted: true,
              assessmentScore: calculatedResult.percentage,
              assessmentLevel: calculatedResult.level as any,
              assessmentAnswers: newAnswers, // NOVO: Salvar respostas específicas
              assessmentRiskFactors: [], // Pode ser expandido futuramente
              assessmentSpecificTriggers: [] // Pode ser expandido futuramente
            })
            
            setTimeout(() => setCurrentStep("results"), 500)
          }
        }, 100)
      }
    }, 300)
  }

  const handleBackStep = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    } else {
      setCurrentStep("intro")
    }
  }

  if (currentStep === "intro") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        {/* Stars background */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/60 rounded-full animate-pulse-soft"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-md text-center">
          <div className="mb-8 animate-spring-in">
            <div className="text-6xl font-bold text-white mb-4">PURIFY</div>
          </div>

          <div className="animate-slide-up">
            <h1 className="text-4xl font-bold text-white mb-6">Welcome!</h1>
            <p className="text-white/90 text-lg leading-relaxed mb-8">
              Let's start by finding out if you have a problem with porn
            </p>

            {/* 5 estrelas */}
            <div className="flex justify-center gap-1 mb-8">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-8 h-8 text-yellow-400 fill-current" />
              ))}
            </div>

            <button
              onClick={() => setCurrentStep("quiz")}
              className="w-full bg-white hover:bg-gray-100 text-gray-900 font-bold py-4 px-8 rounded-full text-lg transition-all shadow-lg flex items-center justify-center gap-3 button-press"
            >
              Start Quiz
              <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
                <ArrowLeft className="w-4 h-4 text-white rotate-180" />
              </div>
            </button>

            <div className="mt-6 space-y-3">
              <button className="block w-full text-white/70 text-base py-3 rounded-xl border border-white/30 hover:bg-white/10 transition-colors">
                Already joined via web?
              </button>
              <button className="text-white/60 text-sm hover:text-white transition-colors">
                I have a code
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === "quiz") {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        {/* Stars background */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/60 rounded-full animate-pulse-soft"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 p-4 pt-12">
          {/* Header com progresso */}
          <div className="flex items-center gap-4 mb-8">
            <button 
              onClick={handleBackStep}
              className="text-white p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-white/80 text-sm px-3 py-1 bg-white/10 rounded-full">EN</span>
              </div>
              <div className="bg-gray-700 rounded-full h-1.5">
                <div 
                  className="bg-cyan-400 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="max-w-md mx-auto">
            <div key={currentQuestionIndex} className="animate-slide-up">
              <h1 className="text-3xl font-bold text-white mb-8 text-center">
                Question #{currentQuestionIndex + 1}
              </h1>
              
              <h2 className="text-xl text-white mb-8 leading-relaxed">
                {currentQuestion.question}
              </h2>

              <div className="space-y-4">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswerSelect(option)}
                    className="w-full p-4 glass-card text-white text-left transition-all transform hover:scale-[1.02] flex items-center gap-3 button-press"
                  >
                    <div className="w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center text-gray-900 font-bold text-sm">
                      {index + 1}
                    </div>
                    <span className="flex-1">{option.text}</span>
                  </button>
                ))}
              </div>

              <div className="mt-8 text-center">
                <button className="text-white/60 text-sm hover:text-white transition-colors">
                  Skip test
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === "calculating") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        {/* Stars */}
        <div className="absolute inset-0">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/60 rounded-full animate-pulse-soft"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center">
          <button 
            onClick={() => setCurrentStep("quiz")}
            className="absolute top-0 left-0 text-white/70 hover:text-white p-2"
          >
            <ArrowLeft size={24} />
          </button>

          {/* Progress Circle */}
          <div className="relative w-48 h-48 mb-8">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="10"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#22d3ee"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${calculationProgress * 2.83} 283`}
                className="transition-all duration-300"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold text-white">{Math.round(calculationProgress)}%</span>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white mb-4">Calculating</h2>
          <p className="text-white/80 text-lg">Learning relapse triggers</p>
        </div>
      </div>
    )
  }

  if (currentStep === "results" && result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        {/* Stars */}
        <div className="absolute inset-0">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/60 rounded-full animate-pulse-soft"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-md text-center">
          <div className="animate-spring-in">
            <h1 className="text-3xl font-bold text-white mb-6">Analysis Complete ✓</h1>
            <p className="text-white/80 text-lg mb-8">
              We've got some news to break to you...
            </p>

            <div className="mb-8">
              <p className="text-white/90 text-xl mb-6 leading-relaxed">
                Your responses indicate a clear dependance on internet porn*
              </p>

              {/* Score visualization */}
              <div className="flex justify-center items-end gap-4 mb-6">
                <div className="text-center">
                  <div 
                    className="bg-red-500 rounded-t-lg mx-auto mb-2 transition-all duration-1000"
                    style={{ width: '60px', height: `${result.percentage * 2}px`, maxHeight: '120px' }}
                  ></div>
                  <div className="text-white font-bold text-xl">{result.percentage}%</div>
                  <div className="text-white/70 text-sm">Your Score</div>
                </div>
                <div className="text-center">
                  <div 
                    className="bg-green-500 rounded-t-lg mx-auto mb-2"
                    style={{ width: '60px', height: '80px' }}
                  ></div>
                  <div className="text-white font-bold text-xl">40%</div>
                  <div className="text-white/70 text-sm">Average</div>
                </div>
              </div>

              <div className="text-red-400 font-semibold mb-4">
                {result.percentage}% higher dependence on porn 📈
              </div>

              <p className="text-white/60 text-xs">
                * This result is an indication only, not a medical diagnosis.
              </p>
            </div>

            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-all shadow-lg button-press"
            >
              Check your symptoms
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
