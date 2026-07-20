"use client";

// app/dashboard/reportes/page.tsx — Módulo nuevo: Reportes y Analítica

import React from "react";
import ReportsTab from "@/components/reports/ReportsTab";
import { useDashboard } from "@/lib/context/DashboardContext";
import { products, orders, promotions, reportedChats } from "@/lib/mockData";

export default function ReportesPage() {
  const { darkMode, sellers, buyers, showNotification } = useDashboard();

  return (
    <ReportsTab
      darkMode={darkMode}
      sellers={sellers}
      buyers={buyers}
      products={products}
      orders={orders}
      promotions={promotions}
      reportedChats={reportedChats}
      onShowNotification={showNotification}
    />
  );
}
