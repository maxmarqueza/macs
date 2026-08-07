export type Agent = {
  slug: string;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  capabilities: string[];
  status: "activo" | "proximamente";
};

export const agents: Agent[] = [
  {
    slug: "mcmarketing",
    name: "McMarketing",
    emoji: "📣",
    tagline: "Tu equipo de marketing que nunca duerme",
    description:
      "Publica contenido todos los días en tus redes sociales, responde comentarios y contesta DMs automáticamente.",
    capabilities: [
      "Publicación diaria automática",
      "Respuesta a comentarios",
      "Respuesta a mensajes directos",
    ],
    status: "activo",
  },
  {
    slug: "mcsoporte",
    name: "McSoporte",
    emoji: "🛟",
    tagline: "Atención al cliente 24/7",
    description:
      "Resuelve dudas de tus clientes al instante, escala lo que necesita atención humana.",
    capabilities: ["Chat de soporte 24/7", "Escalamiento inteligente"],
    status: "proximamente",
  },
  {
    slug: "mcventas",
    name: "McVentas",
    emoji: "🤝",
    tagline: "Ningún lead se queda sin respuesta",
    description:
      "Da seguimiento a prospectos, agenda citas y prepara cotizaciones sin que muevas un dedo.",
    capabilities: ["Seguimiento de leads", "Agenda de citas", "Cotizaciones"],
    status: "proximamente",
  },
  {
    slug: "mcdatos",
    name: "McDatos",
    emoji: "📊",
    tagline: "Tus números, explicados",
    description:
      "Genera reportes automáticos y responde preguntas sobre los datos de tu negocio.",
    capabilities: ["Reportes automáticos", "Análisis bajo demanda"],
    status: "proximamente",
  },
];
