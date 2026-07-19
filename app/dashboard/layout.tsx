// app/dashboard/layout.tsx — Propiedad: Persona A (líder)

import React from "react";
import { DashboardProvider } from "@/lib/context/DashboardContext";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import NotificationToast from "@/components/layout/NotificationToast";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
      <NotificationToast />
    </DashboardProvider>
  );
}
