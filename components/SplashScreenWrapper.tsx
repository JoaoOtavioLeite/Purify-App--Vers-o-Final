"use client"

import { SplashScreen, useSplashScreen } from "./SplashScreen"

interface SplashScreenWrapperProps {
  children: React.ReactNode
}

export function SplashScreenWrapper({ children }: SplashScreenWrapperProps) {
  const { showSplash, hideSplash } = useSplashScreen()

  return (
    <>
      {showSplash && <SplashScreen onComplete={hideSplash} duration={2500} />}
      {children}
    </>
  )
}
