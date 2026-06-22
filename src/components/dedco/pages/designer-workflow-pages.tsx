"use client";

import { useState } from "react";
import {
  Check,
  CheckCircle2,
  Clock,
  MapPin,
  Video,
  Phone,
  MessageSquare,
  Calendar,
  FileText,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Upload,
  X,
  AlertTriangle,
  Lock,
  ShieldCheck,
  Wallet,
  Briefcase,
  Eye,
  Download,
  Send,
  Star,
  Plus,
  Trash2,
  ShoppingBag,
} from "lucide-react";
import { useDedcoStore } from "@/lib/store";
import { formatFCFA, DESIGNERS, PRODUCTS, getProduct } from "@/lib/dedco-data";

// ============================================================
// MOCK DATA — Workflow designer
// ============================================================

const MOCK_BRIEF = {
  id: "BRF-2026-001",
  designerId: 1,
  designerName: "Ndèye Sarr",
  designerAvatar: "https://images.unsplash.com/photo-1729355796906-10a9809e0864?auto=format&fit=crop&crop=faces&w=120&q=80",
  clientName: "Sophie Kossou",
  clientAvatar: "https://images.unsplash.com/photo-1614317226704-aba58b1ce153?auto=format&fit=crop&crop=faces&w=120&q=80",
  // Step 1
  besoinType: "Aménagement d'une pièce",
  lieuType: "Appartement",
  piece: "Salon",
  surface: 25,
  ville: "Cotonou",
  quartier: "Akpakpa",
  // Step 2
  souhaits: "Moderniser mon salon en gardant une touche africaine. Mobilier actuel vieillissant.",
  style: "Afro-contemporain",
  contraintes: "Budget limité, besoin de rangement",
  budget: "250 000 - 750 000 FCFA",
  echeance: "2-3 mois",
  // Step 3
  photos: ["https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=400&q=80"],
  inspirations: ["https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=400&q=80"],
  // Step 4
  format: "visite" as "distance" | "visite" | "recommandation",
  // Meta
  sentAt: "Il y a 2h",
  status: "en_attente" as const,
};

// ============================================================
// PAGE: designer-projet-attente — Brief envoyé, en attente
// ============================================================

export function DesignerProjetAttentePage({ projectId }: { projectId: string }) {
  const navigate = useDedcoStore((s) => s.navigate);
  const brief = MOCK_BRIEF;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button onClick={() => navigate({ page: "home" })} className="text-sm text-[var(--text-3)] hover:text-[var(--amber)] mb-4 flex items-center gap-1">
        ← Retour à l'accueil
      </button>

      {/* Status banner */}
      <div className="dedco-card p-5 mb-5 bg-[var(--amber-pale)]/50 border-l-4" style={{ borderLeftColor: "var(--amber)" }}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--amber)] flex items-center justify-center flex-shrink-0">
            <Clock size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg mb-1">Brief envoyé</h1>
            <p className="text-sm text-[var(--text-2)]">En attente de la proposition de cadrage du designer</p>
          </div>
        </div>
      </div>

      {/* Designer selected */}
      <div className="dedco-card p-5 mb-5">
        <p className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-3">Designer contacté</p>
        <div className="flex items-center gap-4">
          <img src={brief.designerAvatar} alt={brief.designerName} className="w-14 h-14 rounded-full object-cover" />
          <div className="flex-1">
            <p className="font-display font-semibold">{brief.designerName}</p>
            <p className="text-xs text-[var(--text-3)]">Délai de réponse moyen : 4h</p>
          </div>
          <span className="dedco-badge dedco-badge-amber">Brief envoyé</span>
        </div>
      </div>

      {/* Brief summary */}
      <div className="dedco-card p-5 mb-5">
        <h2 className="font-display font-bold mb-4">Résumé du brief</h2>
        <dl className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Type de besoin</dt>
            <dd>{brief.besoinType}</dd>
          </div>
          <div>
            <dt className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Type de lieu</dt>
            <dd>{brief.lieuType}</dd>
          </div>
          <div>
            <dt className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Pièce</dt>
            <dd>{brief.piece} · {brief.surface} m²</dd>
          </div>
          <div>
            <dt className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Localisation</dt>
            <dd>{brief.quartier}, {brief.ville}</dd>
          </div>
          <div>
            <dt className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Budget estimatif</dt>
            <dd className="font-numeric font-semibold text-[var(--amber)]">{brief.budget}</dd>
          </div>
          <div>
            <dt className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Échéance</dt>
            <dd>{brief.echeance}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Souhaits</dt>
            <dd className="p-3 bg-[var(--bg-warm)] rounded-md">{brief.souhaits}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Format souhaité pour le premier échange</dt>
            <dd>
              <span className="dedco-badge dedco-badge-amber">
                {brief.format === "distance" ? "À distance" : brief.format === "visite" ? "Visite sur site souhaitée" : "Recommandation designer"}
              </span>
            </dd>
          </div>
        </dl>
      </div>

      {/* Photos */}
      <div className="dedco-card p-5 mb-5">
        <h2 className="font-display font-bold mb-3">Fichiers envoyés</h2>
        <div className="grid grid-cols-2 gap-3">
          {brief.photos.map((p, i) => (
            <div key={i}>
              <img src={p} alt="" className="w-full aspect-video object-cover rounded-md" />
              <p className="text-xs text-[var(--text-3)] mt-1">Photo espace {i + 1}</p>
            </div>
          ))}
          {brief.inspirations.map((p, i) => (
            <div key={i}>
              <img src={p} alt="" className="w-full aspect-video object-cover rounded-md" />
              <p className="text-xs text-[var(--text-3)] mt-1">Inspiration {i + 1}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Messagerie encadrée */}
      <div className="dedco-card p-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-bold flex items-center gap-2">
            <MessageSquare size={16} /> Messagerie
          </h2>
          <span className="dedco-badge dedco-badge-gray">
            <Lock size={10} /> Encadrée
          </span>
        </div>
        <div className="bg-[var(--bg-warm)] rounded-md p-4 mb-3 min-h-[100px]">
          <p className="text-xs text-[var(--text-3)] text-center">
            Les clarifications sont possibles ici. L'échange de coordonnées est bloqué jusqu'au paiement du cadrage.
          </p>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Votre message..."
            className="flex-1 px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-white focus:outline-none focus:border-[var(--amber)]"
          />
          <button className="dedco-btn dedco-btn-primary dedco-btn-sm">
            <Send size={14} />
          </button>
        </div>
      </div>

      <p className="text-xs text-[var(--text-3)] text-center">
        <Clock size={11} className="inline" /> Délai de réponse annoncé : 24-48h
      </p>
    </div>
  );
}

// ============================================================
// PAGE: designer-brief-recu — Designer reçoit le brief
// ============================================================

export function DesignerBriefRecuPage({ briefId }: { briefId: string }) {
  const navigate = useDedcoStore((s) => s.navigate);
  const brief = MOCK_BRIEF;

  const actions = [
    { id: "cadrage", label: "Envoyer une proposition de cadrage", desc: "Proposer un format de premier échange (visite, à distance) avec un prix.", icon: <FileText size={18} />, primary: true },
    { id: "precision", label: "Demander une précision", desc: "Poser une question au client avant de proposer.", icon: <MessageSquare size={18} /> },
    { id: "decline", label: "Décliner le projet", desc: "Refuser poliment avec un motif.", icon: <X size={18} />, danger: true },
    { id: "archive", label: "Archiver", desc: "Classer sans refuser explicitement.", icon: <Briefcase size={18} /> },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <header className="mb-6">
        <h1 className="display-lg mb-1">Brief reçu</h1>
        <p className="text-sm text-[var(--text-2)] font-numeric">{brief.id} · Reçu {brief.sentAt}</p>
      </header>

      <div className="grid lg:grid-cols-[2fr_1fr] gap-5">
        {/* Brief content */}
        <div className="space-y-4">
          {/* Client info */}
          <div className="dedco-card p-4 flex items-center gap-3">
            <img src={brief.clientAvatar} alt={brief.clientName} className="w-12 h-12 rounded-full object-cover" />
            <div>
              <p className="font-display font-semibold">{brief.clientName}</p>
              <p className="text-xs text-[var(--text-3)]">{brief.quartier}, {brief.ville}</p>
            </div>
          </div>

          <div className="dedco-card p-5">
            <h3 className="font-display font-bold mb-3">Besoin exprimé</h3>
            <div className="space-y-3 text-sm">
              <div className="flex gap-2"><span className="text-[var(--text-3)] w-32 flex-shrink-0">Type :</span> <span>{brief.besoinType} · {brief.lieuType}</span></div>
              <div className="flex gap-2"><span className="text-[var(--text-3)] w-32 flex-shrink-0">Pièce :</span> <span>{brief.piece} ({brief.surface} m²)</span></div>
              <div className="flex gap-2"><span className="text-[var(--text-3)] w-32 flex-shrink-0">Style :</span> <span>{brief.style}</span></div>
              <div className="flex gap-2"><span className="text-[var(--text-3)] w-32 flex-shrink-0">Budget :</span> <span className="font-numeric font-semibold text-[var(--amber)]">{brief.budget}</span></div>
              <div className="flex gap-2"><span className="text-[var(--text-3)] w-32 flex-shrink-0">Échéance :</span> <span>{brief.echeance}</span></div>
              <div className="flex gap-2"><span className="text-[var(--text-3)] w-32 flex-shrink-0">Format :</span> <span className="dedco-badge dedco-badge-amber">{brief.format === "distance" ? "À distance" : brief.format === "visite" ? "Visite sur site" : "Recommandation"}</span></div>
              <div className="pt-3 border-t border-[var(--border)]">
                <p className="text-xs text-[var(--text-3)] mb-1">Souhaits :</p>
                <p>{brief.souhaits}</p>
              </div>
              {brief.contraintes && (
                <div>
                  <p className="text-xs text-[var(--text-3)] mb-1">Contraintes :</p>
                  <p>{brief.contraintes}</p>
                </div>
              )}
            </div>
          </div>

          <div className="dedco-card p-5">
            <h3 className="font-display font-bold mb-3">Photos fournies</h3>
            <div className="grid grid-cols-2 gap-2">
              {brief.photos.map((p, i) => (
                <img key={i} src={p} alt="" className="w-full aspect-video object-cover rounded-md" />
              ))}
              {brief.inspirations.map((p, i) => (
                <img key={i} src={p} alt="" className="w-full aspect-video object-cover rounded-md" />
              ))}
            </div>
          </div>
        </div>

        {/* Actions sidebar */}
        <div className="dedco-card p-5 h-fit sticky top-4">
          <h3 className="font-display font-bold mb-4">Actions</h3>
          <div className="space-y-2">
            {actions.map((a) => (
              <button
                key={a.id}
                onClick={() => {
                  if (a.id === "cadrage") navigate({ page: "designer-cadrage-create", briefId: brief.id });
                }}
                className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                  a.primary ? "border-[var(--amber)] bg-[var(--amber-pale)]/30 hover:bg-[var(--amber-pale)]" :
                  a.danger ? "border-[var(--terracotta)]/30 hover:bg-[var(--terracotta-pale)]" :
                  "border-[var(--border)] hover:border-[var(--text-3)]"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span style={{ color: a.primary ? "var(--amber)" : a.danger ? "var(--terracotta)" : "var(--text-2)" }}>{a.icon}</span>
                  <p className="text-sm font-display font-semibold">{a.label}</p>
                </div>
                <p className="text-xs text-[var(--text-3)]">{a.desc}</p>
              </button>
            ))}
          </div>
          <div className="mt-4 p-3 bg-[var(--bg-warm)] rounded-md">
            <p className="text-xs text-[var(--text-3)] flex items-start gap-2">
              <AlertTriangle size={12} className="flex-shrink-0 mt-0.5" />
              Vous ne pouvez pas envoyer de proposition finale sans passer par le cadrage, sauf consultation simple explicite.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PAGE: designer-cadrage-create — Designer crée proposition de cadrage
// ============================================================

export function DesignerCadrageCreatePage({ briefId }: { briefId: string }) {
  const navigate = useDedcoStore((s) => s.navigate);
  const brief = MOCK_BRIEF;
  const [form, setForm] = useState({
    objet: "Diagnostic initial pour aménagement de salon",
    format: "visite" as "distance" | "visite",
    date: "Mardi 14h",
    duree: "1h30",
    inclus: "Visite, échange de cadrage, analyse des contraintes, prise de mesures si nécessaire",
    nonInclus: "Plans, moodboard, liste d'achats, suivi",
    prix: 40000,
    suite: "Proposition complète envoyée sous 72h après le rendez-vous",
    deduction: true,
  });

  const garantie = Math.round(form.prix * 0.015);
  const total = form.prix + garantie;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button onClick={() => navigate({ page: "designer-brief-recu", briefId })} className="text-sm text-[var(--text-3)] hover:text-[var(--amber)] mb-4 flex items-center gap-1">
        ← Retour au brief
      </button>

      <header className="mb-6">
        <h1 className="display-lg mb-1">Proposition de cadrage</h1>
        <p className="text-sm text-[var(--text-2)]">Définissez le premier échange avec {brief.clientName}</p>
      </header>

      <div className="dedco-card p-5 mb-4 bg-[var(--amber-pale)]/50">
        <p className="text-sm flex items-start gap-2">
          <Sparkles size={16} className="text-[var(--amber)] flex-shrink-0 mt-0.5" />
          Le cadrage est la première étape payante. Il permet de comprendre le besoin réel (visite ou consultation) avant tout engagement sur le projet complet.
        </p>
      </div>

      <div className="dedco-card p-5 space-y-4">
        <div>
          <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Objet du cadrage</label>
          <input
            value={form.objet}
            onChange={(e) => setForm({ ...form, objet: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-white focus:outline-none focus:border-[var(--amber)]"
          />
        </div>

        <div>
          <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Format</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "distance", label: "À distance", icon: <Video size={18} />, desc: "Visio ou appel" },
              { id: "visite", label: "Visite sur site", icon: <MapPin size={18} />, desc: "Déplacement client" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setForm({ ...form, format: f.id as "distance" | "visite" })}
                className={`p-3 rounded-lg border-2 text-left transition-all ${
                  form.format === f.id ? "border-[var(--amber)] bg-[var(--amber-pale)]/30" : "border-[var(--border)]"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {f.icon}
                  <span className="font-display font-semibold text-sm">{f.label}</span>
                </div>
                <p className="text-xs text-[var(--text-3)]">{f.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Date proposée</label>
            <input
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-white"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Durée estimée</label>
            <input
              value={form.duree}
              onChange={(e) => setForm({ ...form, duree: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-white"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Ce qui est inclus</label>
          <textarea
            value={form.inclus}
            onChange={(e) => setForm({ ...form, inclus: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-white resize-none"
          />
        </div>

        <div>
          <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Ce qui n'est PAS inclus</label>
          <textarea
            value={form.nonInclus}
            onChange={(e) => setForm({ ...form, nonInclus: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-white resize-none"
          />
        </div>

        <div>
          <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Prix du cadrage (FCFA)</label>
          <input
            type="number"
            value={form.prix}
            onChange={(e) => setForm({ ...form, prix: Number(e.target.value) || 0 })}
            className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-white font-numeric"
          />
        </div>

        <div>
          <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Suite après le rendez-vous</label>
          <input
            value={form.suite}
            onChange={(e) => setForm({ ...form, suite: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-white"
          />
        </div>

        <label className="flex items-start gap-2 cursor-pointer p-3 bg-[var(--bg-warm)] rounded-md">
          <input
            type="checkbox"
            checked={form.deduction}
            onChange={(e) => setForm({ ...form, deduction: e.target.checked })}
            className="w-4 h-4 mt-0.5"
            style={{ accentColor: "var(--amber)" }}
          />
          <span className="text-sm">Déductible des honoraires finaux si le projet est confirmé</span>
        </label>

        {/* Récap financier côté client */}
        <div className="p-4 bg-[var(--bg-warm)] rounded-md">
          <p className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-2">Ce que verra le client</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>{form.objet}</span>
              <span className="font-numeric font-semibold">{formatFCFA(form.prix)}</span>
            </div>
            <div className="flex justify-between text-[var(--text-2)]">
              <span>Frais de garantie Dedco (1,5%)</span>
              <span className="font-numeric">{formatFCFA(garantie)}</span>
            </div>
            <div className="flex justify-between font-display font-bold pt-1 border-t border-[var(--border)]">
              <span>Total</span>
              <span className="font-numeric">{formatFCFA(total)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={() => navigate({ page: "designer-brief-recu", briefId })} className="dedco-btn dedco-btn-ghost">
            Annuler
          </button>
          <button
            onClick={() => navigate({ page: "designer-dashboard" })}
            className="dedco-btn dedco-btn-primary flex-1"
          >
            <Send size={16} /> Envoyer la proposition
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PAGE: client-cadrage-recu — Client reçoit proposition de cadrage
// ============================================================

export function ClientCadrageRecuPage({ proposalId }: { proposalId: string }) {
  const navigate = useDedcoStore((s) => s.navigate);
  const proposal = {
    designerName: "Ndèye Sarr",
    designerAvatar: "https://images.unsplash.com/photo-1729355796906-10a9809e0864?auto=format&fit=crop&crop=faces&w=120&q=80",
    objet: "Diagnostic initial pour aménagement de salon",
    format: "Visite sur site",
    date: "Mardi 14h",
    duree: "1h30",
    inclus: "Visite, échange de cadrage, analyse des contraintes, prise de mesures si nécessaire",
    nonInclus: "Plans, moodboard, liste d'achats, suivi",
    prix: 40000,
    suite: "Proposition complète envoyée sous 72h après le rendez-vous",
    deduction: true,
  };
  const garantie = Math.round(proposal.prix * 0.015);
  const total = proposal.prix + garantie;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button onClick={() => navigate({ page: "client-projets" })} className="text-sm text-[var(--text-3)] hover:text-[var(--amber)] mb-4 flex items-center gap-1">
        ← Mes projets
      </button>

      <header className="mb-6">
        <span className="dedco-badge dedco-badge-amber mb-2">Proposition de cadrage</span>
        <h1 className="display-lg mb-2">{proposal.objet}</h1>
        <div className="flex items-center gap-3">
          <img src={proposal.designerAvatar} alt={proposal.designerName} className="w-10 h-10 rounded-full" />
          <p className="text-sm">par <strong>{proposal.designerName}</strong></p>
        </div>
      </header>

      <div className="dedco-card p-5 mb-4">
        <dl className="space-y-3 text-sm">
          <div className="flex gap-3">
            <dt className="text-[var(--text-3)] w-32 flex-shrink-0">Format</dt>
            <dd className="flex items-center gap-2">
              <MapPin size={14} className="text-[var(--amber)]" /> {proposal.format}
            </dd>
          </div>
          <div className="flex gap-3">
            <dt className="text-[var(--text-3)] w-32 flex-shrink-0">Date proposée</dt>
            <dd className="flex items-center gap-2">
              <Calendar size={14} className="text-[var(--amber)]" /> {proposal.date}
            </dd>
          </div>
          <div className="flex gap-3">
            <dt className="text-[var(--text-3)] w-32 flex-shrink-0">Durée estimée</dt>
            <dd className="flex items-center gap-2">
              <Clock size={14} className="text-[var(--amber)]" /> {proposal.duree}
            </dd>
          </div>
          <div className="pt-3 border-t border-[var(--border)]">
            <dt className="text-[var(--text-3)] mb-1 flex items-center gap-1"><Check size={12} className="text-[var(--forest)]" /> Inclus</dt>
            <dd className="p-2 bg-[var(--forest-pale)]/30 rounded text-[var(--text-1)]">{proposal.inclus}</dd>
          </div>
          <div>
            <dt className="text-[var(--text-3)] mb-1 flex items-center gap-1"><X size={12} className="text-[var(--terracotta)]" /> Non inclus</dt>
            <dd className="p-2 bg-[var(--terracotta-pale)]/30 rounded text-[var(--text-1)]">{proposal.nonInclus}</dd>
          </div>
          <div>
            <dt className="text-[var(--text-3)] mb-1">Suite après le rendez-vous</dt>
            <dd>{proposal.suite}</dd>
          </div>
          {proposal.deduction && (
            <div className="p-2 bg-[var(--amber-pale)]/30 rounded text-xs text-[var(--amber-dark)] flex items-center gap-2">
              <Sparkles size={12} /> Déductible des honoraires finaux si le projet est confirmé.
            </div>
          )}
        </dl>
      </div>

      {/* Tarification */}
      <div className="dedco-card p-5 mb-4">
        <h3 className="font-display font-bold mb-3">Tarification</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>{proposal.objet}</span>
            <span className="font-numeric font-semibold">{formatFCFA(proposal.prix)}</span>
          </div>
          <div className="flex justify-between text-[var(--text-2)]">
            <span className="flex items-center gap-1">Frais de garantie Dedco (1,5%)
              <ShieldCheck size={12} className="text-[var(--forest)]" />
            </span>
            <span className="font-numeric">{formatFCFA(garantie)}</span>
          </div>
          <div className="flex justify-between font-display font-bold pt-2 border-t border-[var(--border)]">
            <span>Total</span>
            <span className="font-numeric text-[var(--amber)]">{formatFCFA(total)}</span>
          </div>
        </div>
        <p className="text-xs text-[var(--text-3)] mt-3 p-2 bg-[var(--forest-pale)]/30 rounded flex items-start gap-2">
          <ShieldCheck size={12} className="text-[var(--forest)] flex-shrink-0 mt-0.5" />
          <span><strong>Protection Dedco :</strong> paiement sécurisé, médiation et protection en cas de prestation non réalisée.</span>
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button className="dedco-btn dedco-btn-ghost">Demander une modification</button>
        <button className="dedco-btn dedco-btn-ghost text-[var(--terracotta)]">Refuser</button>
        <button
          onClick={() => navigate({ page: "cadrage-paiement", proposalId })}
          className="dedco-btn dedco-btn-primary flex-1"
        >
          Accepter et payer <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ============================================================
// PAGE: cadrage-paiement — Paiement du cadrage
// ============================================================

export function CadragePaiementPage({ proposalId }: { proposalId: string }) {
  const navigate = useDedcoStore((s) => s.navigate);
  const [operator, setOperator] = useState<"mtn" | "moov">("mtn");
  const [step, setStep] = useState<"form" | "processing" | "done">("form");

  const proposal = { prix: 40000, objet: "Diagnostic initial pour aménagement de salon" };
  const garantie = Math.round(proposal.prix * 0.015);
  const total = proposal.prix + garantie;

  if (step === "done") {
    return (
      <div className="p-8 max-w-xl mx-auto text-center">
        <div className="w-20 h-20 rounded-full bg-[var(--forest-pale)] mx-auto flex items-center justify-center mb-5">
          <CheckCircle2 size={40} className="text-[var(--forest)]" />
        </div>
        <h1 className="display-xl mb-3">Cadrage confirmé !</h1>
        <p className="text-sm text-[var(--text-2)] mb-6">
          Votre rendez-vous est confirmé. L'adresse exacte est maintenant révélée. Le paiement est conservé par Dedco jusqu'à confirmation de réalisation.
        </p>
        <button onClick={() => navigate({ page: "cadrage-rendez-vous", cadrageId: proposalId })} className="dedco-btn dedco-btn-primary">
          Voir le rendez-vous <ChevronRight size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <button onClick={() => navigate({ page: "client-cadrage-recu", proposalId })} className="text-sm text-[var(--text-3)] hover:text-[var(--amber)] mb-4 flex items-center gap-1">
        ← Retour à la proposition
      </button>

      <header className="mb-6">
        <h1 className="display-lg mb-1">Paiement du cadrage</h1>
        <p className="text-sm text-[var(--text-2)]">{proposal.objet}</p>
      </header>

      <div className="dedco-card p-5 mb-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Diagnostic initial</span>
            <span className="font-numeric font-semibold">{formatFCFA(proposal.prix)}</span>
          </div>
          <div className="flex justify-between text-[var(--text-2)]">
            <span className="flex items-center gap-1">Frais de garantie Dedco (1,5%)
              <ShieldCheck size={12} className="text-[var(--forest)]" />
            </span>
            <span className="font-numeric">{formatFCFA(garantie)}</span>
          </div>
          <div className="flex justify-between font-display font-bold pt-2 border-t border-[var(--border)]">
            <span>Total</span>
            <span className="font-numeric text-[var(--amber)] text-lg">{formatFCFA(total)}</span>
          </div>
        </div>
      </div>

      <div className="dedco-card p-5 mb-4">
        <h3 className="font-display font-bold mb-3">Moyen de paiement</h3>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { id: "mtn", label: "MTN MoMo", color: "#FFCC00", text: "#000" },
            { id: "moov", label: "Moov Money", color: "#009BDB", text: "#fff" },
          ].map((op) => (
            <button
              key={op.id}
              onClick={() => setOperator(op.id as "mtn" | "moov")}
              className={`px-3 py-3 rounded-md text-sm font-semibold border-2 transition-all ${
                operator === op.id ? "border-[var(--ink)]" : "border-[var(--border)]"
              }`}
              style={{ backgroundColor: op.color, color: op.text }}
            >
              {op.label}
            </button>
          ))}
        </div>
        <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Numéro de téléphone</label>
        <input
          defaultValue="+229 01 97 45 23 10"
          className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-white font-numeric"
        />
      </div>

      <div className="p-3 bg-[var(--forest-pale)]/30 rounded-md mb-4 flex items-start gap-2">
        <Lock size={14} className="text-[var(--forest)] flex-shrink-0 mt-0.5" />
        <p className="text-xs text-[var(--text-2)]">
          Paiement sécurisé via Fedapay. Le montant est conservé par Dedco jusqu'à confirmation de la prestation.
        </p>
      </div>

      <button
        onClick={() => {
          setStep("processing");
          setTimeout(() => setStep("done"), 1500);
        }}
        className="dedco-btn dedco-btn-primary w-full dedco-btn-lg"
      >
        {step === "processing" ? "Traitement..." : `Payer ${formatFCFA(total)}`}
      </button>
    </div>
  );
}

// ============================================================
// PAGE: cadrage-rendez-vous — Consultation à distance OU visite
// ============================================================

export function CadrageRendezVousPage({ cadrageId }: { cadrageId: string }) {
  const navigate = useDedcoStore((s) => s.navigate);
  const isVisite = true; // mock
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button onClick={() => navigate({ page: "client-projets" })} className="text-sm text-[var(--text-3)] hover:text-[var(--amber)] mb-4 flex items-center gap-1">
        ← Mes projets
      </button>

      <header className="mb-6">
        <span className="dedco-badge dedco-badge-forest mb-2">
          <CheckCircle2 size={11} /> Cadrage confirmé
        </span>
        <h1 className="display-lg mb-1">
          {isVisite ? "Visite sur site" : "Consultation à distance"}
        </h1>
        <p className="text-sm text-[var(--text-2)]">Mardi à 14h · Durée estimée 1h30</p>
      </header>

      <div className="grid md:grid-cols-2 gap-4 mb-5">
        <div className="dedco-card p-5">
          <h3 className="font-display font-bold mb-3 flex items-center gap-2">
            <Calendar size={16} className="text-[var(--amber)]" /> Rendez-vous
          </h3>
          <dl className="space-y-2 text-sm">
            <div><dt className="text-xs text-[var(--text-3)]">Date</dt><dd>Mardi 14h</dd></div>
            <div><dt className="text-xs text-[var(--text-3)]">Durée</dt><dd>1h30</dd></div>
            {isVisite && (
              <div>
                <dt className="text-xs text-[var(--text-3)]">Adresse</dt>
                <dd className="flex items-start gap-1">
                  <MapPin size={14} className="text-[var(--amber)] mt-0.5" />
                  <span>12 rue des Lagunes, Akpakpa, Cotonou</span>
                </dd>
              </div>
            )}
            {!isVisite && (
              <div>
                <dt className="text-xs text-[var(--text-3)]">Lien visio</dt>
                <dd className="flex items-center gap-1">
                  <Video size={14} className="text-[var(--amber)]" />
                  <a href="#" className="text-[var(--amber)] underline">Rejoindre la visio</a>
                </dd>
              </div>
            )}
            <div><dt className="text-xs text-[var(--text-3)]">Contact designer</dt><dd>+229 01 97 ... (révélé)</dd></div>
          </dl>
        </div>

        <div className="dedco-card p-5">
          <h3 className="font-display font-bold mb-3 flex items-center gap-2">
            <FileText size={16} className="text-[var(--amber)]" /> Brief
          </h3>
          <p className="text-sm text-[var(--text-2)] mb-3">Aménagement d'un salon de 25m², style Afro-contemporain, budget 250-750k FCFA.</p>
          <p className="text-xs text-[var(--text-3)] mb-2">Pièces jointes :</p>
          <div className="flex gap-2">
            <img src="https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=200&q=80" alt="" className="w-16 h-16 rounded object-cover" />
            <img src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=200&q=80" alt="" className="w-16 h-16 rounded object-cover" />
          </div>
          {isVisite && (
            <p className="text-xs text-[var(--text-3)] mt-3">Consignes d'accès : Sonner à l'interphone "Kossou", 2e étage gauche.</p>
          )}
        </div>
      </div>

      <div className="dedco-card p-5">
        <h3 className="font-display font-bold mb-3">Confirmation</h3>
        <p className="text-sm text-[var(--text-2)] mb-4">
          Le designer et le client doivent tous deux confirmer. En l'absence de contestation, le paiement de cadrage est débloqué automatiquement après un délai de 48h.
        </p>
        <div className="flex gap-2">
          <button className="dedco-btn dedco-btn-ghost text-[var(--terracotta)]">
            <AlertTriangle size={14} /> Signaler un problème
          </button>
          <button
            onClick={() => { setConfirmed(true); setTimeout(() => navigate({ page: "cadrage-compte-rendu", cadrageId }), 1500); }}
            disabled={confirmed}
            className="dedco-btn dedco-btn-primary flex-1"
          >
            {confirmed ? <><Check size={16} /> Confirmé !</> : isVisite ? "Confirmer la visite" : "Confirmer que l'échange a eu lieu"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PAGE: cadrage-compte-rendu — Après le rendez-vous
// ============================================================

export function CadrageCompteRenduPage({ cadrageId }: { cadrageId: string }) {
  const navigate = useDedcoStore((s) => s.navigate);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <header className="mb-6">
        <span className="dedco-badge dedco-badge-forest mb-2">
          <CheckCircle2 size={11} /> Cadrage terminé
        </span>
        <h1 className="display-lg mb-1">Votre cadrage est terminé</h1>
        <p className="text-sm text-[var(--text-2)]">Le designer a rédigé un compte rendu de la consultation.</p>
      </header>

      <div className="dedco-card p-5 mb-4">
        <h3 className="font-display font-bold mb-3">Compte rendu de cadrage</h3>
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Besoin retenu</p>
            <p>Rénovation légère du salon avec mobilier sur mesure en bois local et textiles wax. Conserver la structure existante, moderniser l'ambiance.</p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Contraintes identifiées</p>
            <p>Petite surface (25m²), besoin de rangement intégré, lumière naturelle limitée côté ouest, budget à optimiser.</p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Orientation proposée</p>
            <p>Mobilier multifonction (banquette avec rangement), éclairage indirect, palette terracotta + cream + accents wax bleu.</p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Prochaine étape recommandée</p>
            <p>Proposition finale de mission : moodboard + plan d'implantation + sélection mobilier Dedco + 2 ajustements + 1 visite de suivi.</p>
          </div>
        </div>
        <button className="dedco-btn dedco-btn-ghost dedco-btn-sm mt-4">
          <Download size={14} /> Télécharger le compte rendu (PDF)
        </button>
      </div>

      <div className="dedco-card p-4 mb-4 bg-[var(--amber-pale)]/30">
        <p className="text-sm flex items-center gap-2">
          <Wallet size={14} className="text-[var(--amber)]" />
          Paiement de cadrage (40 600 FCFA) débloqué au designer.
        </p>
      </div>

      <button
        onClick={() => navigate({ page: "designer-proposition-finale", cadrageId })}
        className="dedco-btn dedco-btn-primary w-full"
      >
        Voir la proposition finale de mission <ChevronRight size={16} />
      </button>
    </div>
  );
}

// ============================================================
// PAGE: designer-proposition-finale — Designer crée proposition finale
// ============================================================

export function DesignerPropositionFinalePage({ cadrageId }: { cadrageId: string }) {
  const navigate = useDedcoStore((s) => s.navigate);
  const [form, setForm] = useState({
    titre: "Aménagement complet du salon",
    objectif: "Transformer le salon en espace convivial, moderne et ancré dans l'identité africaine contemporaine.",
    livrables: "Moodboard, plan d'implantation, sélection de mobilier et décoration, liste d'achats Dedco",
    etapes: "1. Moodboard (3j) 2. Plan d'implantation (5j) 3. Sélection produits (3j) 4. Ajustements (3j) 5. Visite de suivi",
    delai: "21 jours",
    revisions: 2,
    presence: true,
    visitesIncluses: 1,
    honoraires: 300000,
    depensesExclues: "Achats produits, travaux, livraison, prestations artisans",
    paiement: "50% à la commande, 50% à la livraison",
    annulation: "Annulation gratuite jusqu'à 48h après paiement. Au-delà : 30% retenus.",
    validite: "30 jours",
  });

  const garantie = Math.round(form.honoraires * 0.015);
  const totalClient = form.honoraires + garantie;
  const commission = Math.round(form.honoraires * 0.10);
  const netDesigner = form.honoraires - commission;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button onClick={() => navigate({ page: "cadrage-compte-rendu", cadrageId })} className="text-sm text-[var(--text-3)] hover:text-[var(--amber)] mb-4 flex items-center gap-1">
        ← Retour au compte rendu
      </button>

      <header className="mb-6">
        <h1 className="display-lg mb-1">Proposition finale de mission</h1>
        <p className="text-sm text-[var(--text-2)]">Après le cadrage, proposez la mission complète</p>
      </header>

      <div className="dedco-card p-5 space-y-4">
        <div>
          <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Titre de mission</label>
          <input value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })} className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-white" />
        </div>
        <div>
          <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Objectif</label>
          <textarea value={form.objectif} onChange={(e) => setForm({ ...form, objectif: e.target.value })} rows={2} className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-white resize-none" />
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Livrables</label>
            <textarea value={form.livrables} onChange={(e) => setForm({ ...form, livrables: e.target.value })} rows={3} className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-white resize-none" />
          </div>
          <div>
            <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Étapes</label>
            <textarea value={form.etapes} onChange={(e) => setForm({ ...form, etapes: e.target.value })} rows={3} className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-white resize-none" />
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Délai</label>
            <input value={form.delai} onChange={(e) => setForm({ ...form, delai: e.target.value })} className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-white" />
          </div>
          <div>
            <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Révisions</label>
            <input type="number" value={form.revisions} onChange={(e) => setForm({ ...form, revisions: Number(e.target.value) })} className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-white font-numeric" />
          </div>
          <div>
            <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Visites incluses</label>
            <input type="number" value={form.visitesIncluses} onChange={(e) => setForm({ ...form, visitesIncluses: Number(e.target.value) })} className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-white font-numeric" />
          </div>
        </div>
        <div>
          <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Honoraires (FCFA)</label>
          <input type="number" value={form.honoraires} onChange={(e) => setForm({ ...form, honoraires: Number(e.target.value) })} className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-white font-numeric" />
        </div>
        <div>
          <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Dépenses exclues</label>
          <input value={form.depensesExclues} onChange={(e) => setForm({ ...form, depensesExclues: e.target.value })} className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-white" />
        </div>
        <div>
          <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Conditions de paiement</label>
          <input value={form.paiement} onChange={(e) => setForm({ ...form, paiement: e.target.value })} className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-white" />
        </div>
        <div>
          <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Conditions d'annulation</label>
          <input value={form.annulation} onChange={(e) => setForm({ ...form, annulation: e.target.value })} className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-white" />
        </div>
        <div>
          <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Validité de l'offre</label>
          <input value={form.validite} onChange={(e) => setForm({ ...form, validite: e.target.value })} className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-white" />
        </div>

        {/* Transparence financière */}
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="p-3 bg-[var(--amber-pale)]/30 rounded-md">
            <p className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-2">Côté client</p>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between"><span>Honoraires</span><span className="font-numeric">{formatFCFA(form.honoraires)}</span></div>
              <div className="flex justify-between text-[var(--text-2)]"><span>Garantie 1,5%</span><span className="font-numeric">{formatFCFA(garantie)}</span></div>
              <div className="flex justify-between font-bold pt-1 border-t border-[var(--border)]"><span>Total client</span><span className="font-numeric text-[var(--amber)]">{formatFCFA(totalClient)}</span></div>
            </div>
          </div>
          <div className="p-3 bg-[var(--bg-warm)] rounded-md">
            <p className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-2">Côté designer (vous)</p>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between"><span>Montant mission</span><span className="font-numeric">{formatFCFA(form.honoraires)}</span></div>
              <div className="flex justify-between text-[var(--terracotta)]"><span>Commission 10%</span><span className="font-numeric">-{formatFCFA(commission)}</span></div>
              <div className="flex justify-between font-bold pt-1 border-t border-[var(--border)]"><span>Net reçu</span><span className="font-numeric text-[var(--forest)]">{formatFCFA(netDesigner)}</span></div>
            </div>
          </div>
        </div>

        <button onClick={() => navigate({ page: "designer-dashboard" })} className="dedco-btn dedco-btn-primary w-full">
          <Send size={16} /> Envoyer la proposition finale
        </button>
      </div>
    </div>
  );
}

// ============================================================
// PAGE: client-proposition-finale — Client voit la proposition finale
// ============================================================

export function ClientPropositionFinalePage({ proposalId }: { proposalId: string }) {
  const navigate = useDedcoStore((s) => s.navigate);
  const proposal = {
    titre: "Aménagement complet du salon",
    objectif: "Transformer le salon en espace convivial, moderne et ancré dans l'identité africaine contemporaine.",
    livrables: ["Moodboard", "Plan d'implantation", "Sélection de mobilier et décoration", "Liste d'achats Dedco"],
    exclus: ["Achat des produits", "Travaux", "Livraison", "Prestations d'artisans"],
    delai: "21 jours",
    revisions: 2,
    visites: 1,
    honoraires: 300000,
    paiement: "50% à la commande, 50% à la livraison",
    validite: "30 jours",
  };
  const garantie = Math.round(proposal.honoraires * 0.015);
  const total = proposal.honoraires + garantie;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button onClick={() => navigate({ page: "client-projets" })} className="text-sm text-[var(--text-3)] hover:text-[var(--amber)] mb-4 flex items-center gap-1">
        ← Mes projets
      </button>

      <header className="mb-6">
        <span className="dedco-badge dedco-badge-amber mb-2">Proposition finale de mission</span>
        <h1 className="display-lg mb-2">{proposal.titre}</h1>
        <p className="text-sm text-[var(--text-2)]">{proposal.objectif}</p>
      </header>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="dedco-card p-5">
          <h3 className="font-display font-bold mb-3 flex items-center gap-2 text-[var(--forest)]"><Check size={16} /> Inclus</h3>
          <ul className="space-y-2 text-sm">
            {proposal.livrables.map((l) => (
              <li key={l} className="flex items-start gap-2"><Check size={14} className="text-[var(--forest)] mt-0.5" /> {l}</li>
            ))}
            <li className="flex items-start gap-2"><Check size={14} className="text-[var(--forest)] mt-0.5" /> {proposal.revisions} ajustements</li>
            <li className="flex items-start gap-2"><Check size={14} className="text-[var(--forest)] mt-0.5" /> {proposal.visites} visite de suivi</li>
          </ul>
        </div>
        <div className="dedco-card p-5">
          <h3 className="font-display font-bold mb-3 flex items-center gap-2 text-[var(--terracotta)]"><X size={16} /> Non inclus</h3>
          <ul className="space-y-2 text-sm">
            {proposal.exclus.map((l) => (
              <li key={l} className="flex items-start gap-2"><X size={14} className="text-[var(--terracotta)] mt-0.5" /> {l}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="dedco-card p-5 mb-4">
        <dl className="grid sm:grid-cols-3 gap-3 text-sm">
          <div><dt className="text-xs text-[var(--text-3)] uppercase">Délai</dt><dd className="font-numeric font-semibold">{proposal.delai}</dd></div>
          <div><dt className="text-xs text-[var(--text-3)] uppercase">Révisions</dt><dd className="font-numeric font-semibold">{proposal.revisions}</dd></div>
          <div><dt className="text-xs text-[var(--text-3)] uppercase">Validité offre</dt><dd className="font-numeric font-semibold">{proposal.validite}</dd></div>
          <div className="sm:col-span-3"><dt className="text-xs text-[var(--text-3)] uppercase">Paiement</dt><dd>{proposal.paiement}</dd></div>
        </dl>
      </div>

      <div className="dedco-card p-5 mb-4">
        <h3 className="font-display font-bold mb-3">Tarification</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span>Honoraires designer</span><span className="font-numeric font-semibold">{formatFCFA(proposal.honoraires)}</span></div>
          <div className="flex justify-between text-[var(--text-2)]"><span className="flex items-center gap-1">Frais de garantie Dedco (1,5%)<ShieldCheck size={12} className="text-[var(--forest)]" /></span><span className="font-numeric">{formatFCFA(garantie)}</span></div>
          <div className="flex justify-between font-display font-bold pt-2 border-t border-[var(--border)]"><span>Total</span><span className="font-numeric text-[var(--amber)] text-lg">{formatFCFA(total)}</span></div>
        </div>
      </div>

      <div className="flex gap-2">
        <button className="dedco-btn dedco-btn-ghost">Demander une modification</button>
        <button className="dedco-btn dedco-btn-ghost text-[var(--terracotta)]">Refuser</button>
        <button onClick={() => navigate({ page: "projet-paiement", proposalId })} className="dedco-btn dedco-btn-primary flex-1">
          Accepter et payer <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ============================================================
// PAGE: projet-paiement — Paiement du projet complet
// ============================================================

export function ProjetPaiementPage({ proposalId }: { proposalId: string }) {
  const navigate = useDedcoStore((s) => s.navigate);
  const [operator, setOperator] = useState<"mtn" | "moov">("mtn");
  const [step, setStep] = useState<"form" | "done">("form");
  const honoraires = 300000;
  const garantie = Math.round(honoraires * 0.015);
  const total = honoraires + garantie;

  if (step === "done") {
    return (
      <div className="p-8 max-w-xl mx-auto text-center">
        <div className="w-20 h-20 rounded-full bg-[var(--forest-pale)] mx-auto flex items-center justify-center mb-5">
          <CheckCircle2 size={40} className="text-[var(--forest)]" />
        </div>
        <h1 className="display-xl mb-3">Projet confirmé !</h1>
        <p className="text-sm text-[var(--text-2)] mb-6">Le designer a été notifié. Le projet démarre maintenant. Premier paiement (50%) sous séquestre.</p>
        <button onClick={() => navigate({ page: "projet-detail", projectId: proposalId })} className="dedco-btn dedco-btn-primary">
          Suivre le projet <ChevronRight size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <header className="mb-6">
        <h1 className="display-lg mb-1">Paiement du projet</h1>
        <p className="text-sm text-[var(--text-2)]">Aménagement complet du salon</p>
      </header>

      <div className="dedco-card p-5 mb-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span>Honoraires designer</span><span className="font-numeric font-semibold">{formatFCFA(honoraires)}</span></div>
          <div className="flex justify-between text-[var(--text-2)]"><span className="flex items-center gap-1">Frais de garantie Dedco (1,5%)<ShieldCheck size={12} className="text-[var(--forest)]" /></span><span className="font-numeric">{formatFCFA(garantie)}</span></div>
          <div className="flex justify-between font-display font-bold pt-2 border-t border-[var(--border)]"><span>Total</span><span className="font-numeric text-[var(--amber)] text-lg">{formatFCFA(total)}</span></div>
        </div>
        <p className="text-xs text-[var(--text-3)] mt-3">Conditions : 50% à la commande ({formatFCFA(total / 2)}), 50% à la livraison.</p>
      </div>

      <div className="dedco-card p-5 mb-4">
        <h3 className="font-display font-bold mb-3">Moyen de paiement</h3>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { id: "mtn", label: "MTN MoMo", color: "#FFCC00", text: "#000" },
            { id: "moov", label: "Moov Money", color: "#009BDB", text: "#fff" },
          ].map((op) => (
            <button key={op.id} onClick={() => setOperator(op.id as "mtn" | "moov")} className={`px-3 py-3 rounded-md text-sm font-semibold border-2 ${operator === op.id ? "border-[var(--ink)]" : "border-[var(--border)]"}`} style={{ backgroundColor: op.color, color: op.text }}>
              {op.label}
            </button>
          ))}
        </div>
        <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Numéro de téléphone</label>
        <input defaultValue="+229 01 97 45 23 10" className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-white font-numeric" />
      </div>

      <button onClick={() => { setStep("done"); }} className="dedco-btn dedco-btn-primary w-full dedco-btn-lg">
        Payer {formatFCFA(total / 2)} (acompte 50%)
      </button>
    </div>
  );
}

// ============================================================
// PAGE: projet-detail — Dashboard projet multi-stage
// ============================================================

export function ProjetDetailPage({ projectId }: { projectId: string }) {
  const navigate = useDedcoStore((s) => s.navigate);
  const [activeTab, setActiveTab] = useState<"calendrier" | "fichiers" | "messages" | "achats">("calendrier");

  const stages = [
    { label: "Projet confirmé", done: true, date: "22 juin" },
    { label: "Moodboard en préparation", done: false, current: true, date: "À venir" },
    { label: "Plan d'implantation", done: false, date: "À venir" },
    { label: "Sélection produits", done: false, date: "À venir" },
    { label: "Ajustements", done: false, date: "À venir" },
    { label: "Visite de suivi", done: false, date: "À venir" },
    { label: "Livraison finale", done: false, date: "À venir" },
  ];

  const recommendedProducts = PRODUCTS.slice(0, 4);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <header className="mb-6">
        <button onClick={() => navigate({ page: "client-projets" })} className="text-sm text-[var(--text-3)] hover:text-[var(--amber)] mb-2 flex items-center gap-1">
          ← Mes projets
        </button>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <span className="dedco-badge dedco-badge-amber mb-1">En cours</span>
            <h1 className="display-lg">Aménagement complet du salon</h1>
            <p className="text-sm text-[var(--text-2)] font-numeric">PROJ-2026-001 · Démarré le 22 juin · 21 jours restants</p>
          </div>
          <button onClick={() => navigate({ page: "projet-livraison", projectId })} className="dedco-btn dedco-btn-ghost dedco-btn-sm">
            <ShoppingBag size={14} /> Voir la livraison
          </button>
        </div>
      </header>

      {/* Progress pipeline */}
      <div className="dedco-card p-5 mb-5">
        <h3 className="font-display font-bold mb-4">Progression</h3>
        <div className="space-y-3">
          {stages.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                s.done ? "bg-[var(--forest)] text-white" : s.current ? "bg-[var(--amber)] text-white" : "bg-[var(--bg-warm)] text-[var(--text-3)]"
              }`}>
                {s.done ? <Check size={14} /> : <span className="font-numeric text-xs">{i + 1}</span>}
              </div>
              <div className="flex-1 flex items-center justify-between">
                <span className={`text-sm ${s.done ? "text-[var(--text-2)]" : s.current ? "font-semibold" : "text-[var(--text-3)]"}`}>{s.label}</span>
                <span className="text-xs text-[var(--text-3)] font-numeric">{s.date}</span>
              </div>
              {s.current && <span className="dedco-badge dedco-badge-amber">En cours</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {[
          { id: "calendrier", label: "Calendrier" },
          { id: "fichiers", label: "Fichiers" },
          { id: "messages", label: "Messagerie" },
          { id: "achats", label: "Achats recommandés" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as typeof activeTab)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === t.id ? "bg-[var(--ink)] text-white" : "bg-white border border-[var(--border)] text-[var(--text-2)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "calendrier" && (
        <div className="dedco-card p-5">
          <h3 className="font-display font-bold mb-3">Jalons</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between p-3 bg-[var(--forest-pale)]/30 rounded-md">
              <span>Acompte 50% reçu</span>
              <span className="font-numeric text-[var(--forest)] font-semibold">22 juin</span>
            </div>
            <div className="flex justify-between p-3 bg-[var(--bg-warm)] rounded-md">
              <span>Moodboard attendu</span>
              <span className="font-numeric text-[var(--amber)]">25 juin</span>
            </div>
            <div className="flex justify-between p-3 bg-[var(--bg-warm)] rounded-md">
              <span>Plan d'implantation attendu</span>
              <span className="font-numeric text-[var(--text-3)]">30 juin</span>
            </div>
            <div className="flex justify-between p-3 bg-[var(--bg-warm)] rounded-md">
              <span>Sélection produits</span>
              <span className="font-numeric text-[var(--text-3)]">3 juillet</span>
            </div>
            <div className="flex justify-between p-3 bg-[var(--bg-warm)] rounded-md">
              <span>Visite de suivi</span>
              <span className="font-numeric text-[var(--text-3)]">10 juillet</span>
            </div>
            <div className="flex justify-between p-3 bg-[var(--bg-warm)] rounded-md">
              <span>Livraison finale + paiement 50%</span>
              <span className="font-numeric text-[var(--text-3)]">13 juillet</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === "fichiers" && (
        <div className="dedco-card p-5">
          <h3 className="font-display font-bold mb-3">Fichiers du projet</h3>
          <p className="text-sm text-[var(--text-3)] mb-3">Aucun livrable pour l'instant. Le designer déposera le moodboard le 25 juin.</p>
          <button className="dedco-btn dedco-btn-ghost dedco-btn-sm">
            <Upload size={14} /> Ajouter un fichier (client)
          </button>
        </div>
      )}

      {activeTab === "messages" && (
        <div className="dedco-card p-5">
          <h3 className="font-display font-bold mb-3 flex items-center gap-2">
            <MessageSquare size={16} /> Messagerie projet
          </h3>
          <div className="space-y-3 mb-4 min-h-[200px]">
            <div className="flex gap-2">
              <img src="https://images.unsplash.com/photo-1729355796906-10a9809e0864?auto=format&fit=crop&crop=faces&w=80&q=80" alt="" className="w-8 h-8 rounded-full" />
              <div className="flex-1 p-3 bg-[var(--bg-warm)] rounded-md">
                <p className="text-xs text-[var(--text-3)] mb-1">Ndèye (designer) · il y a 2h</p>
                <p className="text-sm">Bonjour Sophie ! Je démarre le moodboard. Pour confirmer : palette terracotta + cream + accents wax bleu ?</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <input placeholder="Votre message..." className="flex-1 px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-white" />
            <button className="dedco-btn dedco-btn-primary dedco-btn-sm"><Send size={14} /></button>
          </div>
        </div>
      )}

      {activeTab === "achats" && (
        <div>
          <div className="dedco-card p-4 mb-3 bg-[var(--amber-pale)]/30">
            <p className="text-sm flex items-start gap-2">
              <Sparkles size={14} className="text-[var(--amber)] flex-shrink-0 mt-0.5" />
              <span><strong>Sélection recommandée pour votre projet.</strong> Le designer a sélectionné ces produits. Vous restez libre d'acheter tout, une partie ou aucun.</span>
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {recommendedProducts.map((p) => (
              <button
                key={p.id}
                onClick={() => navigate({ page: "product", id: p.id })}
                className="dedco-card overflow-hidden text-left"
              >
                <img src={p.images[0]} alt={p.name} className="w-full aspect-square object-cover" />
                <div className="p-3">
                  <p className="text-xs font-medium line-clamp-1">{p.name}</p>
                  <p className="font-numeric font-bold text-sm text-[var(--amber)] mt-1">{formatFCFA(p.price)}</p>
                  <button className="dedco-btn dedco-btn-primary dedco-btn-sm w-full mt-2">
                    <Plus size={12} /> Ajouter
                  </button>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5 flex gap-2">
        <button className="dedco-btn dedco-btn-ghost text-[var(--terracotta)]">
          <AlertTriangle size={14} /> Ouvrir un litige
        </button>
      </div>
    </div>
  );
}

// ============================================================
// PAGE: projet-livraison — Livraison + validation
// ============================================================

export function ProjetLivraisonPage({ projectId }: { projectId: string }) {
  const navigate = useDedcoStore((s) => s.navigate);
  const [validated, setValidated] = useState(false);

  const livrables = [
    { id: 1, name: "Moodboard final.pdf", size: "2.4 MB", date: "25 juin" },
    { id: 2, name: "Plan d'implantation.pdf", size: "1.8 MB", date: "30 juin" },
    { id: 3, name: "Sélection mobilier Dedco.pdf", size: "3.1 MB", date: "3 juillet" },
    { id: 4, name: "Rendu 3D salon.png", size: "5.2 MB", date: "8 juillet" },
    { id: 5, name: "Liste d'achats.pdf", size: "800 KB", date: "10 juillet" },
  ];

  if (validated) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center">
        <div className="w-20 h-20 rounded-full bg-[var(--forest-pale)] mx-auto flex items-center justify-center mb-5">
          <CheckCircle2 size={40} className="text-[var(--forest)]" />
        </div>
        <h1 className="display-xl mb-3">Livraison validée !</h1>
        <p className="text-sm text-[var(--text-2)] mb-6">
          Paiement libéré au designer. Commission Dedco prélevée. Fonds de garantie conservé selon les règles. Vous pouvez continuer vos achats sur Dedco.
        </p>
        <div className="flex gap-2 justify-center">
          <button onClick={() => navigate({ page: "client-projets" })} className="dedco-btn dedco-btn-primary">Mes projets</button>
          <button onClick={() => navigate({ page: "marketplace" })} className="dedco-btn dedco-btn-ghost">Marketplace</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button onClick={() => navigate({ page: "projet-detail", projectId })} className="text-sm text-[var(--text-3)] hover:text-[var(--amber)] mb-4 flex items-center gap-1">
        ← Retour au projet
      </button>

      <header className="mb-6">
        <span className="dedco-badge dedco-badge-amber mb-2">Livrables à valider</span>
        <h1 className="display-lg mb-1">Livraison du projet</h1>
        <p className="text-sm text-[var(--text-2)]">Le designer a déposé tous les livrables prévus.</p>
      </header>

      <div className="dedco-card p-5 mb-4">
        <h3 className="font-display font-bold mb-3">Livrables ({livrables.length})</h3>
        <ul className="space-y-2">
          {livrables.map((l) => (
            <li key={l.id} className="flex items-center gap-3 p-3 bg-[var(--bg-warm)] rounded-md">
              <div className="w-10 h-10 rounded-md bg-white flex items-center justify-center text-[var(--amber)]">
                <FileText size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{l.name}</p>
                <p className="text-xs text-[var(--text-3)] font-numeric">{l.size} · {l.date}</p>
              </div>
              <button className="dedco-btn dedco-btn-ghost dedco-btn-sm">
                <Download size={14} /> Télécharger
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="dedco-card p-5 mb-4">
        <h3 className="font-display font-bold mb-3">Paiement final</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span>Acompte 50% déjà payé</span><span className="font-numeric text-[var(--forest)]">{formatFCFA(152250)}</span></div>
          <div className="flex justify-between"><span>Solde 50% à libérer</span><span className="font-numeric font-semibold">{formatFCFA(152250)}</span></div>
          <div className="flex justify-between text-[var(--text-3)] text-xs pt-2 border-t border-[var(--border)]">
            <span>Dont commission Dedco 10% (sur designer)</span>
            <span className="font-numeric">{formatFCFA(30000)}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button className="dedco-btn dedco-btn-ghost">Demander une révision</button>
        <button className="dedco-btn dedco-btn-ghost text-[var(--terracotta)]">Ouvrir un litige</button>
        <button onClick={() => setValidated(true)} className="dedco-btn dedco-btn-primary flex-1">
          <Check size={16} /> Valider la livraison
        </button>
      </div>
    </div>
  );
}
