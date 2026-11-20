"use client";

import { Button } from "@/components/ui/button";

export function RescanButton({ scanning = false, onClick }: { scanning?: boolean; onClick?: () => void }) {
  return (
    <Button className="h-[42px]" loading={scanning} onClick={onClick} disabled={!onClick}>
      {!scanning && (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 12a8 8 0 11-2.3-5.6" />
          <path d="M20 4v4.5h-4.5" />
        </svg>
      )}
      {scanning ? "Escaneando" : "Reescanear"}
    </Button>
  );
}