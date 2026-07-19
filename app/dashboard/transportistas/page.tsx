"use client";

// app/dashboard/transportistas/page.tsx — Propiedad: Persona D

import React from "react";
import TransportersTab from "@/components/transporters/TransportersTab";
import { useDashboard } from "@/lib/context/DashboardContext";

export default function TransportistasPage() {
  const { darkMode, carriers, setCarriers, showNotification } = useDashboard();

  return (
    <TransportersTab
      darkMode={darkMode}
      carriers={carriers}
      onUpdateCarriers={setCarriers}
      onShowNotification={showNotification}
    />
  );
}
