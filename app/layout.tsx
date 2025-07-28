import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AddictionProvider } from "@/contexts/AddictionContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Purify - Sua Jornada de Superação",
  description: "Aplicativo para acompanhar sua jornada de purificação e recuperação",
  manifest: "/manifest.json",
  generator: 'v0.dev'
}

export const viewport: Viewport = {
  themeColor: "#3B82F6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-gradient-to-br from-blue-50 to-sky-100 text-gray-800 min-h-screen`}>
        <AddictionProvider>
          <div className="max-w-sm mx-auto min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 relative">
            {children}
          </div>
        </AddictionProvider>
      </body>
    </html>
  )
}
