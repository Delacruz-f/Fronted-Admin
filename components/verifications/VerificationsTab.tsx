"use client";

// components/verifications/VerificationsTab.tsx — Propiedad: Persona B

import React, { useState } from "react";
import { 
  FileCheck, ShieldCheck, AlertTriangle, X, Check, ThumbsUp, ThumbsDown,
  FileText, Mail, Calendar, Eye, ShieldAlert, FileQuestion
} from "lucide-react";
import { VerificationRequest } from "@/lib/mockData";

interface VerificationsTabProps {
  darkMode: boolean;
  verifications: VerificationRequest[];
  onUpdateVerifications: (verifications: VerificationRequest[]) => void;
  onShowNotification: (text: string, type: "success" | "warning" | "error") => void;
  onApproveUser: (userId: string, userType: "Vendedor" | "Transportista") => void;
  onRejectUser: (userId: string, userType: "Vendedor" | "Transportista") => void;
}

export default function VerificationsTab({
  darkMode,
  verifications,
  onUpdateVerifications,
  onShowNotification,
  onApproveUser,
  onRejectUser,
}: VerificationsTabProps) {
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(
    verifications.length > 0 ? verifications[0] : null
  );

  const handleApprove = (req: VerificationRequest) => {
    // Set verification status to approved
    const updated = verifications.map(v => v.id === req.id ? { ...v, status: "Aprobado" as const } : v);
    onUpdateVerifications(updated);
    
    // Call user status update
    onApproveUser(req.userId, req.userType);
    
    onShowNotification(`Documentación de ${req.userName} verificada y cuenta activada exitosamente.`, "success");
    
    // Select next pending if any
    const nextPending = updated.find(v => v.status === "Pendiente");
    setSelectedRequest(nextPending || null);
  };

  const handleReject = (req: VerificationRequest) => {
    const updated = verifications.map(v => v.id === req.id ? { ...v, status: "Rechazado" as const } : v);
    onUpdateVerifications(updated);
    onRejectUser(req.userId, req.userType);
    
    onShowNotification(`Verificación de ${req.userName} rechazada. Se envió notificación solicitando correcciones.`, "error");
    
    const nextPending = updated.find(v => v.status === "Pendiente");
    setSelectedRequest(nextPending || null);
  };

  const pendingRequests = verifications.filter(v => v.status === "Pendiente");
  const processedRequests = verifications.filter(v => v.status !== "Pendiente");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Left Column: Pending List */}
      <div className="lg:col-span-1 space-y-4">
        <h4 className="font-semibold text-sm tracking-tight flex items-center gap-1.5">
          <ShieldAlert className="h-4 w-4 text-indigo-500" />
          <span>SOLICITUDES KYC PENDIENTES ({pendingRequests.length})</span>
        </h4>

        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {pendingRequests.length === 0 ? (
            <div className={`p-6 rounded-2xl border text-center ${
              darkMode ? "bg-slate-900 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-500"
            }`}>
              <FileCheck className="h-8 w-8 mx-auto text-emerald-500 mb-2" />
              <p className="text-xs font-semibold">¡Todo al día!</p>
              <p className="text-[10px] text-slate-400 mt-1">No hay verificaciones de perfil pendientes de revisión.</p>
            </div>
          ) : (
            pendingRequests.map((req) => (
              <div
                key={req.id}
                onClick={() => setSelectedRequest(req)}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                  selectedRequest?.id === req.id
                    ? darkMode
                      ? "bg-slate-850 border-indigo-600 shadow-sm"
                      : "bg-indigo-50/70 border-indigo-300"
                    : darkMode
                      ? "bg-slate-900 border-slate-800 hover:bg-slate-850"
                      : "bg-white border-slate-100 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    req.userType === "Vendedor" 
                      ? "bg-emerald-500/10 text-emerald-500" 
                      : "bg-blue-500/10 text-blue-500"
                  }`}>
                    {req.userType}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{req.registerDate}</span>
                </div>
                <h5 className="font-bold text-xs mt-2">{req.userName}</h5>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">DNI: {req.dni}</p>
              </div>
            ))
          )}
        </div>

        {/* Processed requests log */}
        {processedRequests.length > 0 && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-2">Historial de Verificaciones</span>
            <div className="space-y-1.5">
              {processedRequests.map((req) => (
                <div 
                  key={req.id}
                  onClick={() => setSelectedRequest(req)}
                  className={`p-2.5 rounded-lg border text-left text-[10px] cursor-pointer transition-all flex items-center justify-between ${
                    selectedRequest?.id === req.id
                      ? darkMode ? "bg-slate-850 border-slate-750" : "bg-slate-100 border-slate-300"
                      : darkMode ? "bg-slate-900/60 border-slate-800" : "bg-slate-50/50 border-slate-100"
                  }`}
                >
                  <div>
                    <span className="font-bold block">{req.userName}</span>
                    <span className="text-[9px] text-slate-400">{req.userType} • DNI {req.dni}</span>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                    req.status === "Aprobado" 
                      ? "bg-emerald-500/10 text-emerald-500" 
                      : "bg-rose-500/10 text-rose-500"
                  }`}>
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Active KYC Preview & Audit Panel */}
      <div className="lg:col-span-2">
        {selectedRequest ? (
          <div className={`p-5 rounded-2xl border space-y-6 ${
            darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
          }`}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-150 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-400 block">Auditoría KYC Manual</span>
                <h4 className="text-lg font-bold">{selectedRequest.userName}</h4>
                <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  Registro como <span className="font-semibold">{selectedRequest.userType}</span> • {selectedRequest.email}
                </p>
              </div>

              {selectedRequest.status === "Pendiente" ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReject(selectedRequest)}
                    className="px-3 py-1.5 text-xs font-semibold bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-lg hover:bg-rose-500/20 flex items-center gap-1 transition-colors"
                  >
                    <ThumbsDown className="h-3.5 w-3.5" />
                    <span>Rechazar</span>
                  </button>
                  <button
                    onClick={() => handleApprove(selectedRequest)}
                    className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center gap-1 shadow-sm transition-colors"
                  >
                    <ThumbsUp className="h-3.5 w-3.5" />
                    <span>Aprobar KYC</span>
                  </button>
                </div>
              ) : (
                <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  selectedRequest.status === "Aprobado" 
                    ? "bg-emerald-500/10 text-emerald-500" 
                    : "bg-rose-500/10 text-rose-500"
                }`}>
                  Solicitud {selectedRequest.status}
                </span>
              )}
            </div>

            {/* Audit Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left detail card */}
              <div className="space-y-4">
                <div className={`p-4 rounded-xl border space-y-3 ${
                  darkMode ? "bg-slate-950/40 border-slate-800/80" : "bg-slate-50/50 border-slate-100"
                }`}>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Comparación de Datos</span>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Nombre Registrado</span>
                      <span className="font-semibold">{selectedRequest.userName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">DNI Tributario</span>
                      <span className="font-semibold font-mono">{selectedRequest.dni}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Correo Electrónico</span>
                      <span className="font-mono truncate block max-w-[150px]">{selectedRequest.email}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Fecha Registro</span>
                      <span className="font-mono">{selectedRequest.registerDate}</span>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border space-y-2.5 ${
                  darkMode ? "bg-slate-950/40 border-slate-800/80" : "bg-slate-50/50 border-slate-100"
                }`}>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Referencias y Garantías</span>
                  
                  <div>
                    <span className="text-slate-400 block text-[10px]">Referencias Comunales Oficiales</span>
                    <p className="text-xs font-medium mt-0.5">{selectedRequest.communalRef}</p>
                  </div>

                  {selectedRequest.companyInfo && (
                    <div className="pt-2 border-t border-slate-150 dark:border-slate-850">
                      <span className="text-slate-400 block text-[10px]">Información de la Empresa</span>
                      <p className="text-xs font-semibold text-indigo-400 mt-0.5">{selectedRequest.companyInfo}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right detail card: Image previews */}
              <div className="space-y-4">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Documentos Adjuntos</span>
                
                <div className="grid grid-cols-2 gap-3">
                  {/* Selfie frame */}
                  <div className="space-y-1 text-center">
                    <span className="text-[10px] text-slate-400 font-medium">Foto del Rostro</span>
                    <div className={`relative aspect-square rounded-xl overflow-hidden border ${
                      darkMode ? "border-slate-800 bg-slate-950" : "border-slate-200 bg-slate-50"
                    }`}>
                      <img 
                        src={selectedRequest.selfieUrl} 
                        alt="Foto Selfie" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* DNI front frame */}
                  <div className="space-y-1 text-center">
                    <span className="text-[10px] text-slate-400 font-medium">DNI Frente</span>
                    <div className={`relative aspect-square rounded-xl overflow-hidden border ${
                      darkMode ? "border-slate-800 bg-slate-950" : "border-slate-200 bg-slate-50"
                    }`}>
                      <img 
                        src={selectedRequest.dniFrontUrl} 
                        alt="DNI Escaneado" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                <div className={`p-3 rounded-lg border text-[10px] flex items-center gap-2 ${
                  darkMode ? "bg-slate-950/20 border-slate-800/80 text-slate-400" : "bg-slate-100/60 border-slate-200 text-slate-600"
                }`}>
                  <ShieldCheck className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span>Por seguridad, el sistema valida biométricamente los rostros antes de presentarlos al administrador.</span>
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div className={`p-12 rounded-2xl border text-center flex flex-col items-center justify-center ${
            darkMode ? "bg-slate-900 border-slate-800 text-slate-400" : "bg-white border-slate-100 text-slate-500"
          }`}>
            <FileQuestion className="h-12 w-12 text-slate-300 mb-3" />
            <p className="font-semibold">Sin solicitud seleccionada</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Selecciona una solicitud de verificación del listado de la izquierda para comenzar el proceso de auditoría de identidad.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
