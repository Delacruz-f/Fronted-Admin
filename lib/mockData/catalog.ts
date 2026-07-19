// lib/mockData/catalog.ts
// Módulo: Catálogo y Transacciones — Persona C

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sellerName: string;
  reportsCount: number;
  status: "Aprobado" | "Pendiente" | "Oculto" | "Reportado" | "Rechazado";
  imageUrl: string;
}

export interface Order {
  id: string;
  code: string;
  buyerName: string;
  sellerName: string;
  carrierName: string;
  date: string;
  amount: number;
  status:
    | "Pendiente"
    | "Pagado"
    | "Preparando"
    | "En ruta"
    | "Entregado"
    | "Cancelado"
    | "En disputa";
  buyerClaim?: string;
  sellerClaim?: string;
  disputeResolution?: string;
}

export interface Promotion {
  id: string;
  productName: string;
  sellerName: string;
  type:
    | "Destacado Principal"
    | "Producto Patrocinado"
    | "Banner Promocional"
    | "Promoción Regional";
  startDate: string;
  endDate: string;
  amountPaid: number;
  status: "Activo" | "Programado" | "Finalizado";
}

export const products: Product[] = [
  {
    id: "p1",
    name: "Caja de Tomates Orgánicos 10Kg",
    category: "Frutas y Verduras",
    price: 18.5,
    stock: 34,
    sellerName: "Carlos Mendoza (Fruver Organics)",
    reportsCount: 0,
    status: "Aprobado",
    imageUrl: "https://picsum.photos/seed/tomates/200/140",
  },
  {
    id: "p2",
    name: "Audífonos Bluetooth ElectroCl X200",
    category: "Tecnología",
    price: 42.0,
    stock: 12,
    sellerName: "María José (ElectroCl)",
    reportsCount: 0,
    status: "Pendiente",
    imageUrl: "https://picsum.photos/seed/audifonos/200/140",
  },
  {
    id: "p3",
    name: "Set de Living Muebles Sur 3 piezas",
    category: "Hogar y Muebles",
    price: 310.0,
    stock: 0,
    sellerName: "Roberto Tapia (Muebles Sur)",
    reportsCount: 3,
    status: "Reportado",
    imageUrl: "https://picsum.photos/seed/muebles/200/140",
  },
];

export const orders: Order[] = [
  {
    id: "o1",
    code: "PED-2026-0035",
    buyerName: "Juan Ignacio Pérez",
    sellerName: "Roberto Tapia (Muebles Sur)",
    carrierName: "MExpress",
    date: "2026-07-15",
    amount: 310.0,
    status: "En disputa",
    buyerClaim:
      "El sofá llegó con una pata rota y el embalaje estaba visiblemente dañado.",
    sellerClaim:
      "El producto salió en perfecto estado de bodega; la responsabilidad es del transportista.",
  },
  {
    id: "o2",
    code: "PED-2026-0041",
    buyerName: "Camila Rojas",
    sellerName: "Carlos Mendoza (Fruver Organics)",
    carrierName: "RutaSur",
    date: "2026-07-16",
    amount: 18.5,
    status: "En ruta",
  },
];

export const promotions: Promotion[] = [
  {
    id: "pr1",
    productName: "Caja de Tomates Orgánicos 10Kg",
    sellerName: "Carlos Mendoza (Fruver Organics)",
    type: "Destacado Principal",
    startDate: "2026-07-10",
    endDate: "2026-07-24",
    amountPaid: 150.0,
    status: "Activo",
  },
  {
    id: "pr2",
    productName: "Audífonos Bluetooth ElectroCl X200",
    sellerName: "María José (ElectroCl)",
    type: "Producto Patrocinado",
    startDate: "2026-07-12",
    endDate: "2026-07-19",
    amountPaid: 45.0,
    status: "Activo",
  },
];
