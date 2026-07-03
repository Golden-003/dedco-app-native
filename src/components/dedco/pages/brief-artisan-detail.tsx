"use client";

import { useState } from "react";
import {
  CheckCircle2, Clock, ChevronRight, AlertTriangle, X, Check,
  Hammer, MapPin, Ruler, Calendar, Send, MessageSquare, ShieldCheck,
  Plus, Edit3, Eye, CreditCard, ArrowRight, Package, RefreshCw,
} from "lucide-react";
import { useDedcoStore } from "@/lib/store";
import { getBackToProjets } from "@/lib/back-to-projets";
import { useBriefArtisanStore } from "@/lib/artisan-brief-store";
import { formatFCFA } from "@/lib/dedco-data";
import { BRIEF_ARTISAN_STATUS } from "@/lib/dedco-status";
import type { ArtisanBrief, ArtisanBriefProposal } from "@/lib/artisan-brief-types";

// ============================================================
// PAGE : Brief Artisan Détail (s'adapte au statut)
// Boutons contextuels selon la machine d'états
// ============================================================

export function BriefArtisanDetailPage({ briefId }: { briefId: string }) {
  const navigate = useDedcoStore((s) => s.navigate);
  const currentUser = useDedcoStore((s) => s.currentUser);
  const brief = useBriefArtisanStore((s) => s.briefs.find(b => b.id === briefId));
  const submitBrief = useBriefArtisanStore((s) => s.submitBrief);
  const publishBrief = useBriefArtisanStore((s) => s.publishBrief);
  const startDiscussion = useBriefArtisanStore((s) => s.startDiscussion);
  const selectProposal = useBriefArtisanStore((s) => s.selectProposal);
  const confirmSelection = useBriefArtisanStore((s) => s.confirmSelection);
  const payDeposit = useBriefArtisanStore((s) => s.payDeposit);
  const cancelBrief = useBriefArtisanStore((s) => s.cancelBrief);
  const duplicateBrief = useBriefArtisanStore((s) => s.duplicateBrief);
  const relanceBrief = useBriefArtisanStore((s) => s.relanceBrief);

  const [toast, setToast] = useState<string | null>(null);
  const [expandedProposals, setExpandedProposals] = useState(false);
  const [discussionProposalId, setDiscussionProposalId] = useState<string | null>(null);
  const [discussionMessage, setDiscussionMessage] = useState("");

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  // ── Bouton retour — role-aware ──
  const { route: backRoute, label: backLabel } = getBackToProjets(currentUser?.role);

  // Brief non trouvé
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

  const statusConfig = BRIEF_ARTISAN_STATUS[brief.status];
  const selectedProposal = brief.proposals.find(p => p.id === brief.selectedProposalId);

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto relative">
      {/* Retour */}
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
            {brief.expiresAt && brief.status === 'PUBLISHED' && (
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
        <h2 className="font-display font-bold mb-3 text-sm">Détails du brief</h2>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Catégorie</p>
            <p className="flex items-center gap-1"><Hammer size={12} className="text-[var(--amber)]" /> {brief.category}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Zone</p>
            <p className="flex items-center gap-1"><MapPin size={12} className="text-[var(--amber)]" /> {brief.zone}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Pièce</p>
            <p>{brief.piece}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Style</p>
            <p>{brief.style}</p>
          </div>
          {brief.dimensions && (
            <div>
              <p className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Dimensions</p>
              <p className="flex items-center gap-1 font-numeric"><Ruler size={12} className="text-[var(--amber)]" /> {brief.dimensions}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Budget</p>
            <p className="font-numeric">{formatFCFA(brief.budgetMin)} – {formatFCFA(brief.budgetMax)}</p>
          </div>
          {brief.materials.length > 0 && (
            <div className="sm:col-span-2">
              <p className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Matériaux souhaités</p>
              <div className="flex flex-wrap gap-1.5">
                {brief.materials.map(m => (
                  <span key={m} className="text-[11px] px-2 py-0.5 rounded-full border border-[var(--border)] text-[var(--text-2)]">{m}</span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border)] text-[11px] text-[var(--text-3)]">
          <span>Créé le <span className="font-numeric">{brief.createdAt}</span></span>
          <span>MAJ <span className="font-numeric">{brief.updatedAt}</span></span>
        </div>
      </div>

      {/* === SECTION CONTEXTUELLE SELON STATUT === */}

      {/* DRAFT : édition + soumettre */}
      {brief.status === 'DRAFT' && (
        <div className="dedco-card p-5 mb-4 border-l-4" style={{ borderLeftColor: "var(--text-3)" }}>
          <h2 className="font-display font-bold mb-2 text-sm">Brouillon en cours</h2>
          <p className="text-sm text-[var(--text-2)] mb-4">
            Votre brief n'est pas encore publié. Les artisans ne peuvent pas le voir. Complétez les informations puis soumettez-le pour publication.
          </p>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => navigate({ page: "brief" })} className="dedco-btn dedco-btn-secondary">
              <Edit3 size={14} /> Continuer l'édition
            </button>
            <button
              onClick={() => {
                submitBrief(brief.id);
                showToast("Brief soumis. Il sera publié automatiquement.");
              }}
              className="dedco-btn dedco-btn-primary"
            >
              <Send size={14} /> Soumettre le brief
            </button>
          </div>
        </div>
      )}

      {/* SUBMITTED : en attente publication */}
      {brief.status === 'SUBMITTED' && (
        <div className="dedco-card p-5 mb-4 border-l-4" style={{ borderLeftColor: "var(--amber)" }}>
          <h2 className="font-display font-bold mb-2 text-sm">Prêt à publier</h2>
          <p className="text-sm text-[var(--text-2)] mb-4">
            Votre brief est complet. Publiez-le pour qu'il soit visible par les artisans vérifiés pendant 14 jours.
          </p>
          <button
            onClick={() => {
              publishBrief(brief.id);
              showToast("Brief publié. Les artisans peuvent désormais répondre.");
            }}
            className="dedco-btn dedco-btn-primary"
          >
            <CheckCircle2 size={14} /> Publier le brief
          </button>
        </div>
      )}

      {/* PUBLISHED : en attente de propositions */}
      {brief.status === 'PUBLISHED' && (
        <div className="dedco-card p-5 mb-4 border-l-4" style={{ borderLeftColor: "var(--amber)" }}>
          <h2 className="font-display font-bold mb-2 text-sm">En recherche d'artisan</h2>
          <p className="text-sm text-[var(--text-2)] mb-4">
            Votre brief est visible par les artisans vérifiés. Vous recevrez une notification dès qu'une proposition sera soumise.
          </p>
          <div className="p-3 rounded-lg flex items-center gap-2" style={{ backgroundColor: "var(--amber-pale)" }}>
            <Clock size={14} style={{ color: "var(--amber-dark)" }} />
            <p className="text-xs" style={{ color: "var(--amber-dark)" }}>
              Expiration le <span className="font-numeric">{brief.expiresAt}</span> — sans proposition, le brief expirera automatiquement.
            </p>
          </div>
        </div>
      )}

      {/* PROPOSALS_RECEIVED : comparaison */}
      {brief.status === 'PROPOSALS_RECEIVED' && (
        <ProposalsSection
          brief={brief}
          expanded={expandedProposals}
          setExpanded={setExpandedProposals}
          onChoose={(proposalId) => {
            selectProposal(brief.id, proposalId);
            showToast(`Proposition de ${brief.proposals.find(p => p.id === proposalId)?.artisanName} sélectionnée. Confirmez pour finaliser le paiement.`);
          }}
          onDiscuss={(proposalId) => {
            startDiscussion(brief.id, proposalId);
            setDiscussionProposalId(proposalId);
            showToast("Discussion ouverte avec l'artisan.");
          }}
        />
      )}

      {/* IN_DISCUSSION : messagerie avec l'artisan sélectionné */}
      {brief.status === 'IN_DISCUSSION' && selectedProposal && (
        <DiscussionSection
          proposal={selectedProposal}
          message={discussionMessage}
          setMessage={setDiscussionMessage}
          onSend={() => {
            if (!discussionMessage.trim()) return;
            setDiscussionMessage("");
            showToast("Message envoyé à l'artisan.");
          }}
          onSelect={() => {
            selectProposal(brief.id, selectedProposal.id);
            showToast("Artisan sélectionné. Confirmez pour passer au paiement.");
          }}
        />
      )}

      {/* ARTISAN_SELECTED : récapitulatif + confirmation */}
      {brief.status === 'ARTISAN_SELECTED' && selectedProposal && (
        <div className="dedco-card p-5 mb-4 border-l-4" style={{ borderLeftColor: "var(--terracotta)" }}>
          <h2 className="font-display font-bold mb-3 text-sm">Récapitulatif</h2>
          <div className="flex gap-3 mb-4">
            <img src={selectedProposal.artisanAvatar} alt={selectedProposal.artisanName} className="w-12 h-12 rounded-full object-cover" />
            <div className="flex-1">
              <p className="font-display font-semibold">{selectedProposal.artisanName}</p>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "var(--amber-pale)", color: "var(--amber-dark)" }}>
                  {selectedProposal.artisanLevel}
                </span>
                {selectedProposal.artisanVerified && <ShieldCheck size={12} className="text-[var(--forest)]" />}
              </div>
            </div>
            <div className="text-right">
              <p className="font-numeric font-bold text-[var(--amber-dark)]">{formatFCFA(selectedProposal.price)}</p>
              <p className="text-[10px] text-[var(--text-3)] font-numeric">{selectedProposal.deliveryTime}</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 mb-4 text-sm">
            <div>
              <p className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Matériaux</p>
              <p>{selectedProposal.materials}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Paiement</p>
              <p>{selectedProposal.paymentConditions}</p>
            </div>
          </div>
          <button
            onClick={() => {
              confirmSelection(brief.id);
              showToast("Sélection confirmée. Vous pouvez maintenant finaliser le paiement.");
            }}
            className="dedco-btn dedco-btn-primary w-full"
          >
            <Check size={14} /> Confirmer et passer au paiement
          </button>
        </div>
      )}

      {/* AWAITING_DEPOSIT : paiement sécurisé (100% au début, plateforme gère avance+escrow) */}
      {brief.status === 'AWAITING_DEPOSIT' && selectedProposal && (
        <div className="dedco-card p-5 mb-4 border-l-4" style={{ borderLeftColor: "var(--terracotta)" }}>
          <h2 className="font-display font-bold mb-2 text-sm">Paiement sécurisé</h2>
          <p className="text-sm text-[var(--text-2)] mb-4">
            Réglez l'intégralité du montant maintenant. Vous payez l'intégralité maintenant. Le designer est payé après validation de vos livrables.
          </p>
          <div className="p-3 rounded-lg mb-4 space-y-2" style={{ backgroundColor: "var(--bg-warm)" }}>
            <div className="flex items-center justify-between text-sm">
              <span>Prix de la prestation</span>
              <span className="font-numeric font-semibold">{formatFCFA(selectedProposal.price)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-[var(--text-2)]">
              <span className="flex items-center gap-1">
                <ShieldCheck size={11} className="text-[var(--forest)]" />
                Fonds de garantie (1,5%)
              </span>
              <span className="font-numeric">{formatFCFA(Math.round(selectedProposal.price * 0.015))}</span>
            </div>
            <div className="flex items-center justify-between font-display font-bold pt-2 border-t border-[var(--border)]">
              <span>Total à payer</span>
              <span className="font-numeric text-[var(--amber-dark)] text-lg">{formatFCFA(Math.round(selectedProposal.price * 1.015))}</span>
            </div>
          </div>
          <div className="p-3 rounded-lg mb-4 flex items-start gap-2" style={{ backgroundColor: "var(--forest-pale)" }}>
            <ShieldCheck size={14} className="text-[var(--forest)] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-[var(--forest)]">
              Paiement sécurisé Mobile Money. Le designer est payé après validation de vos livrables.
            </p>
          </div>
          <button
            onClick={() => {
              // Redirige vers la page de paiement Mobile Money (choix opérateur + confirmation)
              if (selectedProposal) {
                navigate({ page: "projet-paiement-artisan", proposalId: selectedProposal.id });
              }
            }}
            className="dedco-btn dedco-btn-primary w-full"
          >
            <CreditCard size={14} /> Payer {formatFCFA(Math.round(selectedProposal.price * 1.015))}
          </button>
        </div>
      )}

      {/* CONVERTED_TO_PROJECT : suivi projet */}
      {brief.status === 'CONVERTED_TO_PROJECT' && brief.linkedProjectId && (
        <div className="dedco-card p-5 mb-4 border-l-4" style={{ borderLeftColor: "var(--forest)" }}>
          <h2 className="font-display font-bold mb-2 text-sm">Projet créé</h2>
          <p className="text-sm text-[var(--text-2)] mb-4">
            Votre brief a été converti en projet artisan. Suivez l'avancement de la fabrication.
          </p>
          <div className="p-3 rounded-lg mb-4" style={{ backgroundColor: "var(--forest-pale)" }}>
            <p className="text-xs text-[var(--forest)]">
              <CheckCircle2 size={12} className="inline mr-1" />
              Projet <span className="font-numeric">{brief.linkedProjectId}</span> créé — suivi des jalons disponible.
            </p>
          </div>
          <button
            onClick={() => navigate({ page: "projet-artisan-detail", projectId: brief.linkedProjectId! })}
            className="dedco-btn dedco-btn-primary"
          >
            <ArrowRight size={14} /> Suivre le projet
          </button>
        </div>
      )}

      {/* EXPIRED : relance ou duplication */}
      {brief.status === 'EXPIRED' && (
        <div className="dedco-card p-5 mb-4 border-l-4" style={{ borderLeftColor: "var(--text-3)" }}>
          <h2 className="font-display font-bold mb-2 text-sm">Brief expiré</h2>
          <p className="text-sm text-[var(--text-2)] mb-4">
            Votre brief n'a pas reçu de proposition dans les 14 jours. Relancez-le pour 14 jours supplémentaires ou dupliquez-le pour modifier les informations.
          </p>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => {
                relanceBrief(brief.id);
                showToast("Brief relancé pour 14 jours.");
              }}
              className="dedco-btn dedco-btn-primary"
            >
              <RefreshCw size={14} /> Relancer 14 jours
            </button>
            <button
              onClick={() => {
                const newId = duplicateBrief(brief.id);
                showToast(`Brief dupliqué sous ${newId}.`);
                setTimeout(() => navigate({ page: "brief-artisan-detail", briefId: newId }), 1500);
              }}
              className="dedco-btn dedco-btn-secondary"
            >
              <Plus size={14} /> Dupliquer et modifier
            </button>
          </div>
        </div>
      )}

      {/* CANCELLED : duplication */}
      {brief.status === 'CANCELLED' && (
        <div className="dedco-card p-5 mb-4 border-l-4" style={{ borderLeftColor: "var(--text-3)" }}>
          <h2 className="font-display font-bold mb-2 text-sm">Brief annulé</h2>
          <p className="text-sm text-[var(--text-2)] mb-4">
            Ce brief a été annulé. Vous pouvez le dupliquer pour repartir des mêmes informations.
          </p>
          <button
            onClick={() => {
              const newId = duplicateBrief(brief.id);
              showToast(`Brief dupliqué sous ${newId}.`);
              setTimeout(() => navigate({ page: "brief-artisan-detail", briefId: newId }), 1500);
            }}
            className="dedco-btn dedco-btn-primary"
          >
            <Plus size={14} /> Dupliquer le brief
          </button>
        </div>
      )}

      {/* Actions globales (annuler) — sauf si déjà terminal */}
      {!['CONVERTED_TO_PROJECT', 'CANCELLED', 'EXPIRED'].includes(brief.status) && (
        <div className="flex gap-3 flex-wrap mt-4">
          <button
            onClick={() => {
              if (confirm("Annuler ce brief ? Cette action est irréversible.")) {
                cancelBrief(brief.id);
                showToast("Brief annulé.");
              }
            }}
            className="dedco-btn dedco-btn-ghost text-[var(--terracotta)]"
          >
            <X size={14} /> Annuler le brief
          </button>
        </div>
      )}

      {/* Toast inline */}
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
// SUB-COMPONENT : Section Propositions (PROPOSALS_RECEIVED)
// ============================================================

function ProposalsSection({
  brief,
  expanded,
  setExpanded,
  onChoose,
  onDiscuss,
}: {
  brief: ArtisanBrief;
  expanded: boolean;
  setExpanded: (v: boolean) => void;
  onChoose: (proposalId: string) => void;
  onDiscuss: (proposalId: string) => void;
}) {
  return (
    <div className="dedco-card p-5 mb-4 border-l-4" style={{ borderLeftColor: "var(--forest)" }}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display font-bold text-sm">
          <span className="font-numeric">{brief.proposals.length}</span> proposition{brief.proposals.length > 1 ? "s" : ""} reçue{brief.proposals.length > 1 ? "s" : ""}
        </h2>
        <button
          onClick={() => setExpanded(!expanded)}
          className="dedco-btn dedco-btn-primary dedco-btn-sm"
        >
          <Eye size={14} /> {expanded ? "Masquer" : "Comparer"}
        </button>
      </div>

      {!expanded ? (
        <p className="text-sm text-[var(--text-2)]">
          Comparez les matériaux, délais et prix. Choisissez celle qui vous parle ou ouvrez une discussion avec un artisan.
        </p>
      ) : (
        <div className="space-y-3 mt-4">
          {brief.proposals.map((prop: ArtisanBriefProposal) => (
            <div key={prop.id} className="p-4 rounded-lg border border-[var(--border)] bg-[var(--bg-card)]">
              <div className="flex gap-3 mb-3">
                <img src={prop.artisanAvatar} alt={prop.artisanName} className="w-12 h-12 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="font-display font-semibold text-sm truncate">{prop.artisanName}</h4>
                    {prop.artisanVerified && <ShieldCheck size={12} style={{ color: "var(--forest)" }} />}
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "var(--amber-pale)", color: "var(--amber-dark)" }}>
                    {prop.artisanLevel}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-numeric font-bold" style={{ color: "var(--amber-dark)" }}>{formatFCFA(prop.price)}</p>
                  <p className="text-[10px] text-[var(--text-3)] font-numeric">{prop.deliveryTime}</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-2 mb-3 text-xs">
                <p className="text-[var(--text-2)]"><span className="font-medium text-[var(--text-1)]">Matériaux :</span> {prop.materials}</p>
                <p className="text-[var(--text-2)]"><span className="font-medium text-[var(--text-1)]">Paiement :</span> {prop.paymentConditions}</p>
              </div>
              {prop.message && (
                <p className="text-xs italic text-[var(--text-3)] mb-3 p-2 bg-[var(--bg-warm)] rounded">« {prop.message} »</p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => onDiscuss(prop.id)}
                  className="dedco-btn dedco-btn-ghost dedco-btn-sm flex-1"
                >
                  <MessageSquare size={14} /> Discuter
                </button>
                <button
                  onClick={() => onChoose(prop.id)}
                  className="dedco-btn dedco-btn-primary dedco-btn-sm flex-1"
                >
                  <CheckCircle2 size={14} /> Choisir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// SUB-COMPONENT : Section Discussion (IN_DISCUSSION)
// ============================================================

function DiscussionSection({
  proposal,
  message,
  setMessage,
  onSend,
  onSelect,
}: {
  proposal: ArtisanBriefProposal;
  message: string;
  setMessage: (v: string) => void;
  onSend: () => void;
  onSelect: () => void;
}) {
  return (
    <div className="dedco-card p-5 mb-4 border-l-4" style={{ borderLeftColor: "var(--forest)" }}>
      <div className="flex items-center gap-3 mb-4">
        <img src={proposal.artisanAvatar} alt={proposal.artisanName} className="w-10 h-10 rounded-full object-cover" />
        <div className="flex-1">
          <p className="font-display font-semibold text-sm">{proposal.artisanName}</p>
          <p className="text-xs text-[var(--text-3)]">Discussion en cours</p>
        </div>
      </div>

      <div className="space-y-3 mb-4 min-h-[150px]">
        <div className="flex gap-2">
          <img src={proposal.artisanAvatar} alt="" className="w-8 h-8 rounded-full" />
          <div className="flex-1 p-3 bg-[var(--bg-warm)] rounded-md">
            <p className="text-xs text-[var(--text-3)] mb-1">{proposal.artisanName} · il y a 1h</p>
            <p className="text-sm">{proposal.message || "Bonjour ! Je suis disponible pour ce projet. N'hésitez pas si vous avez des questions."}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") onSend(); }}
          placeholder="Votre message..."
          className="flex-1 px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-card"
        />
        <button onClick={onSend} disabled={!message.trim()} className="dedco-btn dedco-btn-primary dedco-btn-sm">
          <Send size={14} />
        </button>
      </div>

      <button onClick={onSelect} className="dedco-btn dedco-btn-primary w-full">
        <Check size={14} /> Sélectionner cet artisan
      </button>
    </div>
  );
}
