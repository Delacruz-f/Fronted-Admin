"use client";

// components/config/ConfigTab.tsx — Propiedad: Persona D

import React, { useState } from "react";
import { 
  Settings, Percent, DollarSign, ShieldAlert, Sparkles, Plus, Trash2, 
  Check, Save, FileText, BellRing, Sliders, LayoutGrid
} from "lucide-react";

interface ConfigTabProps {
  darkMode: boolean;
  onShowNotification: (text: string, type: "success" | "warning" | "error") => void;
}

export default function ConfigTab({
  darkMode,
  onShowNotification,
}: ConfigTabProps) {
  const [commissionRate, setCommissionRate] = useState(12.5);
  const [bannerCost, setBannerCost] = useState(150.00);
  const [sponsoredCost, setSponsoredCost] = useState(45.00);
  
  const [categories, setCategories] = useState([
    "Frutas y Verduras", "Tecnología", "Hogar y Muebles", "Ropa y Calzado", "Mascotas", "Libros"
  ]);
  const [newCatName, setNewCatName] = useState("");

  const [refundPolicy, setRefundPolicy] = useState(
    "El comprador dispone de 48 horas hábiles tras la entrega registrada por el transportista para presentar una disputa por fallas en la calidad o disconformidad con el embalaje."
  );

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onShowNotification("Configuraciones de comisiones y tarifas actualizadas correctamente.", "success");
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    if (categories.includes(newCatName.trim())) {
      onShowNotification("La categoría ya existe.", "error");
      return;
    }
    setCategories([...categories, newCatName.trim()]);
    onShowNotification(`Categoría '${newCatName}' añadida al catálogo.`, "success");
    setNewCatName("");
  };

  const handleRemoveCategory = (cat: string) => {
    setCategories(categories.filter(c => c !== cat));
    onShowNotification(`Categoría '${cat}' removida del catálogo.`, "warning");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Platform fees & settings */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Fees form */}
        <form onSubmit={handleSaveSettings} className={`p-5 rounded-2xl border space-y-5 ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
        }`}>
          <h4 className="font-bold text-sm flex items-center gap-1.5 text-indigo-400">
            <Percent className="h-4.5 w-4.5" />
            <span>COMISIONES Y COSTOS DE PLATAFORMA</span>
          </h4>
          <p className={`text-xs mt-0.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            Configura el porcentaje de comisión que Ranti retiene en cada compra y los valores de suscripción a patrocinio.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-3 border-t border-slate-150 dark:border-slate-850">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Comisión de Venta (%)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(Number(e.target.value))}
                  className={`w-full p-2.5 pl-8 text-xs rounded-xl border focus:outline-none font-bold ${
                    darkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
                  }`}
                />
                <span className="absolute left-3 top-3 text-[10px] font-bold text-slate-400">%</span>
              </div>
              <span className="text-[9px] text-slate-400 block mt-1">Retención automática en la pasarela oficial.</span>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Costo Producto Patrocinado (S/ por semana)</label>
              <div className="relative">
                <input
                  type="number"
                  value={sponsoredCost}
                  onChange={(e) => setSponsoredCost(Number(e.target.value))}
                  className={`w-full p-2.5 pl-9 text-xs rounded-xl border focus:outline-none font-bold ${
                    darkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
                  }`}
                />
                <span className="absolute left-3 top-3 text-[10px] font-bold text-slate-400">S/</span>
              </div>
              <span className="text-[9px] text-slate-400 block mt-1">Costo básico para búsquedas prioritarias.</span>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Costo Banner Promocional Principal (S/ por semana)</label>
              <div className="relative">
                <input
                  type="number"
                  value={bannerCost}
                  onChange={(e) => setBannerCost(Number(e.target.value))}
                  className={`w-full p-2.5 pl-9 text-xs rounded-xl border focus:outline-none font-bold ${
                    darkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
                  }`}
                />
                <span className="absolute left-3 top-3 text-[10px] font-bold text-slate-400">S/</span>
              </div>
              <span className="text-[9px] text-slate-400 block mt-1">Visibilidad completa en portada de compradores.</span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-4.5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center gap-1.5 shadow-md transition-all"
            >
              <Save className="h-4 w-4" />
              <span>Guardar Configuración</span>
            </button>
          </div>
        </form>

        {/* Policy Editor */}
        <div className={`p-5 rounded-2xl border space-y-4 ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
        }`}>
          <h4 className="font-bold text-sm flex items-center gap-1.5 text-indigo-400">
            <FileText className="h-4.5 w-4.5" />
            <span>TÉRMINOS, POLÍTICAS Y DISPUTAS</span>
          </h4>
          <p className="text-[11px] text-slate-400">Redacta los lineamientos legales para el reembolso y arbitraje de transacciones.</p>

          <div className="space-y-1.5">
            <textarea
              rows={4}
              value={refundPolicy}
              onChange={(e) => setRefundPolicy(e.target.value)}
              className={`w-full p-3 text-xs rounded-xl border focus:outline-none leading-relaxed font-medium ${
                darkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-950"
              }`}
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => onShowNotification("Términos de servicio de disputas guardados.", "success")}
              className="px-4 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center gap-1 transition-all"
            >
              <Check className="h-3.5 w-3.5" />
              <span>Actualizar Políticas</span>
            </button>
          </div>
        </div>

      </div>

      {/* Categories editor - Right Column */}
      <div className="lg:col-span-1 space-y-4">
        
        <div className={`p-5 rounded-2xl border space-y-4 ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
        }`}>
          <h4 className="font-bold text-sm flex items-center gap-1.5 text-indigo-400">
            <LayoutGrid className="h-4.5 w-4.5" />
            <span>CATEGORÍAS DE PRODUCTOS</span>
          </h4>
          <p className="text-[11px] text-slate-400">Agrega o remueve las categorías oficiales que los vendedores pueden elegir.</p>

          {/* Add Form */}
          <form onSubmit={handleAddCategory} className="flex gap-2">
            <input
              type="text"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="Nueva categoría..."
              className={`flex-1 p-2 text-xs rounded-lg border focus:outline-none ${
                darkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-slate-250 text-slate-900"
              }`}
            />
            <button
              type="submit"
              className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg"
            >
              <Plus className="h-4 w-4" />
            </button>
          </form>

          {/* List of categories */}
          <div className="space-y-1.5 max-h-[220px] overflow-y-auto">
            {categories.map((cat, idx) => (
              <div 
                key={idx} 
                className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-between ${
                  darkMode ? "bg-slate-950/40 border-slate-800/80 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-700"
                }`}
              >
                <span>{cat}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveCategory(cat)}
                  className="p-1 text-slate-400 hover:text-rose-500"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Security parameters info card */}
        <div className={`p-4 rounded-xl border space-y-2 text-xs ${
          darkMode ? "bg-slate-950/20 border-slate-800/80 text-slate-400" : "bg-slate-100/50 border-slate-200 text-slate-600"
        }`}>
          <div className="flex items-center gap-1.5 font-semibold text-[10px] uppercase tracking-wider text-indigo-400">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>Auditoría de Cambios</span>
          </div>
          <p className="leading-relaxed">
            Cualquier modificación a los coeficientes financieros o a los términos del servicio registra automáticamente el identificador del administrador y genera una notificación interna visible para todos los auditores.
          </p>
        </div>

      </div>

    </div>
  );
}
