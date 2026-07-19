"use client";

// app/dashboard/chats/page.tsx — Propiedad: Persona D

import React, { useState } from "react";
import ChatsTab from "@/components/chats/ChatsTab";
import { useDashboard } from "@/lib/context/DashboardContext";
import { reportedChats as initialChats } from "@/lib/mockData";

export default function ChatsPage() {
  const { darkMode, showNotification, buyers, sellers, setBuyers, setSellers } = useDashboard();
  const [reportedChats, setReportedChats] = useState(initialChats);

  return (
    <ChatsTab
      darkMode={darkMode}
      reportedChats={reportedChats}
      buyers={buyers}
      sellers={sellers}
      onUpdateReportedChats={setReportedChats}
      onUpdateBuyers={setBuyers}
      onUpdateSellers={setSellers}
      onShowNotification={showNotification}
    />
  );
}
