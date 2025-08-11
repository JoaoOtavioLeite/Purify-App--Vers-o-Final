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
    background_color: "#667eea",
    theme_color: "#667eea",
    orientation: "portrait-primary",
    display_override: ["window-controls-overlay", "standalone"],
    icons: [
      {
        src: "/192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable"
      },
      {
        src: "/512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable"
      },
      {
        src: "/180.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any"
      }
    ],
    categories: ["health", "lifestyle", "productivity", "medical"],
    lang: "pt-BR",
    scope: "/",
    id: "purify-app",
    prefer_related_applications: false,
    edge_side_panel: {
      preferred_width: 400
    },
    launch_handler: {
      client_mode: "focus-existing"
    },
    screenshots: [
      {
        src: "/screenshot-mobile.png",
        sizes: "390x844",
        type: "image/png",
        form_factor: "narrow"
      }
    ],
    shortcuts: [
      {
        name: "SOS - Emergência",
        short_name: "SOS",
        description: "Acesso rápido à ajuda de emergência",
        url: "/emergencia",
        icons: [
          {
            src: "/shield-icon.png",
            sizes: "96x96",
            type: "image/png"
          }
        ]
      },
      {
        name: "Estatísticas",
        short_name: "Progresso",
        description: "Ver seu progresso",
        url: "/estatistica",
        icons: [
          {
            src: "/chart-icon.png",
            sizes: "96x96",
            type: "image/png"
          }
        ]
      }
    ]
  }
}
