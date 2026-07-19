"use client";

// app/dashboard/pedidos/page.tsx — Propiedad: Persona C

import React, { useState } from "react";
import OrdersTab from "@/components/orders/OrdersTab";
import { useDashboard } from "@/lib/context/DashboardContext";
import { orders as initialOrders } from "@/lib/mockData";

export default function PedidosPage() {
  const { darkMode, showNotification } = useDashboard();
  const [orders, setOrders] = useState(initialOrders);

  return (
    <OrdersTab
      darkMode={darkMode}
      orders={orders}
      onUpdateOrders={setOrders}
      onShowNotification={showNotification}
    />
  );
}
