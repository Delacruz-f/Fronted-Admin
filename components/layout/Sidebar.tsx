"use client";

// components/layout/Sidebar.tsx — Propiedad: Persona A (líder)

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Package,
  ShoppingBag,
  Sparkles,
  Truck,
  MessageSquare,
  HelpCircle,
  Settings,
  Store,
  X,
} from "lucide-react";
import { useDashboard } from "@/lib/context/DashboardContext";

const navItems = [
  { href: "/dashboard", label: "Panel", icon: LayoutDashboard },
  { href: "/dashboard/usuarios", label: "Usuarios", icon: Users },
  { href: "/dashboard/verificaciones", label: "Verificaciones", icon: ShieldCheck },
  { href: "/dashboard/productos", label: "Productos", icon: Package },
  { href: "/dashboard/pedidos", label: "Pedidos", icon: ShoppingBag },
  { href: "/dashboard/promociones", label: "Promociones", icon: Sparkles },
  { href: "/dashboard/transportistas", label: "Transportistas", icon: Truck },
  { href: "/dashboard/chats", label: "Chats y Moderación", icon: MessageSquare },
  { href: "/dashboard/soporte", label: "Soporte", icon: HelpCircle },
  { href: "/dashboard/configuracion", label: "Configuración", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { darkMode, mobileMenuOpen, setMobileMenuOpen } = useDashboard();

  return (
    <>
      {/* Fondo oscuro detrás del menú, solo visible en móvil cuando está abierto */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-50 flex flex-col w-64 shrink-0 border-r h-screen transition-transform duration-200 ease-out
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
          ${darkMode ? "bg-slate-950 border-slate-800" : "bg-white border-slate-100"}`}
      >
        <div className="p-5 flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Store className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="font-bold text-sm tracking-tight">CoraMarket Admin</span>
          </div>

          {/* Botón cerrar, solo en móvil */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className={`md:hidden p-1.5 rounded-lg ${
              darkMode ? "text-slate-400 hover:bg-slate-900" : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  active
                    ? "bg-indigo-600 text-white"
                    : darkMode
                    ? "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
