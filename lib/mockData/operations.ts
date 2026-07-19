// lib/mockData/operations.ts
// Módulo: Moderación, Soporte y Logística — Persona D

export interface ChatMessage {
  role: "buyer" | "seller";
  sender: string;
  timestamp: string;
  text: string;
}

export interface ReportedChat {
  id: string;
  buyerName: string;
  sellerName: string;
  reason: string;
  status: "Pendiente" | "Sancionado";
  scannedFlags: string[];
  messages: ChatMessage[];
}

export interface TicketReply {
  sender: string;
  text: string;
  date: string;
}

export interface SupportTicket {
  id: string;
  code: string;
  userName: string;
  userRole: string;
  category: string;
  subject: string;
  description: string;
  date: string;
  status: "Abierto" | "Escalado" | "Cerrado";
  replies: TicketReply[];
}

export const reportedChats: ReportedChat[] = [
  {
    id: "ch1",
    buyerName: "Juan Ignacio Pérez",
    sellerName: "Roberto Tapia (Muebles Sur)",
    reason: "Lenguaje ofensivo",
    status: "Pendiente",
    scannedFlags: ["insulto", "tono agresivo"],
    messages: [
      {
        role: "buyer",
        sender: "Juan Ignacio Pérez",
        timestamp: "10:32",
        text: "El mueble llegó roto, esto es una estafa.",
      },
      {
        role: "seller",
        sender: "Roberto Tapia",
        timestamp: "10:40",
        text: "No me hago responsable, deja de molestarme.",
      },
    ],
  },
  {
    id: "ch2",
    buyerName: "Camila Rojas",
    sellerName: "Roberto Tapia (Muebles Sur)",
    reason: "Sospecha de fraude",
    status: "Pendiente",
    scannedFlags: ["pago fuera de plataforma"],
    messages: [
      {
        role: "seller",
        sender: "Roberto Tapia",
        timestamp: "09:12",
        text: "Mejor págame directo por transferencia y te bajo el precio.",
      },
    ],
  },
];

export const supportTickets: SupportTicket[] = [
  {
    id: "t1",
    code: "TCK-1042",
    userName: "Camila Rojas",
    userRole: "Comprador",
    category: "Entregas",
    subject: "Pedido no ha llegado",
    description: "Mi pedido PED-2026-0041 debía llegar ayer y aún no tengo noticias del transportista.",
    date: "2026-07-17",
    status: "Abierto",
    replies: [],
  },
  {
    id: "t2",
    code: "TCK-1039",
    userName: "María José (ElectroCl)",
    userRole: "Vendedor",
    category: "Pagos",
    subject: "Comisión cobrada incorrectamente",
    description: "Se me descontó más comisión de la acordada en mi última venta.",
    date: "2026-07-15",
    status: "Escalado",
    replies: [
      {
        sender: "Soporte",
        text: "Estamos revisando tu caso con el equipo de finanzas, te contactaremos pronto.",
        date: "2026-07-16",
      },
    ],
  },
];
