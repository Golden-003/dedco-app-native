"use client";

import { useState, useMemo } from "react";
import {
  Clock,
  ChevronRight,
  CreditCard,
  FileText,
  Gavel,
  Image as ImageIcon,
  LayoutGrid,
  Package,
  AlertTriangle,
  CheckCircle2,
  Eye,
  ShieldCheck,
  ArrowRight,
  GitCompareArrows,
  Paperclip,
  Timer,
  Hammer,
  Palette,
} from "lucide-react";
import { useDedcoStore } from "@/lib/store";
import { formatFCFA } from "@/lib/dedco-data";
import { ACTION_PRIORITY_ORDER } from "@/lib/dedco-types";
import type {
  MesProjetsItem,
  MesProjetsRoute,
  ArtisanBriefWithProposals,
  ArtisanProposal,
  DesignerPrestation,
  PendingPayment,
  Reclamation,
} from "@/lib/dedco-types";
import {
  MOCK_EN_COURS,
  MOCK_BRIEF_WITH_PROPOSALS,
  MOCK_PRESTATIONS_DESIGNER,
  MOCK_PAIEMENTS_EN_ATTENTE,
  MOCK_TERMINES,
  MOCK_RECLAMATIONS,
  PRIORITY_CONFIG,
  TYPE_LABELS,
  parseFrDate,
} from "@/lib/mes-projets-data";

// ============================================================
// HELPERS
// ============================================================

function navigateTo(route: MesProjetsRoute) {
  const store = useDedcoStore.getState();
  if (route.page === "brief-detail" && route.id) {
    store.navigate({ page: "artisan-brief-recu", briefId: route.id });
  } else if (route.page === "projet-detail" && route.projectId) {
    // Routing intelligent : PD- → designer, PA- → artisan
    if (route.projectId.startsWith("PD-")) {
      store.navigate({ page: "projet-designer-detail", projectId: route.projectId });
    } else {
      store.navigate({ page: "projet-artisan-detail", projectId: route.projectId });
    }
  } else if (route.page === "projet-paiement-artisan" && route.proposalId) {
    store.navigate({ page: "projet-paiement-artisan", proposalId: route.proposalId });
  } else if (route.page === "projet-paiement" && route.proposalId) {
    store.navigate({ page: "projet-paiement", proposalId: route.proposalId });
  } else if (route.page === "payment" && route.orderId) {
    store.navigate({ page: "payment", orderId: route.orderId });
  } else if (route.page === "litige" && route.id) {
    store.navigate({ page: "litige", id: route.id });
  } else if (route.page === "order-tracking" && route.id) {
    store.navigate({ page: "order-tracking", id: route.id });
  } else if (route.page === "marketplace") {
    store.navigate({ page: "marketplace" });
  } else if (route.page === "brief") {
    store.navigate({ page: "brief" });
  } else if (route.page === "brief-designer" && route.designerId) {
    store.navigate({ page: "brief-designer", designerId: route.designerId });
  } else {
    store.navigate({ page: "home" });
  }
}

// ============================================================
// TYPE BADGE — Brief artisan / Projet artisan / etc.
// ============================================================

function TypeBadge({ type }: { type: MesProjetsItem["type"] }) {
  const cfg = TYPE_LABELS[type];
  if (!cfg) return null;
  return (
    <span
      className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
      style={{ color: cfg.color, backgroundColor: cfg.bg }}
    >
      {cfg.label}
    </span>
  );
}

// ============================================================
// PRIORITY BANNER — badge + échéance + conséquence
// ============================================================

function PriorityBanner({
  priority,
  deadline,
  consequence,
}: {
  priority: string;
  deadline?: string;
  consequence?: string;
}) {
  const cfg = PRIORITY_CONFIG[priority];
  if (!cfg || !cfg.label) return null;
  const isUrgent = priority === "PAYMENT_REQUIRED" || priority === "CHANGE_REQUEST_PENDING" || priority === "DELIVERY_CONFIRMATION_REQUIRED";

  return (
    <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: cfg.bgColor }}>
      <div className="flex items-start gap-2">
        <AlertTriangle size={14} style={{ color: cfg.color, flexShrink: 0, marginTop: 2 }} />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold" style={{ color: cfg.color }}>
            {cfg.label}
            {deadline && (
              <>
                {" "}avant le <span className="font-numeric">{deadline}</span>
              </>
            )}
          </p>
          {consequence && (
            <p className="text-[11px] mt-1" style={{ color: "var(--text-2)" }}>
              {consequence}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CARTES ONGLET "EN COURS"
// ============================================================

function EnCoursCard({ item }: { item: MesProjetsItem }) {
  const [expanded, setExpanded] = useState(false);
  const isUrgent = item.priority === "PAYMENT_REQUIRED" || item.priority === "CHANGE_REQUEST_PENDING" || item.priority === "DELIVERY_CONFIRMATION_REQUIRED";

  return (
    <div className="dedco-card overflow-hidden hover:shadow-md transition-shadow">
      {isUrgent && <div className="h-1 w-full" style={{ backgroundColor: "var(--terracotta)" }} />}

      <div className="p-4 sm:p-5">
        {/* Header cliquable → page détail */}
        <button
          onClick={() => navigateTo(item.nextActionRoute)}
          className="w-full text-left flex gap-4 items-start hover:opacity-80 transition-opacity cursor-pointer"
        >
          <img src={item.image} alt={item.title} className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <TypeBadge type={item.type} />
              <span className="text-[10px] font-numeric text-[var(--text-3)]">{item.id}</span>
            </div>
            <h3 className="font-display font-semibold text-sm sm:text-base leading-tight truncate text-[var(--text-1)]">{item.title}</h3>
            {item.partnerName && (
              <div className="flex items-center gap-2 mt-1.5">
                {item.partnerAvatar && <img src={item.partnerAvatar} alt={item.partnerName} className="w-5 h-5 rounded-full object-cover" />}
                <span className="text-xs text-[var(--text-2)] truncate">{item.partnerName}</span>
                <span className="text-xs text-[var(--text-3)]">
                  {item.partnerType === "artisan" && "— Artisan"}
                  {item.partnerType === "designer" && "— Designer"}
                  {item.partnerType === "maison" && "— Maison deco"}
                </span>
              </div>
            )}
            <div className="flex items-center gap-3 mt-2 text-[11px]">
              {item.amount > 0 && <span className="font-numeric font-semibold text-[var(--text-1)]">{formatFCFA(item.amount)}</span>}
              {item.progress !== undefined && item.progress < 100 && <span className="font-numeric text-[var(--text-3)]">{item.progress}%</span>}
              {item.estimatedDate && <span className="font-numeric text-[var(--text-3)]">→ {item.estimatedDate}</span>}
            </div>
          </div>
          <ChevronRight size={16} className="text-[var(--text-3)] flex-shrink-0 mt-1" />
        </button>

        {/* Statut + bouton "Voir le projet" — TOUJOURS visible */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border)] gap-3">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ color: item.statusColor, backgroundColor: item.statusBgColor }}>
              {item.statusLabel}
            </span>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-[10px] font-semibold text-[var(--text-3)] hover:text-[var(--amber)] flex items-center gap-1"
            >
              {expanded ? "Moins" : "Plus de détails"}
              <ChevronRight size={10} className={`transition-transform ${expanded ? "rotate-90" : ""}`} />
            </button>
          </div>
          <button
            onClick={() => navigateTo(item.nextActionRoute)}
            className="dedco-btn dedco-btn-primary dedco-btn-sm flex items-center gap-1.5 flex-shrink-0"
          >
            {(() => {
              switch (item.priority) {
                case "PAYMENT_REQUIRED": return <><CreditCard size={14} /> {item.nextAction}</>;
                case "CHANGE_REQUEST_PENDING": return <><GitCompareArrows size={14} /> {item.nextAction}</>;
                case "DELIVERY_CONFIRMATION_REQUIRED": return <><CheckCircle2 size={14} /> {item.nextAction}</>;
                default: return <><Eye size={14} /> {item.nextAction}</>;
              }
            })()}
          </button>
        </div>

        {/* Détails dépliables */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-[var(--border)] space-y-3">
            <div className="flex items-center gap-6">
              {item.amount > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[var(--text-3)] mb-0.5">Montant</p>
                  <p className="font-numeric text-sm font-bold text-[var(--text-1)]">{formatFCFA(item.amount)}</p>
                </div>
              )}
              {item.securedAmount !== undefined && item.securedAmount > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[var(--text-3)] mb-0.5">Sécurisé</p>
                  <p className="font-numeric text-sm font-semibold" style={{ color: "var(--forest)" }}>{formatFCFA(item.securedAmount)}</p>
                </div>
              )}
              {item.estimatedDate && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[var(--text-3)] mb-0.5">Échéance</p>
                  <p className="font-numeric text-xs font-medium text-[var(--text-2)]">{item.estimatedDate}</p>
                </div>
              )}
            </div>
            {item.progress !== undefined && item.type !== "ARTISAN_BRIEF" && item.type !== "DESIGNER_BRIEF" && item.progress < 100 && (
              <div className="h-1.5 bg-[var(--bg-warm)] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${item.progress}%`, backgroundColor: isUrgent ? "var(--terracotta)" : item.progress >= 80 ? "var(--forest)" : "var(--amber)" }} />
              </div>
            )}
            <PriorityBanner priority={item.priority} deadline={item.priorityDeadline} consequence={item.priorityConsequence} />
            <p className="text-[11px] text-[var(--text-3)]">
              <Clock size={10} className="inline mr-1" style={{ verticalAlign: "middle" }} /> MAJ <span className="font-numeric">{item.lastUpdate}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// ONGLET "A CHOISIR" — Brief avec propositions groupées
// ============================================================

function BriefProposalsCard({ brief }: { brief: ArtisanBriefWithProposals }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="dedco-card overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4 sm:p-5">
        {/* Header du brief */}
        <div className="flex gap-4">
          <img src={brief.briefImage} alt={brief.briefTitle} className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <TypeBadge type="ARTISAN_BRIEF" />
              <span className="text-[10px] font-numeric text-[var(--text-3)]">{brief.briefId}</span>
            </div>
            <h3 className="font-display font-semibold text-sm sm:text-base leading-tight">{brief.briefTitle}</h3>
            <div className="flex items-center gap-3 mt-1.5 text-[11px] text-[var(--text-3)] flex-wrap">
              <span>{brief.category}</span>
              <span className="text-[var(--border)]">|</span>
              <span>{brief.zone}</span>
              <span className="text-[var(--border)]">|</span>
              <span className="font-numeric">{formatFCFA(brief.budgetMin)} – {formatFCFA(brief.budgetMax)}</span>
            </div>
          </div>
        </div>

        {/* Bandeau propositions reçues */}
        <div className="mt-3 p-3 rounded-lg flex items-center justify-between gap-3" style={{ backgroundColor: "var(--amber-pale)" }}>
          <div className="flex items-center gap-2 min-w-0">
            <Package size={14} style={{ color: "var(--amber-dark)" }} className="flex-shrink-0" />
            <span className="text-xs font-semibold truncate" style={{ color: "var(--amber-dark)" }}>
              <span className="font-numeric">{brief.proposals.length}</span> proposition{brief.proposals.length > 1 ? "s" : ""} reçue{brief.proposals.length > 1 ? "s" : ""}
            </span>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="dedco-btn dedco-btn-primary dedco-btn-sm flex items-center gap-1 flex-shrink-0"
          >
            <GitCompareArrows size={14} />
            {expanded ? "Masquer" : "Comparer les propositions"}
          </button>
        </div>

        {/* Propositions dépliées — grille 3 colonnes + tableau comparatif */}
        {expanded && (
          <div className="mt-4 space-y-4">
            {/* Mini-cartes en grille */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {brief.proposals.map((prop: ArtisanProposal) => (
                <div key={prop.id} className="p-4 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] flex flex-col">
                  {/* En-tête artisan */}
                  <div className="flex items-start gap-3 mb-3">
                    <img src={prop.artisanAvatar} alt={prop.artisanName} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <h4 className="font-display font-semibold text-sm truncate">{prop.artisanName}</h4>
                        {prop.artisanVerified && <ShieldCheck size={12} style={{ color: "var(--forest)", flexShrink: 0 }} />}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "var(--amber-pale)", color: "var(--amber-dark)" }}>
                          {prop.artisanLevel}
                        </span>
                        {!prop.artisanVerified && (
                          <span className="text-[10px] text-[var(--text-3)]">Non vérifié</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Prix + délai */}
                  <div className="grid grid-cols-2 gap-2 mb-3 pb-3 border-b border-[var(--border)]">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[var(--text-3)] mb-0.5">Prix</p>
                      <p className="font-numeric text-sm font-bold" style={{ color: "var(--amber-dark)" }}>{formatFCFA(prop.price)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[var(--text-3)] mb-0.5">Délai</p>
                      <p className="font-numeric text-sm font-semibold text-[var(--text-1)]">{prop.deliveryTime}</p>
                    </div>
                  </div>

                  {/* Matériaux + paiement */}
                  <div className="space-y-1.5 mb-3 text-xs flex-1">
                    <p className="text-[var(--text-2)]">
                      <span className="font-medium text-[var(--text-1)]">Matériaux :</span> {prop.materials}
                    </p>
                    <p className="text-[var(--text-2)]">
                      <span className="font-medium text-[var(--text-1)]">Paiement :</span> {prop.paymentConditions}
                    </p>
                  </div>

                  {/* Image exemple */}
                  {prop.images.length > 0 && (
                    <img src={prop.images[0]} alt="Exemple" className="w-full h-24 object-cover rounded-lg mb-3" />
                  )}

                  {/* Action */}
                  <button
                    onClick={() => navigateTo({ page: "projet-paiement-artisan", proposalId: prop.id })}
                    className="dedco-btn dedco-btn-primary dedco-btn-sm w-full flex items-center justify-center gap-1.5 mt-auto"
                  >
                    <CheckCircle2 size={14} />
                    Choisir
                  </button>
                </div>
              ))}
            </div>

            {/* Tableau comparatif synthétique */}
            <div className="overflow-x-auto dedco-hide-scroll rounded-lg border border-[var(--border)]">
              <table className="w-full text-xs min-w-[600px]">
                <thead>
                  <tr className="bg-[var(--bg-warm)] text-[var(--text-3)]">
                    <th className="text-left px-3 py-2 font-semibold">Artisan</th>
                    <th className="text-right px-3 py-2 font-semibold">Prix</th>
                    <th className="text-right px-3 py-2 font-semibold">Délai</th>
                    <th className="text-left px-3 py-2 font-semibold">Paiement</th>
                    <th className="text-left px-3 py-2 font-semibold">Vérifié</th>
                    <th className="text-right px-3 py-2 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {brief.proposals.map((prop: ArtisanProposal) => {
                    return (
                      <tr key={prop.id} className="border-t border-[var(--border)]">
                        <td className="px-3 py-2.5 font-medium text-[var(--text-1)]">
                          <div className="flex items-center gap-2">
                            <span className="truncate">{prop.artisanName}</span>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "var(--amber-pale)", color: "var(--amber-dark)" }}>
                              {prop.artisanLevel}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-2.5 text-right font-numeric font-bold" style={{ color: "var(--amber-dark)" }}>{formatFCFA(prop.price)}</td>
                        <td className="px-3 py-2.5 text-right font-numeric text-[var(--text-2)]">{prop.deliveryTime}</td>
                        <td className="px-3 py-2.5 text-[var(--text-2)] text-[11px]">{prop.paymentConditions}</td>
                        <td className="px-3 py-2.5">
                          {prop.artisanVerified
                            ? <ShieldCheck size={14} className="text-[var(--forest)]" />
                            : <span className="text-[var(--text-3)] text-[11px]">Non</span>}
                        </td>
                        <td className="px-3 py-2.5 text-right">
                          <button
                            onClick={() => navigateTo({ page: "projet-paiement-artisan", proposalId: prop.id })}
                            className="dedco-btn dedco-btn-primary dedco-btn-sm"
                          >
                            Choisir
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border)]">
          <span className="text-[11px] text-[var(--text-3)]">
            <Clock size={10} className="inline mr-1" style={{ verticalAlign: "middle" }} />
            MAJ <span className="font-numeric">{brief.lastUpdate}</span>
          </span>
          <span className="text-[11px] text-[var(--text-3)]">
            Sans choix sous <span className="font-numeric">14 jours</span>, le brief expire.
          </span>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ONGLET "A CHOISIR" — Prestation designer
// ============================================================

function PrestationDesignerCard({ prestation }: { prestation: DesignerPrestation }) {
  return (
    <div className="dedco-card p-4 sm:p-5 hover:shadow-md transition-shadow">
      {/* Badge statut AWAITING_PAYMENT */}
      <div className="mb-3">
        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ color: "var(--terracotta)", backgroundColor: "var(--terracotta-pale)" }}>
          Paiement à effectuer
        </span>
      </div>
      <div className="flex gap-4">
        <img src={prestation.designerAvatar} alt={prestation.designerName} className="w-14 h-14 rounded-full object-cover flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-sm truncate">{prestation.designerName}</h3>
          <p className="text-xs text-[var(--text-2)] mt-0.5">{prestation.prestation}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="font-numeric text-base font-bold" style={{ color: "var(--amber-dark)" }}>{formatFCFA(prestation.price)}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {prestation.livrables.map((l) => (
          <span key={l} className="text-[10px] px-2 py-0.5 rounded-full border border-[var(--border)] text-[var(--text-2)]">{l}</span>
        ))}
      </div>
      <div className="flex items-center gap-4 text-[11px] text-[var(--text-3)] mt-2">
        <span className="font-numeric">
          <FileText size={10} className="inline mr-1" style={{ verticalAlign: "middle" }} />
          {prestation.revisions} révision{prestation.revisions > 1 ? "s" : ""} incluse{prestation.revisions > 1 ? "s" : ""}
        </span>
        <span className="font-numeric">
          <Clock size={10} className="inline mr-1" style={{ verticalAlign: "middle" }} />
          {prestation.deliveryTime}
        </span>
      </div>
      <p className="text-[11px] text-[var(--text-3)] mt-1">Disponibilité : {prestation.availability}</p>
      <button
        onClick={() => navigateTo(prestation.nextActionRoute)}
        className="dedco-btn dedco-btn-primary dedco-btn-sm w-full mt-4 flex items-center justify-center gap-1.5"
      >
        <CreditCard size={14} />
        Réserver la prestation
      </button>
    </div>
  );
}

// ============================================================
// ONGLET "A CHOISIR" — Paiement en attente
// ============================================================

function PaiementEnAttenteCard({ paiement }: { paiement: PendingPayment }) {
  return (
    <div className="dedco-card overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-1 w-full bg-[var(--terracotta)]" />
      <div className="p-4 sm:p-5">
        <div className="flex gap-4">
          <img src={paiement.projectImage} alt={paiement.projectTitle} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-sm truncate">{paiement.projectTitle}</h3>
            <p className="text-[11px] text-[var(--text-3)] mt-0.5 font-numeric">
              <Timer size={10} className="inline mr-1" style={{ verticalAlign: "middle" }} />
              Échéance : {paiement.dueDate}
            </p>
            <p className="text-[11px] text-[var(--text-3)] mt-0.5">{paiement.paymentMethod}</p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--border)]">
          <p className="font-numeric text-lg font-bold" style={{ color: "var(--terracotta)" }}>{formatFCFA(paiement.amount)}</p>
          <button
            onClick={() => navigateTo(paiement.nextActionRoute)}
            className="dedco-btn dedco-btn-terracotta dedco-btn-sm flex items-center gap-1.5"
          >
            <CreditCard size={14} />
            Payer maintenant
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ONGLET "TERMINÉS" — carte projet
// ============================================================

function TermineCard({ item }: { item: MesProjetsItem }) {
  return (
    <div className="dedco-card overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-1 w-full" style={{ backgroundColor: item.isCancelled ? "var(--text-3)" : "var(--forest)" }} />
      <div className="p-4 sm:p-5">
        <div className="flex gap-4">
          <img src={item.image} alt={item.title} className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <TypeBadge type={item.type} />
              <span className="text-[10px] font-numeric text-[var(--text-3)]">{item.id}</span>
            </div>
            <h3 className="font-display font-semibold text-sm sm:text-base leading-tight truncate">{item.title}</h3>
            {item.partnerName && (
              <div className="flex items-center gap-2 mt-1.5">
                {item.partnerAvatar && <img src={item.partnerAvatar} alt={item.partnerName} className="w-4 h-4 rounded-full object-cover" />}
                <span className="text-xs text-[var(--text-2)]">{item.partnerName}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[var(--border)]">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[var(--text-3)] mb-0.5">Montant</p>
            <p className="font-numeric text-sm font-bold text-[var(--text-1)]">{formatFCFA(item.amount)}</p>
          </div>
          {item.estimatedDate && (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[var(--text-3)] mb-0.5">Clôture</p>
              <p className="font-numeric text-xs font-medium text-[var(--text-2)]">{item.estimatedDate}</p>
            </div>
          )}
          <div className="flex-1" />
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ color: item.statusColor, backgroundColor: item.statusBgColor }}>
            {item.statusLabel}
          </span>
        </div>
        <div className="flex gap-2 mt-4 pt-3 border-t border-[var(--border)]">
          <button onClick={() => navigateTo(item.nextActionRoute)} className="dedco-btn dedco-btn-ghost dedco-btn-sm flex items-center gap-1.5">
            <Eye size={14} />
            {item.isCancelled ? "Dupliquer la commande" : "Voir le projet"}
          </button>
          {!item.isCancelled && (
            <button
              onClick={() => {
                // Routing contextuel : projet designer → brief designer, sinon brief artisan
                if (item.type === "DESIGNER_PROJECT" || item.type === "DESIGNER_BRIEF") {
                  navigateTo({ page: "brief-designer", designerId: 1 });
                } else {
                  navigateTo({ page: "brief" });
                }
              }}
              className="dedco-btn dedco-btn-secondary dedco-btn-sm flex items-center gap-1.5"
            >
              <ArrowRight size={14} />
              Refaire une demande similaire
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ONGLET "RÉCLAMATIONS" — carte réclamation
// ============================================================

function ReclamationCard({ rec }: { rec: Reclamation }) {
  return (
    <div className="dedco-card overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-1 w-full bg-[var(--terracotta)]" />
      <div className="p-4 sm:p-5">
        <div className="flex gap-4">
          <img src={rec.projectImage} alt={rec.projectTitle} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-sm leading-tight truncate">{rec.projectTitle}</h3>
            <p className="text-xs text-[var(--text-2)] mt-1">{rec.partnerName}</p>
            <p className="text-xs text-[var(--text-3)] mt-0.5 font-numeric">
              <Gavel size={10} className="inline mr-1" style={{ verticalAlign: "middle" }} />
              Ouvert le {rec.openedDate}
            </p>
          </div>
        </div>
        <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: "var(--bg-warm)" }}>
          <p className="text-xs font-medium text-[var(--text-1)] mb-1">Motif</p>
          <p className="text-sm text-[var(--text-2)]">{rec.motif}</p>
        </div>
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[var(--border)]">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[var(--text-3)] mb-0.5">Montant</p>
            <p className="font-numeric text-sm font-bold" style={{ color: "var(--terracotta)" }}>{formatFCFA(rec.amount)}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <Paperclip size={12} className="text-[var(--text-3)]" />
            <span className="font-numeric text-xs text-[var(--text-3)]">{rec.attachments} pièce{rec.attachments > 1 ? "s" : ""}</span>
          </div>
          <div className="flex-1" />
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ color: rec.statusColor, backgroundColor: rec.statusBgColor }}>
            {rec.statusLabel}
          </span>
        </div>
        {rec.lastAction && <p className="text-[11px] text-[var(--text-3)] mt-2 italic">Dernière action : {rec.lastAction}</p>}
        {rec.dedcoDecision && (
          <div className="mt-2 p-2 rounded-lg border" style={{ borderColor: "var(--forest)", backgroundColor: "var(--forest-pale)" }}>
            <p className="text-xs font-medium" style={{ color: "var(--forest)" }}>Décision Dedco : {rec.dedcoDecision}</p>
          </div>
        )}
        <div className="flex gap-2 mt-4 pt-3 border-t border-[var(--border)]">
          <button onClick={() => navigateTo(rec.nextActionRoute)} className="dedco-btn dedco-btn-terracotta dedco-btn-sm flex items-center gap-1.5">
            <Eye size={14} />
            Voir le dossier
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SECTION HEADER
// ============================================================

function SectionHeader({ icon: Icon, title, count, description, accentColor }: { icon: React.ElementType; title: string; count: number; description?: string; accentColor?: string }) {
  const bg = accentColor ? `${accentColor}20` : "var(--amber-pale)";
  const color = accentColor || "var(--amber-dark)";
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
        <Icon size={16} style={{ color }} />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="font-display font-semibold text-base">{title}</h2>
          <span className="font-numeric text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--bg-warm)", color: "var(--text-2)" }}>{count}</span>
        </div>
        {description && <p className="text-xs text-[var(--text-3)] mt-0.5">{description}</p>}
      </div>
    </div>
  );
}

// ============================================================
// EMPTY STATE
// ============================================================

function EmptyState({ title, description, actionLabel, onAction }: { title: string; description: string; actionLabel?: string; onAction?: () => void }) {
  const navigate = useDedcoStore((s) => s.navigate);
  return (
    <div className="dedco-card p-10 sm:p-14 text-center">
      <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: "var(--bg-warm)" }}>
        <LayoutGrid size={24} className="text-[var(--text-3)]" />
      </div>
      <p className="font-display font-semibold text-base mb-1">{title}</p>
      <p className="text-sm text-[var(--text-2)] mb-5 max-w-sm mx-auto">{description}</p>
      {actionLabel && (
        <button onClick={onAction || (() => navigate({ page: "marketplace" }))} className="dedco-btn dedco-btn-primary dedco-btn-sm">
          {actionLabel}
        </button>
      )}
    </div>
  );
}

// ============================================================
// ONGLET : EN COURS
// ============================================================

function TabEnCours() {
  // Tri : priorité d'abord, deadline départage les égalités
  const sorted = useMemo(
    () =>
      [...MOCK_EN_COURS].sort((a, b) => {
        const pa = ACTION_PRIORITY_ORDER[a.priority] ?? 8;
        const pb = ACTION_PRIORITY_ORDER[b.priority] ?? 8;
        if (pa !== pb) return pa - pb;
        // Même priorité : la deadline la plus proche d'abord
        const da = a.priorityDeadline ? parseFrDate(a.priorityDeadline) : Number.MAX_SAFE_INTEGER;
        const db = b.priorityDeadline ? parseFrDate(b.priorityDeadline) : Number.MAX_SAFE_INTEGER;
        return da - db;
      }),
    [],
  );
  const urgentCount = sorted.filter((i) => ACTION_PRIORITY_ORDER[i.priority] <= 3).length;

  return (
    <div>
      {urgentCount > 0 && (
        <div className="mb-5 p-3 rounded-lg flex items-center gap-2" style={{ backgroundColor: "var(--terracotta-pale)" }}>
          <AlertTriangle size={16} style={{ color: "var(--terracotta)" }} />
          <p className="text-xs font-medium" style={{ color: "var(--terracotta)" }}>
            <span className="font-numeric">{urgentCount}</span> action{urgentCount > 1 ? "s" : ""} urgente{urgentCount > 1 ? "s" : ""} en attente
          </p>
        </div>
      )}
      <div className="space-y-3">
        {sorted.map((item) => <EnCoursCard key={item.id} item={item} />)}
      </div>
    </div>
  );
}

// ============================================================
// ONGLET : A CHOISIR
// ============================================================

function TabAChoisir() {
  const hasArtisan = true; // brief avec propositions
  const hasDesigner = MOCK_PRESTATIONS_DESIGNER.length > 0 || MOCK_PAIEMENTS_EN_ATTENTE.some(p => p.parentBriefId?.startsWith("BD"));

  return (
    <div className="space-y-8">
      {/* Section ARTISAN */}
      {hasArtisan && (
        <section>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b-2" style={{ borderColor: "var(--amber)" }}>
            <Hammer size={14} style={{ color: "var(--amber-dark)" }} />
            <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--amber-dark)" }}>Artisan</span>
          </div>
          <SectionHeader icon={Package} title="Briefs avec propositions" count={1} description="Comparez les propositions et choisissez un artisan" accentColor="var(--amber)" />
          <BriefProposalsCard brief={MOCK_BRIEF_WITH_PROPOSALS} />

          {/* Paiements paiement artisan */}
          {MOCK_PAIEMENTS_EN_ATTENTE.filter(p => p.sourceType === "ARTISAN_BRIEF").length > 0 && (
            <div className="mt-6">
              <SectionHeader icon={CreditCard} title="Paiements artisan à régler" count={MOCK_PAIEMENTS_EN_ATTENTE.filter(p => p.sourceType === "ARTISAN_BRIEF").length} description="Proposition sélectionnée — payez pour démarrer la fabrication" accentColor="var(--amber)" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {MOCK_PAIEMENTS_EN_ATTENTE.filter(p => p.sourceType === "ARTISAN_BRIEF").map((p) => (
                  <PaiementEnAttenteCard key={p.id} paiement={p} />
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Section DESIGNER */}
      {hasDesigner && (
        <section>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b-2" style={{ borderColor: "var(--forest)" }}>
            <Palette size={14} style={{ color: "var(--forest)" }} />
            <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--forest)" }}>Designer</span>
          </div>

          {MOCK_PRESTATIONS_DESIGNER.length > 0 && (
            <div className="mb-6">
              <SectionHeader icon={LayoutGrid} title="Prestations designer acceptées" count={MOCK_PRESTATIONS_DESIGNER.length} description="Un designer a accepté — réservez la prestation" accentColor="var(--forest)" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {MOCK_PRESTATIONS_DESIGNER.map((p) => <PrestationDesignerCard key={p.id} prestation={p} />)}
              </div>
            </div>
          )}

          {MOCK_PAIEMENTS_EN_ATTENTE.filter(p => p.sourceType === "DESIGNER_BRIEF").length > 0 && (
            <div>
              <SectionHeader icon={CreditCard} title="Paiements designer en attente" count={MOCK_PAIEMENTS_EN_ATTENTE.filter(p => p.sourceType === "DESIGNER_BRIEF").length} description="Finalisez le règlement pour confirmer la mission" accentColor="var(--forest)" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {MOCK_PAIEMENTS_EN_ATTENTE.filter(p => p.sourceType === "DESIGNER_BRIEF").map((p) => (
                  <PaiementEnAttenteCard key={p.id} paiement={p} />
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Empty state global si rien à choisir */}
      {!hasArtisan && !hasDesigner && (
        <EmptyState
          title="Aucune décision à prendre"
          description="Lorsque vous recevrez des propositions artisan ou des acceptations designer, elles apparaîtront ici."
          actionLabel="Explorer la marketplace"
          onAction={() => navigateTo({ page: "marketplace" })}
        />
      )}
    </div>
  );
}

// ============================================================
// ONGLET : TERMINÉS — avec sous-filtre
// ============================================================

type TermineFilter = "tous" | "termines" | "annules";

function TabTermines() {
  const [filter, setFilter] = useState<TermineFilter>("tous");

  const filtered = useMemo(() => {
    switch (filter) {
      case "termines": return MOCK_TERMINES.filter((i) => !i.isCancelled);
      case "annules": return MOCK_TERMINES.filter((i) => i.isCancelled);
      default: return MOCK_TERMINES;
    }
  }, [filter]);

  const FILTERS: { key: TermineFilter; label: string }[] = [
    { key: "tous", label: `Tous (${MOCK_TERMINES.length})` },
    { key: "termines", label: `Terminés (${MOCK_TERMINES.filter((i) => !i.isCancelled).length})` },
    { key: "annules", label: `Annulés / expirés (${MOCK_TERMINES.filter((i) => i.isCancelled).length})` },
  ];

  return (
    <div>
      <div className="flex gap-2 mb-5 overflow-x-auto dedco-hide-scroll -mx-4 px-4 sm:mx-0 sm:px-0">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
              filter === f.key
                ? "bg-[var(--amber)] text-white"
                : "bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-2)] hover:bg-[var(--bg-warm)]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <EmptyState title="Aucun élément" description="Aucun projet ne correspond à ce filtre." />
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => <TermineCard key={item.id} item={item} />)}
        </div>
      )}
    </div>
  );
}

// ============================================================
// ONGLET : RÉCLAMATIONS
// ============================================================

function TabReclamations() {
  return (
    <div>
      {MOCK_RECLAMATIONS.length === 0 ? (
        <EmptyState title="Aucune réclamation ouverte" description="Aucun litige en cours. En cas de problème, ouvrez une réclamation depuis la page du projet concerné." />
      ) : (
        <div className="space-y-3">
          {MOCK_RECLAMATIONS.map((rec) => <ReclamationCard key={rec.id} rec={rec} />)}
        </div>
      )}
    </div>
  );
}

// ============================================================
// STATS HEADER
// ============================================================

function StatsHeader() {
  const totalSuivi = MOCK_EN_COURS.length
    + MOCK_BRIEF_WITH_PROPOSALS.proposals.length
    + MOCK_PRESTATIONS_DESIGNER.length
    + MOCK_PAIEMENTS_EN_ATTENTE.length
    + MOCK_TERMINES.length
    + MOCK_RECLAMATIONS.length;

  const actionsEnCours = MOCK_EN_COURS.filter((i) => ACTION_PRIORITY_ORDER[i.priority] <= 3).length;
  const decisionsAPrendre = MOCK_BRIEF_WITH_PROPOSALS.proposals.length
    + MOCK_PRESTATIONS_DESIGNER.length
    + MOCK_PAIEMENTS_EN_ATTENTE.length;
  const reclamationsOuvertes = MOCK_RECLAMATIONS.length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {[
        { label: "Éléments suivis", value: totalSuivi, color: "var(--text-1)" },
        { label: "Actions en cours", value: actionsEnCours, color: "var(--terracotta)" },
        { label: "Décisions à prendre", value: decisionsAPrendre, color: "var(--amber-dark)" },
        { label: "Réclamations ouvertes", value: reclamationsOuvertes, color: reclamationsOuvertes > 0 ? "var(--terracotta)" : "var(--forest)" },
      ].map((s) => (
        <div key={s.label} className="dedco-card p-3 sm:p-4 text-center">
          <p className="font-numeric text-xl sm:text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
          <p className="text-[11px] text-[var(--text-3)] mt-0.5">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// PAGE PRINCIPALE — MES PROJETS
// ============================================================

type TabKey = "en_cours" | "a_choisir" | "termines" | "reclamations";

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "en_cours", label: "En cours", icon: Clock },
  { key: "a_choisir", label: "À choisir", icon: GitCompareArrows },
  { key: "termines", label: "Terminés", icon: CheckCircle2 },
  { key: "reclamations", label: "Réclamations", icon: Gavel },
];

function getTabCount(key: TabKey): number {
  switch (key) {
    case "en_cours": return MOCK_EN_COURS.length;
    case "a_choisir": return MOCK_BRIEF_WITH_PROPOSALS.proposals.length + MOCK_PRESTATIONS_DESIGNER.length + MOCK_PAIEMENTS_EN_ATTENTE.length;
    case "termines": return MOCK_TERMINES.length;
    case "reclamations": return MOCK_RECLAMATIONS.length;
  }
}

export function MesProjetsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("en_cours");
  const navigate = useDedcoStore((s) => s.navigate);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-cream)" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <button onClick={() => navigate({ page: "home" })} className="p-1.5 rounded-lg hover:bg-[var(--bg-warm)] transition-colors" aria-label="Retour">
              <ChevronRight size={18} className="text-[var(--text-2)] rotate-180" />
            </button>
            <h1 className="display-lg">Mes projets</h1>
          </div>
          <p className="text-sm text-[var(--text-2)] ml-10">Suivez vos briefs, projets, commandes et réclamations en un seul endroit.</p>
        </header>

        {/* Stats */}
        <StatsHeader />

        {/* Tabs */}
        <div className="mb-6 overflow-x-auto dedco-hide-scroll -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-1 p-1 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] min-w-max">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              const count = getTabCount(tab.key);
              const isReclamation = tab.key === "reclamations" && MOCK_RECLAMATIONS.length > 0;

              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-[var(--amber)] text-white shadow-sm"
                      : "text-[var(--text-2)] hover:bg-[var(--bg-warm)] hover:text-[var(--text-1)]"
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                  <span
                    className={`font-numeric text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive ? "bg-white/20 text-white" : "bg-[var(--bg-warm)] text-[var(--text-3)]"
                    }`}
                    style={!isActive && isReclamation ? { backgroundColor: "var(--terracotta)", color: "white" } : undefined}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        {activeTab === "en_cours" && <TabEnCours />}
        {activeTab === "a_choisir" && <TabAChoisir />}
        {activeTab === "termines" && <TabTermines />}
        {activeTab === "reclamations" && <TabReclamations />}
      </div>
    </div>
  );
}