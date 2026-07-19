"use client";

// app/dashboard/page.tsx — Propiedad: Persona A (líder)

import React from "react";
import { useRouter } from "next/navigation";
import DashboardTab from "@/components/dashboard/DashboardTab";
import { useDashboard } from "@/lib/context/DashboardContext";
import { products, orders, reportedChats, supportTickets } from "@/lib/mockData";

const tabRoutes: Record<string, string> = {
  usuarios: "/dashboard/usuarios",
  pedidos: "/dashboard/pedidos",
  promociones: "/dashboard/promociones",
  chats: "/dashboard/chats",
  verificaciones: "/dashboard/verificaciones",
  soporte: "/dashboard/soporte",
  configuracion: "/dashboard/configuracion",
};

export default function DashboardPage() {
  const router = useRouter();
  const { darkMode, sellers, buyers, carriers, verifications } = useDashboard();

  return (
    <DashboardTab
      darkMode={darkMode}
      onNavigateToTab={(tabId) => {
        const target = tabRoutes[tabId];
        if (target) router.push(target);
      }}
      sellersCount={sellers.length}
      buyersCount={buyers.length}
      carriersCount={carriers.length}
      productsCount={products.length}
      ordersCount={orders.length}
      verificationsCount={verifications.filter((v) => v.status === "Pendiente").length}
      chatsCount={reportedChats.filter((c) => c.status === "Pendiente").length}
      ticketsCount={supportTickets.filter((t) => t.status !== "Cerrado").length}
    />
  );
}
