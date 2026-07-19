"use client";


import React, { useState } from "react";
import PromotionsTab from "@/components/promotions/PromotionsTab";
import { useDashboard } from "@/lib/context/DashboardContext";
import { promotions as initialPromotions } from "@/lib/mockData";

export default function PromocionesPage() {
  const { darkMode, showNotification } = useDashboard();
  const [promotions, setPromotions] = useState(initialPromotions);

  return (
    <PromotionsTab
      darkMode={darkMode}
      promotions={promotions}
      onUpdatePromotions={setPromotions}
      onShowNotification={showNotification}
    />
  );
}