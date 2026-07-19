"use client";

// app/page.tsx — Login — Propiedad: Persona A (líder)

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recoveryMessage, setRecoveryMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock: sin backend real todavía, solo navega al panel.
    router.push("/dashboard");
  };

  const handleGuestAccess = () => {
    router.push("/dashboard");
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setRecoveryMessage("Ingresa tu correo arriba y vuelve a intentarlo.");
      return;
    }
    // Mock: aquí en el futuro se llama al endpoint real de recuperación.
    setRecoveryMessage(
      `Si existe una cuenta para ${email}, te enviamos instrucciones para recuperar tu contraseña.`
    );
  };

  return (
    <main
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{ backgroundColor: "#F4EFE6" }}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-8"
        style={{ border: "0.5px solid #E4DCCB" }}
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <div
            className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl"
            style={{ backgroundColor: "#DD7A45" }}
          >
            <span className="text-lg font-semibold text-white">A</span>
          </div>
          <h1 className="text-lg font-semibold" style={{ color: "#2B2420" }}>
            Bienvenido de nuevo
          </h1>
          <p className="mt-1 text-sm" style={{ color: "#8A8078" }}>
            Inicia sesión para continuar
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: "#5B534A" }}>
              Correo
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
              style={{ borderColor: "#E4DCCB" }}
              placeholder="admin@coramarket.com"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold" style={{ color: "#5B534A" }}>
                Contraseña
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs font-semibold hover:underline"
                style={{ color: "#DD7A45" }}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
              style={{ borderColor: "#E4DCCB" }}
              placeholder="••••••••"
            />
          </div>

          {recoveryMessage && (
            <div
              className="rounded-lg px-3 py-2 text-xs"
              style={{ backgroundColor: "#FBF4EC", color: "#8A6A4A", border: "1px solid #E4DCCB" }}
            >
              {recoveryMessage}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-lg py-2.5 text-sm font-semibold text-white"
            style={{ backgroundColor: "#DD7A45" }}
          >
            Iniciar sesión
          </button>

          <div className="flex items-center gap-3 py-1">
            <div className="h-px flex-1" style={{ backgroundColor: "#E4DCCB" }} />
            <span className="text-[10px] uppercase tracking-wider" style={{ color: "#8A8078" }}>
              o
            </span>
            <div className="h-px flex-1" style={{ backgroundColor: "#E4DCCB" }} />
          </div>

          <button
            type="button"
            onClick={handleGuestAccess}
            className="w-full rounded-lg py-2.5 text-sm font-semibold border"
            style={{ borderColor: "#E4DCCB", color: "#5B534A" }}
          >
            Ingresar sin cuenta
          </button>
        </form>
      </div>
    </main>
  );
}