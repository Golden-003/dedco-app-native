"use client";

import { useState } from "react";
import {
  Check,
  CheckCircle2,
  Clock,
  ChevronRight,
  X,
  AlertTriangle,
  ShieldCheck,
  Send,
  MessageSquare,
  Download,
  FileText,
  ShoppingBag,
  Plus,
  Zap,
  Sofa,
  Home,
  Lightbulb,
  MapPin,
} from "lucide-react";
import { useDedcoStore, type ProjectScope } from "@/lib/store";
import { getBackToProjets } from "@/lib/back-to-projets";
import { formatFCFA, PRODUCTS } from "@/lib/dedco-data";
import { PhoneInput } from "@/components/dedco/phone-input";

// ============================================================
// MOCK DATA
// ============================================================

const SCOPE_INFO: Record<ProjectScope, { label: string; icon: typeof Zap }> = {
  prototype: { label: "Prototype", icon: Zap },
  standard: { label: "Standard", icon: Sofa },
  premium: { label: "Premium", icon: Home },
};

function ScopeBadge({ scope }: { scope: ProjectScope }) {
  const info = SCOPE_INFO[scope];
  const Icon = info.icon;
  return <span className="dedco-badge dedco-badge-amber"><Icon size={12} /> {info.label}</span>;
}

// Prestations que le designer DOIT choisir avant de répondre
const PRESTATION_OPTIONS = [
  { id: "consultation", label: "Consultation rapide", icon: Lightbulb, desc: "Conseil ponctuel, ajustement décoratif" },
  { id: "espace", label: "Aménagement d'un espace", icon: Sofa, desc: "Une pièce ou zone définie" },
  { id: "complet", label: "Projet complet", icon: Home, desc: "Plusieurs espaces, conception globale" },
] as const;

const MOCK_BRIEF = {
  id: "BRF-2026-001",
  designerName: "Ndèye Sarr",
  designerAvatar: "https://images.unsplash.com/photo-1729355796906-10a9809e0864?auto=format&fit=crop&crop=faces&w=120&q=80",
  clientName: "Sophie Kossou",
  clientAvatar: "https://images.unsplash.com/photo-1614317226704-aba58b1ce153?auto=format&fit=crop&crop=faces&w=120&q=80",
  scope: "standard" as ProjectScope,
  besoin: "Moderniser mon salon en gardant une touche africaine. Mobilier vieillissant, besoin de rangement.",
  objectif: "Un salon convivial, moderne et ancré dans l'identité africaine contemporaine",
  espace: "Salon 25m²",
  prestationsSouhaitees: ["Moodboard", "Plan d'implantation", "Liste d'achats Dedco"],
  sentAt: "Il y a 2h",
};

// ============================================================
// PAGE 1: designer-projet-attente — Brief envoyé, en attente
// ============================================================

export function DesignerProjetAttentePage({ projectId }: { projectId: string }) {
  const navigate = useDedcoStore((s) => s.navigate);
  const brief = MOCK_BRIEF;

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <button onClick={() => navigate({ page: "home" })} className="text-sm text-[var(--text-3)] hover:text-[var(--amber)] mb-4 flex items-center gap-1">
        ← Retour à l'accueil
      </button>

      <div className="dedco-card p-5 mb-4 bg-[var(--amber-pale)]/50 border-l-4" style={{ borderLeftColor: "var(--amber)" }}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--amber)] flex items-center justify-center flex-shrink-0">
            <Clock size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg mb-1">Brief envoyé</h1>
            <p className="text-sm text-[var(--text-2)]">En attente de la réponse du designer (24-48h)</p>
          </div>
        </div>
      </div>

      <div className="dedco-card p-5 mb-4">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h2 className="font-display font-bold">Résumé du brief</h2>
          <ScopeBadge scope={brief.scope} />
        </div>
        <dl className="space-y-2 text-sm">
          <div><dt className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Besoin</dt><dd>{brief.besoin}</dd></div>
          <div><dt className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Objectif</dt><dd>{brief.objectif}</dd></div>
          {brief.espace && <div><dt className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Espace</dt><dd>{brief.espace}</dd></div>}
          <div><dt className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Prestations souhaitées</dt><dd>{brief.prestationsSouhaitees.join(", ")}</dd></div>
        </dl>
      </div>

      <p className="text-xs text-[var(--text-3)] text-center">Aucun paiement à cette étape. Le designer va répondre puis vous envoyer une proposition.</p>
    </div>
  );
}

// ============================================================
// PAGE 2: designer-brief-recu — Brief reçu + Choix prestation + 3 actions
// ============================================================

export function DesignerBriefRecuPage({ briefId }: { briefId: string }) {
  const navigate = useDedcoStore((s) => s.navigate);
  const brief = MOCK_BRIEF;
  const [prestation, setPrestation] = useState<string>("");
  const [showQuestions, setShowQuestions] = useState(false);
  const [questions, setQuestions] = useState(["", "", ""]);

  // 3 ACTIONS UNIQUEMENT — pas d'autres options
  const canAct = !!prestation; // Le designer DOIT choisir une prestation avant d'agir

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <header className="mb-6">
        <div className="flex items-center gap-3 mb-1 flex-wrap">
          <h1 className="display-lg mb-0">Brief reçu</h1>
          <ScopeBadge scope={brief.scope} />
        </div>
        <p className="text-sm text-[var(--text-2)] font-numeric">{brief.id} · Reçu {brief.sentAt}</p>
      </header>

      {/* 1. RÉSUMÉ DU BRIEF — simple, pas de navigation */}
      <div className="dedco-card p-5 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <img src={brief.clientAvatar} alt={brief.clientName} className="w-12 h-12 rounded-full object-cover" />
          <div><p className="font-display font-semibold">{brief.clientName}</p><p className="text-xs text-[var(--text-3)]">Client</p></div>
        </div>
        <dl className="space-y-2 text-sm">
          <div><dt className="text-xs text-[var(--text-3)] uppercase tracking-wide">Niveau</dt><dd className="font-semibold">{SCOPE_INFO[brief.scope].label}</dd></div>
          <div><dt className="text-xs text-[var(--text-3)] uppercase tracking-wide">Type</dt><dd>{brief.espace || "Non précisé"}</dd></div>
          <div><dt className="text-xs text-[var(--text-3)] uppercase tracking-wide">Besoin</dt><dd>{brief.besoin}</dd></div>
          <div><dt className="text-xs text-[var(--text-3)] uppercase tracking-wide">Objectif</dt><dd>{brief.objectif}</dd></div>
          <div><dt className="text-xs text-[var(--text-3)] uppercase tracking-wide">Prestations souhaitées</dt><dd>{brief.prestationsSouhaitees.join(", ")}</dd></div>
        </dl>
      </div>

      {/* 2. CHOIX DE PRESTATION — OBLIGATOIRE avant toute action */}
      <div className="dedco-card p-5 mb-4 border-l-4" style={{ borderLeftColor: "var(--amber)" }}>
        <h2 className="font-display font-bold mb-1">Choix de prestation</h2>
        <p className="text-xs text-[var(--text-3)] mb-4">Vous devez choisir une prestation avant de répondre au client.</p>
        <div className="grid sm:grid-cols-3 gap-3">
          {PRESTATION_OPTIONS.map((opt) => {
            const active = prestation === opt.id;
            const OptIcon = opt.icon;
            return (
              <button
                key={opt.id}
                onClick={() => setPrestation(opt.id)}
                className={`p-4 rounded-lg border-2 text-center transition-all ${
                  active ? "border-[var(--amber)] bg-[var(--amber-pale)]/30" : "border-[var(--border)] hover:border-[var(--text-3)]"
                }`}
              >
                <div className="mb-1 flex justify-center"><OptIcon size={24} className="text-[var(--amber)]" /></div>
                <p className="font-display font-semibold text-sm">{opt.label}</p>
                <p className="text-[10px] text-[var(--text-3)] mt-0.5">{opt.desc}</p>
                {active && <Check size={16} className="text-[var(--amber)] mx-auto mt-1" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. ACTIONS DESIGNER — 3 UNIQUEMENT */}
      {!showQuestions ? (
        <div className="dedco-card p-5">
          <h3 className="font-display font-bold mb-4">Votre réponse</h3>
          {!canAct && <p className="text-xs text-[var(--terracotta)] mb-3 flex items-center gap-1"><AlertTriangle size={12} /> Choisissez une prestation ci-dessus pour activer les actions.</p>}
          <div className="space-y-2">
            <button
              disabled={!canAct}
              onClick={() => navigate({ page: "designer-proposition-mission", briefId: brief.id })}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all flex items-center gap-3 ${
                canAct ? "border-[var(--amber)] bg-[var(--amber-pale)]/30 hover:bg-[var(--amber-pale)] cursor-pointer" : "border-[var(--border)] opacity-40 cursor-not-allowed"
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-[var(--amber)] text-white flex items-center justify-center flex-shrink-0"><Check size={18} /></div>
              <div><p className="font-display font-semibold text-sm">Proposer immédiatement</p><p className="text-xs text-[var(--text-3)]">Créer une proposition de mission avec prix</p></div>
            </button>

            <button
              disabled={!canAct}
              onClick={() => canAct && setShowQuestions(true)}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all flex items-center gap-3 ${
                canAct ? "border-[var(--border)] hover:border-[var(--text-3)] cursor-pointer" : "border-[var(--border)] opacity-40 cursor-not-allowed"
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-[var(--bg-warm)] text-[var(--text-2)] flex items-center justify-center flex-shrink-0"><MessageSquare size={18} /></div>
              <div><p className="font-display font-semibold text-sm">Poser max 3 questions</p><p className="text-xs text-[var(--text-3)]">Demander des précisions avant de proposer</p></div>
            </button>

            <button
              disabled={!canAct}
              onClick={() => canAct && navigate({ page: "designer-dashboard" })}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all flex items-center gap-3 ${
                canAct ? "border-[var(--terracotta)]/30 hover:bg-[var(--terracotta-pale)] cursor-pointer" : "border-[var(--border)] opacity-40 cursor-not-allowed"
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-[var(--terracotta-pale)] text-[var(--terracotta)] flex items-center justify-center flex-shrink-0"><X size={18} /></div>
              <div><p className="font-display font-semibold text-sm text-[var(--terracotta)]">Refuser</p><p className="text-xs text-[var(--text-3)]">Décliner ce projet</p></div>
            </button>
          </div>
        </div>
      ) : (
        <div className="dedco-card p-5">
          <h3 className="font-display font-bold mb-3">Poser vos questions (max 3)</h3>
          <div className="space-y-3 mb-4">
            {questions.map((q, i) => (
              <input
                key={i}
                value={q}
                onChange={(e) => setQuestions(questions.map((qq, idx) => idx === i ? e.target.value : qq))}
                placeholder={`Question ${i + 1}`}
                className="w-full px-3 py-2.5 text-sm border border-[var(--border)] rounded-md bg-card"
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowQuestions(false)} className="dedco-btn dedco-btn-ghost">Annuler</button>
            <button onClick={() => navigate({ page: "designer-dashboard" })} className="dedco-btn dedco-btn-primary flex-1"><Send size={14} /> Envoyer les questions</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// PAGE 3: designer-proposition-mission — Proposition (structure obligatoire)
// ============================================================

export function DesignerPropositionMissionPage({ briefId }: { briefId: string }) {
  const navigate = useDedcoStore((s) => s.navigate);
  const brief = MOCK_BRIEF;
  const [form, setForm] = useState({
    objectif: brief.objectif,
    prestation: "Aménagement d'un espace",
    livrables: "Moodboard, plan d'implantation, sélection mobilier, liste d'achats",
    delai: "21 jours",
    prix: 300000,
    inclusions: "Moodboard, plan, sélection produits, 2 ajustements",
    exclusions: "Achats produits, travaux, livraison, prestations artisans",
    visite: false,
  });

  const totalClient = form.prix;
  const commission = Math.round(form.prix * 0.10);
  const netDesigner = form.prix - commission;

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <button onClick={() => navigate({ page: "designer-brief-recu", briefId })} className="text-sm text-[var(--text-3)] hover:text-[var(--amber)] mb-4 flex items-center gap-1">
        ← Retour au brief
      </button>

      <header className="mb-6">
        <h1 className="display-lg mb-1">Proposition de mission</h1>
        <p className="text-sm text-[var(--text-2)]">Pour {brief.clientName}</p>
      </header>

      <div className="dedco-card p-5 space-y-4">
        {/* Structure obligatoire */}
        <div>
          <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Objectif</label>
          <input value={form.objectif} onChange={(e) => setForm({ ...form, objectif: e.target.value })} className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-card" />
        </div>

        <div>
          <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Prestation choisie</label>
          <input value={form.prestation} onChange={(e) => setForm({ ...form, prestation: e.target.value })} className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-card" />
        </div>

        <div>
          <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Livrables</label>
          <textarea value={form.livrables} onChange={(e) => setForm({ ...form, livrables: e.target.value })} rows={2} className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-card resize-none" />
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Délai</label>
            <input value={form.delai} onChange={(e) => setForm({ ...form, delai: e.target.value })} className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-card" />
          </div>
          <div>
            <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Prix global (FCFA)</label>
            <input type="number" value={form.prix} onChange={(e) => setForm({ ...form, prix: Number(e.target.value) })} className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-card font-numeric" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Inclusions</label>
            <input value={form.inclusions} onChange={(e) => setForm({ ...form, inclusions: e.target.value })} className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-card" />
          </div>
          <div>
            <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Exclusions</label>
            <input value={form.exclusions} onChange={(e) => setForm({ ...form, exclusions: e.target.value })} className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-card" />
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer p-3 bg-[var(--bg-warm)] rounded-md">
          <input type="checkbox" checked={form.visite} onChange={(e) => setForm({ ...form, visite: e.target.checked })} className="w-4 h-4" style={{ accentColor: "var(--amber)" }} />
          <span className="text-sm">Visite sur site incluse si nécessaire</span>
        </label>

        {/* Transparence financière */}
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="p-3 bg-[var(--amber-pale)]/30 rounded-md">
            <p className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-2">Côté client</p>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between"><span>Honoraires</span><span className="font-numeric">{formatFCFA(form.prix)}</span></div>
              <div className="flex justify-between font-bold pt-1 border-t border-[var(--border)]"><span>Total</span><span className="font-numeric text-[var(--amber)]">{formatFCFA(totalClient)}</span></div>
            </div>
          </div>
          <div className="p-3 bg-[var(--bg-warm)] rounded-md">
            <p className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-2">Côté designer</p>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between"><span>Montant mission</span><span className="font-numeric">{formatFCFA(form.prix)}</span></div>
              <div className="flex justify-between text-[var(--terracotta)]"><span>Commission 10%</span><span className="font-numeric">-{formatFCFA(commission)}</span></div>
              <div className="flex justify-between font-bold pt-1 border-t border-[var(--border)]"><span>Net reçu</span><span className="font-numeric text-[var(--forest)]">{formatFCFA(netDesigner)}</span></div>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            // Génère un ID de proposition et notifie le client
            const proposalId = `PROP-${Date.now()}`;
            // TODO: en production, appel API POST /api/proposals
            // Pour le prototype, on redirige le designer vers son dashboard
            // avec un toast de confirmation, et le client pourra voir la proposition
            // depuis sa page "Mes projets"
            navigate({ page: "designer-dashboard" });
            // Afficher un toast de succès (sera capté par le Toaster global)
            if (typeof window !== "undefined") {
              window.dispatchEvent(new CustomEvent("dedco-toast", {
                detail: {
                  type: "success",
                  title: "Proposition envoyée !",
                  message: "Le client a été notifié. Vous serez prévenu dès qu'il aura répondu.",
                }
              }));
            }
          }}
          className="dedco-btn dedco-btn-primary w-full"
        >
          <Send size={16} /> Envoyer la proposition
        </button>
      </div>
    </div>
  );
}

// ============================================================
// PAGE 4: client-proposition-recue — Client voit proposition + paie
// ============================================================

export function ClientPropositionRecuePage({ proposalId }: { proposalId: string }) {
  const navigate = useDedcoStore((s) => s.navigate);
  const currentUser = useDedcoStore((s) => s.currentUser);
  const { route: backRoute, label: backLabel } = getBackToProjets(currentUser?.role);
  const proposal = {
    scope: "standard" as ProjectScope,
    designerName: "Ndèye Sarr",
    designerAvatar: "https://images.unsplash.com/photo-1729355796906-10a9809e0864?auto=format&fit=crop&crop=faces&w=120&q=80",
    objectif: "Un salon convivial, moderne et ancré dans l'identité africaine contemporaine",
    prestation: "Aménagement d'un espace",
    livrables: ["Moodboard", "Plan d'implantation", "Sélection mobilier et décoration", "Liste d'achats Dedco"],
    delai: "21 jours",
    prix: 300000,
    inclusions: "Moodboard, plan, sélection produits, 2 ajustements",
    exclusions: "Achats produits, travaux, livraison, prestations artisans",
    visite: false,
  };
  const total = proposal.prix;

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <button onClick={() => navigate(backRoute)} className="text-sm text-[var(--text-3)] hover:text-[var(--amber)] mb-4 flex items-center gap-1">← {backLabel}</button>

      <header className="mb-6">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="dedco-badge dedco-badge-amber">Proposition de mission</span>
          <ScopeBadge scope={proposal.scope} />
        </div>
        <h1 className="display-lg mb-2">{proposal.objectif}</h1>
        <div className="flex items-center gap-3">
          <img src={proposal.designerAvatar} alt={proposal.designerName} className="w-10 h-10 rounded-full" />
          <p className="text-sm">par <strong>{proposal.designerName}</strong></p>
        </div>
      </header>

      <div className="dedco-card p-5 mb-4">
        <dl className="space-y-3 text-sm">
          <div><dt className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Prestation</dt><dd className="font-semibold">{proposal.prestation}</dd></div>
          <div><dt className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Livrables</dt><dd><ul className="space-y-1">{proposal.livrables.map((l) => <li key={l} className="flex items-center gap-2"><Check size={14} className="text-[var(--forest)]" /> {l}</li>)}</ul></dd></div>
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[var(--border)]">
            <div><dt className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Délai</dt><dd className="font-numeric font-semibold">{proposal.delai}</dd></div>
            <div><dt className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Prix</dt><dd className="font-numeric font-semibold text-[var(--amber)]">{formatFCFA(proposal.prix)}</dd></div>
          </div>
          <div><dt className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Inclus</dt><dd className="text-[var(--forest)]">{proposal.inclusions}</dd></div>
          <div><dt className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Non inclus</dt><dd className="text-[var(--terracotta)]">{proposal.exclusions}</dd></div>
          {proposal.visite && <div className="p-2 bg-[var(--amber-pale)]/30 rounded text-xs flex items-center gap-1"><MapPin size={12} className="text-[var(--amber)]" /> Visite sur site incluse si nécessaire</div>}
        </dl>
      </div>

      <div className="dedco-card p-5 mb-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span>Honoraires designer</span><span className="font-numeric font-semibold">{formatFCFA(proposal.prix)}</span></div>
          <div className="flex justify-between font-display font-bold pt-2 border-t border-[var(--border)]"><span>Total</span><span className="font-numeric text-[var(--amber)] text-lg">{formatFCFA(total)}</span></div>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={() => navigate({ page: "messages", conversationId: `prop-${proposalId}` })} className="dedco-btn dedco-btn-ghost">Demander une modification</button>
        <button onClick={() => navigate(backRoute)} className="dedco-btn dedco-btn-ghost text-[var(--terracotta)]">Refuser</button>
        <button onClick={() => navigate({ page: "projet-paiement", proposalId })} className="dedco-btn dedco-btn-primary flex-1">Accepter et payer <ChevronRight size={16} /></button>
      </div>
    </div>
  );
}

// ============================================================
// PAGE 5: projet-paiement — Paiement
// ============================================================

export function ProjetPaiementPage({ proposalId }: { proposalId: string }) {
  const navigate = useDedcoStore((s) => s.navigate);
  const currentUser = useDedcoStore((s) => s.currentUser);
  const { route: backRoute, label: backLabel } = getBackToProjets(currentUser?.role);
  const [operator, setOperator] = useState<"mtn" | "moov">("mtn");
  const [done, setDone] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("+229 01 97 45 23 10");
  const total = 304500;

  if (done) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center">
        <div className="w-20 h-20 rounded-full bg-[var(--forest-pale)] mx-auto flex items-center justify-center mb-5">
          <CheckCircle2 size={40} className="text-[var(--forest)]" />
        </div>
        <h1 className="display-xl mb-3">Projet confirmé !</h1>
        <p className="text-sm text-[var(--text-2)] mb-6">Le projet démarre maintenant.</p>
        <button onClick={() => navigate({ page: "projet-designer-detail", projectId: `PD-${proposalId.replace(/\D/g, "")}` } as any)} className="dedco-btn dedco-btn-primary">Suivre le projet <ChevronRight size={16} /></button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-md mx-auto">
      <header className="mb-6"><h1 className="display-lg mb-1">Paiement</h1><p className="text-sm text-[var(--text-2)]">Aménagement du salon</p></header>
      <div className="dedco-card p-5 mb-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span>Honoraires</span><span className="font-numeric font-semibold">{formatFCFA(300000)}</span></div>
          <div className="flex justify-between font-display font-bold pt-2 border-t border-[var(--border)]"><span>Total</span><span className="font-numeric text-[var(--amber)] text-lg">{formatFCFA(total)}</span></div>
        </div>
      </div>
      <div className="dedco-card p-5 mb-4">
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[{ id: "mtn", label: "MTN MoMo", color: "#FFCC00", text: "#000" }, { id: "moov", label: "Moov Money", color: "#009BDB", text: "#fff" }].map((op) => (
            <button key={op.id} onClick={() => setOperator(op.id as "mtn" | "moov")} className={`px-3 py-3 rounded-md text-sm font-semibold border-2 ${operator === op.id ? "border-[var(--amber)]" : "border-[var(--border)]"}`} style={{ backgroundColor: op.color, color: op.text }}>{op.label}</button>
          ))}
        </div>
        <PhoneInput value={phoneNumber} onChange={setPhoneNumber} className="w-full" />
      </div>
      <button onClick={() => setDone(true)} className="dedco-btn dedco-btn-primary w-full dedco-btn-lg">Payer {formatFCFA(total)}</button>
    </div>
  );
}

// ============================================================
// PAGE 6: projet-detail — Suivi projet (simple, pas de CRM)
// ============================================================

export function ProjetDetailPage({ projectId }: { projectId: string }) {
  const navigate = useDedcoStore((s) => s.navigate);
  const currentUser = useDedcoStore((s) => s.currentUser);
  const { route: backRoute, label: backLabel } = getBackToProjets(currentUser?.role);
  const [tab, setTab] = useState<"progression" | "messages" | "achats">("progression");
  const [toast, setToast] = useState<string | null>(null);
  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  const stages = [
    { label: "Projet confirmé", done: true },
    { label: "Moodboard", done: false, current: true },
    { label: "Plan & sélection", done: false },
    { label: "Livraison", done: false },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <button onClick={() => navigate(backRoute)} className="text-sm text-[var(--text-3)] hover:text-[var(--amber)] mb-2 flex items-center gap-1">← {backLabel}</button>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1"><span className="dedco-badge dedco-badge-amber">En cours</span><ScopeBadge scope="standard" /></div>
          <h1 className="display-lg">Aménagement du salon</h1>
        </div>
        <button onClick={() => navigate({ page: "projet-livraison", projectId })} className="dedco-btn dedco-btn-ghost dedco-btn-sm"><ShoppingBag size={14} /> Livraison</button>
      </div>

      <div className="flex gap-2 mb-4">
        {[{ id: "progression", label: "Progression" }, { id: "messages", label: "Messagerie" }, { id: "achats", label: "Achats recommandés" }].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id as typeof tab)} className={`px-4 py-2 rounded-full text-sm font-medium ${tab === t.id ? "bg-[var(--amber)] text-white" : "bg-card border border-[var(--border)] text-[var(--text-2)]"}`}>{t.label}</button>
        ))}
      </div>

      {tab === "progression" && (
        <div className="dedco-card p-5">
          <div className="space-y-3">
            {stages.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${s.done ? "bg-[var(--forest)] text-white" : s.current ? "bg-[var(--amber)] text-white" : "bg-[var(--bg-warm)] text-[var(--text-3)]"}`}>
                  {s.done ? <Check size={14} /> : <span className="font-numeric text-xs">{i + 1}</span>}
                </div>
                <span className={`text-sm ${s.done ? "text-[var(--text-2)]" : s.current ? "font-semibold" : "text-[var(--text-3)]"}`}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "messages" && (
        <div className="dedco-card p-5">
          <div className="space-y-3 mb-4 min-h-[120px]">
            <div className="flex gap-2">
              <img src="https://images.unsplash.com/photo-1729355796906-10a9809e0864?auto=format&fit=crop&crop=faces&w=400&q=85" alt="" className="w-8 h-8 rounded-full" />
              <div className="flex-1 p-3 bg-[var(--bg-warm)] rounded-md"><p className="text-xs text-[var(--text-3)] mb-1">Ndèye · il y a 2h</p><p className="text-sm">Je démarre le moodboard. Palette terracotta + cream ?</p></div>
            </div>
          </div>
          <div className="flex gap-2">
            <input placeholder="Votre message..." className="flex-1 px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-card" />
            <button onClick={() => showToast("Message envoyé.")} className="dedco-btn dedco-btn-primary dedco-btn-sm"><Send size={14} /></button>
          </div>
        </div>
      )}

      {tab === "achats" && (
        <div>
          <div className="dedco-card p-3 mb-3 bg-[var(--amber-pale)]/30">
            <p className="text-xs">Sélection recommandée par le designer. Vous êtes libre d'acheter ou non.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PRODUCTS.slice(0, 4).map((p) => (
              <button key={p.id} onClick={() => navigate({ page: "product", id: p.id })} className="dedco-card overflow-hidden text-left">
                <img src={p.images[0]} alt={p.name} className="w-full aspect-square object-cover" />
                <div className="p-2"><p className="text-xs font-medium line-clamp-1">{p.name}</p><p className="font-numeric font-bold text-xs text-[var(--amber)] mt-1">{formatFCFA(p.price)}</p></div>
              </button>
            ))}
          </div>
        </div>
      )}

      <button onClick={() => navigate({ page: "litige", id: `REC-${projectId}` })} className="dedco-btn dedco-btn-ghost text-[var(--terracotta)] mt-4"><AlertTriangle size={14} /> Ouvrir un litige</button>

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
// PAGE 7: projet-livraison — Livraison + validation
// ============================================================

export function ProjetLivraisonPage({ projectId }: { projectId: string }) {
  const [toast, setToast] = useState<string | null>(null);
  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(null), 3000); }

  const navigate = useDedcoStore((s) => s.navigate);
  const currentUser = useDedcoStore((s) => s.currentUser);
  const { route: backRoute, label: backLabel } = getBackToProjets(currentUser?.role);
  const [validated, setValidated] = useState(false);
  const livrables = [
    { id: 1, name: "Moodboard.pdf", date: "25 juin" },
    { id: 2, name: "Plan d'implantation.pdf", date: "30 juin" },
    { id: 3, name: "Sélection mobilier.pdf", date: "3 juillet" },
    { id: 4, name: "Liste d'achats.pdf", date: "10 juillet" },
  ];

  if (validated) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center">
        <div className="w-20 h-20 rounded-full bg-[var(--forest-pale)] mx-auto flex items-center justify-center mb-5"><CheckCircle2 size={40} className="text-[var(--forest)]" /></div>
        <h1 className="display-xl mb-3">Livraison validée !</h1>
        <p className="text-sm text-[var(--text-2)] mb-6">Paiement libéré au designer.</p>
        <div className="flex gap-2 justify-center">
          <button onClick={() => navigate(backRoute)} className="dedco-btn dedco-btn-primary">{backLabel}</button>
          <button onClick={() => navigate({ page: "marketplace" })} className="dedco-btn dedco-btn-ghost">Marketplace</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <button onClick={() => navigate({ page: "projet-detail", projectId })} className="text-sm text-[var(--text-3)] hover:text-[var(--amber)] mb-4 flex items-center gap-1">← Retour</button>
      <header className="mb-6"><span className="dedco-badge dedco-badge-amber mb-2">Livrables à valider</span><h1 className="display-lg">Livraison du projet</h1></header>
      <div className="dedco-card p-5 mb-4">
        <ul className="space-y-2">
          {livrables.map((l) => (
            <li key={l.id} className="flex items-center gap-3 p-3 bg-[var(--bg-warm)] rounded-md">
              <div className="w-10 h-10 rounded-md bg-card flex items-center justify-center text-[var(--amber)]"><FileText size={18} /></div>
              <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{l.name}</p><p className="text-xs text-[var(--text-3)] font-numeric">{l.date}</p></div>
              <button onClick={() => showToast("Téléchargement démarré.")} className="dedco-btn dedco-btn-ghost dedco-btn-sm"><Download size={14} /></button>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex gap-2">
        <button onClick={() => navigate({ page: "messages", conversationId: `proj-${projectId}` })} className="dedco-btn dedco-btn-ghost">Demander une révision</button>
        <button onClick={() => setValidated(true)} className="dedco-btn dedco-btn-primary flex-1"><Check size={16} /> Valider la livraison</button>
      </div>
    </div>
  );
}
