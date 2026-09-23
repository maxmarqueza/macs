import type { Faq } from "./agents";

/**
 * Soluciones por giro (fuente única de `/soluciones` y de la portada). Cada giro
 * junta a los Mc que conviene poner a trabajar primero, con su papel en ese tipo
 * de negocio y un día de ejemplo. Los días son ilustrativos: muestran cómo se
 * reparten las tareas, no resultados medidos.
 */

export type Solution = {
  slug: string;
  name: string;
  /** Segunda línea del título. */
  promise: string;
  summary: string;
  /** Lo que se repite todos los días en ese giro. */
  pains: string[];
  /** Los Mc de este giro y lo que hace cada uno ahí. */
  team: { mc: string; role: string }[];
  /** Un día de ejemplo, en orden. */
  day: { time: string; text: string }[];
  faqs: Faq[];
};

export const solutions: Solution[] = [
  {
    slug: "restaurantes-y-hoteles",
    name: "Restaurantes y hoteles",
    promise: "Más tiempo para atender, menos para repetir.",
    summary:
      "Reservaciones, reseñas, facturas y traslados se repiten todos los días. Los Mc se encargan de eso para que tu equipo se dedique a comensales y huéspedes.",
    pains: [
      "Reservaciones y preguntas por WhatsApp a cualquier hora.",
      "Reseñas en Google que nadie responde.",
      "Clientes que piden su factura días después.",
      "Meseros que caminan más de lo que atienden.",
    ],
    team: [
      { mc: "mcagenda", role: "Toma y confirma reservaciones por WhatsApp." },
      { mc: "mcresenas", role: "Responde reseñas y pide su opinión a quien salió contento." },
      { mc: "mcfactura", role: "Emite la factura en cuanto el cliente manda sus datos." },
      { mc: "mcmesero", role: "Lleva platillos y recoge la loza en las horas pico." },
      { mc: "mclimpieza", role: "Limpia salones y pasillos fuera de horario." },
    ],
    day: [
      { time: "09:00", text: "McAgenda confirma las reservaciones del día y ofrece las mesas que se liberaron." },
      { time: "14:30", text: "En la hora pico, McMesero lleva los platillos mientras tus meseros atienden las mesas." },
      { time: "17:00", text: "McFactura envía las facturas que pidieron los clientes de la comida." },
      { time: "23:30", text: "McReseñas responde las reseñas del día y McLimpieza recorre el salón." },
    ],
    faqs: [
      {
        q: "¿Puedo empezar solo con las reservaciones?",
        a: "Sí. McAgenda suele ser el primer Mc en un restaurante; los demás se suman cuando el primero ya funciona.",
      },
    ],
  },
  {
    slug: "consultorios-y-clinicas",
    name: "Consultorios y clínicas",
    promise: "Tu agenda llena y cada paciente atendido.",
    summary:
      "Citas, recordatorios, dudas y cobros ocupan buena parte del día de la recepción. Los Mc los resuelven y dejan a tu equipo lo que requiere trato humano.",
    pains: [
      "Pacientes que no llegan a su cita.",
      "Teléfono y WhatsApp saturados con las mismas preguntas.",
      "Pagos pendientes que nadie persigue.",
      "Una recepción ocupada justo cuando llega un paciente.",
    ],
    team: [
      { mc: "mcagenda", role: "Agenda, confirma y recuerda cada cita." },
      { mc: "mcsoporte", role: "Responde dudas de horarios, precios, ubicación y preparación." },
      { mc: "mccobranza", role: "Recuerda los pagos pendientes y envía la liga de pago." },
      { mc: "mcanfitrion", role: "Recibe a los pacientes y los orienta en la sala." },
    ],
    day: [
      { time: "08:00", text: "McAgenda envía los recordatorios y confirma las citas del día." },
      { time: "11:00", text: "McSoporte responde a quien pregunta por precios o preparación mientras recepción atiende a los pacientes presentes." },
      { time: "16:00", text: "McAnfitrión recibe a los pacientes de la tarde y los guía al consultorio." },
      { time: "19:00", text: "McCobranza recuerda los saldos pendientes con la liga de pago." },
    ],
    faqs: [
      {
        q: "¿Qué pasa con los datos de salud?",
        a: "Son datos sensibles. Los Mc usan solo lo necesario para agendar y recordar, nunca expedientes clínicos, y todo va con consentimiento y contrato de tratamiento de datos.",
      },
    ],
  },
  {
    slug: "comercios-y-tiendas",
    name: "Comercios y tiendas en línea",
    promise: "Vende a cualquier hora sin dejar a nadie esperando.",
    summary:
      "Preguntas por precios, existencias y envíos llegan de día y de noche. Los Mc responden, venden, publican y facturan, y tú ves todo en un solo lugar.",
    pains: [
      "Mensajes que se contestan tarde y ventas que se enfrían.",
      "Las mismas preguntas sobre envíos, cambios y garantías.",
      "Redes sociales sin publicar durante semanas.",
      "Facturas que se hacen a mano.",
    ],
    team: [
      { mc: "mcventas", role: "Atiende a los interesados, cotiza y da seguimiento." },
      { mc: "mcsoporte", role: "Resuelve dudas de envíos, cambios y garantías." },
      { mc: "mcmarketing", role: "Publica todos los días y responde comentarios." },
      { mc: "mcfactura", role: "Factura cada venta sin captura manual." },
    ],
    day: [
      { time: "07:30", text: "McMarketing publica la promoción del día." },
      { time: "13:00", text: "McVentas responde a quienes preguntaron por la promoción y envía cotizaciones." },
      { time: "18:00", text: "McSoporte resuelve dudas de envíos y cambios." },
      { time: "22:00", text: "McFactura emite las facturas de las ventas del día." },
    ],
    faqs: [
      {
        q: "¿Funciona si vendo en tienda física y en línea?",
        a: "Sí. Los Mc se conectan a tu punto de venta y a tu tienda en línea para trabajar con la misma información.",
      },
    ],
  },
  {
    slug: "distribuidoras-e-importadores",
    name: "Distribuidoras e importadores",
    promise: "Cada cotización, pedido y cobro a tiempo.",
    summary:
      "Cotizar, dar seguimiento, cobrar y resurtir consume horas de tu equipo. Los Mc hacen lo repetitivo y te avisan dónde hace falta decidir.",
    pains: [
      "Cotizaciones que tardan y clientes que compran en otro lado.",
      "Cartera vencida que crece sin que nadie lo note.",
      "Productos agotados junto a inventario que no se mueve.",
      "Reportes armados a mano en hojas de cálculo.",
    ],
    team: [
      { mc: "mcventas", role: "Cotiza con tu lista de precios y da seguimiento a cada prospecto." },
      { mc: "mccompras", role: "Propone el pedido de cada proveedor antes de que algo se agote." },
      { mc: "mccobranza", role: "Recuerda vencimientos y registra los pagos." },
      { mc: "mcdatos", role: "Te envía ventas, cartera e inventario, explicados." },
    ],
    day: [
      { time: "08:00", text: "McDatos te envía el resumen: ventas de ayer, cartera y faltantes." },
      { time: "10:00", text: "McVentas cotiza a los clientes que escribieron durante la noche." },
      { time: "13:00", text: "McCompras deja listo el pedido al proveedor para que lo apruebes." },
      { time: "17:00", text: "McCobranza recuerda las facturas que vencen esta semana." },
    ],
    faqs: [
      {
        q: "¿Sirve si importo con tiempos de entrega largos?",
        a: "Sí. McCompras considera el tiempo de tránsito de cada proveedor para pedir con anticipación.",
      },
    ],
  },
  {
    slug: "manufactura-y-almacenes",
    name: "Manufactura y almacenes",
    promise: "Tu línea más precisa y tu almacén en movimiento.",
    summary:
      "Inspeccionar, mover material, empacar y resurtir se repite todo el turno. Los robots Mc lo hacen junto a tu equipo y los agentes Mc coordinan compras y reportes.",
    pains: [
      "Defectos que se detectan tarde o llegan al cliente.",
      "Personal que camina de un lado a otro para mover material.",
      "Tareas pesadas y repetitivas en empaque.",
      "Faltantes de materia prima que detienen la línea.",
    ],
    team: [
      { mc: "mcvision", role: "Inspecciona cada pieza y aprende de cada corrección." },
      { mc: "mcbrazo", role: "Empaca, acomoda y alimenta máquinas junto a tu equipo." },
      { mc: "mccarga", role: "Mueve material entre almacén, líneas y embarque." },
      { mc: "mccompras", role: "Resurte la materia prima antes de que falte." },
    ],
    day: [
      { time: "06:00", text: "Empieza el turno: McCarga lleva la materia prima a las líneas." },
      { time: "09:00", text: "McVisión inspecciona cada pieza y McBrazo aparta las que no cumplen." },
      { time: "13:00", text: "McCompras detecta que un insumo se acaba y prepara el pedido." },
      { time: "21:00", text: "Llega el reporte del turno: piezas buenas, rechazos y la foto de cada defecto." },
    ],
    faqs: [
      {
        q: "¿Tengo que cambiar mi línea de producción?",
        a: "Por lo general no. Antes de proponer un robot hacemos una visita técnica para revisar el espacio y la tarea.",
      },
    ],
  },
  {
    slug: "servicios-profesionales",
    name: "Servicios profesionales",
    promise: "Tu tiempo en tus clientes, no en la administración.",
    summary:
      "Despachos, agencias y consultorías pierden horas agendando, facturando, cobrando y contratando. Los Mc llevan la administración para que te dediques al trabajo que cobras.",
    pains: [
      "Mensajes de ida y vuelta para agendar una reunión.",
      "Facturas y complementos de pago atrasados.",
      "Clientes que pagan tarde.",
      "Contrataciones que toman semanas.",
    ],
    team: [
      { mc: "mcagenda", role: "Agenda reuniones y envía recordatorios." },
      { mc: "mcfactura", role: "Emite facturas y complementos de pago." },
      { mc: "mccobranza", role: "Da seguimiento a los pagos con cordialidad." },
      { mc: "mctalento", role: "Filtra candidatos y agenda entrevistas." },
    ],
    day: [
      { time: "09:00", text: "McAgenda confirma las reuniones del día." },
      { time: "12:00", text: "McFactura emite la factura del proyecto que cerraste ayer." },
      { time: "16:00", text: "McTalento agenda entrevistas con los candidatos que cumplen." },
      { time: "18:00", text: "McCobranza recuerda los pagos pendientes de la semana." },
    ],
    faqs: [
      {
        q: "¿Mis clientes van a notar el cambio?",
        a: "Sí, para bien: reciben confirmaciones, facturas y recordatorios a tiempo, con el tono de tu despacho.",
      },
    ],
  },
];

export function getSolution(slug: string) {
  return solutions.find((solution) => solution.slug === slug);
}
