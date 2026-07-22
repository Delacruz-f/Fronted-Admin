"use client";



import React, { useState } from "react";
import { 
  Search, SlidersHorizontal, AlertTriangle, Eye, EyeOff, Check,
  X, Filter, Trash2, ShieldAlert, Sparkles, AlertCircle
} from "lucide-react";
import { Product } from "@/lib/mockData";
import { formatCurrency } from "@/lib/format";

interface ProductsTabProps {
  darkMode: boolean;
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
  onShowNotification: (text: string, type: "success" | "warning" | "error") => void;
}

export default function ProductsTab({
  darkMode,
  products,
  onUpdateProducts,
  onShowNotification,
}: ProductsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("todas");
  const [statusFilter, setStatusFilter] = useState("todos");

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sellerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "todas" || p.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesStatus = statusFilter === "todos" || p.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleStatusChange = (id: string, newStatus: Product["status"]) => {
    const updated = products.map(p => p.id === id ? { ...p, status: newStatus } : p);
    onUpdateProducts(updated);
    
    let notifyType: "success" | "warning" | "error" = "success";
    if (newStatus === "Oculto" || newStatus === "Rechazado") notifyType = "warning";
    if (newStatus === "Reportado") notifyType = "error";

    onShowNotification(`El estado del producto se actualizó a: ${newStatus}`, notifyType);
  };

  const categories = Array.from(new Set(products.map(p => p.category)));

  return (
    <div className="space-y-6">
      {/* Header text */}
      <div>
        <h3 className="text-lg font-semibold tracking-tight">Moderación del Catálogo de Productos</h3>
        <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
          Supervisa las publicaciones hechas por vendedores, aprueba ofertas pendientes u oculta productos denunciados.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por producto, vendedor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 text-xs rounded-xl border focus:outline-none transition-colors ${
              darkMode
                ? "bg-slate-900 border-slate-800 focus:border-slate-700 text-white"
                : "bg-white border-slate-200 focus:border-indigo-400 text-slate-900"
            }`}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={`p-2 text-xs rounded-xl border focus:outline-none ${
              darkMode ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-white border-slate-200 text-slate-700"
            }`}
          >
            <option value="todas">Todas las Categorías</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`p-2 text-xs rounded-xl border focus:outline-none ${
              darkMode ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-white border-slate-200 text-slate-700"
            }`}
          >
            <option value="todos">Todos los Estados</option>
            <option value="aprobado">Aprobados</option>
            <option value="pendiente">Pendientes de Aprobación</option>
            <option value="reportado">Reportados</option>
            <option value="oculto">Ocultos</option>
          </select>
        </div>
      </div>

      {/* Grid of Products list */}
      <div className={`border rounded-2xl overflow-hidden ${
        darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`text-[10px] font-bold uppercase tracking-wider border-b ${
                darkMode ? "bg-slate-950/60 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-100 text-slate-500"
              }`}>
                <th className="p-4">Producto</th>
                <th className="p-4">Categoría</th>
                <th className="p-4">Vendedor</th>
                <th className="p-4">Precio / Stock</th>
                <th className="p-4">Reportes</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-right">Moderación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">Ningún producto coincide con los filtros aplicados.</td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    {/* Item block */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={p.imageUrl} alt={p.name} className="h-10 w-14 rounded-lg object-cover border border-slate-100 dark:border-slate-800 shrink-0" />
                        <div>
                          <span className="font-bold block max-w-[200px] truncate">{p.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">ID: {p.id}</span>
                        </div>
                      </div>
                    </td>
                    
                    {/* Category */}
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                        darkMode ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"
                      }`}>
                        {p.category}
                      </span>
                    </td>

                    {/* Seller */}
                    <td className="p-4 font-semibold text-slate-600 dark:text-slate-300">
                      {p.sellerName}
                    </td>

                    {/* Price / Stock */}
                    <td className="p-4">
                      <div className="font-mono font-bold text-emerald-500">{formatCurrency(p.price)}</div>
                      <div className={`text-[10px] ${p.stock === 0 ? "text-rose-500 font-bold" : "text-slate-400"}`}>
                        {p.stock === 0 ? "Agotado" : `${p.stock} unidades`}
                      </div>
                    </td>

                    {/* Reports count */}
                    <td className="p-4">
                      {p.reportsCount > 0 ? (
                        <div className="flex items-center gap-1 font-bold text-rose-500">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          <span>{p.reportsCount} denuncias</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">Sin reportes</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        p.status === "Aprobado" ? "bg-emerald-500/10 text-emerald-500" :
                        p.status === "Pendiente" ? "bg-amber-500/10 text-amber-500" :
                        p.status === "Oculto" ? "bg-slate-500/10 text-slate-400" :
                        p.status === "Reportado" ? "bg-rose-500/15 text-rose-500 font-bold animate-pulse" :
                        "bg-slate-500/10 text-slate-400"
                      }`}>
                        {p.status}
                      </span>
                    </td>

                    {/* Active Moderation controls */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {p.status !== "Aprobado" && (
                          <button
                            onClick={() => handleStatusChange(p.id, "Aprobado")}
                            title="Aprobar Producto"
                            className="p-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 transition-colors"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {p.status !== "Oculto" && (
                          <button
                            onClick={() => handleStatusChange(p.id, "Oculto")}
                            title="Ocultar Publicación"
                            className="p-1 rounded bg-slate-500/10 hover:bg-slate-500/25 text-slate-400 transition-colors"
                          >
                            <EyeOff className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {p.status !== "Rechazado" && (
                          <button
                            onClick={() => handleStatusChange(p.id, "Rechazado")}
                            title="Rechazar Publicación"
                            className="p-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-colors"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
