"use client";

// app/dashboard/soporte/page.tsx — Propiedad: Persona D

import React, { useState } from "react";
import SupportTab from "@/components/support/SupportTab";
import { useDashboard } from "@/lib/context/DashboardContext";
import { supportTickets as initialTickets } from "@/lib/mockData";

export default function SoportePage() {
  const { darkMode, showNotification } = useDashboard();
  const [tickets, setTickets] = useState(initialTickets);

  return (
    <SupportTab
      darkMode={darkMode}
      tickets={tickets}
      onUpdateTickets={setTickets}
      onShowNotification={showNotification}
    />
  );
}
