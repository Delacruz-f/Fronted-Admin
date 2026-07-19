"use client";

// components/layout/Topbar.tsx — Propiedad: Persona A (líder)

import React from "react";
import { Sun, Moon, Search, Bell } from "lucide-react";
import { useDashboard } from "@/lib/context/DashboardContext";

export default function Topbar() {
  const { darkMode, toggleDarkMode } = useDashboard();

  return (
    <header
      className={`sticky top-0 z-40 flex items-center justify-between gap-4 px-6 py-3 border-b backdrop-blur-sm ${
        darkMode ? "bg-slate-950/80 border-slate-800" : "bg-white/80 border-slate-100"
      }`}
    >
      <div className="relative w-full max-w-sm hidden sm:block">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar en todo el panel..."
          className={`w-full pl-10 pr-4 py-2 text-xs rounded-xl border focus:outline-none ${
            darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
          }`}
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <button
          className={`p-2 rounded-lg border ${
            darkMode ? "border-slate-800 text-slate-300" : "border-slate-200 text-slate-600"
          }`}
        >
          <Bell className="h-4 w-4" />
        </button>
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-lg border ${
            darkMode ? "border-slate-800 text-amber-400" : "border-slate-200 text-slate-600"
          }`}
        >
          {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </header>
  );
}
