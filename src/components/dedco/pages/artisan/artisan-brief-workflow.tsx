"use client";

import { useState } from "react";
import {
  Check, CheckCircle2, Clock, ChevronRight, X, AlertTriangle,
  ShieldCheck, Send, MessageSquare, FileText, Hammer, Ruler,
  MapPin, Calendar, Package, Truck, ArrowRight, ArrowLeft,
} from "lucide-react";
import { useDedcoStore } from "@/lib/store";
import { formatFCFA } from "@/lib/dedco-data";

// ============================================================
// WORKFLOW ARTISAN — Spécifique à la fabrication sur mesure
// DIFFÉRENT du designer :
// - Designer : brief → choix prestation → proposition de mission → paiement → exécution → livraison PDF
// - Artisan : demande de fabrication → devis (prix+délai+matières) → négociation → paiement → fabrication → livraison → validation
// ============================================================

const MOCK_BRIEF = {
  id: "BRF-ART-001",
  clientName: "Sophie Kossou",
  clientAvatar: "https://images.unsplash.com/photo-1614317226704-aba58b1ce153?auto=format&fit=crop&crop=faces&w=120&q=80",
  clientVille: "Cotonou",
  clientQuartier: "Akpakpa",
  categorie: "Mobilier",
  titre: "Table basse en bois iroko avec plateau wax",
  matiere: "Bois (iroko, teck, acajou)",
  dimensions: "120 x 60 x 45 cm",
  couleur: "Naturel + wax bleu Ankara",
  quantite: 1,
  description: "Table basse pour salon de 25m². Plateau en bois iroko avec insert en tissu wax bleu Ankara. Pieds en bois massif. Un tiroir de rangement sur le côté droit. Finition naturelle mate.",
  budget: "150 000 – 400 000 FCFA",
  delai: "Normal (3-8 semaines)",
  photos: ["https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&w=400&q=80"],
  sentAt: "Il y a 2h",
  countdown: "47h restantes",
};

// ============================================================
// PAGE: artisan-brief-recu — Demande de fabrication reçue
// ============================================================

export function ArtisanBriefRecuPage({ briefId }: { briefId: string }) {
  const navigate = useDedcoStore((s) => s.navigate);
  const brief = MOCK_BRIEF;
  const [showQuestions, setShowQuestions] = useState(false);
  const [questions, setQuestions] = useState(["", "", ""]);

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <header className="mb-6">
        <div className="flex items-center gap-3 mb-1 flex-wrap">
          <h1 className="display-lg mb-0">Demande de fabrication</h1>
          <span className="dedco-badge dedco-badge-amber">{brief.categorie}</span>
        </div>
        <p className="text-sm text-[var(--text-2)] font-numeric">{brief.id} · Reçu {brief.sentAt}</p>
        {brief.countdown && (
          <p className="text-xs text-[var(--terracotta)] mt-1 flex items-center gap-1">
            <Clock size={11} /> {brief.countdown}
          </p>
        )}
      </header>

      {/* Client */}
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

        {/* Détails de fabrication — spécifique artisan */}
        <dl className="space-y-3 text-sm">
          <div className="pb-3 border-b border-[var(--border)]">
            <dt className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Objet à fabriquer</dt>
            <dd className="font-semibold text-base">{brief.titre}</dd>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <dt className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Matière demandée</dt>
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
              <dt className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Budget du client</dt>
              <dd className="font-numeric font-semibold text-[var(--amber)]">{brief.budget}</dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Délai souhaité</dt>
              <dd className="flex items-center gap-1"><Calendar size={12} className="text-[var(--amber)]" /> {brief.delai}</dd>
            </div>
          </div>
        </dl>

        {brief.photos.length > 0 && (
          <div className="mt-4 pt-3 border-t border-[var(--border)]">
            <p className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-2">Photos de référence</p>
            <div className="grid grid-cols-2 gap-2">
              {brief.photos.map((p, i) => (
                <img key={i} src={p} alt={`Référence ${i+1}`} className="w-full aspect-video object-cover rounded-md" />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions — 3 SEULEMENT, adaptées à l'artisan */}
      {!showQuestions ? (
        <div className="dedco-card p-5">
          <h3 className="font-display font-bold mb-4">Votre réponse</h3>
          <div className="space-y-2">
            {/* 1. Proposer un devis */}
            <button
              onClick={() => navigate({ page: "artisan-devis-create", briefId: brief.id })}
              className="w-full p-4 rounded-lg border-2 border-[var(--amber)] bg-[var(--amber-pale)]/30 hover:bg-[var(--amber-pale)] text-left transition-all flex items-center gap-3 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-[var(--amber)] text-white flex items-center justify-center flex-shrink-0">
                <FileText size={18} />
              </div>
              <div className="flex-1">
                <p className="font-display font-semibold text-sm">Proposer un devis</p>
                <p className="text-xs text-[var(--text-3)]">Votre prix, votre délai de fabrication, vos conditions</p>
              </div>
              <ChevronRight size={16} className="text-[var(--amber)]" />
            </button>

            {/* 2. Poser des questions */}
            <button
              onClick={() => setShowQuestions(true)}
              className="w-full p-4 rounded-lg border-2 border-[var(--border)] hover:border-[var(--text-3)] text-left transition-all flex items-center gap-3 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-[var(--bg-warm)] text-[var(--text-2)] flex items-center justify-center flex-shrink-0">
                <MessageSquare size={18} />
              </div>
              <div className="flex-1">
                <p className="font-display font-semibold text-sm">Demander des précisions</p>
                <p className="text-xs text-[var(--text-3)]">Sur les dimensions, la matière, la finition... (max 3 questions)</p>
              </div>
            </button>

            {/* 3. Refuser */}
            <button
              onClick={() => navigate({ page: "artisan-dashboard" })}
              className="w-full p-4 rounded-lg border-2 border-[var(--terracotta)]/30 hover:bg-[var(--terracotta-pale)] text-left transition-all flex items-center gap-3 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-[var(--terracotta-pale)] text-[var(--terracotta)] flex items-center justify-center flex-shrink-0">
                <X size={18} />
              </div>
              <div className="flex-1">
                <p className="font-display font-semibold text-sm text-[var(--terracotta)]">Refuser</p>
                <p className="text-xs text-[var(--text-3)]">Si vous ne pouvez pas fabriquer cette pièce</p>
              </div>
            </button>
          </div>
        </div>
      ) : (
        <div className="dedco-card p-5">
          <h3 className="font-display font-bold mb-3">Vos questions (max 3)</h3>
          <div className="space-y-3 mb-4">
            {questions.map((q, i) => (
              <input
                key={i}
                value={q}
                onChange={(e) => setQuestions(questions.map((qq, idx) => idx === i ? e.target.value : qq))}
                placeholder={`Question ${i+1}`}
                className="w-full px-3 py-2.5 text-sm border border-[var(--border)] rounded-md bg-card"
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowQuestions(false)} className="dedco-btn dedco-btn-ghost">
              <ArrowLeft size={14} /> Annuler
            </button>
            <button onClick={() => navigate({ page: "artisan-dashboard" })} className="dedco-btn dedco-btn-primary flex-1">
              <Send size={14} /> Envoyer les questions
            </button>
          </div>
        </div>
      )}

      {/* Note spécifique artisan */}
      <div className="mt-4 p-3 bg-[var(--bg-warm)] rounded-md">
        <p className="text-xs text-[var(--text-3)] leading-relaxed">
          <ShieldCheck size={12} className="inline text-[var(--forest)]" />
          {" "}Le client recevra votre devis. S'il accepte, le paiement est <strong>sécurisé via Mobile Money</strong>.
          Vous fabriquez, puis livrez en <strong>confirmation</strong> (T1 : produit prêt, T2 : en transit, T3 : remise client).
          Négociation possible (max 2 allers-retours).
        </p>
      </div>
    </div>
  );
}

// ============================================================
// PAGE: artisan-devis-create — Devis de fabrication
// DIFFÉRENT du designer : pas de "proposition de mission"
// mais un vrai devis de fabrication avec matériaux, processus, conditions
// ============================================================

export function ArtisanDevisCreatePage({ briefId }: { briefId: string }) {
  const navigate = useDedcoStore((s) => s.navigate);
  const brief = MOCK_BRIEF;

  const [form, setForm] = useState({
    prixUnitaire: 185000,
    quantite: brief.quantite,
    delaiFabrication: "3 semaines",
    materiauxUtilises: "Bois iroko massif, tissu wax bleu Ankara, colle bois, vernis naturel",
    processus: "1. Sélection du bois (2j) 2. Découpe et assemblage (5j) 3. Insert wax (3j) 4. Tiroir et finition (4j)",
    conditions: "Paiement sécurisé Mobile Money. Ajustement dimensions possible (±5cm). Garantie 6 mois sur la fabrication.",
  });

  const total = form.prixUnitaire * form.quantite;
  const garantie = Math.round(total * 0.015);
  const totalClient = total + garantie;
  const commission = Math.round(total * 0.10);
  const netArtisan = total - commission;

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <button onClick={() => navigate({ page: "artisan-brief-recu", briefId })} className="text-sm text-[var(--text-3)] hover:text-[var(--amber)] mb-4 flex items-center gap-1">
        <ArrowLeft size={16} /> Retour à la demande
      </button>

      <header className="mb-6">
        <h1 className="display-lg mb-1">Devis de fabrication</h1>
        <p className="text-sm text-[var(--text-2)]">Pour {brief.clientName} — {brief.titre}</p>
      </header>

      {/* Rappel de la demande */}
      <div className="dedco-card p-4 mb-4 bg-[var(--bg-warm)]">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div><span className="text-[var(--text-3)]">Demandé :</span> {brief.titre}</div>
          <div><span className="text-[var(--text-3)]">Matière :</span> {brief.matiere}</div>
          {brief.dimensions && <div><span className="text-[var(--text-3)]">Dimensions :</span> <span className="font-numeric">{brief.dimensions}</span></div>}
          <div><span className="text-[var(--text-3)]">Qté :</span> <span className="font-numeric">{brief.quantite}</span></div>
          <div><span className="text-[var(--text-3)]">Budget client :</span> <span className="font-numeric text-[var(--amber)]">{brief.budget}</span></div>
          <div><span className="text-[var(--text-3)]">Délai souhaité :</span> {brief.delai}</div>
        </div>
      </div>

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
              className="w-full px-3 py-2.5 text-sm border border-[var(--border)] rounded-md bg-card font-numeric focus:outline-none focus:border-[var(--amber)]"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Quantité</label>
            <input
              type="number"
              value={form.quantite}
              onChange={(e) => setForm({ ...form, quantite: Number(e.target.value) || 1 })}
              min={1}
              className="w-full px-3 py-2.5 text-sm border border-[var(--border)] rounded-md bg-card font-numeric focus:outline-none focus:border-[var(--amber)]"
            />
          </div>
        </div>

        {/* Délai de fabrication */}
        <div>
          <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Délai de fabrication</label>
          <input
            value={form.delaiFabrication}
            onChange={(e) => setForm({ ...form, delaiFabrication: e.target.value })}
            placeholder="Ex : 3 semaines"
            className="w-full px-3 py-2.5 text-sm border border-[var(--border)] rounded-md bg-card focus:outline-none focus:border-[var(--amber)]"
          />
        </div>

        {/* Matériaux utilisés — spécifique artisan */}
        <div>
          <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Matériaux que vous utiliserez</label>
          <textarea
            value={form.materiauxUtilises}
            onChange={(e) => setForm({ ...form, materiauxUtilises: e.target.value })}
            rows={2}
            placeholder="Ex : Bois iroko massif, tissu wax, vernis..."
            className="w-full px-3 py-2.5 text-sm border border-[var(--border)] rounded-md bg-card resize-none focus:outline-none focus:border-[var(--amber)]"
          />
        </div>

        {/* Processus de fabrication — spécifique artisan */}
        <div>
          <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Processus de fabrication</label>
          <textarea
            value={form.processus}
            onChange={(e) => setForm({ ...form, processus: e.target.value })}
            rows={3}
            placeholder="Ex : 1. Sélection bois 2. Découpe 3. Assemblage 4. Finition"
            className="w-full px-3 py-2.5 text-sm border border-[var(--border)] rounded-md bg-card resize-none focus:outline-none focus:border-[var(--amber)]"
          />
        </div>

        {/* Conditions */}
        <div>
          <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Conditions (garantie, ajustements)</label>
          <textarea
            value={form.conditions}
            onChange={(e) => setForm({ ...form, conditions: e.target.value })}
            rows={2}
            className="w-full px-3 py-2.5 text-sm border border-[var(--border)] rounded-md bg-card resize-none focus:outline-none focus:border-[var(--amber)]"
          />
        </div>

        {/* Transparence financière */}
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="p-3 bg-[var(--amber-pale)]/30 rounded-md">
            <p className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-2">Ce que paie le client</p>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between"><span>Prix fabrication</span><span className="font-numeric">{formatFCFA(total)}</span></div>
              <div className="flex justify-between text-[var(--text-2)]"><span className="flex items-center gap-1">Garantie 1,5%<ShieldCheck size={10} className="text-[var(--forest)]" /></span><span className="font-numeric">{formatFCFA(garantie)}</span></div>
              <div className="flex justify-between font-bold pt-1 border-t border-[var(--border)]"><span>Total client</span><span className="font-numeric text-[var(--amber)]">{formatFCFA(totalClient)}</span></div>
            </div>
          </div>
          <div className="p-3 bg-[var(--bg-warm)] rounded-md">
            <p className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-2">Ce que vous recevez</p>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between"><span>Montant vente</span><span className="font-numeric">{formatFCFA(total)}</span></div>
              <div className="flex justify-between text-[var(--terracotta)]"><span>Commission Dedco 10%</span><span className="font-numeric">-{formatFCFA(commission)}</span></div>
              <div className="flex justify-between font-bold pt-1 border-t border-[var(--border)]"><span>Net reçu</span><span className="font-numeric text-[var(--forest)]">{formatFCFA(netArtisan)}</span></div>
            </div>
          </div>
        </div>

        {/* Rappel du workflow */}
        <div className="p-3 bg-[var(--forest-pale)]/30 rounded-md">
          <p className="text-xs text-[var(--text-2)]">
            <strong>Après acceptation du client :</strong>
            {" "}Paiement Mobile Money → Fabrication → T1 (photo produit prêt) → T2 (photo transit) → T3 (photo remise) → Validation → Paiement libéré
          </p>
        </div>

        <button onClick={() => navigate({ page: "artisan-dashboard" })} className="dedco-btn dedco-btn-primary w-full">
          <Send size={16} /> Envoyer le devis
        </button>
      </div>
    </div>
  );
}
