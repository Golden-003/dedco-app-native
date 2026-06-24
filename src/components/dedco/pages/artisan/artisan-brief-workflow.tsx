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
  FileText,
  Hammer,
  Ruler,
  MapPin,
  Calendar,
  Package,
} from "lucide-react";
import { useDedcoStore } from "@/lib/store";
import { formatFCFA } from "@/lib/dedco-data";

// ============================================================
// MOCK — Brief artisan reçu
// ============================================================

const MOCK_ARTISAN_BRIEF = {
  id: "BRF-ART-001",
  clientName: "Sophie Kossou",
  clientAvatar: "https://images.unsplash.com/photo-1614317226704-aba58b1ce153?auto=format&fit=crop&crop=faces&w=120&q=80",
  clientVille: "Cotonou",
  clientQuartier: "Akpakpa",
  // Détails de la pièce à fabriquer
  categorie: "Mobilier",
  titre: "Table basse en bois iroko avec plateau wax",
  matiere: "Bois (iroko, teck, acajou)",
  dimensions: "120 x 60 x 45 cm",
  couleur: "Naturel + wax bleu Ankara",
  quantite: 1,
  description: "Table basse pour salon de 25m². Plateau en bois iroko avec insert en tissu wax bleu Ankara. Pieds en bois massif. Un tiroir de rangement sur le côté droit. Finition naturelle mate.",
  budget: "150 000 – 400 000 FCFA",
  delai: "Normal (3-8 semaines)",
  photos: [
    "https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1579656592043-a20e25a4aa4b?auto=format&fit=crop&w=400&q=80",
  ],
  sentAt: "Il y a 2h",
};

// ============================================================
// PAGE: artisan-brief-recu — Artisan reçoit un brief de fabrication
// ============================================================

export function ArtisanBriefRecuPage({ briefId }: { briefId: string }) {
  const navigate = useDedcoStore((s) => s.navigate);
  const brief = MOCK_ARTISAN_BRIEF;
  const [showQuestions, setShowQuestions] = useState(false);
  const [questions, setQuestions] = useState(["", "", ""]);

  // 3 ACTIONS — comme le designer mais adapté à l'artisan
  const canAct = true; // Pas de choix de prestation nécessaire — l'artisan fabrique

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <header className="mb-6">
        <div className="flex items-center gap-3 mb-1 flex-wrap">
          <h1 className="display-lg mb-0">Demande de fabrication</h1>
          <span className="dedco-badge dedco-badge-amber">{brief.categorie}</span>
        </div>
        <p className="text-sm text-[var(--text-2)] font-numeric">{brief.id} · Reçu {brief.sentAt}</p>
      </header>

      {/* 1. RÉSUMÉ DU BRIEF — adapté à une commande de fabrication */}
      <div className="dedco-card p-5 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <img src={brief.clientAvatar} alt={brief.clientName} className="w-12 h-12 rounded-full object-cover" />
          <div>
            <p className="font-display font-semibold">{brief.clientName}</p>
            <p className="text-xs text-[var(--text-3)] flex items-center gap-1">
              <MapPin size={11} /> {brief.clientQuartier}, {brief.clientVille}
            </p>
          </div>
        </div>

        <dl className="space-y-3 text-sm">
          <div>
            <dt className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Objet à fabriquer</dt>
            <dd className="font-semibold text-base">{brief.titre}</dd>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <dt className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Matière</dt>
              <dd className="flex items-center gap-1"><Hammer size={12} className="text-[var(--amber)]" /> {brief.matiere}</dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Quantité</dt>
              <dd className="font-numeric font-semibold">{brief.quantite} pièce(s)</dd>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {brief.dimensions && (
              <div>
                <dt className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Dimensions</dt>
                <dd className="flex items-center gap-1 font-numeric"><Ruler size={12} className="text-[var(--amber)]" /> {brief.dimensions}</dd>
              </div>
            )}
            {brief.couleur && (
              <div>
                <dt className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Couleur / Finition</dt>
                <dd>{brief.couleur}</dd>
              </div>
            )}
          </div>

          <div>
            <dt className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Description du client</dt>
            <dd className="p-3 bg-[var(--bg-warm)] rounded-md">{brief.description}</dd>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 pt-2 border-t border-[var(--border)]">
            <div>
              <dt className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Budget estimatif</dt>
              <dd className="font-numeric font-semibold text-[var(--amber)]">{brief.budget}</dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Délai souhaité</dt>
              <dd className="flex items-center gap-1"><Calendar size={12} className="text-[var(--amber)]" /> {brief.delai}</dd>
            </div>
          </div>
        </dl>

        {/* Photos */}
        {brief.photos.length > 0 && (
          <div className="mt-4 pt-3 border-t border-[var(--border)]">
            <p className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-2">Photos fournies par le client</p>
            <div className="grid grid-cols-2 gap-2">
              {brief.photos.map((p, i) => (
                <img key={i} src={p} alt={`Référence ${i + 1}`} className="w-full aspect-video object-cover rounded-md" />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. ACTIONS — 3 UNIQUEMENT (adapté à l'artisan) */}
      {!showQuestions ? (
        <div className="dedco-card p-5">
          <h3 className="font-display font-bold mb-4">Votre réponse</h3>
          <div className="space-y-2">
            {/* Proposer un devis */}
            <button
              onClick={() => navigate({ page: "artisan-devis-create", briefId: brief.id })}
              className="w-full p-4 rounded-lg border-2 border-[var(--amber)] bg-[var(--amber-pale)]/30 hover:bg-[var(--amber-pale)] text-left transition-all flex items-center gap-3 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-[var(--amber)] text-white flex items-center justify-center flex-shrink-0">
                <FileText size={18} />
              </div>
              <div>
                <p className="font-display font-semibold text-sm">Proposer un devis</p>
                <p className="text-xs text-[var(--text-3)]">Envoyer votre prix, votre délai de fabrication et vos conditions</p>
              </div>
            </button>

            {/* Poser des questions */}
            <button
              onClick={() => setShowQuestions(true)}
              className="w-full p-4 rounded-lg border-2 border-[var(--border)] hover:border-[var(--text-3)] text-left transition-all flex items-center gap-3 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-[var(--bg-warm)] text-[var(--text-2)] flex items-center justify-center flex-shrink-0">
                <MessageSquare size={18} />
              </div>
              <div>
                <p className="font-display font-semibold text-sm">Poser max 3 questions</p>
                <p className="text-xs text-[var(--text-3)]">Demander des précisions sur les dimensions, la matière, etc.</p>
              </div>
            </button>

            {/* Refuser */}
            <button
              onClick={() => navigate({ page: "artisan-dashboard" })}
              className="w-full p-4 rounded-lg border-2 border-[var(--terracotta)]/30 hover:bg-[var(--terracotta-pale)] text-left transition-all flex items-center gap-3 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-[var(--terracotta-pale)] text-[var(--terracotta)] flex items-center justify-center flex-shrink-0">
                <X size={18} />
              </div>
              <div>
                <p className="font-display font-semibold text-sm text-[var(--terracotta)]">Refuser</p>
                <p className="text-xs text-[var(--text-3)]">Décliner cette demande</p>
              </div>
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
                className="w-full px-3 py-2.5 text-sm border border-[var(--border)] rounded-md bg-white"
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowQuestions(false)} className="dedco-btn dedco-btn-ghost">Annuler</button>
            <button onClick={() => navigate({ page: "artisan-dashboard" })} className="dedco-btn dedco-btn-primary flex-1">
              <Send size={14} /> Envoyer les questions
            </button>
          </div>
        </div>
      )}

      <p className="text-xs text-[var(--text-3)] text-center mt-4">
        Le client recevra votre devis. S'il accepte, le paiement est séquestré via Fedapay. Négociation possible (max 2 allers-retours).
      </p>
    </div>
  );
}

// ============================================================
// PAGE: artisan-devis-create — Artisan crée un devis
// ============================================================

export function ArtisanDevisCreatePage({ briefId }: { briefId: string }) {
  const navigate = useDedcoStore((s) => s.navigate);
  const brief = MOCK_ARTISAN_BRIEF;
  const [form, setForm] = useState({
    prixUnitaire: 185000,
    quantite: brief.quantite,
    delaiFabrication: "3 semaines",
    description: "Fabrication en bois iroko massif, plateau avec insert wax bleu Ankara. Tiroir avec coulisses métal. Finition naturelle mate (vernis).",
    conditions: "Acompte de 30% à la commande, solde à la livraison. Possibilité d'ajustement dimensions (±5cm).",
  });

  const total = form.prixUnitaire * form.quantite;
  const garantie = Math.round(total * 0.015);
  const totalClient = total + garantie;
  const commission = Math.round(total * 0.10);
  const netArtisan = total - commission;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button onClick={() => navigate({ page: "artisan-brief-recu", briefId })} className="text-sm text-[var(--text-3)] hover:text-[var(--amber)] mb-4 flex items-center gap-1">
        <ChevronRight size={16} className="rotate-180" /> Retour au brief
      </button>

      <header className="mb-6">
        <h1 className="display-lg mb-1">Proposer un devis</h1>
        <p className="text-sm text-[var(--text-2)]">Pour {brief.clientName} — {brief.titre}</p>
      </header>

      <div className="dedco-card p-5 space-y-4">
        {/* Prix */}
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Prix unitaire (FCFA)</label>
            <input
              type="number"
              value={form.prixUnitaire}
              onChange={(e) => setForm({ ...form, prixUnitaire: Number(e.target.value) || 0 })}
              step={5000}
              min={0}
              className="w-full px-3 py-2.5 text-sm border border-[var(--border)] rounded-md bg-white font-numeric focus:outline-none focus:border-[var(--amber)]"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Quantité</label>
            <input
              type="number"
              value={form.quantite}
              onChange={(e) => setForm({ ...form, quantite: Number(e.target.value) || 1 })}
              min={1}
              className="w-full px-3 py-2.5 text-sm border border-[var(--border)] rounded-md bg-white font-numeric focus:outline-none focus:border-[var(--amber)]"
            />
          </div>
        </div>

        {/* Délai */}
        <div>
          <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Délai de fabrication</label>
          <input
            value={form.delaiFabrication}
            onChange={(e) => setForm({ ...form, delaiFabrication: e.target.value })}
            placeholder="Ex : 3 semaines"
            className="w-full px-3 py-2.5 text-sm border border-[var(--border)] rounded-md bg-white focus:outline-none focus:border-[var(--amber)]"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Description de votre proposition</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2.5 text-sm border border-[var(--border)] rounded-md bg-white resize-none focus:outline-none focus:border-[var(--amber)]"
          />
        </div>

        {/* Conditions */}
        <div>
          <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Conditions (acompte, ajustements, etc.)</label>
          <textarea
            value={form.conditions}
            onChange={(e) => setForm({ ...form, conditions: e.target.value })}
            rows={2}
            className="w-full px-3 py-2.5 text-sm border border-[var(--border)] rounded-md bg-white resize-none focus:outline-none focus:border-[var(--amber)]"
          />
        </div>

        {/* Transparence financière */}
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="p-3 bg-[var(--amber-pale)]/30 rounded-md">
            <p className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-2">Côté client</p>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between"><span>Prix fabrication</span><span className="font-numeric">{formatFCFA(total)}</span></div>
              <div className="flex justify-between text-[var(--text-2)]"><span className="flex items-center gap-1">Garantie 1,5%<ShieldCheck size={10} className="text-[var(--forest)]" /></span><span className="font-numeric">{formatFCFA(garantie)}</span></div>
              <div className="flex justify-between font-bold pt-1 border-t border-[var(--border)]"><span>Total client</span><span className="font-numeric text-[var(--amber)]">{formatFCFA(totalClient)}</span></div>
            </div>
          </div>
          <div className="p-3 bg-[var(--bg-warm)] rounded-md">
            <p className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-2">Côté artisan (vous)</p>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between"><span>Montant vente</span><span className="font-numeric">{formatFCFA(total)}</span></div>
              <div className="flex justify-between text-[var(--terracotta)]"><span>Commission Dedco 10%</span><span className="font-numeric">-{formatFCFA(commission)}</span></div>
              <div className="flex justify-between font-bold pt-1 border-t border-[var(--border)]"><span>Net reçu</span><span className="font-numeric text-[var(--forest)]">{formatFCFA(netArtisan)}</span></div>
            </div>
          </div>
        </div>

        <button onClick={() => navigate({ page: "artisan-dashboard" })} className="dedco-btn dedco-btn-primary w-full">
          <Send size={16} /> Envoyer le devis
        </button>
      </div>

      <p className="text-xs text-[var(--text-3)] text-center mt-4">
        Le client recevra votre devis. Il peut accepter, négocier (max 2 allers-retours) ou refuser. En cas d'acceptation, le paiement est séquestré.
      </p>
    </div>
  );
}
