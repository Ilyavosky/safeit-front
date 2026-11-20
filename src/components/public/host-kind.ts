import type { HostKind } from "@/lib/api/types";

export const HOST_KINDS: Record<HostKind, { label: string; description: string; className: string }> = {
  web_app: { label: "Aplicación web", description: "Sitio o aplicación que responde en el navegador.", className: "bg-[#1f2a44] text-[#8ea6ff]" },
  api: { label: "API", description: "Servicio que responde datos para otras aplicaciones.", className: "bg-[#1d3340] text-[#7fd0f0]" },
  mail: { label: "Correo", description: "Servidor o panel relacionado con el correo.", className: "bg-[#2b2540] text-[#b9a4f5]" },
  login_panel: { label: "Acceso", description: "Pantalla de inicio de sesión o panel de administración.", className: "bg-[#3a2c1d] text-[#f0b36b]" },
  docs: { label: "Documentación", description: "Ayuda, guías o documentación para desarrolladores.", className: "bg-[#1c3a2c] text-[#6fcf97]" },
  blog: { label: "Blog", description: "Contenido editorial, noticias o prensa.", className: "bg-[#1c3a2c] text-[#6fcf97]" },
  redirect: { label: "Redirección", description: "Envía a los visitantes a otro host.", className: "bg-[#2a2e35] text-[#c9ced5]" },
  no_service: { label: "Sin servicio web", description: "Existe el nombre, pero no respondió en web.", className: "bg-[#2a2e35] text-[#a0a7b0]" },
};

export const HOST_KIND_ORDER: HostKind[] = ["web_app", "api", "login_panel", "docs", "blog", "mail", "redirect", "no_service"];
