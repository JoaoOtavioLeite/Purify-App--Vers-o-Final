"use client"

import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string
  children?: React.ReactNode
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-300 dark:bg-gray-700",
        className
      )}
      {...props}
    />
  )
}

// Componentes de skeleton pré-configurados
export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="flex-1">
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
      <Skeleton className="h-20 w-full mb-3" />
      <Skeleton className="h-10 w-full" />
    </div>
  )
}

export function SkeletonStats() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="grid grid-cols-3 gap-4">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="text-center">
            <Skeleton className="w-10 h-10 rounded-xl mx-auto mb-2" />
            <Skeleton className="h-6 w-12 mx-auto mb-1" />
            <Skeleton className="h-3 w-16 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function SkeletonProgress() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="text-center mb-6">
        <Skeleton className="w-32 h-32 rounded-full mx-auto mb-4" />
        <Skeleton className="h-8 w-24 mx-auto mb-2" />
        <Skeleton className="h-4 w-32 mx-auto" />
      </div>
      <Skeleton className="h-3 w-full mb-2" />
      <Skeleton className="h-10 w-full" />
    </div>
  )
}

export function SkeletonList() {
  return (
    <div className="space-y-3">
      {Array(5).fill(0).map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <div className="flex-1">
              <Skeleton className="h-4 w-40 mb-2" />
              <Skeleton className="h-3 w-64" />
            </div>
            <Skeleton className="w-6 h-6 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function SkeletonAchievement() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {Array(6).fill(0).map((_, i) => (
        <div key={i} className="bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <Skeleton className="w-6 h-6 rounded" />
            <div className="flex-1">
              <Skeleton className="h-4 w-20 mb-1" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
          <div className="flex justify-between items-center mt-3">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      ))}
    </div>
  )
}
