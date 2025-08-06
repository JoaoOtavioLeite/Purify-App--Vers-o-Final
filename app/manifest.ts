import type { MetadataRoute } from "next"

export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Purify - App de Purificação de Vícios",
    short_name: "Purify",
    description:
      "Aplicativo para ajudar na purificação de vícios com acompanhamento de progresso, objetivos e motivação diária.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#3b82f6",
    orientation: "portrait",
    icons: [
      {
        src: "/192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
      }
    ],
    categories: ["health", "lifestyle", "productivity"],
    lang: "pt-BR",
    scope: "/",
    id: "purify-app",
    prefer_related_applications: false,
  }
}
