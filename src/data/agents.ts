/**
 * Catálogo de MACS (fuente única). Cada Mc es un agente de IA: software que trabaja
 * en los sistemas del negocio, o un robot con IA que trabaja en su espacio.
 * De aquí salen `/agentes`, `/robots`, las fichas de cada Mc, la portada, el menú y
 * el sitemap. Nuevo Mc = entrada aquí + ficha en `docs/AGENTES/<Nombre>.md`.
 *
 * Estados: `disponible` (se vende hoy), `en-desarrollo` (se construye y se puede
 * pedir como piloto), `proximamente` (línea en preparación). Las fichas describen
 * la oferta que MACS está construyendo; al cambiar un estado, cambia el sitio entero.
 */

export type McKind = "agente" | "robot";
export type McStatus = "disponible" | "en-desarrollo" | "proximamente";

export type Faq = { q: string; a: string };

export type Mc = {
  slug: string;
  kind: McKind;
  name: string;
  area: string;
  status: McStatus;
  /** Promesa en una línea (segunda línea del título de la ficha). */
  promise: string;
  /** Qué es y qué resuelve, en dos frases como máximo. */
  summary: string;
  /** Qué hace, tarea por tarea. */
  tasks: string[];
  /** Con qué se conecta (sistemas, canales u otros Mc). */
  connects: string[];
  /** Giros para los que conviene empezar con este Mc. */
  idealFor: string[];
  /** Lo que medimos para saber si funciona. */
  measures: string[];
  /** Cómo mejora con el uso (aprendizaje continuo). */
  learns: string;
  faqs: Faq[];
};

export const statusLabel: Record<McStatus, string> = {
  disponible: "Disponible",
  "en-desarrollo": "En desarrollo",
  proximamente: "Próximamente",
};

export const kindPath: Record<McKind, "/agentes" | "/robots"> = {
  agente: "/agentes",
  robot: "/robots",
};

export const mcs: Mc[] = [
  // ── Agentes IA · Ventas y clientes ─────────────────────────────────────
  {
    slug: "mcventas",
    kind: "agente",
    name: "McVentas",
    area: "Ventas y clientes",
    status: "en-desarrollo",
    promise: "Ningún prospecto se queda sin respuesta.",
    summary:
      "Atiende en segundos a quien te escribe por WhatsApp o redes, cotiza con tus precios, agenda citas y da seguimiento hasta cerrar la venta.",
    tasks: [
      "Responde al momento, de día y de noche, con la información de tu negocio.",
      "Arma cotizaciones con tu lista de precios y las envía en el mismo chat.",
      "Agenda visitas, llamadas o demostraciones en tu calendario.",
      "Da seguimiento a quien dejó de responder y te avisa cuando alguien está listo para comprar.",
    ],
    connects: ["WhatsApp Business", "Instagram y Messenger", "Google Calendar", "Tu CRM u hoja de cálculo", "Tu lista de precios"],
    idealFor: ["Distribuidoras", "Tiendas y comercios", "Inmobiliarias", "Agencias y servicios", "Talleres"],
    measures: [
      "Tiempo de primera respuesta",
      "Cotizaciones enviadas y citas agendadas",
      "Ventas que empezaron en una conversación del Mc",
    ],
    learns:
      "Cada conversación que corriges o cierras tú se vuelve un ejemplo. Con el tiempo responde como tu mejor vendedor y detecta antes quién está listo para comprar.",
    faqs: [
      {
        q: "¿Va a sonar como un robot?",
        a: "Responde con el tono y las palabras de tu negocio. Tú apruebas el estilo antes de que hable con tus clientes.",
      },
      {
        q: "¿Qué pasa si el cliente pide algo que no está en la lista?",
        a: "Te pasa la conversación con un resumen, para que continúes tú sin que el cliente repita nada.",
      },
    ],
  },
  {
    slug: "mcsoporte",
    kind: "agente",
    name: "McSoporte",
    area: "Ventas y clientes",
    status: "en-desarrollo",
    promise: "Atención al cliente a cualquier hora.",
    summary:
      "Resuelve al instante las dudas de tus clientes con la información de tu negocio y pasa a una persona lo que necesita atención humana.",
    tasks: [
      "Contesta preguntas frecuentes: horarios, precios, envíos, garantías y políticas.",
      "Consulta el estado de pedidos o servicios en tu sistema.",
      "Levanta reportes y quejas con todos los datos del caso.",
      "Escala a tu equipo los casos delicados, con el historial resumido.",
    ],
    connects: ["WhatsApp Business", "Correo", "Chat de tu sitio web", "Tu sistema de pedidos o tickets"],
    idealFor: ["Tiendas en línea", "Empresas de servicios", "Distribuidoras", "Software y suscripciones"],
    measures: ["Casos resueltos sin intervención", "Tiempo de respuesta", "Satisfacción de tus clientes"],
    learns:
      "Las preguntas que no supo contestar y las respuestas que da tu equipo pasan a su base de conocimiento, así cada semana resuelve más casos por sí solo.",
    faqs: [
      {
        q: "¿Puede equivocarse?",
        a: "Solo responde con la información que tú le das. Si algo no está claro, pregunta o pasa el caso a una persona en lugar de inventar.",
      },
      {
        q: "¿Mis clientes sabrán que es un agente de IA?",
        a: "Sí. Recomendamos decirlo con claridad y ofrecer siempre la opción de hablar con una persona.",
      },
    ],
  },
  {
    slug: "mcagenda",
    kind: "agente",
    name: "McAgenda",
    area: "Ventas y clientes",
    status: "en-desarrollo",
    promise: "Tu recepción, siempre disponible.",
    summary:
      "Agenda, confirma y reprograma citas por WhatsApp, y recuerda a cada cliente su cita para que no falte.",
    tasks: [
      "Muestra los horarios libres y agenda directo en tu calendario.",
      "Confirma un día antes y reprograma si el cliente lo pide.",
      "Ofrece los espacios que se liberan a quien está en lista de espera.",
      "Envía indicaciones previas: ubicación, requisitos o preparación.",
    ],
    connects: ["WhatsApp Business", "Google Calendar u Outlook", "Tu sistema de citas"],
    idealFor: ["Consultorios y clínicas", "Dentistas", "Estéticas y spas", "Talleres", "Despachos"],
    measures: ["Citas agendadas por el Mc", "Inasistencias", "Espacios recuperados de la lista de espera"],
    learns:
      "Aprende qué horarios se piden más y por qué se cancela, y ajusta cuándo y cómo recordar para que falten menos.",
    faqs: [
      {
        q: "¿Funciona con varios profesionales o sucursales?",
        a: "Sí. Cada agenda se configura por separado y el Mc ofrece solo los horarios disponibles de cada una.",
      },
      {
        q: "¿Qué pasa con las urgencias?",
        a: "Las identifica y las pasa de inmediato a tu equipo.",
      },
    ],
  },
  {
    slug: "mccobranza",
    kind: "agente",
    name: "McCobranza",
    area: "Ventas y clientes",
    status: "en-desarrollo",
    promise: "Cobra a tiempo sin perseguir a nadie.",
    summary:
      "Recuerda los pagos con amabilidad, envía ligas de pago y lleva el registro de quién ya pagó, para que tu flujo de efectivo no dependa de la memoria de nadie.",
    tasks: [
      "Envía recordatorios antes y después de cada vencimiento.",
      "Comparte ligas de pago y datos para transferencia.",
      "Registra los pagos recibidos y actualiza el estado de cada cuenta.",
      "Te avisa cuando un caso necesita una conversación personal.",
    ],
    connects: ["WhatsApp Business", "Correo", "Tu plataforma de pagos", "Tu sistema contable u hoja de cálculo"],
    idealFor: ["Colegios", "Gimnasios", "Distribuidoras con crédito", "Servicios de pago mensual"],
    measures: ["Días promedio de cobro", "Cartera vencida", "Pagos recibidos después de un recordatorio"],
    learns:
      "Aprende qué mensaje, canal y horario funcionan con cada tipo de cliente, y los usa en los siguientes recordatorios.",
    faqs: [
      {
        q: "¿No va a molestar a mis clientes?",
        a: "Tú defines el tono y la frecuencia. Los mensajes son cordiales y se detienen en cuanto el pago queda registrado.",
      },
      {
        q: "¿Puede negociar plazos?",
        a: "Solo dentro de las reglas que tú autorices. Lo demás lo pasa a tu equipo.",
      },
    ],
  },

  // ── Agentes IA · Marketing y reputación ────────────────────────────────
  {
    slug: "mcmarketing",
    kind: "agente",
    name: "McMarketing",
    area: "Marketing y reputación",
    status: "disponible",
    promise: "Tu equipo de marketing que nunca duerme.",
    summary:
      "Publica contenido todos los días en tus redes sociales, responde comentarios y contesta mensajes directos automáticamente.",
    tasks: [
      "Publica contenido automáticamente todos los días en tus redes sociales.",
      "Responde automáticamente a los comentarios que recibes.",
      "Contesta los mensajes directos, para dar respuesta también en privado.",
    ],
    connects: ["Tus redes sociales", "Flujos en n8n"],
    idealFor: ["Negocios locales", "Tiendas en línea", "Restaurantes", "Marcas personales"],
    measures: ["Publicaciones por semana", "Comentarios y mensajes atendidos", "Tiempo de respuesta en redes"],
    learns:
      "En cada revisión ajustamos el contenido y las respuestas según lo que mejor funciona con tu audiencia.",
    faqs: [
      {
        q: "¿Qué hace McMarketing?",
        a: "Automatiza tres tareas de marketing en redes sociales: la publicación diaria de contenido, las respuestas a comentarios y las respuestas a mensajes directos.",
      },
      {
        q: "¿Qué tecnología utiliza?",
        a: "McMarketing utiliza n8n para sus flujos de automatización.",
      },
      {
        q: "¿Cómo puedo saber si encaja con mi negocio?",
        a: "Cuéntanos en qué redes trabajas y qué tareas quieres automatizar. Así podemos conversar sobre el alcance que necesitas para tu negocio.",
      },
    ],
  },
  {
    slug: "mcresenas",
    kind: "agente",
    name: "McReseñas",
    area: "Marketing y reputación",
    status: "en-desarrollo",
    promise: "Tu reputación en línea, cuidada todos los días.",
    summary:
      "Responde las reseñas de Google de tu negocio y pide su opinión a los clientes satisfechos, para que tu calificación refleje el buen servicio que das.",
    tasks: [
      "Responde cada reseña con un mensaje personal y a tiempo.",
      "Te alerta de inmediato cuando llega una reseña negativa.",
      "Pide una reseña a tus clientes después de una buena experiencia.",
      "Resume cada mes lo que tus clientes elogian y lo que piden mejorar.",
    ],
    connects: ["Perfil de Negocio de Google", "WhatsApp Business", "Correo"],
    idealFor: ["Restaurantes", "Hoteles", "Consultorios", "Talleres", "Tiendas físicas"],
    measures: ["Reseñas respondidas y tiempo de respuesta", "Calificación promedio", "Reseñas nuevas al mes"],
    learns:
      "Aprende de las respuestas que editas y de los temas que más mencionan tus clientes, para responder cada vez más como tú.",
    faqs: [
      {
        q: "¿Puede publicar reseñas falsas?",
        a: "No. Solo responde reseñas reales y pide su opinión a clientes reales. Las reseñas falsas van contra las reglas de Google y dañan tu negocio.",
      },
      {
        q: "¿Qué hace con las reseñas negativas?",
        a: "Te avisa al momento y te propone una respuesta. Tú decides si se publica tal cual.",
      },
    ],
  },

  // ── Agentes IA · Operación y administración ────────────────────────────
  {
    slug: "mcfactura",
    kind: "agente",
    name: "McFactura",
    area: "Operación y administración",
    status: "en-desarrollo",
    promise: "Facturas CFDI sin capturar nada.",
    summary:
      "Genera y envía facturas CFDI 4.0 a partir de tus ventas o pedidos, y le pide al cliente sus datos fiscales por WhatsApp cuando faltan.",
    tasks: [
      "Pide y valida los datos fiscales del cliente: RFC, régimen, código postal y uso del CFDI.",
      "Emite la factura con tu proveedor de timbrado y la envía por correo o WhatsApp.",
      "Genera complementos de pago y notas de crédito.",
      "Te avisa de rechazos o datos incorrectos antes de que se vuelvan un problema.",
    ],
    connects: ["Tu proveedor de timbrado", "Tu punto de venta", "Tu tienda en línea", "WhatsApp Business y correo"],
    idealFor: ["Comercios", "Restaurantes", "Distribuidoras", "Profesionistas independientes"],
    measures: ["Facturas emitidas", "Tiempo entre la venta y la factura", "Facturas corregidas o canceladas"],
    learns:
      "Recuerda los datos fiscales de cada cliente y aprende de cada rechazo, para que la siguiente factura salga bien a la primera.",
    faqs: [
      {
        q: "¿Sustituye a mi contador?",
        a: "No. Automatiza la emisión y el envío; tu contador sigue revisando tu contabilidad y presentando tus declaraciones.",
      },
      {
        q: "¿Qué necesito para usarlo?",
        a: "Tu certificado de sello digital y una cuenta con un proveedor de timbrado. Te ayudamos a configurarlo.",
      },
    ],
  },
  {
    slug: "mccompras",
    kind: "agente",
    name: "McCompras",
    area: "Operación y administración",
    status: "en-desarrollo",
    promise: "Resurtido sin adivinar.",
    summary:
      "Cruza tus existencias, ventas y pedidos pendientes para proponerte qué pedir, cuánto y a qué proveedor, antes de que algo se agote.",
    tasks: [
      "Analiza existencias, ventas recientes y pedidos en camino.",
      "Propone el pedido de cada proveedor según sus tiempos de entrega.",
      "Alerta faltantes y productos que no se mueven.",
      "Prepara la orden de compra lista para enviar.",
    ],
    connects: ["Tu ERP o sistema de inventario", "Hojas de cálculo", "Correo de tus proveedores"],
    idealFor: ["Distribuidoras", "Refaccionarias", "Tiendas", "Importadores"],
    measures: ["Productos agotados", "Días de inventario", "Tiempo para armar cada pedido"],
    learns:
      "Compara lo que pidió con lo que realmente se vendió y ajusta sus cálculos para cada producto y cada temporada.",
    faqs: [
      {
        q: "¿Hace el pedido solo?",
        a: "Te lo deja listo para revisar. Solo se envía cuando tú lo apruebas, salvo que definas reglas para hacerlo automático.",
      },
      {
        q: "¿Sirve si importo con tiempos de entrega largos?",
        a: "Sí. Considera el tiempo de tránsito de cada proveedor para pedir con anticipación.",
      },
    ],
  },
  {
    slug: "mcdatos",
    kind: "agente",
    name: "McDatos",
    area: "Operación y administración",
    status: "en-desarrollo",
    promise: "Tus números, explicados.",
    summary:
      "Genera reportes automáticos y responde en lenguaje sencillo tus preguntas sobre ventas, gastos e inventario.",
    tasks: [
      "Envía un resumen diario o semanal por correo o WhatsApp.",
      "Responde preguntas como «¿qué se vendió más este mes?».",
      "Detecta cambios fuera de lo normal y te avisa.",
      "Reúne en un solo lugar datos que hoy viven en archivos distintos.",
    ],
    connects: ["Tu ERP o punto de venta", "Hojas de cálculo", "Tu sistema contable", "WhatsApp Business y correo"],
    idealFor: ["Negocios con información dispersa", "Distribuidoras", "Cadenas y franquicias"],
    measures: ["Reportes entregados a tiempo", "Horas de captura ahorradas", "Alertas atendidas"],
    learns: "Aprende qué preguntas haces con más frecuencia y tiene lista la respuesta antes de que la pidas.",
    faqs: [
      {
        q: "¿Mis datos salen de mi empresa?",
        a: "Solo se usan para generar tus reportes, con acceso limitado a lo necesario y bajo un contrato de tratamiento de datos.",
      },
      {
        q: "¿Necesito tener todo ordenado antes?",
        a: "No. Parte del trabajo es conectar y ordenar lo que ya tienes.",
      },
    ],
  },
  {
    slug: "mctalento",
    kind: "agente",
    name: "McTalento",
    area: "Operación y administración",
    status: "en-desarrollo",
    promise: "Contratar sin perder semanas.",
    summary:
      "Recibe a los candidatos, los filtra con los requisitos que tú defines y agenda entrevistas, para que tu equipo solo hable con quien sí encaja.",
    tasks: [
      "Recibe solicitudes y hace las preguntas iniciales por WhatsApp.",
      "Filtra con los requisitos del puesto que tú defines.",
      "Agenda entrevistas en tu calendario.",
      "Responde dudas frecuentes de tu equipo sobre vacaciones, horarios y políticas.",
    ],
    connects: ["WhatsApp Business", "Correo", "Tu calendario", "Bolsas de trabajo"],
    idealFor: ["Restaurantes", "Comercios", "Centros de atención telefónica", "Manufactura"],
    measures: ["Días para cubrir una vacante", "Candidatos filtrados", "Entrevistas agendadas"],
    learns:
      "Aprende qué perfiles terminan contratados y se quedan, y con tu aprobación afina las preguntas iniciales.",
    faqs: [
      {
        q: "¿Decide a quién contratar?",
        a: "No. Filtra con los requisitos que tú defines y la decisión siempre es de una persona de tu equipo.",
      },
      {
        q: "¿Cómo se evita la discriminación?",
        a: "Solo usa requisitos relacionados con el puesto. Nunca filtra por edad, género, estado civil ni otros datos personales ajenos al trabajo.",
      },
    ],
  },

  // ── Robots con IA · Atención y servicio ────────────────────────────────
  {
    slug: "mcmesero",
    kind: "robot",
    name: "McMesero",
    area: "Atención y servicio",
    status: "proximamente",
    promise: "Cada platillo llega a su mesa.",
    summary:
      "Robot de servicio que lleva platillos y bebidas, recoge la loza y guía a tus clientes, para que tu equipo dedique más tiempo a atender.",
    tasks: [
      "Lleva los pedidos de la cocina a la mesa correcta.",
      "Recoge platos y vasos al terminar.",
      "Recibe a los clientes y los guía hasta su lugar.",
      "Anuncia promociones con voz y pantalla.",
    ],
    connects: ["Tu punto de venta o sistema de comandas", "McSoporte para responder preguntas", "El mapa de tu local"],
    idealFor: ["Restaurantes", "Hoteles", "Salones de eventos", "Hospitales"],
    measures: ["Viajes por turno", "Tiempo de entrega a la mesa", "Horas de tu equipo liberadas"],
    learns:
      "Aprende las rutas más rápidas de tu local y los horarios de más demanda, para estar donde se necesita.",
    faqs: [
      {
        q: "¿Sustituye a mis meseros?",
        a: "No. Hace los traslados repetitivos para que tus meseros atiendan mejor a cada mesa.",
      },
      {
        q: "¿Funciona en cualquier local?",
        a: "Necesita pasillos libres y piso sin escalones. Lo revisamos en una visita antes de proponerlo.",
      },
    ],
  },
  {
    slug: "mcanfitrion",
    kind: "robot",
    name: "McAnfitrión",
    area: "Atención y servicio",
    status: "proximamente",
    promise: "Recibe y orienta a cada visitante.",
    summary:
      "Robot con pantalla y voz que da la bienvenida, responde preguntas con la información de tu negocio y guía a cada persona hasta donde necesita ir.",
    tasks: [
      "Da la bienvenida y registra las visitas.",
      "Responde preguntas con el mismo conocimiento de McSoporte.",
      "Guía a las personas hasta un área o un producto.",
      "Presenta promociones y avisos.",
    ],
    connects: ["McSoporte", "Tu sistema de citas o de registro", "Tu catálogo"],
    idealFor: ["Tiendas departamentales", "Hoteles", "Clínicas", "Exposiciones", "Oficinas corporativas"],
    measures: ["Visitantes atendidos", "Preguntas resueltas", "Personas guiadas"],
    learns: "Registra las preguntas que más le hacen y mejora sus respuestas en cada revisión.",
    faqs: [
      {
        q: "¿Graba a las personas?",
        a: "Usa la cámara para moverse con seguridad. Cualquier registro de datos personales se hace con aviso de privacidad y consentimiento.",
      },
      {
        q: "¿Habla otros idiomas?",
        a: "Sí. Además del español, puede atender en los idiomas que definas para tu negocio.",
      },
    ],
  },
  {
    slug: "mclimpieza",
    kind: "robot",
    name: "McLimpieza",
    area: "Atención y servicio",
    status: "proximamente",
    promise: "Pisos limpios todos los días, sin turnos extra.",
    summary:
      "Robot autónomo que barre, aspira y friega grandes superficies con rutas y horarios programados, y reporta qué áreas limpió.",
    tasks: [
      "Limpia en los horarios que definas, incluso de noche.",
      "Recorre rutas programadas y esquiva obstáculos.",
      "Regresa por sí solo a cargarse.",
      "Reporta las áreas limpiadas y avisa si algo le impide avanzar.",
    ],
    connects: ["Tu calendario de limpieza", "Reportes por correo o WhatsApp"],
    idealFor: ["Plazas comerciales", "Oficinas", "Hospitales", "Escuelas", "Naves industriales"],
    measures: ["Metros cuadrados limpiados", "Rutas completadas", "Horas de limpieza liberadas"],
    learns: "Ajusta sus rutas según las zonas que más se ensucian y los horarios con menos gente.",
    faqs: [
      {
        q: "¿Necesita supervisión?",
        a: "Mínima. Una persona prepara el equipo y revisa los reportes; el robot hace el recorrido.",
      },
      {
        q: "¿Funciona en cualquier piso?",
        a: "En la mayoría de los pisos duros. Lo confirmamos en la visita técnica.",
      },
    ],
  },

  // ── Robots con IA · Industria y almacén ────────────────────────────────
  {
    slug: "mcbrazo",
    kind: "robot",
    name: "McBrazo",
    area: "Industria y almacén",
    status: "proximamente",
    promise: "Un par de manos más en tu línea.",
    summary:
      "Brazo robótico colaborativo que trabaja junto a tu equipo en tareas repetitivas: empacar, acomodar, cargar máquinas o mover piezas.",
    tasks: [
      "Toma y coloca piezas con precisión todo el turno.",
      "Empaca y acomoda cajas en tarimas.",
      "Alimenta máquinas y retira las piezas terminadas.",
      "Aprende tareas nuevas por demostración, sin programación compleja.",
    ],
    connects: ["Tus máquinas y bandas", "McVisión para reconocer piezas", "Tu sistema de producción"],
    idealFor: ["Talleres y maquila", "Alimentos y bebidas", "Empaque", "Autopartes", "Comercio electrónico"],
    measures: ["Piezas por hora", "Tiempo de ciclo", "Horas de trabajo repetitivo liberadas"],
    learns:
      "Cada tarea que un operador le enseña o corrige queda guardada, y con la práctica la hace más rápido y con más precisión.",
    faqs: [
      {
        q: "¿Es seguro trabajar a su lado?",
        a: "Los brazos colaborativos se detienen al detectar contacto. Aun así, analizamos los riesgos de cada estación antes de instalarlo.",
      },
      {
        q: "¿Quién lo programa?",
        a: "Nosotros lo dejamos funcionando y capacitamos a tu equipo para enseñarle tareas nuevas.",
      },
    ],
  },
  {
    slug: "mcvision",
    kind: "robot",
    name: "McVisión",
    area: "Industria y almacén",
    status: "proximamente",
    promise: "Ve los defectos que se escapan al ojo.",
    summary:
      "Estación de inspección con cámaras e IA que revisa cada pieza, cuenta, verifica etiquetas y separa lo que no cumple. Aprende de cada corrección de tu equipo.",
    tasks: [
      "Inspecciona cada pieza de la línea, sin cansarse.",
      "Detecta rayones, faltantes, deformaciones o errores de etiqueta.",
      "Cuenta piezas y registra cada lote.",
      "Guarda la evidencia fotográfica de cada rechazo.",
    ],
    connects: ["Tu línea o banda transportadora", "McBrazo para separar piezas", "Tu sistema de calidad"],
    idealFor: ["Manufactura", "Alimentos", "Empaque", "Autopartes", "Farmacéutica"],
    measures: ["Defectos detectados", "Rechazos por error", "Piezas inspeccionadas por hora"],
    learns:
      "Cada vez que un inspector confirma o corrige un resultado, el modelo se vuelve a entrenar y distingue mejor lo bueno de lo malo. Es aprendizaje continuo en tu propia línea.",
    faqs: [
      {
        q: "¿Cuántos ejemplos necesita para empezar?",
        a: "Unos cientos de fotos de piezas buenas y con defecto. Mientras más corrige tu equipo, mejor se vuelve.",
      },
      {
        q: "¿Qué pasa si cambio de producto?",
        a: "Se le enseña el producto nuevo con fotos y correcciones, sin cambiar la estación.",
      },
    ],
  },
  {
    slug: "mccarga",
    kind: "robot",
    name: "McCarga",
    area: "Industria y almacén",
    status: "proximamente",
    promise: "El material llega solo a donde se necesita.",
    summary:
      "Robot móvil autónomo que transporta cajas, carritos y material entre las áreas de tu almacén o planta, sin rieles ni guías en el piso.",
    tasks: [
      "Lleva material entre almacén, líneas de producción y embarque.",
      "Esquiva personas y obstáculos en su camino.",
      "Recibe órdenes desde una tableta o desde tu sistema.",
      "Registra cada traslado para que sepas dónde está todo.",
    ],
    connects: ["Tu sistema de almacén o ERP", "McBrazo para cargar y descargar", "Puertas y elevadores automáticos"],
    idealFor: ["Almacenes", "Centros de distribución", "Fábricas", "Hospitales"],
    measures: ["Traslados por turno", "Tiempo de cada traslado", "Distancia que tu equipo deja de caminar"],
    learns: "Aprende las rutas y los horarios con más tráfico y reparte los traslados para no estorbar.",
    faqs: [
      {
        q: "¿Tengo que modificar mi almacén?",
        a: "Por lo general no. Se mapea el espacio y se definen las rutas; lo confirmamos en una visita técnica.",
      },
      {
        q: "¿Cuánto peso puede mover?",
        a: "Depende del modelo. Te proponemos el adecuado según lo que necesitas transportar.",
      },
    ],
  },
];

export const agents = mcs.filter((mc) => mc.kind === "agente");
export const robots = mcs.filter((mc) => mc.kind === "robot");

export function getMc(kind: McKind, slug: string) {
  return mcs.find((mc) => mc.kind === kind && mc.slug === slug);
}

export function mcHref(mc: Pick<Mc, "kind" | "slug">) {
  return `${kindPath[mc.kind]}/${mc.slug}`;
}

/** Mc agrupados por área, en el orden del catálogo. */
export function byArea(list: Mc[]) {
  const groups: { area: string; items: Mc[] }[] = [];
  for (const mc of list) {
    const group = groups.find((g) => g.area === mc.area);
    if (group) group.items.push(mc);
    else groups.push({ area: mc.area, items: [mc] });
  }
  return groups;
}

/** Por dónde empezar en cada giro de negocio (agentes y robots). */
export const industries: { name: string; mcs: string[] }[] = [
  { name: "Restaurantes y hoteles", mcs: ["mcresenas", "mcagenda", "mcmesero", "mclimpieza"] },
  { name: "Consultorios y clínicas", mcs: ["mcagenda", "mcsoporte", "mccobranza", "mcanfitrion"] },
  { name: "Comercios y tiendas en línea", mcs: ["mcventas", "mcsoporte", "mcmarketing", "mcfactura"] },
  { name: "Distribuidoras e importadores", mcs: ["mcventas", "mccompras", "mccobranza", "mcdatos"] },
  { name: "Manufactura y almacenes", mcs: ["mcvision", "mcbrazo", "mccarga", "mccompras"] },
  { name: "Servicios profesionales", mcs: ["mcagenda", "mcfactura", "mccobranza", "mctalento"] },
];

/** Cómo trabajamos: la secuencia real de un proyecto. */
export const workSteps = [
  {
    name: "Diagnóstico",
    text: "Revisamos contigo qué tareas se repiten y cuánto tiempo te quitan. Sales con un mapa de qué conviene automatizar primero.",
  },
  {
    name: "Piloto",
    text: "Configuramos el Mc con la información de tu negocio y lo probamos con casos reales, con una persona revisando cada resultado.",
  },
  {
    name: "Operación",
    text: "El Mc trabaja todos los días. Nosotros lo monitoreamos, cuidamos los costos y atendemos cualquier cambio.",
  },
  {
    name: "Mejora continua",
    text: "Cada corrección lo hace mejor. Cada mes recibes un reporte con lo que resolvió y lo que ajustamos.",
  },
] as const;
