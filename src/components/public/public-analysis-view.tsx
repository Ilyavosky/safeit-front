"use client";

import { useState } from "react";
import { PublicAnalysisForm } from "@/components/public/public-analysis-form";
import { PublicAnalysisList } from "@/components/public/public-analysis-list";

export function PublicAnalysisView() {
  const [version, setVersion] = useState(0);
  return (
    <div className="space-y-8">
      <PublicAnalysisForm onStarted={() => setVersion((n) => n + 1)} />
      <PublicAnalysisList key={version} />
    </div>
  );
}
