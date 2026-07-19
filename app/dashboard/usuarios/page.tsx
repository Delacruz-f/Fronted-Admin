"use client";

// app/dashboard/usuarios/page.tsx — Propiedad: Persona B

import React from "react";
import UsersTab from "@/components/users/UsersTab";
import { useDashboard } from "@/lib/context/DashboardContext";

export default function UsuariosPage() {
  const {
    darkMode,
    sellers,
    buyers,
    carriers,
    admins,
    setSellers,
    setBuyers,
    setCarriers,
    setAdmins,
    showNotification,
  } = useDashboard();

  return (
    <UsersTab
      darkMode={darkMode}
      sellers={sellers}
      buyers={buyers}
      carriers={carriers}
      admins={admins}
      onUpdateSellers={setSellers}
      onUpdateBuyers={setBuyers}
      onUpdateCarriers={setCarriers}
      onUpdateAdmins={setAdmins}
      onShowNotification={showNotification}
    />
  );
}
