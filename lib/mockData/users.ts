// lib/mockData/users.ts
// Módulo: Usuarios y Verificaciones — Persona B

export interface Seller {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  dni: string;
  registerDate: string;
  productsCount: number;
  rating: number;
  status: "Aprobado" | "Pendiente" | "Suspendido" | "Bloqueado";
}

export interface Buyer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  registerDate: string;
  purchasesCount: number;
  totalSpent: number;
  reportsReceived: number;
  claimsMade: number;
  status: "Activo" | "Suspendido";
}

export interface Carrier {
  id: string;
  name: string;
  avatar: string;
  license: string;
  routes: string[];
  fare: string;
  rating: number;
  deliveriesCount: number;
  status: "Aprobado" | "Pendiente" | "Suspendido";
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "Super Administrador" | "Administrador General" | "Moderador" | "Soporte";
  status: "Activo" | "Inactivo";
}

export interface VerificationRequest {
  id: string;
  userId: string;
  userName: string;
  userType: "Vendedor" | "Transportista";
  email: string;
  dni: string;
  registerDate: string;
  communalRef: string;
  companyInfo?: string;
  selfieUrl: string;
  dniFrontUrl: string;
  status: "Pendiente" | "Aprobado" | "Rechazado";
}

export const sellers: Seller[] = [
  {
    id: "s1",
    name: "Carlos Mendoza (Fruver Organics)",
    email: "carlos@fruverorganics.cl",
    phone: "+56 9 1234 5678",
    avatar: "https://i.pravatar.cc/150?u=s1",
    dni: "12.345.678-9",
    registerDate: "2026-05-12",
    productsCount: 24,
    rating: 4.8,
    status: "Aprobado",
  },
  {
    id: "s2",
    name: "María José (ElectroCl)",
    email: "mariajose@electrocl.cl",
    phone: "+56 9 8765 4321",
    avatar: "https://i.pravatar.cc/150?u=s2",
    dni: "15.678.234-1",
    registerDate: "2026-07-10",
    productsCount: 8,
    rating: 4.2,
    status: "Pendiente",
  },
  {
    id: "s3",
    name: "Roberto Tapia (Muebles Sur)",
    email: "roberto@mueblessur.cl",
    phone: "+56 9 5555 1122",
    avatar: "https://i.pravatar.cc/150?u=s3",
    dni: "10.222.333-4",
    registerDate: "2026-03-02",
    productsCount: 15,
    rating: 3.9,
    status: "Aprobado",
  },
];

export const buyers: Buyer[] = [
  {
    id: "b1",
    name: "Juan Ignacio Pérez",
    email: "juan.perez@gmail.com",
    phone: "+56 9 3344 5566",
    avatar: "https://i.pravatar.cc/150?u=b1",
    registerDate: "2026-04-18",
    purchasesCount: 12,
    totalSpent: 340,
    reportsReceived: 1,
    claimsMade: 2,
    status: "Activo",
  },
  {
    id: "b2",
    name: "Camila Rojas",
    email: "camila.rojas@gmail.com",
    phone: "+56 9 7788 9900",
    avatar: "https://i.pravatar.cc/150?u=b2",
    registerDate: "2026-06-01",
    purchasesCount: 5,
    totalSpent: 120,
    reportsReceived: 0,
    claimsMade: 0,
    status: "Activo",
  },
];

export const carriers: Carrier[] = [
  {
    id: "c1",
    name: "Mateo Fuentes (MExpress)",
    avatar: "https://i.pravatar.cc/150?u=c1",
    license: "TR-2026-0091",
    routes: ["Santiago-Norte", "Rancagua-Talca"],
    fare: "S/ 20.00 (tarifa base)",
    rating: 4.7,
    deliveriesCount: 210,
    status: "Aprobado",
  },
  {
    id: "c2",
    name: "Gabriel Soto (RutaSur)",
    avatar: "https://i.pravatar.cc/150?u=c2",
    license: "TR-2026-0114",
    routes: ["Rancagua-Talca"],
    fare: "S/ 18.00 (tarifa base)",
    rating: 4.3,
    deliveriesCount: 95,
    status: "Pendiente",
  },
];

export const admins: AdminUser[] = [
  {
    id: "a1",
    name: "Austin (Titular)",
    email: "austin@coramarket.com",
    role: "Super Administrador",
    status: "Activo",
  },
];

export const verificationRequests: VerificationRequest[] = [
  {
    id: "v1",
    userId: "s2",
    userName: "María José (ElectroCl)",
    userType: "Vendedor",
    email: "mariajose@electrocl.cl",
    dni: "15.678.234-1",
    registerDate: "2026-07-10",
    communalRef: "Municipalidad de Ñuñoa",
    companyInfo: "ElectroCl SpA, giro: venta de electrodomésticos",
    selfieUrl: "https://i.pravatar.cc/300?u=v1-selfie",
    dniFrontUrl: "https://i.pravatar.cc/300?u=v1-dni",
    status: "Pendiente",
  },
  {
    id: "v2",
    userId: "c2",
    userName: "Gabriel Soto (RutaSur)",
    userType: "Transportista",
    email: "gabriel.soto@rutasur.cl",
    dni: "18.111.222-3",
    registerDate: "2026-07-08",
    communalRef: "Municipalidad de Rancagua",
    selfieUrl: "https://i.pravatar.cc/300?u=v2-selfie",
    dniFrontUrl: "https://i.pravatar.cc/300?u=v2-dni",
    status: "Pendiente",
  },
];
