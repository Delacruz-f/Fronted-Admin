"use client";

// app/dashboard/configuracion/page.tsx — Propiedad: Persona D

import React from "react";
import ConfigTab from "@/components/config/ConfigTab";
import { useDashboard } from "@/lib/context/DashboardContext";

export default function ConfiguracionPage() {
  const { darkMode, showNotification } = useDashboard();

  return <ConfigTab darkMode={darkMode} onShowNotification={showNotification} />;
}
