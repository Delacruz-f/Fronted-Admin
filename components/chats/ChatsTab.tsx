"use client";

// components/chats/ChatsTab.tsx — Propiedad: Persona D

import React, { useState } from "react";
import { 
  MessageSquare, ShieldAlert, AlertTriangle, AlertCircle, Sparkles, Check,
  User, Send, ShieldCheck, Mail, Info, Clock, CheckCheck
} from "lucide-react";
import { ReportedChat, Buyer, Seller } from "@/lib/mockData";

interface ChatsTabProps {
  darkMode: boolean;
  reportedChats: ReportedChat[];
  buyers: Buyer[];
  sellers: Seller[];
  onUpdateReportedChats: (chats: ReportedChat[]) => void;
  onUpdateBuyers: (buyers: Buyer[]) => void;
  onUpdateSellers: (sellers: Seller[]) => void;
  onShowNotification: (text: string, type: "success" | "warning" | "error") => void;
}

interface AiEvaluation {
  violationDetected: boolean;
  category: "Fraude" | "Lenguaje Ofensivo" | "Amenazas" | "Acoso" | "Ninguno";
  riskLevel: "Bajo" | "Medio" | "Alto";
  reason: string;
  recommendedAction: "Advertencia" | "Silencio 24h" | "Suspensión 7 días" | "Bloqueo Permanente" | "Ninguna";
  generatedWarning: string;
}

export default function ChatsTab({
  darkMode,
  reportedChats,
  buyers,
  sellers,
  onUpdateReportedChats,
  onUpdateBuyers,
  onUpdateSellers,
  onShowNotification,
}: ChatsTabProps) {
  const [selectedChat, setSelectedChat] = useState<ReportedChat | null>(
    reportedChats.length > 0 ? reportedChats[0] : null
  );

  const [aiEvaluation, setAiEvaluation] = useState<AiEvaluation | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeSanctionMessage, setActiveSanctionMessage] = useState("");

  const handleAuditWithAi = async (chat: ReportedChat) => {
    setIsAiLoading(true);
    setAiEvaluation(null);
    setActiveSanctionMessage("");

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "moderate_chat",
          payload: {
            messages: chat.messages,
            userType: "buyer_and_seller"
          }
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setAiEvaluation(data);
      setActiveSanctionMessage(data.generatedWarning);
      onShowNotification("Análisis de lenguaje y fraude completado por RantiAI.", "success");
    } catch (err: any) {
      console.error(err);
      onShowNotification("No se pudo auditar el chat: " + err.message, "error");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleApplySanction = (chat: ReportedChat, actionType: string) => {
    if (!actionType || actionType === "Ninguna") return;

    // 1. Update status in reported chats
    const updatedChats = reportedChats.map(c => c.id === chat.id ? { ...c, status: "Sancionado" as const } : c);
    onUpdateReportedChats(updatedChats);

    // 2. Locate the offender based on the evaluation or messages
    // Let's look for Juan Ignacio Pérez as a default since he is the offender in ch1, or Roberto in ch2
    const offenderName = chat.id === "ch1" ? "Juan Ignacio Pérez" : "Roberto Tapia (Muebles Sur)";

   if (chat.id === "ch1") {
      // offender is Juan Ignacio (Buyer) — Buyer no tiene estado "Bloqueado", solo "Suspendido"
      const buyerOffender = buyers.find(b => b.name === offenderName);
      if (buyerOffender) {
        onUpdateBuyers(buyers.map(b => b.id === buyerOffender.id ? { ...b, status: "Suspendido" as const } : b));
      }
    } else {
      // offender is Roberto (Seller)
      const sellerOffender = sellers.find(s => s.name.includes("Roberto Tapia"));
      if (sellerOffender) {
        const nextStatus = actionType.includes("Bloqueo") ? "Bloqueado" as const : "Suspendido" as const;
        onUpdateSellers(sellers.map(s => s.id === sellerOffender.id ? { ...s, status: nextStatus } : s));
      }
    }

    onShowNotification(`Sanción aplicada: Cuenta del infractor de Ranti actualizada a ${actionType}.`, "success");
    
    // Select next pending
    const nextPending = updatedChats.find(c => c.status === "Pendiente");
    setSelectedChat(nextPending || null);
    setAiEvaluation(null);
    setActiveSanctionMessage("");
  };

  const pendingChats = reportedChats.filter(c => c.status === "Pendiente");
  const reviewedChats = reportedChats.filter(c => c.status !== "Pendiente");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Left list - Flagged chats */}
      <div className="lg:col-span-1 space-y-4">
        <h4 className="font-semibold text-sm tracking-tight flex items-center gap-1.5">
          <ShieldAlert className="h-4 w-4 text-rose-500 animate-pulse" />
          <span>DENUNCIAS DE CONVERSACIÓN ({pendingChats.length})</span>
        </h4>

        <div className="space-y-2">
          {pendingChats.length === 0 ? (
            <div className={`p-6 rounded-2xl border text-center ${
              darkMode ? "bg-slate-900 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-250 text-slate-500"
            }`}>
              <CheckCheck className="h-8 w-8 mx-auto text-emerald-500 mb-2" />
              <p className="text-xs font-semibold">¡Comunidad Limpia!</p>
              <p className="text-[10px] text-slate-400 mt-1">No hay chats denunciados esperando auditoría.</p>
            </div>
          ) : (
            pendingChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => {
                  setSelectedChat(chat);
                  setAiEvaluation(null);
                  setActiveSanctionMessage("");
                }}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                  selectedChat?.id === chat.id
                    ? darkMode
                      ? "bg-slate-850 border-rose-500 shadow-sm"
                      : "bg-rose-50/50 border-rose-300"
                    : darkMode
                      ? "bg-slate-900 border-slate-800 hover:bg-slate-850"
                      : "bg-white border-slate-100 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[8px] font-bold bg-rose-500/10 text-rose-500 uppercase tracking-wider">
                    {chat.reason}
                  </span>
                </div>
                <h5 className="font-bold text-xs mt-2 truncate">
                  {chat.buyerName} ⇄ {chat.sellerName.substring(0, 15)}
                </h5>
                <div className="flex items-center gap-1.5 mt-2">
                  {chat.scannedFlags.map((fl, idx) => (
                    <span key={idx} className="bg-amber-500/15 text-amber-500 rounded px-1.5 py-0.5 text-[9px] font-semibold">
                      {fl}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {reviewedChats.length > 0 && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-2">Historial de Moderación</span>
            <div className="space-y-1.5">
              {reviewedChats.map((chat) => (
                <div 
                  key={chat.id}
                  onClick={() => {
                    setSelectedChat(chat);
                    setAiEvaluation(null);
                    setActiveSanctionMessage("");
                  }}
                  className={`p-2.5 rounded-lg border text-left text-[10px] cursor-pointer transition-all flex items-center justify-between ${
                    selectedChat?.id === chat.id
                      ? darkMode ? "bg-slate-850 border-slate-750" : "bg-slate-100 border-slate-300"
                      : darkMode ? "bg-slate-900/60 border-slate-800" : "bg-slate-50/50 border-slate-100"
                  }`}
                >
                  <span className="font-bold truncate max-w-[120px]">{chat.buyerName} ⇄ {chat.sellerName}</span>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-emerald-500/10 text-emerald-500">
                    Sancionado
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column - Audit Screen */}
      <div className="lg:col-span-2">
        {selectedChat ? (
          <div className={`p-5 rounded-2xl border space-y-6 ${
            darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
          }`}>
            {/* Auditing Top Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-150 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-rose-500 block">Auditoría de Incidente</span>
                <h4 className="text-base font-bold">Chats de {selectedChat.buyerName} y {selectedChat.sellerName}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Denunciado por: <span className="font-semibold text-rose-400">{selectedChat.reason}</span></p>
              </div>

              {selectedChat.status === "Pendiente" && (
                <button
                  onClick={() => handleAuditWithAi(selectedChat)}
                  disabled={isAiLoading}
                  className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  {isAiLoading ? (
                    <>
                      <span className="animate-spin inline-block h-3 w-3 border-2 border-white/30 border-t-white rounded-full" />
                      <span>Analizando...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Auditar Chat con IA</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Chat Box Conversation Log */}
            <div className="space-y-4">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Registro de Mensajes Recientes</span>
              
              <div className={`p-4 rounded-xl border max-h-[220px] overflow-y-auto space-y-3 font-medium ${
                darkMode ? "bg-slate-950/40 border-slate-850" : "bg-slate-50/50 border-slate-150"
              }`}>
                {selectedChat.messages.map((m, idx) => {
                  const isSeller = m.role === "seller";
                  return (
                    <div 
                      key={idx} 
                      className={`flex flex-col p-2.5 rounded-lg max-w-[85%] text-xs ${
                        isSeller 
                          ? "bg-indigo-600/10 border border-indigo-500/10 self-start ml-2" 
                          : "bg-slate-500/10 border border-slate-500/10 self-end mr-2 align-right ml-auto"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-[10px] text-indigo-400">{m.sender}</span>
                        <span className="text-[8px] text-slate-500 font-mono">{m.timestamp}</span>
                      </div>
                      <p className={darkMode ? "text-slate-300" : "text-slate-700"}>{m.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Smart Evaluation results */}
            {aiEvaluation && (
              <div className={`p-4 rounded-xl border space-y-4 animate-fade-in ${
                darkMode ? "bg-slate-950 border-slate-800" : "bg-indigo-50/20 border-indigo-200"
              }`}>
                <div className="flex items-center justify-between border-b border-slate-150 dark:border-slate-850 pb-2">
                  <div className="flex items-center gap-1.5 text-indigo-400 font-bold text-xs">
                    <Sparkles className="h-4 w-4 animate-pulse text-amber-500" />
                    <span>DICTAMEN DE INTELIGENCIA DE SEGURIDAD RANTIAI</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    aiEvaluation.riskLevel === "Alto" 
                      ? "bg-rose-500/20 text-rose-500" 
                      : aiEvaluation.riskLevel === "Medio" 
                      ? "bg-amber-500/20 text-amber-500" 
                      : "bg-emerald-500/25 text-emerald-500"
                  }`}>
                    Riesgo {aiEvaluation.riskLevel}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Infracción Clasificada</span>
                    <span className="font-bold text-rose-500 block text-sm mt-0.5">{aiEvaluation.category}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Acción de Seguridad Recomendada</span>
                    <span className="font-bold text-indigo-400 block text-sm mt-0.5">{aiEvaluation.recommendedAction}</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px]">Razonamiento Técnico</span>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-300 mt-1">{aiEvaluation.reason}</p>
                </div>

                {/* Auto Warning Draft */}
                <div className="space-y-1">
                  <span className="text-slate-400 block text-[10px]">Notificación Sanción (Draft)</span>
                  <textarea
                    rows={3}
                    value={activeSanctionMessage}
                    onChange={(e) => setActiveSanctionMessage(e.target.value)}
                    className={`w-full p-2.5 text-xs rounded-xl border focus:outline-none ${
                      darkMode ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-white border-slate-200 text-slate-700"
                    }`}
                  />
                </div>

                {/* Form submit */}
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => handleApplySanction(selectedChat, aiEvaluation.recommendedAction)}
                    className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-lg flex items-center gap-1.5 shadow-md transition-all"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    <span>Aplicar Sanción Recomendada ({aiEvaluation.recommendedAction})</span>
                  </button>
                </div>
              </div>
            )}

            {/* Standard notification banner */}
            {!aiEvaluation && (
              <div className={`p-4 rounded-xl border flex items-start gap-2.5 ${
                darkMode ? "bg-slate-950/20 border-slate-800/80 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-600"
              }`}>
                <Info className="h-4.5 w-4.5 text-indigo-400 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  Para respetar la privacidad de la comunidad, el acceso a transcripciones de chat solo está autorizado tras una denuncia explícita de usuario o por la detección de palabras ofensivas por el motor estático. Haga clic en <strong className="text-indigo-400">&quot;Auditar Chat con IA&quot;</strong> para procesar un dictamen de convivencia automático.
                </p>
              </div>
            )}

          </div>
        ) : (
          <div className={`p-12 rounded-2xl border text-center flex flex-col items-center justify-center h-48 ${
            darkMode ? "bg-slate-900 border-slate-800 text-slate-400" : "bg-white border-slate-100 text-slate-500"
          }`}>
            <MessageSquare className="h-10 w-10 text-slate-300 mb-2" />
            <p className="font-semibold">Selecciona una denuncia del panel izquierdo</p>
          </div>
        )}
      </div>

    </div>
  );
}
