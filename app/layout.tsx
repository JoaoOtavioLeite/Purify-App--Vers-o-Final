import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AddictionProvider } from "@/contexts/AddictionContext"
import InstallPWA from "@/components/InstallPWA"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Purify - Sua Jornada de Superação",
  description: "Aplicativo para acompanhar sua jornada de purificação e recuperação",
  applicationName: "Purify",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Purify",
    startupImage: [
      {
        url: "/180.png",
        media: "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
    ],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Purify",
    title: "Purify - Sua Jornada de Superação",
    description: "Aplicativo para acompanhar sua jornada de purificação e recuperação",
  },
  twitter: {
    card: "summary",
    title: "Purify - Sua Jornada de Superação",
    description: "Aplicativo para acompanhar sua jornada de purificação e recuperação",
  },
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        {/* PWA Meta Tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Purify" />
        
        {/* iOS Icons - usando arquivos menores */}
        <link rel="apple-touch-icon" sizes="57x57" href="/57.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/60.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/76.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/120.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/180.png" />
        
        {/* Android Icons - usando arquivos menores */}
        <link rel="icon" type="image/png" sizes="192x192" href="/192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/512.png" />
        
        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/16.png" />
        
        {/* Theme colors */}
        <meta name="theme-color" content="#ffffff" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/144.png" />
      </head>
      <body className={`${inter.className} bg-gradient-to-br from-blue-50 to-sky-100 text-gray-800 min-h-screen`}>
        <AddictionProvider>
          <div className="max-w-sm mx-auto min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 relative">
            {children}
            <InstallPWA />
          </div>
        </AddictionProvider>
      </body>
    </html>
  )
}
