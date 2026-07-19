import { NextRequest, NextResponse } from "next/server";

// app/api/gemini/route.ts — Propiedad: Persona A (líder)
// NOTA: esto es un mock para que los botones de IA funcionen sin backend real.
// Para conectar el modelo real, reemplacen cada "case" por una llamada a la
// API de su proveedor de IA, usando la API key desde una variable de entorno
// (nunca la escriban directo en el código ni la suban a GitHub).

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action, payload } = body;

  switch (action) {
    case "moderate_chat":
      return NextResponse.json({
        violationDetected: true,
        category: "Lenguaje Ofensivo",
        riskLevel: "Medio",
        reason: "Se detectó lenguaje agresivo reiterado en la conversación reportada.",
        recommendedAction: "Advertencia",
        generatedWarning:
          "Tu cuenta ha recibido una advertencia por incumplimiento de las normas de convivencia de CoraMarket.",
      });

    case "dispute_resolve":
      return NextResponse.json({
        resolutionText: `Acta de mediación para el pedido ${payload?.orderId ?? ""}: tras revisar los reclamos de ambas partes, se resuelve conforme a la decisión del administrador: "${payload?.adminDecision ?? ""}".`,
      });

    case "draft_reply":
      return NextResponse.json({
        replyText: `Hola, gracias por escribirnos sobre "${payload?.ticketSubject ?? "tu consulta"}". Estamos revisando tu caso y te responderemos con una solución a la brevedad.`,
      });

    default:
      return NextResponse.json({ error: "Acción no reconocida" }, { status: 400 });
  }
}
