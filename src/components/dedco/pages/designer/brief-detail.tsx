"use client";

import React from "react";
import { useDedcoStore } from "@/lib/store";

// ============================================================
// BriefDetailPage — REDIRECT vers le nouveau workflow designer
// ============================================================
// Le parcours designer a été refondu :
// Brief reçu → Proposition de cadrage → Visite/Consultation → Compte rendu → Proposition finale → Paiement → Exécution → Livraison
// Cette ancienne page redirige automatiquement vers la nouvelle page "Brief reçu".

export function BriefDetailPage({ briefId }: { briefId: number }) {
  const navigate = useDedcoStore((s) => s.navigate);

  React.useEffect(() => {
    navigate({ page: "designer-brief-recu", briefId: String(briefId) });
  }, [briefId, navigate]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
      <p className="text-[var(--text-3)]">Redirection vers le nouveau workflow designer...</p>
    </div>
  );
}
