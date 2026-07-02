"use client";

import { useState } from "react";
import {
  CheckCircle2, Clock, ChevronRight, AlertTriangle, X, Check,
  MapPin, Ruler, Calendar, Send, MessageSquare, ShieldCheck,
  CreditCard, Eye, ArrowRight, Palette, Home, Lightbulb,
} from "lucide-react";
import { useDedcoStore } from "@/lib/store";
import { getBackToProjets } from "@/lib/back-to-projets";
import { useBriefDesignerStore } from "@/lib/designer-brief-store";
import { formatFCFA } from "@/lib/dedco-data";
import { BRIEF_DESIGNER_STATUS } from "@/lib/dedco-status";
import type { DesignerBrief } from "@/lib/designer-brief-types";

// ============================================================
// PAGE : Brief Designer Détail (s'adapte au statut)
// ============================================================

export function BriefDesignerDetailPage({ briefId }: { briefId: string }) {
  const navigate = useDedcoStore((s) => s.navigate);
  const currentUser = useDedcoStore((s) => s.currentUser);
  const brief = useBriefDesignerStore((s) => s.briefs.find(b => b.id === briefId));
  const submitBrief = useBriefDesignerStore((s) => s.submitBrief);
  const payPrestation = useBriefDesignerStore((s) => s.payPrestation);
  const cancelBrief = useBriefDesignerStore((s) => s.cancelBrief);
  const duplicateBrief = useBriefDesignerStore((s) => s.duplicateBrief);
  const relanceBrief = useBriefDesignerStore((s) => s.relanceBrief);

  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  // ── Bouton retour — role-aware ──
  const { route: backRoute, label: backLabel } = getBackToProjets(currentUser?.role);

  if (!brief) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center">
        <p className="text-sm text-[var(--text-3)]">Brief introuvable.</p>
        <button onClick={() => navigate(backRoute)} className="dedco-btn dedco-btn-primary mt-4">
          Retour à {backLabel}
        </button>
      </div>
    );
  }

  const statusConfig = BRIEF_DESIGNER_STATUS[brief.status];

  return (
    <div className="p-6 max-w-4xl mx-auto relative">
      <button onClick={() => navigate(backRoute)} className="text-sm text-[var(--text-3)] hover:text-[var(--amber)] mb-4 flex items-center gap-1">
        <ChevronRight size={16} className="rotate-180" /> {backLabel}
      </button>

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full" style={{ color: statusConfig.color, backgroundColor: statusConfig.bgColor }}>
              {statusConfig.label}
            </span>
            <span className="text-[10px] font-numeric text-[var(--text-3)]">{brief.id}</span>
            {brief.expiresAt && brief.status === 'PENDING_DESIGNER_RESPONSE' && (
              <span className="text-[10px] text-[var(--terracotta)] flex items-center gap-1">
                <Clock size={10} /> Expire le <span className="font-numeric">{brief.expiresAt}</span>
              </span>
            )}
          </div>
          <h1 className="display-lg text-[var(--text-1)]">{brief.title}</h1>
          <p className="text-sm text-[var(--text-2)] mt-1">{brief.description}</p>
        </div>
      </div>

      {/* Détails du brief */}
      <div className="dedco-card p-4 mb-4">
        <h2 className="font-display font-bold mb-3 text-sm text-[var(--text-1)]">Détails du brief</h2>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Pièce</p>
            <p className="flex items-center gap-1"><Home size={12} className="text-[var(--forest)]" /> {brief.piece}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Style</p>
            <p className="flex items-center gap-1"><Palette size={12} className="text-[var(--forest)]" /> {brief.style}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Superficie</p>
            <p className="flex items-center gap-1 font-numeric"><Ruler size={12} className="text-[var(--amber)]" /> {brief.superficie}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Budget conseil</p>
            <p className="font-numeric">{formatFCFA(brief.budgetConseil.min)} – {formatFCFA(brief.budgetConseil.max)}</p>
          </div>
        </div>
      </div>

      {/* Designer */}
      <div className="dedco-card p-4 mb-4 flex items-center gap-3">
        <img src={brief.designerAvatar} alt={brief.designerName} className="w-12 h-12 rounded-full object-cover" />
        <div className="flex-1">
          <p className="font-display font-semibold">{brief.designerName}</p>
          <p className="text-xs text-[var(--text-3)] flex items-center gap-1"><MapPin size={11} /> {brief.designerCity}</p>
        </div>
        <button onClick={() => navigate({ page: "designer", id: brief.designerId })} className="dedco-btn dedco-btn-ghost dedco-btn-sm">
          <Eye size={14} /> Voir le profil
        </button>
      </div>

      {/* === SECTION CONTEXTUELLE === */}

      {/* DRAFT */}
      {brief.status === 'DRAFT' && (
        <div className="dedco-card p-5 mb-4 border-l-4" style={{ borderLeftColor: "var(--text-3)" }}>
          <h2 className="font-display font-bold mb-2 text-sm text-[var(--text-1)]">Brouillon en cours</h2>
          <p className="text-sm text-[var(--text-2)] mb-4">Votre demande n'est pas encore envoyée. Complétez les informations puis soumettez-la au designer.</p>
          <div className="flex gap-2">
            <button onClick={() => navigate({ page: "brief-designer", designerId: brief.designerId })} className="dedco-btn dedco-btn-secondary">
              <Eye size={14} /> Continuer l'édition
            </button>
            <button onClick={() => { submitBrief(brief.id); showToast("Demande envoyée au designer."); }} className="dedco-btn dedco-btn-primary">
              <Send size={14} /> Envoyer la demande
            </button>
          </div>
        </div>
      )}

      {/* SUBMITTED / PENDING_DESIGNER_RESPONSE */}
      {(brief.status === 'SUBMITTED' || brief.status === 'PENDING_DESIGNER_RESPONSE') && (
        <div className="dedco-card p-5 mb-4 border-l-4" style={{ borderLeftColor: "var(--amber)" }}>
          <h2 className="font-display font-bold mb-2 text-sm text-[var(--text-1)]">
            {brief.status === 'SUBMITTED' ? 'Demande envoyée' : 'En attente de réponse du designer'}
          </h2>
          <p className="text-sm text-[var(--text-2)] mb-4">
            {brief.designerName} a reçu votre demande. Vous recevrez une notification dès qu'il aura répondu.
          </p>
          {brief.expiresAt && (
            <div className="p-3 rounded-lg flex items-center gap-2" style={{ backgroundColor: "var(--amber-pale)" }}>
              <Clock size={14} style={{ color: "var(--amber-dark)" }} />
              <p className="text-xs" style={{ color: "var(--amber-dark)" }}>
                Expiration le <span className="font-numeric">{brief.expiresAt}</span> — sans réponse, la demande expirera.
              </p>
            </div>
          )}
        </div>
      )}

      {/* NEEDS_INFO */}
      {brief.status === 'NEEDS_INFO' && (
        <div className="dedco-card p-5 mb-4 border-l-4" style={{ borderLeftColor: "var(--terracotta)" }}>
          <h2 className="font-display font-bold mb-2 text-sm text-[var(--text-1)]">Informations à compléter</h2>
          <p className="text-sm text-[var(--text-2)] mb-4">{brief.designerName} a besoin de précisions. Répondez à ses questions pour qu'il puisse finaliser sa proposition.</p>
          <button onClick={() => navigate({ page: "messages", conversationId: `brief-${brief.id}` })} className="dedco-btn dedco-btn-primary">
            <MessageSquare size={14} /> Répondre au designer
          </button>
        </div>
      )}

      {/* ACCEPTED / AWAITING_PAYMENT */}
      {(brief.status === 'ACCEPTED' || brief.status === 'AWAITING_PAYMENT') && brief.prestation && (
        <PrestationCard brief={brief} onPay={() => {
          const newProjectId = `PD-${Math.floor(1000 + Math.random() * 9000)}`;
          payPrestation(brief.id, newProjectId);
          showToast(`Paiement confirmé. Projet ${newProjectId} créé.`);
          setTimeout(() => navigate({ page: "projet-designer-detail", projectId: newProjectId }), 1500);
        }} />
      )}

      {/* BOOKING_CONFIRMED */}
      {brief.status === 'BOOKING_CONFIRMED' && brief.prestation && (
        <div className="dedco-card p-5 mb-4 border-l-4" style={{ borderLeftColor: "var(--forest)" }}>
          <h2 className="font-display font-bold mb-2 text-sm text-[var(--text-1)]">Réservation confirmée</h2>
          <p className="text-sm text-[var(--text-2)] mb-4">
            Le designer démarre votre prestation. Le rendez-vous de cadrage sera planifié prochainement.
          </p>
          <div className="p-3 rounded-lg mb-4" style={{ backgroundColor: "var(--forest-pale)" }}>
            <p className="text-xs text-[var(--forest)]">
              <CheckCircle2 size={12} className="inline mr-1" />
              Prestation « {brief.prestation.prestationLabel} » — {formatFCFA(brief.prestation.price)}
            </p>
          </div>
        </div>
      )}

      {/* CONVERTED_TO_DESIGN_PROJECT */}
      {brief.status === 'CONVERTED_TO_DESIGN_PROJECT' && brief.linkedProjectId && (
        <div className="dedco-card p-5 mb-4 border-l-4" style={{ borderLeftColor: "var(--forest)" }}>
          <h2 className="font-display font-bold mb-2 text-sm text-[var(--text-1)]">Projet créé</h2>
          <p className="text-sm text-[var(--text-2)] mb-4">Votre brief a été converti en projet designer. Suivez l'avancement.</p>
          <button onClick={() => navigate({ page: "projet-designer-detail", projectId: brief.linkedProjectId! })} className="dedco-btn dedco-btn-primary">
            <ArrowRight size={14} /> Suivre le projet
          </button>
        </div>
      )}

      {/* DECLINED */}
      {brief.status === 'DECLINED' && (
        <div className="dedco-card p-5 mb-4 border-l-4" style={{ borderLeftColor: "var(--terracotta)" }}>
          <h2 className="font-display font-bold mb-2 text-sm text-[var(--text-1)]">Mission refusée</h2>
          <p className="text-sm text-[var(--text-2)] mb-4">{brief.designerName} n'est pas disponible pour cette mission. Trouvez un autre designer.</p>
          <button onClick={() => navigate({ page: "designers" })} className="dedco-btn dedco-btn-primary">
            <Eye size={14} /> Trouver un autre designer
          </button>
        </div>
      )}

      {/* EXPIRED */}
      {brief.status === 'EXPIRED' && (
        <div className="dedco-card p-5 mb-4 border-l-4" style={{ borderLeftColor: "var(--text-3)" }}>
          <h2 className="font-display font-bold mb-2 text-sm text-[var(--text-1)]">Demande expirée</h2>
          <p className="text-sm text-[var(--text-2)] mb-4">Le designer n'a pas répondu dans les 14 jours. Relancez ou dupliquez la demande.</p>
          <div className="flex gap-2">
            <button onClick={() => { relanceBrief(brief.id); showToast("Demande relancée pour 14 jours."); }} className="dedco-btn dedco-btn-primary">
              <Clock size={14} /> Relancer 14 jours
            </button>
            <button onClick={() => { const newId = duplicateBrief(brief.id); showToast(`Demande dupliquée sous ${newId}.`); setTimeout(() => navigate({ page: "brief-designer-detail", briefId: newId }), 1500); }} className="dedco-btn dedco-btn-secondary">
              Dupliquer
            </button>
          </div>
        </div>
      )}

      {/* CANCELLED */}
      {brief.status === 'CANCELLED' && (
        <div className="dedco-card p-5 mb-4 border-l-4" style={{ borderLeftColor: "var(--text-3)" }}>
          <h2 className="font-display font-bold mb-2 text-sm text-[var(--text-1)]">Demande annulée</h2>
          <button onClick={() => { const newId = duplicateBrief(brief.id); showToast(`Demande dupliquée sous ${newId}.`); setTimeout(() => navigate({ page: "brief-designer-detail", briefId: newId }), 1500); }} className="dedco-btn dedco-btn-primary">
            Dupliquer la demande
          </button>
        </div>
      )}

      {/* Annuler (sauf terminal) */}
      {!['CONVERTED_TO_DESIGN_PROJECT', 'CANCELLED', 'EXPIRED', 'DECLINED'].includes(brief.status) && (
        <button onClick={() => { if (confirm("Annuler cette demande ?")) { cancelBrief(brief.id); showToast("Demande annulée."); } }} className="dedco-btn dedco-btn-ghost text-[var(--terracotta)] mt-2">
          <X size={14} /> Annuler la demande
        </button>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 dedco-card px-4 py-3 shadow-lg flex items-center gap-2" style={{ backgroundColor: "var(--forest-pale)", borderColor: "var(--forest)" }}>
          <CheckCircle2 size={16} className="text-[var(--forest)] flex-shrink-0" />
          <p className="text-sm text-[var(--text-1)]">{toast}</p>
        </div>
      )}
    </div>
  );
}

// ============================================================
// SUB-COMPONENT : Prestation Card (ACCEPTED / AWAITING_PAYMENT)
// ============================================================

function PrestationCard({ brief, onPay }: { brief: DesignerBrief; onPay: () => void }) {
  if (!brief.prestation) return null;
  const p = brief.prestation;
  const garantie = Math.round(p.price * 0.015);
  const total = p.price + garantie;
  const isAwaitingPayment = brief.status === 'AWAITING_PAYMENT';

  return (
    <div className="dedco-card p-5 mb-4 border-l-4" style={{ borderLeftColor: isAwaitingPayment ? "var(--terracotta)" : "var(--forest)" }}>
      <h2 className="font-display font-bold mb-3 text-sm text-[var(--text-1)]">
        {isAwaitingPayment ? "Paiement de la prestation" : "Prestation acceptée"}
      </h2>

      <div className="flex gap-3 mb-4">
        <img src={p.designerAvatar} alt={p.designerName} className="w-12 h-12 rounded-full object-cover" />
        <div className="flex-1">
          <p className="font-display font-semibold">{p.designerName}</p>
          <p className="text-xs text-[var(--text-2)]">{p.prestationLabel}</p>
        </div>
        <div className="text-right">
          <p className="font-numeric font-bold text-[var(--amber-dark)]">{formatFCFA(p.price)}</p>
          <p className="text-[10px] text-[var(--text-3)] font-numeric">{p.deliveryTime}</p>
        </div>
      </div>

      {/* Livrables */}
      <div className="mb-4">
        <p className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-2">Livrables</p>
        <div className="flex flex-wrap gap-1.5">
          {p.livrables.map(l => (
            <span key={l} className="text-[11px] px-2 py-0.5 rounded-full border border-[var(--border)] text-[var(--text-2)]">{l}</span>
          ))}
        </div>
        <p className="text-[11px] text-[var(--text-3)] mt-2 font-numeric">{p.revisions} révisions incluses · {p.availability}</p>
      </div>

      {isAwaitingPayment && (
        <>
          {/* Détail paiement */}
          <div className="p-3 rounded-lg mb-4 space-y-2" style={{ backgroundColor: "var(--bg-warm)" }}>
            <div className="flex items-center justify-between text-sm">
              <span>Prix de la prestation</span>
              <span className="font-numeric font-semibold">{formatFCFA(p.price)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-[var(--text-2)]">
              <span className="flex items-center gap-1"><ShieldCheck size={11} className="text-[var(--forest)]" /> Fonds de garantie (1,5%)</span>
              <span className="font-numeric">{formatFCFA(garantie)}</span>
            </div>
            <div className="flex items-center justify-between font-display font-bold pt-2 border-t border-[var(--border)]">
              <span>Total à payer</span>
              <span className="font-numeric text-[var(--amber-dark)] text-lg">{formatFCFA(total)}</span>
            </div>
          </div>

          <div className="p-3 rounded-lg mb-4 flex items-start gap-2" style={{ backgroundColor: "var(--forest-pale)" }}>
            <ShieldCheck size={14} className="text-[var(--forest)] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-[var(--forest)]">Paiement sécurisé Mobile Money. Le designer est payé après validation de vos livrables.</p>
          </div>

          <button onClick={onPay} className="dedco-btn dedco-btn-primary w-full">
            <CreditCard size={14} /> Payer {formatFCFA(total)}
          </button>
        </>
      )}
    </div>
  );
}
