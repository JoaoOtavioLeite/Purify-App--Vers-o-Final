import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Purify - App de Purificação de Vícios",
    short_name: "Purify",
    description:
      "Aplicativo para ajudar na purificação de vícios com acompanhamento de progresso, objetivos e motivação diária.",
    start_url: "/",
    display: "standalone",
    background_color: "#dbeafe",
    theme_color: "#3b82f6",
    orientation: "portrait",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    categories: ["health", "lifestyle", "productivity"],
    lang: "pt-BR",
  }
}
