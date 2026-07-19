"use client";

// components/support/SupportTab.tsx — Propiedad: Persona D

import React, { useState } from "react";
import { 
  HelpCircle, Search, Sliders, MessageSquare, Clock, ShieldAlert, Check,
  Reply, Sparkles, Send, X, ArrowUpRight, FolderHeart, Info
} from "lucide-react";
import { SupportTicket } from "@/lib/mockData";

interface SupportTabProps {
  darkMode: boolean;
  tickets: SupportTicket[];
  onUpdateTickets: (tickets: SupportTicket[]) => void;
  onShowNotification: (text: string, type: "success" | "warning" | "error") => void;
}

export default function SupportTab({
  darkMode,
  tickets,
  onUpdateTickets,
  onShowNotification,
}: SupportTabProps) {
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    tickets.length > 0 ? tickets[0] : null
  );

  const [categoryFilter, setCategoryFilter] = useState("todos");
  const [searchQuery, setSearchQuery] = useState("");

  // Ticket Reply draft states
  const [adminNotes, setAdminNotes] = useState("");
  const [replyText, setReplyText] = useState("");
  const [isDrafting, setIsDrafting] = useState(false);

  // Filter lists
  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "todos" || t.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleGenerateDraft = async () => {
    if (!selectedTicket) return;
    setIsDrafting(true);

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "draft_reply",
          payload: {
            ticketSubject: selectedTicket.subject,
            ticketDescription: selectedTicket.description,
            adminNotes: adminNotes,
          }
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setReplyText(data.replyText);
      onShowNotification("Borrador empático e institucional redactado con IA.", "success");
    } catch (err: any) {
      console.error(err);
      onShowNotification("Error al generar borrador de IA: " + err.message, "error");
    } finally {
      setIsDrafting(false);
    }
  };

  const handleSendReplyAndClose = (statusToSet: "Escalado" | "Cerrado") => {
    if (!selectedTicket) return;
    if (!replyText.trim()) {
      onShowNotification("Escribe o genera un mensaje de respuesta primero.", "error");
      return;
    }

    const updatedReply = {
      sender: "Soporte",
      text: replyText,
      date: new Date().toISOString().split("T")[0]
    };

    const updatedTickets = tickets.map(t => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          status: statusToSet,
          replies: [...t.replies, updatedReply]
        };
      }
      return t;
    });

    onUpdateTickets(updatedTickets);
    onShowNotification(
      statusToSet === "Cerrado" 
        ? "Ticket resuelto e hilo cerrado con éxito." 
        : "Ticket escalado a personal especializado.", 
      "success"
    );

    // Reset states
    setReplyText("");
    setAdminNotes("");
    
    // Select next open if any
    const nextOpen = updatedTickets.find(t => t.status !== "Cerrado");
    setSelectedTicket(nextOpen || null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Left List: Active Help Desk Tickets */}
      <div className="lg:col-span-1 space-y-4">
        <h4 className="font-semibold text-sm tracking-tight flex items-center gap-1.5">
          <HelpCircle className="h-4 w-4 text-indigo-400" />
          <span>BANDEJA HELP DESK ({tickets.filter(t => t.status !== "Cerrado").length})</span>
        </h4>

        {/* Filters */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por código, asunto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border focus:outline-none ${
                darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-950"
              }`}
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={`w-full p-2 text-[10px] font-semibold rounded-lg border focus:outline-none ${
              darkMode ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-white border-slate-200 text-slate-700"
            }`}
          >
            <option value="todos">Todas las Categorías de Soporte</option>
            <option value="Problemas de compra">Problemas de compra</option>
            <option value="Problemas de venta">Problemas de venta</option>
            <option value="Entregas">Entregas</option>
            <option value="Pagos">Pagos</option>
            <option value="Consultas generales">Consultas generales</option>
          </select>
        </div>

        {/* Tickets Scroll list */}
        <div className="space-y-2 max-h-[360px] overflow-y-auto">
          {filteredTickets.length === 0 ? (
            <div className={`p-6 rounded-2xl border text-center ${
              darkMode ? "bg-slate-900 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-500"
            }`}>
              <Check className="h-8 w-8 mx-auto text-emerald-500 mb-2" />
              <p className="text-xs font-semibold">¡Bandeja vacía!</p>
              <p className="text-[10px] text-slate-400 mt-1">No hay tickets de soporte pendientes de resolución.</p>
            </div>
          ) : (
            filteredTickets.map((t) => (
              <div
                key={t.id}
                onClick={() => {
                  setSelectedTicket(t);
                  setReplyText("");
                  setAdminNotes("");
                }}
                className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                  selectedTicket?.id === t.id
                    ? darkMode
                      ? "bg-slate-850 border-indigo-500 shadow-sm"
                      : "bg-indigo-50/70 border-indigo-250"
                    : darkMode
                      ? "bg-slate-900 border-slate-800 hover:bg-slate-850"
                      : "bg-white border-slate-100 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] font-bold text-slate-400">{t.code}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                    t.status === "Abierto" ? "bg-indigo-500/10 text-indigo-400" :
                    t.status === "Escalado" ? "bg-amber-500/10 text-amber-500" :
                    "bg-slate-500/10 text-slate-400"
                  }`}>
                    {t.status}
                  </span>
                </div>
                <h5 className="font-bold text-xs mt-1.5 truncate">{t.subject}</h5>
                <span className="text-[10px] text-slate-400 block mt-0.5">{t.userName} ({t.userRole})</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Column: Ticket active workspace */}
      <div className="lg:col-span-2">
        {selectedTicket ? (
          <div className={`p-5 rounded-2xl border space-y-5 ${
            darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
          }`}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-150 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono text-indigo-400">{selectedTicket.code} • {selectedTicket.category}</span>
                <h4 className="text-base font-bold">{selectedTicket.subject}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Usuario: <strong className="text-slate-300">{selectedTicket.userName}</strong> ({selectedTicket.userRole}) • {selectedTicket.date}</p>
              </div>

              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                selectedTicket.status === "Cerrado" 
                  ? "bg-emerald-500/10 text-emerald-500" 
                  : "bg-indigo-500/10 text-indigo-400"
              }`}>
                Estado: {selectedTicket.status}
              </span>
            </div>

            {/* Description card */}
            <div className={`p-4 rounded-xl border ${
              darkMode ? "bg-slate-950/40 border-slate-850" : "bg-slate-50/50 border-slate-150"
            }`}>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Descripción del Incidente</span>
              <p className="text-xs font-medium leading-relaxed mt-1 text-slate-600 dark:text-slate-300">
                &quot;{selectedTicket.description}&quot;
              </p>
            </div>

            {/* Replies history log */}
            {selectedTicket.replies.length > 0 && (
              <div className="space-y-2.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Historial de Comunicación</span>
                <div className="space-y-1.5">
                  {selectedTicket.replies.map((reply, idx) => (
                    <div 
                      key={idx} 
                      className={`p-3 rounded-lg border text-xs ${
                        reply.sender === "Soporte" 
                          ? "bg-emerald-500/5 border-emerald-500/10" 
                          : "bg-slate-500/10 border-slate-500/10"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1 text-[9px] font-bold text-slate-400">
                        <span>{reply.sender}</span>
                        <span>{reply.date}</span>
                      </div>
                      <p className="font-medium whitespace-pre-wrap">{reply.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Assistant response workspace */}
            {selectedTicket.status !== "Cerrado" && (
              <div className="space-y-4 pt-2 border-t border-slate-150 dark:border-slate-850">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Redacción de Respuesta</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Orientación IA: ej: ofrecer cupón, disculparse..."
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      className={`p-1.5 text-[10px] font-medium rounded-lg border focus:outline-none min-w-[200px] ${
                        darkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-slate-250 text-slate-900"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={handleGenerateDraft}
                      disabled={isDrafting}
                      className="px-3 py-1.5 text-[10px] font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center gap-1 transition-all disabled:opacity-50 shadow-sm"
                    >
                      {isDrafting ? (
                        <>
                          <span className="animate-spin h-3 w-3 border-2 border-white/30 border-t-white rounded-full inline-block" />
                          <span>Pensando...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                          <span>Asistente IA</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Response Textarea */}
                <div className="space-y-2">
                  <textarea
                    rows={6}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Escribe aquí tu respuesta para el usuario o genera un borrador empático haciendo clic en el Asistente IA de arriba..."
                    className={`w-full p-3.5 text-xs rounded-xl border focus:outline-none leading-relaxed font-medium ${
                      darkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-slate-250 text-slate-900"
                    }`}
                  />
                  
                  {/* Action row */}
                  <div className="flex items-center justify-end gap-2 text-xs">
                    <button
                      onClick={() => handleSendReplyAndClose("Escalado")}
                      className={`px-3.5 py-2 rounded-lg border font-semibold transition-all ${
                        darkMode ? "border-slate-850 hover:bg-slate-850 text-slate-300" : "border-slate-200 hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      Escalar a Ingeniería
                    </button>
                    <button
                      onClick={() => handleSendReplyAndClose("Cerrado")}
                      className="px-4.5 py-2 font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center gap-1.5 shadow-md transition-all"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Responder y Cerrar Ticket</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        ) : (
          <div className={`p-12 rounded-2xl border text-center flex flex-col items-center justify-center ${
            darkMode ? "bg-slate-900 border-slate-800 text-slate-400" : "bg-white border-slate-100 text-slate-500"
          }`}>
            <HelpCircle className="h-10 w-10 text-slate-300 mb-2" />
            <p className="font-semibold">Selecciona un ticket del panel Help Desk</p>
          </div>
        )}
      </div>

    </div>
  );
}
