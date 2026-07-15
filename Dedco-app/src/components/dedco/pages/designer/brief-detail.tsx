"use client";

import React from "react";
import { useDedcoStore } from "@/lib/store";

// ============================================================
// BriefDetailPage — REDIRECT
// Les workflows ont été refondus :
// - Artisan : Demande de fabrication → Devis → Négociation → Paiement → Fabrication → livraison
// - Designer : Brief reçu → Choix prestation → Proposition mission → Paiement → Projet → Livraison
// Cette ancienne page redirige vers le workflow artisan par défaut.
// ============================================================

export function BriefDetailPage({ briefId }: { briefId: number }) {
  const navigate = useDedcoStore((s) => s.navigate);

  React.useEffect(() => {
    navigate({ page: "artisan-brief-recu", briefId: String(briefId) });
  }, [briefId, navigate]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
      <p className="text-[var(--text-3)]">Redirection...</p>
    </div>
  );
}
