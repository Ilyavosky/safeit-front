import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SafeIT",
    template: "%s | SafeIT",
  },
  description: "Reconocimiento, análisis y pruebas de seguridad asistidas por IA.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}