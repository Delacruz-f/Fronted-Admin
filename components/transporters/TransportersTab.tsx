"use client";

// components/transporters/TransportersTab.tsx — Propiedad: Persona D

import React, { useState } from "react";
import { 
  Map, Navigation, Check, Ban, Star, Truck, ShieldCheck, 
  MapPin, Radio, Eye, EyeOff, Layers, Sliders
} from "lucide-react";
import { Carrier } from "@/lib/mockData";

interface TransportersTabProps {
  darkMode: boolean;
  carriers: Carrier[];
  onUpdateCarriers: (carriers: Carrier[]) => void;
  onShowNotification: (text: string, type: "success" | "warning" | "error") => void;
}

export default function TransportersTab({
  darkMode,
  carriers,
  onUpdateCarriers,
  onShowNotification,
}: TransportersTabProps) {
  const [selectedRouteCarrier, setSelectedRouteCarrier] = useState<Carrier | null>(
    carriers.length > 0 ? carriers[0] : null
  );

  const [activeLanes, setActiveLanes] = useState<{ [key: string]: boolean }>({
    "Ruta-S1": true,
    "Ruta-S2": true,
    "Ruta-O1": false,
  });

  const toggleLane = (laneId: string) => {
    setActiveLanes(prev => {
      const updated = { ...prev, [laneId]: !prev[laneId] };
      onShowNotification(
        `Ruta comercial ${laneId} ahora está ${updated[laneId] ? "Activa" : "Desactivada"}`,
        updated[laneId] ? "success" : "warning"
      );
      return updated;
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Map visualization - Left & Center Column */}
      <div className="lg:col-span-2 space-y-4">
        <div className={`p-5 rounded-2xl border flex flex-col justify-between h-[450px] relative overflow-hidden ${
          darkMode ? "bg-slate-950 border-slate-850" : "bg-slate-50 border-slate-200"
        }`}>
          {/* Map Head */}
          <div className="flex items-center justify-between z-10">
            <div>
              <h4 className="font-bold text-sm tracking-tight flex items-center gap-1.5 text-indigo-400">
                <Radio className="h-4 w-4 animate-pulse text-rose-500" />
                <span>MONITOREO DE DESPACHOS Y GPS EN VIVO</span>
              </h4>
              <p className={`text-[11px] mt-0.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                Señal satelital simulada de transportistas con rutas comerciales autorizadas.
              </p>
            </div>

            <div className={`flex items-center gap-1.5 p-1 rounded-lg border text-[10px] font-bold ${
              darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-150"
            }`}>
              <Layers className="h-3 w-3 text-indigo-500" />
              <span>Capa: Ruta de Tránsito</span>
            </div>
          </div>

          {/* SVG Map Canvas */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 400 300" className="w-full h-full opacity-90">
              {/* Chile/Santiago outline representation or schematic map lines */}
              <path d="M 80,40 Q 150,80 200,60 T 320,120 T 380,260" fill="none" stroke={darkMode ? "#1e293b" : "#e2e8f0"} strokeWidth="6" strokeLinecap="round" />
              <path d="M 50,120 Q 120,200 220,140 T 350,220" fill="none" stroke={darkMode ? "#1e293b" : "#e2e8f0"} strokeWidth="4" strokeLinecap="round" />

              {/* Transit Nodes / Hubs */}
              <circle cx="80" cy="40" r="5" fill="#6366f1" opacity="0.6" />
              <circle cx="200" cy="60" r="5" fill="#6366f1" opacity="0.6" />
              <circle cx="320" cy="120" r="5" fill="#6366f1" opacity="0.6" />
              <circle cx="220" cy="140" r="5" fill="#6366f1" opacity="0.6" />

              {/* Lane Paths */}
              {activeLanes["Ruta-S1"] && (
                <path 
                  d="M 120,80 Q 180,120 240,110 T 310,180" 
                  fill="none" 
                  stroke="#10b981" 
                  strokeWidth="2.5" 
                  strokeDasharray="4 4" 
                  className="animate-[dash_8s_linear_infinite]" 
                />
              )}
              {activeLanes["Ruta-S2"] && (
                <path 
                  d="M 70,140 Q 150,110 220,150 T 300,240" 
                  fill="none" 
                  stroke="#3b82f6" 
                  strokeWidth="2.5" 
                  strokeDasharray="4 4" 
                  className="animate-[dash_12s_linear_infinite]" 
                />
              )}

              {/* Active Pins */}
              <g className="cursor-pointer" onClick={() => setSelectedRouteCarrier(carriers[0])}>
                <circle cx="240" cy="110" r="14" fill="#10b981" fillOpacity="0.15" className="animate-ping" style={{ animationDuration: '3s' }} />
                <circle cx="240" cy="110" r="6" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                <text x="250" y="113" fontSize="8" fontWeight="bold" fill="#10b981" className="bg-slate-900 font-mono">GPS-Mateo</text>
              </g>

              <g className="cursor-pointer" onClick={() => setSelectedRouteCarrier(carriers[1])}>
                <circle cx="150" cy="110" r="14" fill="#3b82f6" fillOpacity="0.15" className="animate-ping" style={{ animationDuration: '4s' }} />
                <circle cx="150" cy="110" r="6" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" />
                <text x="160" y="113" fontSize="8" fontWeight="bold" fill="#3b82f6" className="bg-slate-900 font-mono">GPS-Gabriel</text>
              </g>
            </svg>
          </div>

          {/* Map Footer indicators */}
          <div className="flex items-center gap-6 z-10 text-[10px]">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className={darkMode ? "text-slate-300" : "text-slate-600 font-medium"}>MExpress (Activo)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              <span className={darkMode ? "text-slate-300" : "text-slate-600 font-medium"}>RutaSur (Activo)</span>
            </div>
          </div>
        </div>

        {/* Carrier list shortcut */}
        <div className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
        }`}>
          <div>
            <h5 className="font-bold text-xs">Aprobación Rápida de Rutas Regionales</h5>
            <p className="text-[10px] text-slate-400 mt-0.5">Control directo sobre los corredores logísticos autorizados para circular.</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <button 
              onClick={() => toggleLane("Ruta-S1")}
              className={`px-3 py-1.5 rounded-lg border font-semibold transition-all flex items-center gap-1.5 ${
                activeLanes["Ruta-S1"] 
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
                  : darkMode ? "bg-slate-950 border-slate-850 text-slate-400" : "bg-slate-50 border-slate-150 text-slate-500"
              }`}
            >
              <span>Ruta Santiago-Norte</span>
              <span className={`h-1.5 w-1.5 rounded-full ${activeLanes["Ruta-S1"] ? "bg-emerald-500" : "bg-slate-400"}`} />
            </button>
            <button 
              onClick={() => toggleLane("Ruta-S2")}
              className={`px-3 py-1.5 rounded-lg border font-semibold transition-all flex items-center gap-1.5 ${
                activeLanes["Ruta-S2"] 
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
                  : darkMode ? "bg-slate-950 border-slate-850 text-slate-400" : "bg-slate-50 border-slate-150 text-slate-500"
              }`}
            >
              <span>Ruta Rancagua-Talca</span>
              <span className={`h-1.5 w-1.5 rounded-full ${activeLanes["Ruta-S2"] ? "bg-emerald-500" : "bg-slate-400"}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Selected Carrier Route details */}
      <div className="lg:col-span-1 space-y-4">
        <h4 className="font-semibold text-sm tracking-tight flex items-center gap-1.5">
          <Truck className="h-4 w-4 text-indigo-400" />
          <span>Ficha de Transportista</span>
        </h4>

        {selectedRouteCarrier ? (
          <div className={`p-5 rounded-2xl border space-y-5 ${
            darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
          }`}>
            <div className="flex items-center gap-3">
              <img src={selectedRouteCarrier.avatar} alt={selectedRouteCarrier.name} className="h-10 w-10 rounded-full object-cover border border-slate-150 dark:border-slate-800" />
              <div>
                <h5 className="font-bold text-xs">{selectedRouteCarrier.name}</h5>
                <span className="text-[10px] text-slate-400 block font-mono">Licencia: {selectedRouteCarrier.license}</span>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-2 gap-3 text-xs pt-3 border-t border-slate-100 dark:border-slate-850">
              <div>
                <span className="text-slate-400 block text-[10px]">Entregas Totales</span>
                <span className="font-bold">{selectedRouteCarrier.deliveriesCount} fletes</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Tarifa Estimada</span>
                <span className="font-semibold font-mono">{selectedRouteCarrier.fare}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Calificación Promedio</span>
                <span className="font-bold flex items-center gap-0.5 mt-0.5">
                  <Star className="h-3 w-3 fill-amber-400 stroke-amber-400" />
                  {selectedRouteCarrier.rating}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Estado Operativo</span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold block w-fit mt-0.5 ${
                  selectedRouteCarrier.status === "Aprobado" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                }`}>
                  {selectedRouteCarrier.status}
                </span>
              </div>
            </div>

            {/* Routes list */}
            <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-850">
              <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">Líneas de Cobertura Autorizadas</span>
              <div className="space-y-1">
                {selectedRouteCarrier.routes.map((route, i) => (
                  <div 
                    key={i} 
                    className={`p-2 rounded-lg border text-xs font-semibold flex items-center justify-between ${
                      darkMode ? "bg-slate-950/60 border-slate-800 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-indigo-400" />
                      <span>{route}</span>
                    </div>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </div>
                ))}
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center gap-2 pt-2 text-xs">
              {selectedRouteCarrier.status !== "Aprobado" ? (
                <button 
                  onClick={() => {
                    const updated = carriers.map(c => c.id === selectedRouteCarrier.id ? { ...c, status: "Aprobado" as const } : c);
                    onUpdateCarriers(updated);
                    setSelectedRouteCarrier({ ...selectedRouteCarrier, status: "Aprobado" });
                    onShowNotification("Transportista aprobado para operar.", "success");
                  }}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-1 transition-all"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>Aprobar transportista</span>
                </button>
              ) : (
                <button 
                  onClick={() => {
                    const updated = carriers.map(c => c.id === selectedRouteCarrier.id ? { ...c, status: "Suspendido" as const } : c);
                    onUpdateCarriers(updated);
                    setSelectedRouteCarrier({ ...selectedRouteCarrier, status: "Suspendido" });
                    onShowNotification("Operación del transportista suspendida temporalmente.", "warning");
                  }}
                  className="w-full py-2 bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500/20 rounded-xl font-bold flex items-center justify-center gap-1 transition-all"
                >
                  <Ban className="h-3.5 w-3.5" />
                  <span>Suspender permisos</span>
                </button>
              )}
            </div>

          </div>
        ) : (
          <div className={`p-8 rounded-2xl border text-center ${
            darkMode ? "bg-slate-900 border-slate-800 text-slate-400" : "bg-white border-slate-100 text-slate-500"
          }`}>
            <p className="text-xs font-semibold">Selecciona un transportista en el mapa satelital para ver sus coordenadas y registros de entrega.</p>
          </div>
        )}
      </div>

    </div>
  );
}
