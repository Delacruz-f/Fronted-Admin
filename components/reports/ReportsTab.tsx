"use client";

// components/reports/ReportsTab.tsx — Módulo nuevo: Reportes y Analítica

import React, { useMemo, useState } from "react";
import {
  BarChart3, TrendingUp, DollarSign, AlertTriangle, CheckCircle2, Star,
  Download, FileText, FileSpreadsheet, Sheet, Award, Users,
} from "lucide-react";
import { Seller, Buyer, Product, Order, Promotion, ReportedChat } from "@/lib/mockData";

interface ReportsTabProps {
  darkMode: boolean;
  sellers: Seller[];
  buyers: Buyer[];
  products: Product[];
  orders: Order[];
  promotions: Promotion[];
  reportedChats: ReportedChat[];
  onShowNotification: (text: string, type: "success" | "warning" | "error") => void;
}

type TimeFilter = "Diario" | "Semanal" | "Mensual" | "Anual";

const volumeByFilter: Record<TimeFilter, { label: string; value: number }[]> = {
  Diario: [
    { label: "Lun", value: 1200 }, { label: "Mar", value: 1900 }, { label: "Mié", value: 1500 },
    { label: "Jue", value: 2400 }, { label: "Vie", value: 2800 }, { label: "Sáb", value: 3500 }, { label: "Dom", value: 3100 },
  ],
  Semanal: [
    { label: "Sem 1", value: 8400 }, { label: "Sem 2", value: 9900 },
    { label: "Sem 3", value: 11200 }, { label: "Sem 4", value: 14890 },
  ],
  Mensual: [
    { label: "Feb", value: 28000 }, { label: "Mar", value: 32000 }, { label: "Abr", value: 38000 },
    { label: "May", value: 45000 }, { label: "Jun", value: 54000 }, { label: "Jul", value: 62000 },
  ],
  Anual: [
    { label: "2023", value: 180000 }, { label: "2024", value: 260000 },
    { label: "2025", value: 340000 }, { label: "2026", value: 210000 },
  ],
};

const categoryColors = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6"];

function downloadCsv(filename: string, rows: (string | number)[][]) {
  const csvContent = rows
    .map((row) => row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function ReportsTab({
  darkMode,
  sellers,
  buyers,
  products,
  orders,
  promotions,
  reportedChats,
  onShowNotification,
}: ReportsTabProps) {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("Mensual");

  const totalVolume = useMemo(() => orders.reduce((s, o) => s + o.amount, 0), [orders]);
  const avgPrice = useMemo(
    () => (products.length ? products.reduce((s, p) => s + p.price, 0) / products.length : 0),
    [products]
  );
  const promoRevenue = useMemo(() => promotions.reduce((s, p) => s + p.amountPaid, 0), [promotions]);
  const resolvedDisputes = useMemo(() => orders.filter((o) => !!o.disputeResolution).length, [orders]);
  const totalConductReports = useMemo(
    () => products.reduce((s, p) => s + p.reportsCount, 0) + reportedChats.length,
    [products, reportedChats]
  );

  const categoryBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    const total = products.length || 1;
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count], idx) => ({
        name,
        count,
        percent: Math.round((count / total) * 100),
        color: categoryColors[idx % categoryColors.length],
      }));
  }, [products]);

  const topSellers = useMemo(
    () => [...sellers].sort((a, b) => b.rating - a.rating).slice(0, 5),
    [sellers]
  );
  const topBuyers = useMemo(
    () => [...buyers].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5),
    [buyers]
  );

  const currentVolumeData = volumeByFilter[timeFilter];
  const maxVolume = Math.max(...currentVolumeData.map((d) => d.value)) || 1;

  const handleExportCsv = () => {
    const rows: (string | number)[][] = [
      ["Reporte General CoraMarket"],
      ["Periodo", timeFilter],
      [],
      ["Indicador", "Valor"],
      ["Volumen comercializado (USD)", totalVolume.toFixed(2)],
      ["Precio promedio de producto (USD)", avgPrice.toFixed(2)],
      ["Ingresos por promociones (USD)", promoRevenue.toFixed(2)],
      ["Disputas resueltas", resolvedDisputes],
      ["Reportes de conducta totales", totalConductReports],
      [],
      ["Vendedores Destacados", "Rating", "Productos"],
      ...topSellers.map((s) => [s.name, s.rating, s.productsCount]),
      [],
      ["Compradores Frecuentes", "Compras", "Gasto Total (USD)"],
      ...topBuyers.map((b) => [b.name, b.purchasesCount, b.totalSpent]),
    ];
    downloadCsv(`reporte-coramarket-${timeFilter.toLowerCase()}.csv`, rows);
    onShowNotification("Reporte CSV descargado correctamente.", "success");
  };

  const handleExportPending = (format: string) => {
    onShowNotification(
      `Exportación a ${format} pendiente de conectar con el backend real. Por ahora usa CSV.`,
      "warning"
    );
  };

  return (
    <div className="space-y-6">
      {/* Header + filtros + exportación */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold tracking-tight flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-indigo-500" />
            Reportes y Analítica
          </h3>
          <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            Indicadores consolidados de toda la operación de CoraMarket.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className={`flex items-center p-0.5 rounded-lg border ${darkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-150"}`}>
            {(["Diario", "Semanal", "Mensual", "Anual"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setTimeFilter(f)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  timeFilter === f
                    ? darkMode ? "bg-slate-800 text-white shadow-sm" : "bg-white text-slate-800 shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleExportCsv}
              title="Exportar a CSV"
              className="px-3 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Sheet className="h-3.5 w-3.5" />
              <span>CSV</span>
            </button>
            <button
              onClick={() => handleExportPending("Excel")}
              title="Exportar a Excel"
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border flex items-center gap-1.5 transition-all ${
                darkMode ? "border-slate-800 text-slate-300 hover:bg-slate-900" : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span>Excel</span>
            </button>
            <button
              onClick={() => handleExportPending("PDF")}
              title="Exportar a PDF"
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border flex items-center gap-1.5 transition-all ${
                darkMode ? "border-slate-800 text-slate-300 hover:bg-slate-900" : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl border ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}>
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            <span>VOLUMEN COMERCIALIZADO</span>
          </div>
          <h4 className="text-xl font-bold font-mono mt-1.5">${totalVolume.toFixed(2)} USD</h4>
        </div>
        <div className={`p-4 rounded-xl border ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}>
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
            <DollarSign className="h-4 w-4 text-indigo-400" />
            <span>PRECIO PROMEDIO</span>
          </div>
          <h4 className="text-xl font-bold font-mono mt-1.5">${avgPrice.toFixed(2)} USD</h4>
        </div>
        <div className={`p-4 rounded-xl border ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}>
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
            <Award className="h-4 w-4 text-amber-500" />
            <span>INGRESOS POR PROMOCIÓN</span>
          </div>
          <h4 className="text-xl font-bold font-mono mt-1.5">${promoRevenue.toFixed(2)} USD</h4>
        </div>
        <div className={`p-4 rounded-xl border ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}>
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
            <AlertTriangle className="h-4 w-4 text-rose-500" />
            <span>REPORTES DE CONDUCTA</span>
          </div>
          <h4 className="text-xl font-bold font-mono mt-1.5">{totalConductReports}</h4>
          <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
            {resolvedDisputes} disputas resueltas
          </span>
        </div>
      </div>

      {/* Gráfico de barras + categorías */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`p-5 rounded-2xl border lg:col-span-2 ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}>
          <h4 className="font-semibold text-lg">Volumen Comercializado — {timeFilter}</h4>
          <p className={`text-xs mb-6 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Suma de ventas por periodo seleccionado</p>

          <div className="flex items-end gap-3 h-48">
            {currentVolumeData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-indigo-600 to-indigo-400"
                  style={{ height: `${Math.max((d.value / maxVolume) * 100, 4)}%` }}
                  title={`$${d.value.toLocaleString()}`}
                />
                <span className={`text-[10px] font-semibold ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={`p-5 rounded-2xl border ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}>
          <h4 className="font-semibold text-lg">Categorías Más Vendidas</h4>
          <p className={`text-xs mb-4 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Según catálogo actual de productos</p>

          <div className="space-y-3">
            {categoryBreakdown.map((cat) => (
              <div key={cat.name}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className={darkMode ? "text-slate-300" : "text-slate-600"}>{cat.name}</span>
                  <span className="font-semibold">{cat.percent}%</span>
                </div>
                <div className={`h-1.5 rounded-full overflow-hidden ${darkMode ? "bg-slate-800" : "bg-slate-100"}`}>
                  <div className="h-full rounded-full" style={{ width: `${cat.percent}%`, backgroundColor: cat.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vendedores destacados + compradores frecuentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`p-5 rounded-2xl border ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}>
          <h4 className="font-semibold text-lg flex items-center gap-2">
            <Star className="h-4.5 w-4.5 text-amber-500" />
            Vendedores Destacados
          </h4>
          <div className="mt-4 space-y-2">
            {topSellers.map((s, i) => (
              <div key={s.id} className={`flex items-center justify-between p-2.5 rounded-lg ${darkMode ? "bg-slate-950/40" : "bg-slate-50"}`}>
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] font-bold text-slate-400 w-4">#{i + 1}</span>
                  <span className="text-xs font-semibold">{s.name}</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-400">{s.productsCount} items</span>
                  <span className="flex items-center gap-0.5 font-bold">
                    <Star className="h-3 w-3 fill-amber-400 stroke-amber-400" />
                    {s.rating}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`p-5 rounded-2xl border ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}>
          <h4 className="font-semibold text-lg flex items-center gap-2">
            <Users className="h-4.5 w-4.5 text-indigo-400" />
            Compradores Frecuentes
          </h4>
          <div className="mt-4 space-y-2">
            {topBuyers.map((b, i) => (
              <div key={b.id} className={`flex items-center justify-between p-2.5 rounded-lg ${darkMode ? "bg-slate-950/40" : "bg-slate-50"}`}>
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] font-bold text-slate-400 w-4">#{i + 1}</span>
                  <span className="text-xs font-semibold">{b.name}</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-400">{b.purchasesCount} compras</span>
                  <span className="font-bold font-mono text-emerald-500">${b.totalSpent}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
