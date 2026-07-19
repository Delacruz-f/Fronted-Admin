"use client";

// app/dashboard/verificaciones/page.tsx — Propiedad: Persona B

import React from "react";
import VerificationsTab from "@/components/verifications/VerificationsTab";
import { useDashboard } from "@/lib/context/DashboardContext";

export default function VerificacionesPage() {
  const {
    darkMode,
    verifications,
    setVerifications,
    showNotification,
    sellers,
    setSellers,
    carriers,
    setCarriers,
  } = useDashboard();

  const handleApproveUser = (userId: string, userType: "Vendedor" | "Transportista") => {
    if (userType === "Vendedor") {
      setSellers(sellers.map((s) => (s.id === userId ? { ...s, status: "Aprobado" } : s)));
    } else {
      setCarriers(carriers.map((c) => (c.id === userId ? { ...c, status: "Aprobado" } : c)));
    }
  };

  const handleRejectUser = (userId: string, userType: "Vendedor" | "Transportista") => {
    if (userType === "Vendedor") {
      setSellers(sellers.map((s) => (s.id === userId ? { ...s, status: "Bloqueado" } : s)));
    } else {
      setCarriers(carriers.map((c) => (c.id === userId ? { ...c, status: "Suspendido" } : c)));
    }
  };

  return (
    <VerificationsTab
      darkMode={darkMode}
      verifications={verifications}
      onUpdateVerifications={setVerifications}
      onShowNotification={showNotification}
      onApproveUser={handleApproveUser}
      onRejectUser={handleRejectUser}
    />
  );
}
