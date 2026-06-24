"use client";

import { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Sofa,
  Lamp,
  Ruler,
  Sparkles,
  Image as ImageIcon,
  Clock,
  AlertTriangle,
  Upload,
  X,
  Hammer,
  Palette,
  ShoppingBag,
  MapPin,
  Phone,
} from "lucide-react";
import type { Route } from "@/lib/dedco-types";
import { BackButton } from "./layout";

// ============================================================
// BRIEF ARTISAN — Demande de fabrication sur mesure
// Logique métier réelle : matières adaptées à la catégorie,
// budget indicatif adapté au type d'objet
// ============================================================

type BriefData = {
  categorie: string;
  titre: string;
  matiere: string;
  dimensions: string;
  couleur: string;
  quantite: number;
  description: string;
  references: string[];
  ville: string;
  quartier: string;
  delai: "pas_urgent" | "moyen" | "urgent";
  budget: string;
};

const CATEGORIES = [
  { id: "mobilier", label: "Mobilier", desc: "Table, chaise, canapé, lit...", icon: <Sofa size={28} /> },
  { id: "decoration", label: "Décoration", desc: "Miroir, vase, panier, objet d'art...", icon: <Sparkles size={28} /> },
  { id: "luminaire", label: "Luminaire", desc: "Lampe, suspension, applique...", icon: <Lamp size={28} /> },
  { id: "textile", label: "Textile", desc: "Coussins, rideaux, tapis...", icon: <Palette size={28} /> },
  { id: "amenagement", label: "Aménagement", desc: "Bibliothèque, commode, rangement...", icon: <Ruler size={28} /> },
  { id: "autre", label: "Autre", desc: "Je ne sais pas encore", icon: <Hammer size={28} /> },
];

// Matières adaptées à chaque catégorie — pas de "wax" pour du mobilier en bois
const MATIERES_PAR_CATEGORIE: Record<string, string[]> = {
  mobilier: ["Bois (iroko, teck, acajou)", "Rotin / Osier", "Métal / Fer forgé", "Bambou", "Bois + Métal", "Autre"],
  decoration: ["Bois sculpté", "Terre cuite / Céramique", "Raffia", "Métal / Laiton", "Bois + Raffia", "Autre"],
  luminaire: ["Bambou", "Métal / Laiton", "Tissu (bogolan)", "Bois", "Céramique", "Autre"],
  textile: ["Wax 100% coton", "Kente", "Bogolan", "Laine", "Coton naturel", "Autre"],
  amenagement: ["Bois (iroko, teck)", "Contreplaqué laqué", "Métal + Bois", "Rotin", "Autre"],
  autre: ["Bois", "Métal", "Tissu", "Terre cuite", "Bambou", "Raffia", "Autre"],
};

// Budgets adaptés à la catégorie — modèle paliers (moins de / fourchettes / plus de)
const BUDGETS_PAR_CATEGORIE: Record<string, string[]> = {
  mobilier: [
    "Moins de 50 000 FCFA",
    "50 000 – 150 000 FCFA",
    "150 000 – 400 000 FCFA",
    "Plus de 400 000 FCFA",
  ],
  decoration: [
    "Moins de 25 000 FCFA",
    "25 000 – 80 000 FCFA",
    "80 000 – 200 000 FCFA",
    "Plus de 200 000 FCFA",
  ],
  luminaire: [
    "Moins de 30 000 FCFA",
    "30 000 – 80 000 FCFA",
    "80 000 – 150 000 FCFA",
    "Plus de 150 000 FCFA",
  ],
  textile: [
    "Moins de 20 000 FCFA",
    "20 000 – 80 000 FCFA",
    "80 000 – 200 000 FCFA",
    "Plus de 200 000 FCFA",
  ],
  amenagement: [
    "Moins de 100 000 FCFA",
    "100 000 – 300 000 FCFA",
    "300 000 – 600 000 FCFA",
    "Plus de 600 000 FCFA",
  ],
  autre: [
    "Moins de 50 000 FCFA",
    "50 000 – 200 000 FCFA",
    "200 000 – 500 000 FCFA",
    "Plus de 500 000 FCFA",
  ],
};

const VILLES = ["Cotonou", "Porto-Novo", "Abomey", "Parakou", "Abomey-Calavi", "Ouidah", "Autre"];

const TOTAL_STEPS = 5;

export function BriefPage({
  onNavigate,
  onBack,
}: {
  onNavigate: (route: Route) => void;
  onBack: () => void;
}) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<BriefData>({
    categorie: "",
    titre: "",
    matiere: "",
    dimensions: "",
    couleur: "",
    quantite: 1,
    description: "",
    references: [],
    ville: "",
    quartier: "",
    delai: "moyen",
    budget: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [descLen, setDescLen] = useState(0);

  const update = <K extends keyof BriefData>(key: K, value: BriefData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  // Quand on change de catégorie, reset la matière et le budget
  const selectCategorie = (catId: string) => {
    update("categorie", catId);
    update("matiere", "");
    update("budget", "");
  };

  const matieresDisponibles = data.categorie ? MATIERES_PAR_CATEGORIE[data.categorie] || [] : [];
  const budgetsDisponibles = data.categorie ? BUDGETS_PAR_CATEGORIE[data.categorie] || [] : [];
  const catLabel = CATEGORIES.find(c => c.id === data.categorie)?.label || "";

  const canNext = () => {
    switch (step) {
      case 1: return !!data.categorie;
      case 2: return data.titre.length >= 3 && !!data.matiere;
      case 3: return descLen >= 30;
      case 4: return true;
      case 5: return !!data.ville && !!data.budget;
      default: return false;
    }
  };

  const next = () => {
    if (step < TOTAL_STEPS) setStep(step + 1);
    else setSubmitted(true);
  };
  const prev = () => {
    if (step > 1) setStep(step - 1);
    else onBack();
  };

  if (submitted) {
    return (
      <div className="dedco-fade-in max-w-2xl mx-auto px-4 sm:px-6 py-12 text-center">
        <div className="w-20 h-20 rounded-full bg-forest-pale mx-auto flex items-center justify-center mb-6">
          <Check size={40} className="text-forest" />
        </div>
        <h1 className="display-xl mb-4">Brief envoyé !</h1>
        <p className="text-sm text-ink-soft mb-6 max-w-md mx-auto">
          Votre demande de fabrication a été transmise à <strong>5 à 15 artisans qualifiés</strong>.
          Vous recevrez leurs propositions (prix + délai) sous <strong>48h</strong>.
        </p>
        <div className="dedco-card p-5 mb-6 text-left max-w-md mx-auto">
          <h3 className="font-display font-bold mb-3">Récapitulatif</h3>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <dt className="text-ink-mute">Catégorie</dt>
            <dd className="font-medium">{catLabel}</dd>
            <dt className="text-ink-mute">Objet</dt>
            <dd className="font-medium">{data.titre}</dd>
            <dt className="text-ink-mute">Matière</dt>
            <dd className="font-medium">{data.matiere}</dd>
            {data.dimensions && <><dt className="text-ink-mute">Dimensions</dt><dd className="font-medium font-numeric">{data.dimensions}</dd></>}
            {data.couleur && <><dt className="text-ink-mute">Couleur</dt><dd className="font-medium">{data.couleur}</dd></>}
            <dt className="text-ink-mute">Quantité</dt>
            <dd className="font-medium font-numeric">{data.quantite}</dd>
            <dt className="text-ink-mute">Budget</dt>
            <dd className="font-medium text-amber">{data.budget}</dd>
            <dt className="text-ink-mute">Livraison</dt>
            <dd className="font-medium">{data.quartier}, {data.ville}</dd>
            <dt className="text-ink-mute">Délai</dt>
            <dd className="font-medium">{data.delai === "urgent" ? "Urgent" : data.delai === "moyen" ? "Normal" : "Flexible"}</dd>
          </dl>
        </div>
        <div className="flex gap-3 justify-center">
          <button onClick={() => onNavigate({ name: "home" })} className="dedco-btn dedco-btn-primary">
            Retour à l'accueil
          </button>
          <button onClick={() => onNavigate({ name: "marketplace" })} className="dedco-btn dedco-btn-ghost">
            Voir la marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dedco-fade-in max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <BackButton onBack={onBack} />

      <div className="mb-6">
        <h1 className="display-lg mb-2">Commander sur mesure</h1>
        <p className="text-sm text-ink-soft">
          Décrivez ce que vous voulez faire fabriquer. Les artisans qualifiés vous répondent sous 48h.
        </p>
      </div>

      {/* Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
            const n = i + 1;
            const done = n < step;
            const current = n === step;
            return (
              <div key={n} className="flex items-center flex-1 last:flex-none">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors ${
                    done
                      ? "bg-forest text-white"
                      : current
                        ? "bg-amber text-white"
                        : "bg-warm text-ink-mute"
                  }`}
                >
                  {done ? <Check size={16} /> : n}
                </div>
                {n < TOTAL_STEPS && (
                  <div className={`h-0.5 flex-1 mx-1 ${done ? "bg-forest" : "bg-warm"}`} />
                )}
              </div>
            );
          })}
        </div>
        <p className="text-xs text-ink-mute">
          Étape <span className="font-numeric">{step}</span> / <span className="font-numeric">{TOTAL_STEPS}</span> —{" "}
          {["Que voulez-vous fabriquer ?", "Détails de la pièce", "Description", "Photos (optionnel)", "Livraison & budget"][step - 1]}
        </p>
      </div>

      {/* Step content */}
      <div className="dedco-card p-5 sm:p-8 mb-6">
        {/* STEP 1 — Catégorie */}
        {step === 1 && (
          <div>
            <h2 className="display-sm mb-1">Que voulez-vous fabriquer ?</h2>
            <p className="text-sm text-ink-soft mb-5">
              Sélectionnez la catégorie de votre demande.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => selectCategorie(c.id)}
                  className={`p-4 rounded-lg border-2 text-center transition-all ${
                    data.categorie === c.id
                      ? "border-amber bg-amber-pale"
                      : "border-border bg-white hover:border-ink-mute"
                  }`}
                >
                  <div className={`mx-auto mb-2 ${data.categorie === c.id ? "text-amber" : "text-ink-soft"}`}>
                    {c.icon}
                  </div>
                  <p className="font-display font-semibold text-sm">{c.label}</p>
                  <p className="text-xs text-ink-mute mt-1">{c.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2 — Détails de la pièce */}
        {step === 2 && (
          <div>
            <h2 className="display-sm mb-1">Détails de la pièce</h2>
            <p className="text-sm text-ink-soft mb-5">
              Décrivez l'objet que vous voulez faire fabriquer.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-ink-mute uppercase tracking-wide mb-1.5">
                  Quoi exactement ? <span className="text-ink-mute normal-case">(pour {catLabel})</span>
                </label>
                <input
                  value={data.titre}
                  onChange={(e) => update("titre", e.target.value)}
                  placeholder="Ex : Table basse en bois iroko avec plateau wax"
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-md bg-white focus:outline-none focus:border-amber"
                />
              </div>

              <div>
                <label className="block text-xs text-ink-mute uppercase tracking-wide mb-1.5">
                  Matière souhaitée
                </label>
                <select
                  value={data.matiere}
                  onChange={(e) => update("matiere", e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-md bg-white focus:outline-none focus:border-amber"
                >
                  <option value="">— Sélectionnez —</option>
                  {matieresDisponibles.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <p className="text-xs text-ink-mute mt-1">
                  Les matières proposées correspondent à la catégorie &laquo; {catLabel} &raquo;.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-ink-mute uppercase tracking-wide mb-1.5">
                    Dimensions (si connues)
                  </label>
                  <input
                    value={data.dimensions}
                    onChange={(e) => update("dimensions", e.target.value)}
                    placeholder="Ex : 120 x 60 x 45 cm"
                    className="w-full px-3 py-2.5 text-sm border border-border rounded-md bg-white focus:outline-none focus:border-amber"
                  />
                </div>
                <div>
                  <label className="block text-xs text-ink-mute uppercase tracking-wide mb-1.5">
                    Couleur / Finition
                  </label>
                  <input
                    value={data.couleur}
                    onChange={(e) => update("couleur", e.target.value)}
                    placeholder="Ex : Naturel + wax bleu"
                    className="w-full px-3 py-2.5 text-sm border border-border rounded-md bg-white focus:outline-none focus:border-amber"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-ink-mute uppercase tracking-wide mb-1.5">
                  Quantité
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => update("quantite", Math.max(1, data.quantite - 1))}
                    className="w-10 h-10 rounded-md border border-border bg-white text-lg text-ink-soft hover:text-ink"
                  >
                    -
                  </button>
                  <span className="font-display font-bold text-lg font-numeric">{data.quantite}</span>
                  <button
                    type="button"
                    onClick={() => update("quantite", data.quantite + 1)}
                    className="w-10 h-10 rounded-md border border-border bg-white text-lg text-ink-soft hover:text-ink"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 — Description */}
        {step === 3 && (
          <div>
            <h2 className="display-sm mb-1">Décrivez votre projet</h2>
            <p className="text-sm text-ink-soft mb-5">
              Plus vous êtes précis, meilleures seront les propositions des artisans (min 30 caractères).
            </p>
            <textarea
              value={data.description}
              onChange={(e) => {
                const v = e.target.value.slice(0, 1000);
                update("description", v);
                setDescLen(v.length);
              }}
              rows={6}
              placeholder="Ex : Je veux une table basse pour mon salon de 25m². Plateau en bois iroko avec insert en tissu wax bleu Ankara. Pieds en bois massif. Un tiroir de rangement sur le côté droit. Finition naturelle mate."
              className="w-full px-4 py-3 text-sm border border-border rounded-md bg-white focus:outline-none focus:border-amber resize-none"
            />
            <div className="flex justify-between items-center mt-2 text-xs">
              <span className={descLen < 30 ? "text-terracotta" : "text-forest"}>
                {descLen < 30 ? `Encore ${30 - descLen} caractères minimum` : "Description valide"}
              </span>
              <span className="text-ink-mute font-numeric">{descLen} / 1000</span>
            </div>
          </div>
        )}

        {/* STEP 4 — Photos (optionnel) */}
        {step === 4 && (
          <div>
            <h2 className="display-sm mb-1">Photos d'inspiration</h2>
            <p className="text-sm text-ink-soft mb-5">
              Optionnel — Ajoutez des photos pour aider l'artisan à comprendre votre vision.
            </p>

            <label
              htmlFor="brief-upload"
              className="block border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-amber transition-colors bg-white"
            >
              <Upload size={28} className="mx-auto text-ink-mute mb-2" />
              <p className="text-sm font-semibold mb-1">Cliquez pour ajouter des photos</p>
              <p className="text-xs text-ink-mute">Max 5 photos</p>
              <input
                id="brief-upload"
                type="file"
                multiple
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []).slice(0, 5 - data.references.length);
                  const urls = files.map((f) => URL.createObjectURL(f));
                  update("references", [...data.references, ...urls]);
                }}
              />
            </label>

            {data.references.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-4">
                {data.references.map((ref, i) => (
                  <div key={i} className="relative aspect-square rounded-md overflow-hidden bg-warm">
                    <img src={ref} alt={`Référence ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => update("references", data.references.filter((_, idx) => idx !== i))}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-white/90 flex items-center justify-center text-ink hover:text-terracotta"
                      aria-label={`Supprimer la référence ${i + 1}`}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-5 dedco-card p-3 bg-forest-pale/40 flex items-start gap-2">
              <ImageIcon size={16} className="text-forest flex-shrink-0 mt-0.5" />
              <p className="text-xs text-ink-soft">
                Astuce : une photo d'un objet similaire, d'un moodboard ou de votre pièce actuelle
                aide l'artisan à proposer le bon prix et le bon délai.
              </p>
            </div>
          </div>
        )}

        {/* STEP 5 — Livraison & Budget */}
        {step === 5 && (
          <div>
            <h2 className="display-sm mb-1">Livraison & budget</h2>
            <p className="text-sm text-ink-soft mb-5">
              Où livrer et quel est votre budget indicatif ?
            </p>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-ink-mute uppercase tracking-wide mb-1.5">
                    Ville
                  </label>
                  <select
                    value={data.ville}
                    onChange={(e) => update("ville", e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-border rounded-md bg-white focus:outline-none focus:border-amber"
                  >
                    <option value="">— Sélectionnez —</option>
                    {VILLES.map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-ink-mute uppercase tracking-wide mb-1.5">
                    Quartier
                  </label>
                  <input
                    value={data.quartier}
                    onChange={(e) => update("quartier", e.target.value)}
                    placeholder="Ex : Akpakpa"
                    className="w-full px-3 py-2.5 text-sm border border-border rounded-md bg-white focus:outline-none focus:border-amber"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-ink-mute uppercase tracking-wide mb-1.5">
                  Délai souhaité
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "pas_urgent", label: "Flexible", desc: "+ de 2 mois", icon: <Clock size={16} /> },
                    { id: "moyen", label: "Normal", desc: "3-8 semaines", icon: <Clock size={16} /> },
                    { id: "urgent", label: "Urgent", desc: "- de 3 semaines", icon: <AlertTriangle size={16} />, warning: true },
                  ].map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => update("delai", d.id as BriefData["delai"])}
                      className={`p-3 rounded-lg border-2 text-center transition-all ${
                        data.delai === d.id
                          ? "border-amber bg-amber-pale"
                          : d.warning
                            ? "border-border hover:border-terracotta"
                            : "border-border hover:border-ink-mute"
                      }`}
                    >
                      <div className={`mx-auto mb-1 ${data.delai === d.id ? "text-amber" : "text-ink-soft"}`}>
                        {d.icon}
                      </div>
                      <p className="font-display font-semibold text-sm">{d.label}</p>
                      <p className="text-xs text-ink-mute">{d.desc}</p>
                    </button>
                  ))}
                </div>
                {data.delai === "urgent" && (
                  <div className="mt-3 p-3 bg-terracotta-pale rounded-md flex items-start gap-2">
                    <AlertTriangle size={14} className="text-terracotta flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-ink-soft">
                      Un délai urgent peut limiter le nombre d'artisans disponibles et augmenter le prix.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs text-ink-mute uppercase tracking-wide mb-1.5">
                  Budget estimatif — pour {catLabel.toLowerCase()}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {budgetsDisponibles.map((b) => {
                    const active = data.budget === b;
                    return (
                      <button
                        key={b}
                        type="button"
                        onClick={() => update("budget", b)}
                        className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all text-center ${
                          active
                            ? "border-amber bg-amber-pale text-amber-dark"
                            : "border-border bg-white text-ink-soft hover:border-ink-mute"
                        }`}
                      >
                        {b}
                        {active && <Check size={14} className="inline ml-1 text-amber" />}
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-ink-mute mt-2">
                  Le budget est indicatif. L'artisan fixera son prix dans son devis. Négociation possible (max 2 allers-retours).
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <button type="button" onClick={prev} className="dedco-btn dedco-btn-ghost">
          <ArrowLeft size={16} />
          {step === 1 ? "Annuler" : "Précédent"}
        </button>
        <button
          type="button"
          onClick={next}
          disabled={!canNext()}
          className="dedco-btn dedco-btn-primary flex-1"
        >
          {step === TOTAL_STEPS ? "Envoyer mon brief" : "Continuer"}
          <ArrowRight size={16} />
        </button>
      </div>

      <p className="text-xs text-ink-mute text-center mt-4">
        Votre brief est transmis aux artisans qualifiés (N2+, note ≥ 4.0). Aucun engagement tant que vous n'avez pas accepté un devis. Paiement séquestré, livraison 3 temps.
      </p>
    </div>
  );
}
