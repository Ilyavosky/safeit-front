import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ApiError } from "@/lib/api/client";

export function ErrorNotice({ error, onRetry }: { error?: ApiError; onRetry?: () => void }) {
  if (!error) return null;
  const forbidden = error.status === 403;
  return (
    <Card role="alert" className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border-[#4a2a2a] px-6 py-4">
      <div className="min-w-0">
        <p className="font-semibold text-[#ff8f8f]">{forbidden ? "No tienes permiso para ver esto" : "No pudimos cargar los datos"}</p>
        <p className="mt-0.5 text-[13.5px] text-muted">{error.message}</p>
      </div>
      {onRetry && !forbidden && (
        <Button variant="secondary" className="h-[38px]" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </Card>
  );
}
