"use client";

// components/promotions/PromotionsTab.tsx — Propiedad: Persona C

import React, { useState } from "react";
import { 
  DollarSign, TrendingUp, Calendar, ShoppingBag, Plus, Sparkles,
  Award, Target, Image, MapPin, Eye, Search, AlertCircle
} from "lucide-react";
import { Promotion } from "@/lib/mockData";
import { formatCurrency } from "@/lib/format";

interface PromotionsTabProps {
  darkMode: boolean;
  promotions: Promotion[];
  onUpdatePromotions: (promotions: Promotion[]) => void;
  onShowNotification: (text: string, type: "success" | "warning" | "error") => void;
}

export default function PromotionsTab({
  darkMode,
  promotions,
  onUpdatePromotions,
  onShowNotification,
}: PromotionsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("todos");

  // Add Promotion states
  const [showAddPromo, setShowAddPromo] = useState(false);
  const [newPromoProduct, setNewPromoProduct] = useState("");
  const [newPromoSeller, setNewPromoSeller] = useState("");
  const [newPromoType, setNewPromoType] = useState<Promotion["type"]>("Producto Patrocinado");
  const [newPromoDays, setNewPromoDays] = useState(15);
  const [newPromoAmount, setNewPromoAmount] = useState(45.00);

  // Filter promotions
  const filteredPromotions = promotions.filter(p => {
    const matchesSearch = p.productName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.sellerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "todos" || p.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleAddPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoProduct || !newPromoSeller) {
      onShowNotification("Completa el nombre del producto y del vendedor", "error");
      return;
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + Number(newPromoDays));

    const newPromo: Promotion = {
      id: "pr_" + Date.now(),
      productName: newPromoProduct,
      sellerName: newPromoSeller,
      type: newPromoType,
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      amountPaid: Number(newPromoAmount),
      status: "Activo"
    };

    onUpdatePromotions([newPromo, ...promotions]);
    onShowNotification(`Promoción patrocinada registrada para ${newPromoProduct}`, "success");
    setNewPromoProduct("");
    setNewPromoSeller("");
    setShowAddPromo(false);
  };

  const totalRevenue = promotions.reduce((sum, p) => sum + p.amountPaid, 0);
  const activeCount = promotions.filter(p => p.status === "Activo").length;

  return (
    <div className="space-y-6">
      
      {/* Banner de Monetización */}
      <div className={`p-6 rounded-2xl border ${
        darkMode ? "bg-gradient-to-br from-slate-900 to-amber-950/10 border-slate-800" : "bg-gradient-to-br from-white to-amber-50/20 border-slate-100"
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold tracking-tight flex items-center gap-1.5 text-amber-500">
              <Sparkles className="h-5 w-5" />
              <span>SaaS de Promociones Pagadas</span>
            </h3>
            <p className={`text-xs mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              Monetización nativa de Ranti: cobros automatizados a vendedores para priorizar visualmente sus productos en listados y portadas.
            </p>
          </div>
          <button
            onClick={() => setShowAddPromo(!showAddPromo)}
            className="px-4 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white rounded-xl shadow-md flex items-center gap-1.5 transition-all self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Registrar Promoción</span>
          </button>
        </div>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`p-4 rounded-xl border ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}>
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
            <DollarSign className="h-4 w-4 text-amber-500" />
            <span>INGRESOS HISTÓRICOS SAAS</span>
          </div>
          <h4 className="text-xl font-bold font-mono mt-1.5">{formatCurrency(totalRevenue)}</h4>
          <span className="text-[10px] text-slate-400 font-medium">Facturación acumulada por patrocinio</span>
        </div>

        <div className={`p-4 rounded-xl border ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}>
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
            <TrendingUp className="h-4 w-4 text-indigo-400" />
            <span>CAMPAÑAS ACTIVAS</span>
          </div>
          <h4 className="text-xl font-bold font-mono mt-1.5">{activeCount} activas</h4>
          <span className="text-[10px] text-slate-400 font-medium">Productos destacados en carruseles y búsquedas</span>
        </div>

        <div className={`p-4 rounded-xl border ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}>
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
            <Target className="h-4 w-4 text-emerald-500" />
            <span>TARIFA PROMEDIO</span>
          </div>
          <h4 className="text-xl font-bold font-mono mt-1.5">{formatCurrency(135)}</h4>
          <span className="text-[10px] text-slate-400 font-medium">Costo de adquisición promedio por banner</span>
        </div>
      </div>

      {/* Add promotion form */}
      {showAddPromo && (
        <form onSubmit={handleAddPromo} className={`p-4 rounded-xl border space-y-4 transition-all ${
          darkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
        }`}>
          <div className="font-bold text-xs text-amber-500 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="h-4 w-4" />
            <span>ACTIVAR PATROCINIO ESPECIAL DE PUBLICIDAD</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Nombre del Producto</label>
              <input
                type="text"
                value={newPromoProduct}
                onChange={(e) => setNewPromoProduct(e.target.value)}
                placeholder="Ej: Tomates Orgánicos 10Kg"
                className={`w-full p-2 text-xs rounded-lg border focus:outline-none ${
                  darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-250 text-slate-900"
                }`}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Vendedor Beneficiario</label>
              <input
                type="text"
                value={newPromoSeller}
                onChange={(e) => setNewPromoSeller(e.target.value)}
                placeholder="Ej: Carlos Mendoza (Fruver)"
                className={`w-full p-2 text-xs rounded-lg border focus:outline-none ${
                  darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-250 text-slate-900"
                }`}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Tipo de Sponsor</label>
              <select
                value={newPromoType}
                onChange={(e) => setNewPromoType(e.target.value as any)}
                className={`w-full p-2 text-xs rounded-lg border focus:outline-none ${
                  darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-250 text-slate-900"
                }`}
              >
                <option value="Destacado Principal">Destacado Principal (Carrusel Portada)</option>
                <option value="Producto Patrocinado">Producto Patrocinado (Búsqueda Top)</option>
                <option value="Banner Promocional">Banner Promocional (Publicidad lateral)</option>
                <option value="Promoción Regional">Promoción Regional (Geolocalización)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Duración (Días)</label>
              <input
                type="number"
                value={newPromoDays}
                onChange={(e) => setNewPromoDays(Number(e.target.value))}
                className={`w-full p-2 text-xs rounded-lg border focus:outline-none ${
                  darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-250 text-slate-900"
                }`}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Monto Pagado (S/)</label>
              <input
                type="number"
                value={newPromoAmount}
                onChange={(e) => setNewPromoAmount(Number(e.target.value))}
                className={`w-full p-2 text-xs rounded-lg border focus:outline-none ${
                  darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-250 text-slate-900"
                }`}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddPromo(false)}
              className={`px-3 py-1.5 text-xs rounded-lg border ${
                darkMode ? "border-slate-800 text-slate-400 hover:bg-slate-900" : "border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white rounded-lg shadow-md"
            >
              Registrar Campaña
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por producto patrocinado, vendedor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 text-xs rounded-xl border focus:outline-none transition-colors ${
              darkMode
                ? "bg-slate-900 border-slate-800 focus:border-slate-700 text-white"
                : "bg-white border-slate-200 focus:border-indigo-400 text-slate-900"
            }`}
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className={`p-2 text-xs rounded-xl border focus:outline-none ${
            darkMode ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-white border-slate-200 text-slate-700"
          }`}
        >
          <option value="todos">Todos los Tipos de Promoción</option>
          <option value="Destacado Principal">Destacado Principal</option>
          <option value="Producto Patrocinado">Producto Patrocinado</option>
          <option value="Banner Promocional">Banner Promocional</option>
          <option value="Promoción Regional">Promoción Regional</option>
        </select>
      </div>

      {/* Table listing active promotions */}
      <div className={`border rounded-2xl overflow-hidden ${
        darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`text-[10px] font-bold uppercase tracking-wider border-b ${
                darkMode ? "bg-slate-950/60 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-100 text-slate-500"
              }`}>
                <th className="p-4">Producto Patrocinado</th>
                <th className="p-4">Vendedor</th>
                <th className="p-4">Tipo de Sponsor</th>
                <th className="p-4">Vigencia (Inicio / Fin)</th>
                <th className="p-4">Cobro Monetizado</th>
                <th className="p-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {filteredPromotions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">No hay registros de campañas promocionales patrocinadas.</td>
                </tr>
              ) : (
                filteredPromotions.map((promo) => (
                  <tr key={promo.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    {/* Item */}
                    <td className="p-4 font-bold flex items-center gap-2">
                      {promo.type === "Destacado Principal" && <Award className="h-4 w-4 text-amber-500 shrink-0" />}
                      {promo.type === "Producto Patrocinado" && <Target className="h-4 w-4 text-indigo-400 shrink-0" />}
                      {promo.type === "Banner Promocional" && <Image className="h-4 w-4 text-blue-400 shrink-0" />}
                      {promo.type === "Promoción Regional" && <MapPin className="h-4 w-4 text-emerald-400 shrink-0" />}
                      <span>{promo.productName}</span>
                    </td>

                    {/* Beneficiary */}
                    <td className="p-4 font-medium text-slate-600 dark:text-slate-300">
                      {promo.sellerName}
                    </td>

                    {/* Promo Type Label */}
                    <td className="p-4 font-medium">
                      {promo.type}
                    </td>

                    {/* Validity dates */}
                    <td className="p-4 font-mono text-[11px] text-slate-400">
                      <div>De: {promo.startDate}</div>
                      <div className="font-semibold text-indigo-400">Al: {promo.endDate}</div>
                    </td>

                    {/* Paid */}
                    <td className="p-4 font-bold font-mono text-emerald-500">
                      {formatCurrency(promo.amountPaid)}
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                        promo.status === "Activo" ? "bg-emerald-500/10 text-emerald-500" :
                        promo.status === "Programado" ? "bg-blue-500/10 text-blue-400" :
                        "bg-slate-500/10 text-slate-400"
                      }`}>
                        {promo.status}
                      </span>
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
