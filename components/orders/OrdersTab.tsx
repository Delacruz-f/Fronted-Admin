"use client";



import React, { useState } from "react";
import { 
  Search, SlidersHorizontal, Eye, ShoppingBag, Truck, Calendar, DollarSign,
  AlertTriangle, ShieldCheck, Check, Ban, FileText, ArrowRight, X
} from "lucide-react";
import { Order } from "@/lib/mockData";
import { formatCurrency } from "@/lib/format";

interface OrdersTabProps {
  darkMode: boolean;
  orders: Order[];
  onUpdateOrders: (orders: Order[]) => void;
  onShowNotification: (text: string, type: "success" | "warning" | "error") => void;
}

export default function OrdersTab({
  darkMode,
  orders,
  onUpdateOrders,
  onShowNotification,
}: OrdersTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  
  // Dispute Resolution Modal States
  const [selectedDisputeOrder, setSelectedDisputeOrder] = useState<Order | null>(null);
  const [adminDecision, setAdminDecision] = useState("");
  const [isAiResolving, setIsAiResolving] = useState(false);

  // Filter orders
  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          o.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.sellerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "todos" || o.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (id: string, newStatus: Order["status"]) => {
    const updated = orders.map(o => o.id === id ? { ...o, status: newStatus } : o);
    onUpdateOrders(updated);
    onShowNotification(`El pedido cambió de estado a: ${newStatus}`, "success");
  };

  const handleResolveDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDisputeOrder) return;
    if (!adminDecision.trim()) {
      onShowNotification("Por favor ingresa la decisión formal antes de resolver.", "error");
      return;
    }

    setIsAiResolving(true);

    try {
      // Execute Server-side Gemini request to draft a formal agreement based on admin notes!
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "dispute_resolve",
          payload: {
            orderId: selectedDisputeOrder.code,
            buyerClaim: selectedDisputeOrder.buyerClaim,
            sellerClaim: selectedDisputeOrder.sellerClaim,
            adminDecision: adminDecision,
          }
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Update Order list
      const updated = orders.map(o => o.id === selectedDisputeOrder.id ? { 
        ...o, 
        status: "Entregado" as const, // mark resolved (or refund depending on decision)
        disputeResolution: data.resolutionText 
      } : o);

      onUpdateOrders(updated);
      onShowNotification("La disputa se resolvió formalmente redactando un acta institucional con IA.", "success");
      setSelectedDisputeOrder(null);
      setAdminDecision("");
    } catch (err: any) {
      console.error(err);
      onShowNotification("Ocurrió un error al resolver la disputa: " + err.message, "error");
    } finally {
      setIsAiResolving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab intro */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">Supervisión de Pedidos y Transacciones</h3>
          <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            Monitorea el flujo de compras de la plataforma y arbitra pedidos en disputa.
          </p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por código de pedido, comprador, vendedor..."
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
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={`p-2 text-xs rounded-xl border focus:outline-none ${
            darkMode ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-white border-slate-200 text-slate-700"
          }`}
        >
          <option value="todos">Todos los Estados</option>
          <option value="pendiente">Pendiente de pago</option>
          <option value="pagado">Pagado</option>
          <option value="preparando">Preparando envío</option>
          <option value="en ruta">En ruta</option>
          <option value="entregado">Entregados</option>
          <option value="en disputa">En disputa</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className={`border rounded-2xl overflow-hidden ${
        darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`text-[10px] font-bold uppercase tracking-wider border-b ${
                darkMode ? "bg-slate-950/60 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-100 text-slate-500"
              }`}>
                <th className="p-4">Pedido</th>
                <th className="p-4">Participantes</th>
                <th className="p-4">Transporte</th>
                <th className="p-4">Fecha</th>
                <th className="p-4">Monto</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-right">Monitoreo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">No se encontraron pedidos.</td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    {/* Code */}
                    <td className="p-4 font-bold font-mono text-indigo-400">
                      {order.code}
                    </td>

                    {/* Parties */}
                    <td className="p-4">
                      <div>
                        <span className="text-slate-400">Comprador: </span>
                        <span className="font-semibold">{order.buyerName}</span>
                      </div>
                      <div className="mt-0.5">
                        <span className="text-slate-400">Vendedor: </span>
                        <span className="font-medium">{order.sellerName}</span>
                      </div>
                    </td>

                    {/* Carrier */}
                    <td className="p-4 font-medium flex items-center gap-1.5 mt-2">
                      <Truck className="h-3.5 w-3.5 text-slate-400" />
                      <span>{order.carrierName}</span>
                    </td>

                    {/* Date */}
                    <td className="p-4 font-mono text-[11px] text-slate-400">
                      {order.date}
                    </td>

                    {/* Amount */}
                    <td className="p-4 font-bold font-mono text-slate-700 dark:text-slate-300">
                      {formatCurrency(order.amount)}
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        order.status === "En disputa" ? "bg-rose-500/15 text-rose-500 font-bold animate-pulse" :
                        order.status === "En ruta" ? "bg-blue-500/10 text-blue-500" :
                        order.status === "Entregado" ? "bg-emerald-500/10 text-emerald-500" :
                        order.status === "Pendiente" ? "bg-slate-500/10 text-slate-400" :
                        "bg-amber-500/10 text-amber-500"
                      }`}>
                        {order.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      {order.status === "En disputa" ? (
                        <button
                          onClick={() => setSelectedDisputeOrder(order)}
                          className="px-3 py-1 text-[11px] font-semibold bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors flex items-center gap-1.5 ml-auto"
                        >
                          <AlertTriangle className="h-3.5 w-3.5" />
                          <span>Arbitrar</span>
                        </button>
                      ) : order.disputeResolution ? (
                        <button
                          onClick={() => {
                            // Simple mock info dialog using notification in-app instead of blocking window.alert
                            onShowNotification(`Historial de Arbitraje: ${order.disputeResolution?.substring(0, 100)}...`, "success");
                          }}
                          className="text-[10px] font-medium text-emerald-500 underline hover:opacity-85"
                        >
                          Ver Resolución
                        </button>
                      ) : (
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as any)}
                          className={`p-1 text-[10px] rounded-md border focus:outline-none ${
                            darkMode ? "bg-slate-950 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-600"
                          }`}
                        >
                          <option value="Pendiente">Pendiente</option>
                          <option value="Pagado">Pagado</option>
                          <option value="Preparando">Preparando</option>
                          <option value="En ruta">En ruta</option>
                          <option value="Entregado">Entregado</option>
                          <option value="Cancelado">Cancelado</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DISPUTE RESOLUTION MODAL POPUP */}
      {selectedDisputeOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className={`p-6 rounded-2xl border w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-5 transition-all ${
            darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
          }`}>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-rose-500" />
                <h4 className="font-bold text-base">Tribunal de Mediación Ranti ({selectedDisputeOrder.code})</h4>
              </div>
              <button 
                onClick={() => setSelectedDisputeOrder(null)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Claims */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className={`p-4 rounded-xl border ${darkMode ? "bg-slate-950 border-slate-850" : "bg-slate-50 border-slate-150"}`}>
                <span className="font-bold text-rose-500 block mb-1">RECLAMO DEL COMPRADOR ({selectedDisputeOrder.buyerName})</span>
                <p className="italic text-slate-600 dark:text-slate-400 font-medium">&quot;{selectedDisputeOrder.buyerClaim}&quot;</p>
              </div>
              <div className={`p-4 rounded-xl border ${darkMode ? "bg-slate-950 border-slate-850" : "bg-slate-50 border-slate-150"}`}>
                <span className="font-bold text-amber-500 block mb-1">DESCARGO DEL VENDEDOR ({selectedDisputeOrder.sellerName})</span>
                <p className="italic text-slate-600 dark:text-slate-400 font-medium">&quot;{selectedDisputeOrder.sellerClaim}&quot;</p>
              </div>
            </div>

            {/* Admin Input Form */}
            <form onSubmit={handleResolveDispute} className="space-y-4">
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                  Dirección y Fallo del Administrador
                </label>
                <textarea
                  rows={4}
                  value={adminDecision}
                  onChange={(e) => setAdminDecision(e.target.value)}
                  placeholder="Ej: Se dictamina reembolso del 100% al comprador ya que el producto llegó defectuoso. El transportista MExpress asume 50% de la pérdida por manipulación negligente comprobada."
                  className={`w-full p-3 text-xs rounded-xl border focus:outline-none font-medium ${
                    darkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-slate-250 text-slate-900"
                  }`}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedDisputeOrder(null)}
                  className={`px-4 py-2 text-xs rounded-lg border font-semibold ${
                    darkMode ? "border-slate-800 text-slate-400 hover:bg-slate-950" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isAiResolving}
                  className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center gap-2 shadow-md transition-all disabled:opacity-50"
                >
                  {isAiResolving ? (
                    <>
                      <span className="animate-spin inline-block h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full" />
                      <span>Mediando con IA...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      <span>Emitir Fallo Formal</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
