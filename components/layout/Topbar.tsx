"use client";

// components/layout/Topbar.tsx — Propiedad: Persona A (líder)

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Sun, Moon, Search, Bell, X, Menu } from "lucide-react";
import { useDashboard } from "@/lib/context/DashboardContext";
import {
  products,
  orders,
  promotions,
  reportedChats,
  supportTickets,
} from "@/lib/mockData";

// --- Utilidades de búsqueda con tolerancia a errores de tipeo ---

function normalize(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function levenshtein(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, () =>
    new Array(b.length + 1).fill(0)
  );
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

// Coincide si el texto contiene el término, o si alguna palabra del
// texto es "parecida" al término buscado (tolera 1-2 errores de tipeo).
function fuzzyMatch(haystack: string, needle: string): boolean {
  const h = normalize(haystack);
  const n = normalize(needle);
  if (!n) return false;
  if (h.includes(n)) return true;

  const tolerance = n.length <= 4 ? 1 : 2;
  const words = h.split(/\s+/);
  return words.some((w) => {
    if (Math.abs(w.length - n.length) > tolerance + 1) return false;
    return levenshtein(w, n) <= tolerance;
  });
}

interface SearchResult {
  id: string;
  label: string;
  meta: string;
  route: string;
}

const navTargets: { label: string; route: string }[] = [
  { label: "Panel", route: "/dashboard" },
  { label: "Usuarios", route: "/dashboard/usuarios" },
  { label: "Verificaciones", route: "/dashboard/verificaciones" },
  { label: "Administradores", route: "/dashboard/administradores" },
  { label: "Productos", route: "/dashboard/productos" },
  { label: "Pedidos", route: "/dashboard/pedidos" },
  { label: "Promociones", route: "/dashboard/promociones" },
  { label: "Transportistas", route: "/dashboard/transportistas" },
  { label: "Chats y Moderación", route: "/dashboard/chats" },
  { label: "Soporte", route: "/dashboard/soporte" },
  { label: "Reportes", route: "/dashboard/reportes" },
  { label: "Configuración", route: "/dashboard/configuracion" },
];

export default function Topbar() {
  const router = useRouter();
  const {
    darkMode,
    toggleDarkMode,
    toggleMobileMenu,
    sellers,
    buyers,
    carriers,
    verifications,
    admins,
  } = useDashboard();

  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // Índice combinado: módulos + entidades de todos los módulos.
  const searchIndex = useMemo<SearchResult[]>(() => {
    const items: SearchResult[] = [];

    navTargets.forEach((n) =>
      items.push({ id: `nav-${n.route}`, label: n.label, meta: "Módulo", route: n.route })
    );

    sellers.forEach((s) =>
      items.push({ id: `s-${s.id}`, label: s.name, meta: `Vendedor · ${s.status}`, route: "/dashboard/usuarios" })
    );
    buyers.forEach((b) =>
      items.push({ id: `b-${b.id}`, label: b.name, meta: `Comprador · ${b.status}`, route: "/dashboard/usuarios" })
    );
    carriers.forEach((c) =>
      items.push({ id: `c-${c.id}`, label: c.name, meta: `Transportista · ${c.status}`, route: "/dashboard/transportistas" })
    );
    verifications.forEach((v) =>
      items.push({ id: `v-${v.id}`, label: v.userName, meta: `Verificación KYC · ${v.status}`, route: "/dashboard/verificaciones" })
    );
    admins.forEach((a) =>
      items.push({ id: `adm-${a.id}`, label: a.name, meta: `Administrador · ${a.role}`, route: "/dashboard/administradores" })
    );
    products.forEach((p) =>
      items.push({ id: `p-${p.id}`, label: p.name, meta: `Producto · ${p.sellerName}`, route: "/dashboard/productos" })
    );
    orders.forEach((o) =>
      items.push({ id: `o-${o.id}`, label: o.code, meta: `Pedido · ${o.status}`, route: "/dashboard/pedidos" })
    );
    promotions.forEach((pr) =>
      items.push({ id: `pr-${pr.id}`, label: pr.productName, meta: `Promoción · ${pr.type}`, route: "/dashboard/promociones" })
    );
    reportedChats.forEach((ch) =>
      items.push({
        id: `ch-${ch.id}`,
        label: `${ch.buyerName} ⇄ ${ch.sellerName}`,
        meta: `Chat denunciado · ${ch.reason}`,
        route: "/dashboard/chats",
      })
    );
    supportTickets.forEach((t) =>
      items.push({ id: `t-${t.id}`, label: t.subject, meta: `Ticket ${t.code} · ${t.userName}`, route: "/dashboard/soporte" })
    );

    return items;
  }, [sellers, buyers, carriers, verifications, admins]);

  const results = useMemo<SearchResult[]>(() => {
    if (!query.trim()) return [];
    return searchIndex
      .filter((item) => fuzzyMatch(item.label, query) || fuzzyMatch(item.meta, query))
      .slice(0, 8);
  }, [query, searchIndex]);

  const goTo = (route: string) => {
    router.push(route);
    setQuery("");
    setIsFocused(false);
  };

  return (
    <header
      className={`sticky top-0 z-30 flex items-center justify-between gap-3 px-4 md:px-6 py-3 border-b backdrop-blur-sm ${
        darkMode ? "bg-slate-950/80 border-slate-800" : "bg-white/80 border-slate-100"
      }`}
    >
      {/* Botón hamburguesa, solo visible en móvil */}
      <button
        onClick={toggleMobileMenu}
        className={`md:hidden shrink-0 p-2 rounded-lg border ${
          darkMode ? "border-slate-800 text-slate-300" : "border-slate-200 text-slate-600"
        }`}
      >
        <Menu className="h-4 w-4" />
      </button>

      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 z-10" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          placeholder="Buscar en todo el panel..."
          className={`w-full pl-10 pr-8 py-2 text-xs rounded-xl border focus:outline-none relative ${
            darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
          }`}
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-200 z-10"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}

        {/* Resultados */}
        {isFocused && query && (
          <div
            className={`absolute top-full mt-2 w-full rounded-xl border shadow-lg overflow-hidden z-50 ${
              darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
            }`}
          >
            {results.length === 0 ? (
              <div className="p-4 text-xs text-slate-400 text-center">
                Sin resultados para &quot;{query}&quot;
              </div>
            ) : (
              <ul className="max-h-80 overflow-y-auto py-1">
                {results.map((r) => (
                  <li key={r.id}>
                    <button
                      onClick={() => goTo(r.route)}
                      className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between gap-3 transition-colors ${
                        darkMode ? "hover:bg-slate-850 text-slate-200" : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <span className="font-semibold truncate">{r.label}</span>
                      <span className="text-[10px] text-slate-400 shrink-0">{r.meta}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 ml-auto shrink-0">
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
