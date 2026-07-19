import type { Metadata } from "next";
import "./globals.css";

// app/layout.tsx — Propiedad: Persona A (líder)

export const metadata: Metadata = {
  title: "CoraMarket Admin",
  description: "Panel de administración de CoraMarket",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
