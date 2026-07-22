// lib/format.ts — Propiedad: Persona A (líder)
//
// Utilidad central de formato de moneda. Toda la app muestra montos en
// Soles peruanos (PEN) a través de esta única función — si en el futuro
// hay que cambiar de moneda otra vez, solo se edita este archivo.

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
  }).format(amount);
}

// Versión compacta para espacios reducidos (ej. "S/ 14.8k" en vez de "S/ 14,800.00")
export function formatCurrencyCompact(amount: number): string {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
}
