"use client";

// components/users/UsersTab.tsx — Propiedad: Persona B

import React, { useState } from "react";
import { 
  Search, SlidersHorizontal, UserPlus, Shield, MoreVertical, 
  Trash2, AlertTriangle, CheckCircle, Ban, Star, Mail, Phone,
  FileText, Truck, MapPin, KeyRound, ShieldAlert, Pencil
} from "lucide-react";
import { Seller, Buyer, Carrier, AdminUser } from "@/lib/mockData";
import { formatCurrency } from "@/lib/format";

interface UsersTabProps {
  darkMode: boolean;
  sellers: Seller[];
  buyers: Buyer[];
  carriers: Carrier[];
  admins: AdminUser[];
  onUpdateSellers: (sellers: Seller[]) => void;
  onUpdateBuyers: (buyers: Buyer[]) => void;
  onUpdateCarriers: (carriers: Carrier[]) => void;
  onUpdateAdmins: (admins: AdminUser[]) => void;
  onShowNotification: (text: string, type: "success" | "warning" | "error") => void;
}

export default function UsersTab({
  darkMode,
  sellers,
  buyers,
  carriers,
  admins,
  onUpdateSellers,
  onUpdateBuyers,
  onUpdateCarriers,
  onUpdateAdmins,
  onShowNotification,
}: UsersTabProps) {
  const [subTab, setSubTab] = useState<"vendedores" | "compradores" | "transportistas" | "administradores">("vendedores");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  // Admin Create / Edit states
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [editingAdminId, setEditingAdminId] = useState<string | null>(null);
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminRole, setNewAdminRole] = useState<"Super Administrador" | "Administrador General" | "Moderador" | "Soporte">("Moderador");

  // Filter lists based on search
  const filteredSellers = sellers.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.email.toLowerCase().includes(searchQuery.toLowerCase()) || s.dni.includes(searchQuery);
    const matchesStatus = statusFilter === "todos" || s.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const filteredBuyers = buyers.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "todos" || b.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const filteredCarriers = carriers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.license.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "todos" || c.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Action Handlers
  const handleSellerStatusChange = (id: string, newStatus: Seller["status"]) => {
    const updated = sellers.map(s => s.id === id ? { ...s, status: newStatus } : s);
    onUpdateSellers(updated);
    onShowNotification(`Estado del vendedor actualizado a: ${newStatus}`, "success");
  };

  const handleBuyerStatusChange = (id: string, newStatus: Buyer["status"]) => {
    const updated = buyers.map(b => b.id === id ? { ...b, status: newStatus } : b);
    onUpdateBuyers(updated);
    onShowNotification(`Estado del comprador actualizado a: ${newStatus}`, "warning");
  };

  const handleCarrierStatusChange = (id: string, newStatus: Carrier["status"]) => {
    const updated = carriers.map(c => c.id === id ? { ...c, status: newStatus } : c);
    onUpdateCarriers(updated);
    onShowNotification(`Estado del transportista actualizado a: ${newStatus}`, "success");
  };

  // Abre el formulario limpio, en modo "crear"
  const openCreateAdmin = () => {
    setEditingAdminId(null);
    setNewAdminName("");
    setNewAdminEmail("");
    setNewAdminRole("Moderador");
    setShowAddAdmin(true);
  };

  // Abre el formulario precargado con los datos del administrador, en modo "editar"
  const openEditAdmin = (admin: AdminUser) => {
    setEditingAdminId(admin.id);
    setNewAdminName(admin.name);
    setNewAdminEmail(admin.email);
    setNewAdminRole(admin.role);
    setShowAddAdmin(true);
  };

  const closeAdminForm = () => {
    setShowAddAdmin(false);
    setEditingAdminId(null);
    setNewAdminName("");
    setNewAdminEmail("");
    setNewAdminRole("Moderador");
  };

  const handleSubmitAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminName || !newAdminEmail) {
      onShowNotification("Por favor completa el nombre y el correo", "error");
      return;
    }

    if (editingAdminId) {
      // Modo edición: actualiza el administrador existente
      const updated = admins.map(a =>
        a.id === editingAdminId
          ? { ...a, name: newAdminName, email: newAdminEmail, role: newAdminRole }
          : a
      );
      onUpdateAdmins(updated);
      onShowNotification(`Administrador '${newAdminName}' actualizado correctamente.`, "success");
    } else {
      // Modo creación
      const newAdmin: AdminUser = {
        id: "a_" + Date.now(),
        name: newAdminName,
        email: newAdminEmail,
        role: newAdminRole,
        status: "Activo"
      };
      onUpdateAdmins([...admins, newAdmin]);
      onShowNotification(`Administrador '${newAdminName}' creado exitosamente con rol de ${newAdminRole}.`, "success");
    }

    closeAdminForm();
  };

  const toggleAdminStatus = (id: string) => {
    const updated = admins.map(a => a.id === id ? { ...a, status: (a.status === "Activo" ? "Inactivo" : "Activo") as "Activo" | "Inactivo" } : a);
    onUpdateAdmins(updated);
    onShowNotification("Estado del administrador modificado", "success");
  };

  return (
    <div className="space-y-6">
      {/* Tab Selectors */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-150 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          {(["vendedores", "compradores", "transportistas", "administradores"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setSubTab(tab);
                setStatusFilter("todos");
                setSearchQuery("");
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-lg capitalize transition-all shrink-0 ${
                subTab === tab
                  ? darkMode
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-950/40"
                    : "bg-indigo-600 text-white shadow-sm"
                  : darkMode
                    ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              }`}
            >
              {tab === "vendedores" ? "Vendedores" : tab === "compradores" ? "Compradores" : tab === "transportistas" ? "Transportistas" : "Administradores"}
            </button>
          ))}
        </div>

        {subTab === "administradores" && (
          <button
            onClick={() => (showAddAdmin ? closeAdminForm() : openCreateAdmin())}
            className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center gap-1.5 transition-all self-end"
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>Crear Administrador</span>
          </button>
        )}
      </div>

      {/* Add / Edit Admin Collapse Area */}
      {showAddAdmin && subTab === "administradores" && (
        <form onSubmit={handleSubmitAdmin} className={`p-4 rounded-xl border space-y-4 transition-all ${
          darkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
        }`}>
          <div className="flex items-center gap-1.5 font-semibold text-xs text-indigo-500">
            <KeyRound className="h-4 w-4" />
            <span>{editingAdminId ? "EDITAR CUENTA DE ADMINISTRACIÓN" : "CREAR NUEVA CUENTA DE ADMINISTRACIÓN"}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={`block text-[10px] uppercase font-bold tracking-wider mb-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                Nombre de Usuario
              </label>
              <input
                type="text"
                value={newAdminName}
                onChange={(e) => setNewAdminName(e.target.value)}
                placeholder="Ej. Constanza Rivas"
                className={`w-full p-2 text-xs rounded-lg border focus:outline-none ${
                  darkMode ? "bg-slate-900 border-slate-850 text-white" : "bg-white border-slate-250 text-slate-900"
                }`}
              />
            </div>
            <div>
              <label className={`block text-[10px] uppercase font-bold tracking-wider mb-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                Correo de Trabajo
              </label>
              <input
                type="email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                placeholder="Ej. constanza@coramarket.com"
                className={`w-full p-2 text-xs rounded-lg border focus:outline-none ${
                  darkMode ? "bg-slate-900 border-slate-850 text-white" : "bg-white border-slate-250 text-slate-900"
                }`}
              />
            </div>
            <div>
              <label className={`block text-[10px] uppercase font-bold tracking-wider mb-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                Rol de Privilegio
              </label>
              <select
                value={newAdminRole}
                onChange={(e) => setNewAdminRole(e.target.value as any)}
                className={`w-full p-2 text-xs rounded-lg border focus:outline-none ${
                  darkMode ? "bg-slate-900 border-slate-850 text-white" : "bg-white border-slate-250 text-slate-900"
                }`}
              >
                <option value="Super Administrador">Super Administrador</option>
                <option value="Administrador General">Administrador General</option>
                <option value="Moderador">Moderador</option>
                <option value="Soporte">Soporte</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={closeAdminForm}
              className={`px-3 py-1.5 text-xs rounded-lg border ${
                darkMode ? "border-slate-800 hover:bg-slate-900 text-slate-400" : "border-slate-200 hover:bg-slate-100 text-slate-600"
              }`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-sm"
            >
              {editingAdminId ? "Guardar Cambios" : "Registrar Administrador"}
            </button>
          </div>
        </form>
      )}

      {/* Advanced Filter / Search Row (Not for Admin listing) */}
      {subTab !== "administradores" && (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder={`Buscar por nombre, correo, identificador o teléfono...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 text-xs rounded-xl border focus:outline-none transition-colors ${
                darkMode
                  ? "bg-slate-900 border-slate-800 focus:border-slate-700 text-white"
                  : "bg-white border-slate-200 focus:border-indigo-400 text-slate-900"
              }`}
            />
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-slate-400 hidden sm:block" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`p-2 text-xs rounded-xl border focus:outline-none ${
                darkMode ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-white border-slate-200 text-slate-700"
              }`}
            >
              <option value="todos">Todos los Estados</option>
              <option value="aprobado">Aprobado / Activo</option>
              <option value="pendiente">Pendiente</option>
              <option value="suspendido">Suspendido</option>
              {subTab === "vendedores" && <option value="bloqueado">Bloqueado</option>}
            </select>
          </div>
        </div>
      )}

      {/* Main Lists Containers */}
      <div className={`border rounded-2xl overflow-hidden ${
        darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
      }`}>
        {/* Table 1: VENDEDORES */}
        {subTab === "vendedores" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`text-[10px] font-bold uppercase tracking-wider border-b ${
                  darkMode ? "bg-slate-950/60 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-100 text-slate-500"
                }`}>
                  <th className="p-4">Vendedor</th>
                  <th className="p-4">DNI / Datos</th>
                  <th className="p-4">Productos</th>
                  <th className="p-4">Calificación</th>
                  <th className="p-4">Fecha Reg.</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-right">Acciones de Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {filteredSellers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">Ningún vendedor coincide con la búsqueda.</td>
                  </tr>
                ) : (
                  filteredSellers.map((seller) => (
                    <tr key={seller.id} className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors`}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={seller.avatar} alt={seller.name} className="h-9 w-9 rounded-full object-cover border border-slate-100 dark:border-slate-800" />
                          <div>
                            <span className="font-semibold block">{seller.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono block">{seller.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-[11px]">
                        <div>{seller.dni}</div>
                        <div className="text-slate-400">{seller.phone}</div>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold">{seller.productsCount}</span> items
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-amber-400 stroke-amber-400" />
                          <span className="font-bold">{seller.rating}</span>
                        </div>
                      </td>
                      <td className="p-4 text-slate-400 font-mono text-[11px]">{seller.registerDate}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          seller.status === "Aprobado" ? "bg-emerald-500/10 text-emerald-500" :
                          seller.status === "Pendiente" ? "bg-amber-500/10 text-amber-500" :
                          seller.status === "Suspendido" ? "bg-rose-500/10 text-rose-500" :
                          "bg-slate-500/10 text-slate-400"
                        }`}>
                          {seller.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {seller.status !== "Aprobado" && (
                            <button 
                              onClick={() => handleSellerStatusChange(seller.id, "Aprobado")}
                              title="Aprobar Vendedor"
                              className="p-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 transition-colors"
                            >
                              <CheckCircle className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {seller.status !== "Suspendido" && (
                            <button 
                              onClick={() => handleSellerStatusChange(seller.id, "Suspendido")}
                              title="Suspender Temporalmente"
                              className="p-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-colors"
                            >
                              <AlertTriangle className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {seller.status !== "Bloqueado" && (
                            <button 
                              onClick={() => handleSellerStatusChange(seller.id, "Bloqueado")}
                              title="Bloquear Permanentemente"
                              className="p-1 rounded bg-slate-500/10 hover:bg-slate-500/25 text-slate-400 transition-colors"
                            >
                              <Ban className="h-3.5 w-3.5" />
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
        )}

        {/* Table 2: COMPRADORES */}
        {subTab === "compradores" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`text-[10px] font-bold uppercase tracking-wider border-b ${
                  darkMode ? "bg-slate-950/60 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-100 text-slate-500"
                }`}>
                  <th className="p-4">Comprador</th>
                  <th className="p-4">Contacto</th>
                  <th className="p-4">Historial de Compras</th>
                  <th className="p-4">Reportes Recibidos</th>
                  <th className="p-4">Reclamos Hechos</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-right">Controles</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {filteredBuyers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">Ningún comprador coincide con la búsqueda.</td>
                  </tr>
                ) : (
                  filteredBuyers.map((buyer) => (
                    <tr key={buyer.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={buyer.avatar} alt={buyer.name} className="h-9 w-9 rounded-full object-cover border border-slate-100 dark:border-slate-800" />
                          <div>
                            <span className="font-semibold block">{buyer.name}</span>
                            <span className="text-[10px] text-slate-400 block">Registrado: {buyer.registerDate}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-mono text-[11px]">{buyer.email}</div>
                        <div className="text-slate-400">{buyer.phone}</div>
                      </td>
                      <td className="p-4">
                        <span className="font-bold">{buyer.purchasesCount}</span> compras
                        <span className="block text-[10px] text-slate-400">Gasto: {formatCurrency(buyer.totalSpent)}</span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          buyer.reportsReceived > 0 ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-emerald-500"
                        }`}>
                          {buyer.reportsReceived} reportes
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-slate-500">{buyer.claimsMade} reclamos</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          buyer.status === "Activo" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                        }`}>
                          {buyer.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {buyer.status !== "Activo" && (
                            <button 
                              onClick={() => handleBuyerStatusChange(buyer.id, "Activo")}
                              title="Activar Cuenta"
                              className="p-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 transition-colors"
                            >
                              <CheckCircle className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {buyer.status !== "Suspendido" && (
                            <button 
                              onClick={() => handleBuyerStatusChange(buyer.id, "Suspendido")}
                              title="Suspender Comprador"
                              className="p-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-colors"
                            >
                              <AlertTriangle className="h-3.5 w-3.5" />
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
        )}

        {/* Table 3: TRANSPORTISTAS */}
        {subTab === "transportistas" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`text-[10px] font-bold uppercase tracking-wider border-b ${
                  darkMode ? "bg-slate-950/60 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-100 text-slate-500"
                }`}>
                  <th className="p-4">Transportista</th>
                  <th className="p-4">Licencia</th>
                  <th className="p-4">Rutas Oficiales</th>
                  <th className="p-4">Tarifa base</th>
                  <th className="p-4">Desempeño / Rating</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-right">Controles</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {filteredCarriers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">Ningún transportista coincide con la búsqueda.</td>
                  </tr>
                ) : (
                  filteredCarriers.map((carrier) => (
                    <tr key={carrier.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={carrier.avatar} alt={carrier.name} className="h-9 w-9 rounded-full object-cover border border-slate-100 dark:border-slate-800" />
                          <span className="font-semibold">{carrier.name}</span>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-[11px] text-slate-500">{carrier.license}</td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {carrier.routes.map((route, idx) => (
                            <span key={idx} className={`px-1.5 py-0.5 rounded text-[9px] flex items-center gap-0.5 ${
                              darkMode ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"
                            }`}>
                              <MapPin className="h-2 w-2 text-indigo-400" />
                              {route}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 font-mono font-medium">{carrier.fare}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 font-bold">
                          <Star className="h-3.5 w-3.5 fill-amber-400 stroke-amber-400" />
                          <span>{carrier.rating}</span>
                          <span className="text-[10px] text-slate-400 font-normal">({carrier.deliveriesCount} fletes)</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          carrier.status === "Aprobado" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                        }`}>
                          {carrier.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {carrier.status !== "Aprobado" && (
                            <button 
                              onClick={() => handleCarrierStatusChange(carrier.id, "Aprobado")}
                              title="Aprobar Transportista"
                              className="p-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 transition-colors"
                            >
                              <CheckCircle className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {carrier.status !== "Suspendido" && (
                            <button 
                              onClick={() => handleCarrierStatusChange(carrier.id, "Suspendido")}
                              title="Suspender Transportista"
                              className="p-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-colors"
                            >
                              <AlertTriangle className="h-3.5 w-3.5" />
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
        )}

        {/* Table 4: ADMINISTRADORES */}
        {subTab === "administradores" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`text-[10px] font-bold uppercase tracking-wider border-b ${
                  darkMode ? "bg-slate-950/60 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-100 text-slate-500"
                }`}>
                  <th className="p-4">Administrador</th>
                  <th className="p-4">Correo</th>
                  <th className="p-4">Rol / Privilegio</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-right">Seguridad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="p-4 font-semibold flex items-center gap-2">
                      <Shield className={`h-4 w-4 ${
                        admin.role === "Super Administrador" ? "text-rose-500" : "text-indigo-400"
                      }`} />
                      {admin.name}
                    </td>
                    <td className="p-4 font-mono text-slate-400">{admin.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        admin.role === "Super Administrador" ? "bg-rose-500/15 text-rose-500" :
                        admin.role === "Administrador General" ? "bg-indigo-500/15 text-indigo-400" :
                        admin.role === "Moderador" ? "bg-amber-500/15 text-amber-500" :
                        "bg-slate-500/15 text-slate-500"
                      }`}>
                        {admin.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        admin.status === "Activo" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                      }`}>
                        {admin.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditAdmin(admin)}
                          title="Editar Administrador"
                          className="p-1 rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        {admin.id !== "a1" ? (
                          <button 
                            onClick={() => toggleAdminStatus(admin.id)}
                            className={`text-xs px-2.5 py-1 rounded-lg border font-semibold hover:opacity-85 ${
                              admin.status === "Activo" 
                                ? "bg-rose-500/10 border-rose-500/20 text-rose-500" 
                                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                            }`}
                          >
                            {admin.status === "Activo" ? "Desactivar" : "Activar"}
                          </button>
                        ) : (
                          <span className="text-slate-400 italic text-[10px]">Titular Principal</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
