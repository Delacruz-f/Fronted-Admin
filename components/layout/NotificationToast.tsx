"use client";

// components/layout/NotificationToast.tsx — Propiedad: Persona A (líder)

import React from "react";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { useDashboard } from "@/lib/context/DashboardContext";

export default function NotificationToast() {
  const { notifications } = useDashboard();

  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2 w-80">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`p-3 rounded-xl border shadow-md flex items-center gap-2 text-xs font-semibold ${
            n.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : n.type === "warning"
              ? "bg-amber-50 border-amber-200 text-amber-700"
              : "bg-rose-50 border-rose-200 text-rose-700"
          }`}
        >
          {n.type === "success" && <CheckCircle2 className="h-4 w-4 shrink-0" />}
          {n.type === "warning" && <AlertTriangle className="h-4 w-4 shrink-0" />}
          {n.type === "error" && <XCircle className="h-4 w-4 shrink-0" />}
          <span>{n.text}</span>
        </div>
      ))}
    </div>
  );
}
