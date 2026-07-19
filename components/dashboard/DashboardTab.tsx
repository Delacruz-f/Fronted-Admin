"use client";

// components/dashboard/DashboardTab.tsx — Propiedad: Persona A (líder)

import React, { useState } from "react";
import { 
  Users, ShoppingBag, TrendingUp, AlertTriangle, ShieldAlert, DollarSign, 
  Package, Truck, ArrowUpRight, CheckCircle2, ChevronRight, Clock
} from "lucide-react";

interface DashboardTabProps {
  darkMode: boolean;
  onNavigateToTab: (tabId: string) => void;
  sellersCount: number;
  buyersCount: number;
  carriersCount: number;
  productsCount: number;
  ordersCount: number;
  verificationsCount: number;
  chatsCount: number;
  ticketsCount: number;
}

export default function DashboardTab({
  darkMode,
  onNavigateToTab,
  sellersCount,
  buyersCount,
  carriersCount,
  productsCount,
  ordersCount,
  verificationsCount,
  chatsCount,
  ticketsCount,
}: DashboardTabProps) {
  const [timeFilter, setTimeFilter] = useState<"Diario" | "Semanal" | "Mensual">("Semanal");
  const [hoveredDataIndex, setHoveredDataIndex] = useState<number | null>(null);

  // Growth Chart Data
  const growthData = {
    Diario: [
      { label: "Lun", ventas: 1200, promociones: 350 },
      { label: "Mar", ventas: 1900, promociones: 400 },
      { label: "Mié", ventas: 1500, promociones: 310 },
      { label: "Jue", ventas: 2400, promociones: 450 },
      { label: "Vie", ventas: 2800, promociones: 600 },
      { label: "Sáb", ventas: 3500, promociones: 750 },
      { label: "Dom", ventas: 3100, promociones: 500 },
    ],
    Semanal: [
      { label: "Sem 1", ventas: 8400, promociones: 2100 },
      { label: "Sem 2", ventas: 9900, promociones: 2400 },
      { label: "Sem 3", ventas: 11200, promociones: 2850 },
      { label: "Sem 4", ventas: 14890, promociones: 3200 },
    ],
    Mensual: [
      { label: "Ene", ventas: 24000, promociones: 5200 },
      { label: "Feb", ventas: 28000, promociones: 6100 },
      { label: "Mar", ventas: 32000, promociones: 7500 },
      { label: "Abr", ventas: 38000, promociones: 8400 },
      { label: "May", ventas: 45000, promociones: 9600 },
      { label: "Jun", ventas: 54000, promociones: 11200 },
      { label: "Jul", ventas: 62000, promociones: 14890 },
    ],
  };

  const currentGrowthData = growthData[timeFilter];

  // Category Distribution
  const categoryData = [
    { name: "Frutas y Verduras", percent: 35, color: "#10b981", val: "$5,211" },
    { name: "Tecnología", percent: 28, color: "#3b82f6", val: "$4,169" },
    { name: "Hogar y Muebles", percent: 20, color: "#f59e0b", val: "$2,978" },
    { name: "Ropa y Calzado", percent: 17, color: "#8b5cf6", val: "$2,532" },
  ];

  const recentActivities = [
    { id: 1, type: "user", text: "Nueva vendedora 'María José (ElectroCl)' registrada.", time: "Hace 10 mins", status: "Pendiente Verificación" },
    { id: 2, type: "report", text: "Conversación entre Juan y Carlos denunciada por lenguaje ofensivo.", time: "Hace 25 mins", status: "Crítico" },
    { id: 3, type: "verification", text: "Carlos Mendoza (Fruver Organics) completó verificación de DNI.", time: "Hace 1 hora", status: "Aprobado" },
    { id: 4, type: "order", text: "Pedido PED-2026-0035 cambió estado a 'En Disputa'.", time: "Hace 2 horas", status: "Atención" },
    { id: 5, type: "promotion", text: "Se activó Destacado Principal para 'Caja de Tomates Orgánicos'.", time: "Hace 4 horas", status: "Activo" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Hero / Quick Overview */}
      <div className={`p-6 rounded-2xl border transition-all ${
        darkMode 
       ? "bg-slate-900 border-slate-800"
    : "bg-white border-slate-100"
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Panel Administrativo RantiAdmin</h1>
            <p className={`mt-1 text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              Monitoreo general de seguridad, moderación y crecimiento de la plataforma en tiempo real.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className={`text-xs font-medium ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
              Sincronizado: 12,450 usuarios activos
            </span>
          </div>
        </div>
      </div>

      {/* Grid of 4 Key Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Users & Safety */}
        <div 
          onClick={() => onNavigateToTab("usuarios")}
          className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer hover:scale-[1.01] ${
            darkMode ? "bg-slate-900 hover:bg-slate-850 border-slate-800" : "bg-white hover:shadow-sm border-slate-100"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className={`p-2.5 rounded-xl ${darkMode ? "bg-indigo-950 text-indigo-400" : "bg-indigo-50 text-indigo-600"}`}>
              <Users className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
              +14% sem.
            </span>
          </div>
          <div className="mt-4">
            <p className={`text-xs font-medium uppercase tracking-wider ${darkMode ? "text-slate-400" : "text-slate-400"}`}>
              Usuarios Registrados
            </p>
            <h3 className="text-2xl font-semibold mt-1">12,450</h3>
            <div className="flex items-center gap-1.5 mt-2 text-xs">
              <span className={`font-semibold ${darkMode ? "text-indigo-400" : "text-indigo-600"}`}>
                {sellersCount} Ven / {buyersCount} Com / {carriersCount} Trans
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Transactions / Pedidos */}
        <div 
          onClick={() => onNavigateToTab("pedidos")}
          className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer hover:scale-[1.01] ${
            darkMode ? "bg-slate-900 hover:bg-slate-850 border-slate-800" : "bg-white hover:shadow-sm border-slate-100"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className={`p-2.5 rounded-xl ${darkMode ? "bg-emerald-950 text-emerald-400" : "bg-emerald-50 text-emerald-600"}`}>
              <ShoppingBag className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
              +8.3k total
            </span>
          </div>
          <div className="mt-4">
            <p className={`text-xs font-medium uppercase tracking-wider ${darkMode ? "text-slate-400" : "text-slate-400"}`}>
              Transacciones y Pedidos
            </p>
            <h3 className="text-2xl font-semibold mt-1">{ordersCount + 28400}</h3>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
              <span>{productsCount} productos publicados</span>
            </div>
          </div>
        </div>

        {/* Card 3: Promociones e Ingresos */}
        <div 
          onClick={() => onNavigateToTab("promociones")}
          className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer hover:scale-[1.01] ${
            darkMode ? "bg-slate-900 hover:bg-slate-850 border-slate-800" : "bg-white hover:shadow-sm border-slate-100"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className={`p-2.5 rounded-xl ${darkMode ? "bg-amber-950 text-amber-400" : "bg-amber-50 text-amber-600"}`}>
              <DollarSign className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600">
              SaaS Activo
            </span>
          </div>
          <div className="mt-4">
            <p className={`text-xs font-medium uppercase tracking-wider ${darkMode ? "text-slate-400" : "text-slate-400"}`}>
              Ingresos por Promoción
            </p>
            <h3 className="text-2xl font-semibold mt-1">$14,890 USD</h3>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
              <span>Publicidad, destacados y banners</span>
            </div>
          </div>
        </div>

        {/* Card 4: Alertas y Moderación */}
        <div 
          onClick={() => onNavigateToTab("chats")}
          className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer hover:scale-[1.01] ${
            darkMode ? "bg-slate-900 hover:bg-slate-850 border-slate-800" : "bg-white hover:shadow-sm border-slate-100"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className={`p-2.5 rounded-xl ${darkMode ? "bg-rose-950 text-rose-400" : "bg-rose-50 text-rose-600"}`}>
              <ShieldAlert className="h-5 w-5" />
            </div>
            {chatsCount > 0 ? (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-500 animate-pulse">
                {chatsCount} pendientes
              </span>
            ) : (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
                Limpio
              </span>
            )}
          </div>
          <div className="mt-4">
            <p className={`text-xs font-medium uppercase tracking-wider ${darkMode ? "text-slate-400" : "text-slate-400"}`}>
              Incidentes y Reclamos
            </p>
            <h3 className="text-2xl font-semibold mt-1">{chatsCount + verificationsCount + ticketsCount}</h3>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
              <span>{verificationsCount} KYC / {chatsCount} Chats / {ticketsCount} Soporte</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts & Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 1. Growth Area Chart (SVG) */}
        <div className={`p-5 rounded-2xl border lg:col-span-2 ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h4 className="font-semibold text-lg">Crecimiento Comercial y Tráfico</h4>
              <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                Volumen comercializado e ingresos mensuales en Ranti
              </p>
            </div>
            {/* Filter Toggle */}
            <div className={`flex items-center p-0.5 rounded-lg border ${darkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-150"}`}>
              {(["Diario", "Semanal", "Mensual"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTimeFilter(filter)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    timeFilter === filter
                      ? darkMode 
                        ? "bg-slate-800 text-white shadow-sm" 
                        : "bg-white text-slate-800 shadow-sm"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Custom Area/Line Chart */}
          <div className="relative h-64 w-full">
            <svg viewBox="0 0 500 220" className="w-full h-full">
              {/* Grid Lines */}
              <line x1="40" y1="20" x2="480" y2="20" stroke={darkMode ? "#1e293b" : "#f1f5f9"} strokeDasharray="3 3" />
              <line x1="40" y1="70" x2="480" y2="70" stroke={darkMode ? "#1e293b" : "#f1f5f9"} strokeDasharray="3 3" />
              <line x1="40" y1="120" x2="480" y2="120" stroke={darkMode ? "#1e293b" : "#f1f5f9"} strokeDasharray="3 3" />
              <line x1="40" y1="170" x2="480" y2="170" stroke={darkMode ? "#1e293b" : "#f1f5f9"} strokeDasharray="3 3" />
              <line x1="40" y1="170" x2="480" y2="170" stroke={darkMode ? "#334155" : "#cbd5e1"} strokeWidth="1" />

              {/* Dynamic calculations for SVG graph paths */}
              {(() => {
                const count = currentGrowthData.length;
                const stepX = 410 / (count - 1 || 1);
                
                // Max values to scale coordinates
                const maxVentas = Math.max(...currentGrowthData.map(d => d.ventas)) * 1.15;
                const maxProm = Math.max(...currentGrowthData.map(d => d.promociones)) * 1.15;

                const getCoordinates = (value: number, isVentas: boolean) => {
                  const maxVal = isVentas ? maxVentas : maxProm;
                  const ratio = value / maxVal;
                  return 170 - (ratio * 130); // scale within 20 to 170 y-axis
                };

                // Generate points
                const ventasPoints = currentGrowthData.map((d, i) => {
                  const x = 40 + i * stepX;
                  const y = getCoordinates(d.ventas, true);
                  return `${x},${y}`;
                });

                const promPoints = currentGrowthData.map((d, i) => {
                  const x = 40 + i * stepX;
                  const y = getCoordinates(d.promociones, false);
                  return `${x},${y}`;
                });

                const ventasPathStr = `M ${ventasPoints.join(" L ")}`;
                const promPathStr = `M ${promPoints.join(" L ")}`;

                const ventasAreaStr = `${ventasPathStr} L ${40 + (count-1)*stepX},170 L 40,170 Z`;
                const promAreaStr = `${promPathStr} L ${40 + (count-1)*stepX},170 L 40,170 Z`;

                return (
                  <>
                    {/* Areas */}
                    <path d={ventasAreaStr} fill="url(#ventasGradient)" opacity={darkMode ? "0.15" : "0.08"} />
                    <path d={promAreaStr} fill="url(#promGradient)" opacity={darkMode ? "0.2" : "0.1"} />

                    {/* Gradient Defs */}
                    <defs>
                      <linearGradient id="ventasGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="promGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {/* Lines */}
                    <path d={ventasPathStr} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d={promPathStr} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                    {/* Interactivity circles */}
                    {currentGrowthData.map((d, i) => {
                      const x = 40 + i * stepX;
                      const yVentas = getCoordinates(d.ventas, true);
                      const yProm = getCoordinates(d.promociones, false);

                      return (
                        <g key={i}>
                          {/* Ventas Dot */}
                          <circle 
                            cx={x} cy={yVentas} r="4" 
                            fill={darkMode ? "#0f172a" : "#ffffff"} 
                            stroke="#10b981" strokeWidth="2" 
                            className="cursor-pointer"
                            onMouseEnter={() => setHoveredDataIndex(i)}
                            onMouseLeave={() => setHoveredDataIndex(null)}
                          />
                          {/* Prom Dot */}
                          <circle 
                            cx={x} cy={yProm} r="4" 
                            fill={darkMode ? "#0f172a" : "#ffffff"} 
                            stroke="#6366f1" strokeWidth="2" 
                            className="cursor-pointer"
                            onMouseEnter={() => setHoveredDataIndex(i)}
                            onMouseLeave={() => setHoveredDataIndex(null)}
                          />

                          {/* X-Axis labels */}
                          <text 
                            x={x} y="195" 
                            textAnchor="middle" 
                            fontSize="9" 
                            fill={darkMode ? "#94a3b8" : "#64748b"}
                            fontWeight="500"
                          >
                            {d.label}
                          </text>
                        </g>
                      );
                    })}
                  </>
                );
              })()}

              {/* Y-Axis scale */}
              <text x="32" y="24" textAnchor="end" fontSize="8" fill={darkMode ? "#64748b" : "#94a3b8"}>Max</text>
              <text x="32" y="95" textAnchor="end" fontSize="8" fill={darkMode ? "#64748b" : "#94a3b8"}>Med</text>
              <text x="32" y="173" textAnchor="end" fontSize="8" fill={darkMode ? "#64748b" : "#94a3b8"}>0</text>
            </svg>

            {/* Interactive tooltip floating element */}
            {hoveredDataIndex !== null && (
              <div 
                className={`absolute p-3 rounded-lg border text-xs shadow-md top-2 left-[50%] -translate-x-[50%] flex items-center gap-4 transition-all ${
                  darkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800"
                }`}
              >
                <div>
                  <span className="text-slate-400 block font-medium">Periodo</span>
                  <span className="font-semibold block text-sm">{currentGrowthData[hoveredDataIndex].label}</span>
                </div>
                <div className="border-l border-slate-800 pl-3">
                  <span className="text-emerald-500 block font-semibold flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Ventas: ${currentGrowthData[hoveredDataIndex].ventas.toLocaleString()}
                  </span>
                  <span className="text-indigo-400 block font-semibold flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    Promociones: ${currentGrowthData[hoveredDataIndex].promociones.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Chart Legends */}
          <div className="flex items-center gap-6 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-md bg-emerald-500 block" />
              <span className={darkMode ? "text-slate-300" : "text-slate-600 font-medium"}>Volumen total de Ventas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-md bg-indigo-500 block" />
              <span className={darkMode ? "text-slate-300" : "text-slate-600 font-medium"}>Ingresos por Promociones (SaaS)</span>
            </div>
          </div>
        </div>

        {/* 2. Category Distribution Donut Chart (SVG) */}
        <div className={`p-5 rounded-2xl border ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
        }`}>
          <h4 className="font-semibold text-lg">Ventas por Categoría</h4>
          <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            Distribución proporcional del valor comercializado
          </p>

          <div className="flex flex-col items-center justify-center py-6">
            <div className="relative h-40 w-40">
              <svg viewBox="0 0 100 100" className="w-full h-full rotate-[-90deg]">
                {/* Simulated Segment Rings */}
                {/* Total = 100 */}
                {/* Segment 1: Frutas y Verduras (35) -> strokeDasharray="35 65" strokeDashoffset="0" */}
                <circle cx="50" cy="50" r="35" fill="transparent" stroke="#10b981" strokeWidth="12" strokeDasharray="35 65" strokeDashoffset="0" />
                {/* Segment 2: Tecnología (28) -> strokeDasharray="28 72" strokeDashoffset="-35" */}
                <circle cx="50" cy="50" r="35" fill="transparent" stroke="#3b82f6" strokeWidth="12" strokeDasharray="28 72" strokeDashoffset="-35" />
                {/* Segment 3: Hogar y Muebles (20) -> strokeDasharray="20 80" strokeDashoffset="-63" */}
                <circle cx="50" cy="50" r="35" fill="transparent" stroke="#f59e0b" strokeWidth="12" strokeDasharray="20 80" strokeDashoffset="-63" />
                {/* Segment 4: Ropa y Calzado (17) -> strokeDasharray="17 83" strokeDashoffset="-83" */}
                <circle cx="50" cy="50" r="35" fill="transparent" stroke="#8b5cf6" strokeWidth="12" strokeDasharray="17 83" strokeDashoffset="-83" />
              </svg>
              {/* Inner Circle Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Total Estimado</span>
                <span className="text-xl font-bold font-mono">$14.8k</span>
              </div>
            </div>

            {/* Legend indicators */}
            <div className="mt-5 w-full space-y-2">
              {categoryData.map((cat, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className={darkMode ? "text-slate-300" : "text-slate-600"}>{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono font-medium">
                    <span className={darkMode ? "text-slate-400" : "text-slate-500"}>{cat.percent}%</span>
                    <span className="font-semibold">{cat.val}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Activity Log & Quick Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Activity Feed */}
        <div className={`p-5 rounded-2xl border lg:col-span-2 ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-semibold text-lg">Actividad Reciente del Sistema</h4>
              <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                Acciones registradas automáticamente en la plataforma
              </p>
            </div>
            <button className={`text-xs font-semibold px-3 py-1 rounded-lg border flex items-center gap-1 hover:opacity-85 ${
              darkMode ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-700"
            }`}>
              Ver Logs <ChevronRight className="h-3 w-3" />
            </button>
          </div>

          <div className="space-y-4">
            {recentActivities.map((act) => (
              <div 
                key={act.id} 
                className={`p-3 rounded-xl border flex items-start gap-3 transition-colors ${
                  darkMode ? "bg-slate-950/40 border-slate-800/60" : "bg-slate-50/50 border-slate-100"
                }`}
              >
                <div className="mt-0.5">
                  <Clock className="h-4 w-4 text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate">{act.text}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{act.time}</span>
                    <span className="text-[10px] text-slate-500">•</span>
                    <span className={`text-[10px] font-semibold tracking-wider ${
                      act.status === "Crítico" 
                        ? "text-rose-500" 
                        : act.status === "Atención" 
                        ? "text-amber-500" 
                        : act.status === "Aprobado" 
                        ? "text-emerald-500" 
                        : "text-indigo-400"
                    }`}>
                      {act.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Administrative Quick Shortcuts */}
        <div className={`p-5 rounded-2xl border ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
        }`}>
          <h4 className="font-semibold text-lg">Acciones Rápidas</h4>
          <p className={`text-xs mb-4 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            Acceso veloz a validaciones y configuración
          </p>

          <div className="grid grid-cols-1 gap-2">
            <button 
              onClick={() => onNavigateToTab("verificaciones")}
              className={`p-3.5 rounded-xl border text-left text-xs font-semibold transition-all hover:translate-x-1 flex items-center justify-between ${
                darkMode ? "bg-slate-950 border-slate-800 text-slate-200 hover:bg-slate-850" : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Verificar Cuentas Pendientes</span>
              </div>
              <span className="bg-emerald-500/15 text-emerald-500 px-2 py-0.5 rounded-md text-[10px] font-bold">
                {verificationsCount} KYC
              </span>
            </button>

            <button 
              onClick={() => onNavigateToTab("chats")}
              className={`p-3.5 rounded-xl border text-left text-xs font-semibold transition-all hover:translate-x-1 flex items-center justify-between ${
                darkMode ? "bg-slate-950 border-slate-800 text-slate-200 hover:bg-slate-850" : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span>Auditar Denuncias de Chat</span>
              </div>
              <span className="bg-amber-500/15 text-amber-500 px-2 py-0.5 rounded-md text-[10px] font-bold">
                {chatsCount} Chats
              </span>
            </button>

            <button 
              onClick={() => onNavigateToTab("soporte")}
              className={`p-3.5 rounded-xl border text-left text-xs font-semibold transition-all hover:translate-x-1 flex items-center justify-between ${
                darkMode ? "bg-slate-950 border-slate-800 text-slate-200 hover:bg-slate-850" : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-indigo-400" />
                <span>Resolver Tickets de Soporte</span>
              </div>
              <span className="bg-indigo-500/15 text-indigo-400 px-2 py-0.5 rounded-md text-[10px] font-bold">
                {ticketsCount} Tck
              </span>
            </button>

            <button 
              onClick={() => onNavigateToTab("configuracion")}
              className={`p-3.5 rounded-xl border text-left text-xs font-semibold transition-all hover:translate-x-1 flex items-center justify-between ${
                darkMode ? "bg-slate-950 border-slate-800 text-slate-200 hover:bg-slate-850" : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-blue-400" />
                <span>Ajustar Comisiones de Compra</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
