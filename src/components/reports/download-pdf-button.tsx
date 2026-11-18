import { buttonClasses } from "@/components/ui/button";

export function DownloadPdfButton({ href }: { href?: string }) {
  const icon = (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 4v11M7.5 10.5L12 15l4.5-4.5" />
      <path d="M5 19h14" />
    </svg>
  );

  if (!href) {
    return (
      <button type="button" disabled className={buttonClasses("primary", "h-[42px]")} title="Disponible cuando el reporte esté listo">
        {icon}
        Descargar PDF
      </button>
    );
  }

  return (
    <a href={href} download className={buttonClasses("primary", "h-[42px]")}>
      {icon}
      Descargar PDF
    </a>
  );
}