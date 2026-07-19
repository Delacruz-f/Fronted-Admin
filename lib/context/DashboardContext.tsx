"use client";

// lib/context/DashboardContext.tsx
// Propiedad: Persona A (líder)
// Estado global "mock" del panel: modo oscuro, notificaciones, y las
// entidades que se comparten entre módulos (usuarios y verificaciones).

import React, { createContext, useContext, useState, useCallback } from "react";
import {
  Seller,
  Buyer,
  Carrier,
  AdminUser,
  VerificationRequest,
  sellers as initialSellers,
  buyers as initialBuyers,
  carriers as initialCarriers,
  admins as initialAdmins,
  verificationRequests as initialVerifications,
} from "@/lib/mockData";

type NotificationType = "success" | "warning" | "error";

interface Notification {
  id: number;
  text: string;
  type: NotificationType;
}

interface DashboardContextValue {
  darkMode: boolean;
  toggleDarkMode: () => void;
  notifications: Notification[];
  showNotification: (text: string, type: NotificationType) => void;

  sellers: Seller[];
  setSellers: (s: Seller[]) => void;
  buyers: Buyer[];
  setBuyers: (b: Buyer[]) => void;
  carriers: Carrier[];
  setCarriers: (c: Carrier[]) => void;
  admins: AdminUser[];
  setAdmins: (a: AdminUser[]) => void;
  verifications: VerificationRequest[];
  setVerifications: (v: VerificationRequest[]) => void;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [sellers, setSellers] = useState<Seller[]>(initialSellers);
  const [buyers, setBuyers] = useState<Buyer[]>(initialBuyers);
  const [carriers, setCarriers] = useState<Carrier[]>(initialCarriers);
  const [admins, setAdmins] = useState<AdminUser[]>(initialAdmins);
  const [verifications, setVerifications] = useState<VerificationRequest[]>(initialVerifications);

  const toggleDarkMode = useCallback(() => setDarkMode((d) => !d), []);

  const showNotification = useCallback((text: string, type: NotificationType) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        notifications,
        showNotification,
        sellers,
        setSellers,
        buyers,
        setBuyers,
        carriers,
        setCarriers,
        admins,
        setAdmins,
        verifications,
        setVerifications,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error("useDashboard debe usarse dentro de <DashboardProvider>");
  }
  return ctx;
}
