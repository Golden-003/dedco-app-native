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
} from "lucide-react";
import type { Route } from "@/lib/dedco-types";
import { BackButton } from "./layout";

// ============================================================
// BRIEF ARTISAN — Formulaire guidé en 6 étapes
// Selon architecture V3 §4.6
// ============================================================

type BriefData = {
  type: string;
  room: string;
  styles: string[];
  budgetMin: number;
  budgetMax: number;
  description: string;
  references: string[];
  delay: "pas_urgent" | "moyen" | "urgent";
};

const TYPES = [
  {
    id: "mobilier",
    label: "Mobilier",
    desc: "Table, chaise, canapé, lit...",
    icon: <Sofa size={32} />,
  },
  {
    id: "decoration",
    label: "Décoration",
    desc: "Miroir, vase, objet d'art...",
    icon: <Sparkles size={32} />,
  },
  {
    id: "amenagement",
    label: "Aménagement",
    desc: "Rangement, bibliothèque, dressing...",
    icon: <Ruler size={32} />,
  },
  {
    id: "autre",
    label: "Autre",
    desc: "Luminaires, textile, sur-mesure...",
    icon: <Lamp size={32} />,
  },
];

const ROOMS = [
  "Salon",
  "Chambre",
  "Cuisine",
  "Salle à manger",
  "Bureau",
  "Entrée",
  "Salle de bain",
  "Extérieur",
  "Commercial",
];

const STYLE_OPTIONS = [
  { id: "afro-contemporain", label: "Afro-contemporain", img: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=400&q=80" },
  { id: "minimaliste", label: "Minimaliste", img: "https://images.unsplash.com/photo-1616627452792-20384b0f7d9b?auto=format&fit=crop&w=400&q=80" },
  { id: "tropical", label: "Tropical", img: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=400&q=80" },
  { id: "industriel", label: "Industriel", img: "https://images.unsplash.com/photo-1611269154421-4e2729ac711a?auto=format&fit=crop&w=400&q=80" },
  { id: "scandinave", label: "Scandinave", img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&q=80" },
  { id: "boheme", label: "Bohème", img: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=400&q=80" },
  { id: "wax-color", label: "Wax & Couleur", img: "https://images.unsplash.com/photo-1579656592043-a20e25a4aa4b?auto=format&fit=crop&w=400&q=80" },
  { id: "zen-bio", label: "Zen & Biophilique", img: "https://images.unsplash.com/photo-1528789386055-75c4b717bad1?auto=format&fit=crop&w=400&q=80" },
];

const DELAYS = [
  { id: "pas_urgent", label: "Pas urgent", desc: "Plus de 2 mois", icon: <Clock size={20} /> },
  { id: "moyen", label: "Moyen", desc: "3 à 8 semaines", icon: <Clock size={20} /> },
  { id: "urgent", label: "Urgent", desc: "Moins de 3 semaines", icon: <AlertTriangle size={20} />, warning: true },
];

const TOTAL_STEPS = 6;

export function BriefPage({
  onNavigate,
  onBack,
}: {
  onNavigate: (route: Route) => void;
  onBack: () => void;
}) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<BriefData>({
    type: "",
    room: "",
    styles: [],
    budgetMin: 50000,
    budgetMax: 300000,
    description: "",
    references: [],
    delay: "moyen",
  });
  const [submitted, setSubmitted] = useState(false);
  const [descLen, setDescLen] = useState(0);

  const update = <K extends keyof BriefData>(key: K, value: BriefData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleStyle = (id: string) => {
    setData((prev) => ({
      ...prev,
      styles: prev.styles.includes(id)
        ? prev.styles.filter((s) => s !== id)
        : [...prev.styles, id],
    }));
  };

  const canNext = () => {
    switch (step) {
      case 1:
        return !!data.type;
      case 2:
        return !!data.room && data.styles.length > 0;
      case 3:
        return data.budgetMax > data.budgetMin;
      case 4:
        return descLen >= 50 && descLen <= 1000;
      case 5:
        return true; // références optionnelles
      case 6:
        return !!data.delay;
      default:
        return false;
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
        <p className="text-base text-ink-soft mb-6 max-w-md mx-auto">
          Votre brief a été transmis à <strong>5 à 15 artisans qualifiés</strong>{" "}
          correspondant à votre demande. Vous recevrez leurs propositions sous{" "}
          <strong>48 heures</strong> dans votre dashboard.
        </p>
        <div className="dedco-card p-5 mb-6 text-left">
          <h3 className="font-display font-bold mb-3">Récapitulatif</h3>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <dt className="text-ink-mute">Type</dt>
            <dd className="font-medium capitalize">
              {TYPES.find((t) => t.id === data.type)?.label || data.type}
            </dd>
            <dt className="text-ink-mute">Pièce</dt>
            <dd className="font-medium">{data.room}</dd>
            <dt className="text-ink-mute">Styles</dt>
            <dd className="font-medium">
              {data.styles
                .map((s) => STYLE_OPTIONS.find((o) => o.id === s)?.label)
                .filter(Boolean)
                .join(", ")}
            </dd>
            <dt className="text-ink-mute">Budget</dt>
            <dd className="font-medium">
              {data.budgetMin.toLocaleString("fr-FR")} —{" "}
              {data.budgetMax.toLocaleString("fr-FR")} FCFA
            </dd>
            <dt className="text-ink-mute">Délai</dt>
            <dd className="font-medium">
              {DELAYS.find((d) => d.id === data.delay)?.label}
            </dd>
          </dl>
        </div>
        <div className="flex gap-3 justify-center">
          <button
            type="button"
            onClick={() => onNavigate({ name: "home" })}
            className="dedco-btn dedco-btn-primary"
          >
            Retour à l'accueil
          </button>
          <button
            type="button"
            onClick={() => onNavigate({ name: "marketplace" })}
            className="dedco-btn dedco-btn-ghost"
          >
            Voir la marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dedco-fade-in max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <BackButton onBack={onBack} />

      {/* Header */}
      <div className="mb-6">
        <h1 className="display-lg mb-2">Créer mon brief</h1>
        <p className="text-sm text-ink-soft">
          Décrivez votre projet en {TOTAL_STEPS} étapes. Recevez 5 à 15
          propositions d'artisans qualifiés sous 48h.
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
                  <div
                    className={`h-0.5 flex-1 mx-1 ${
                      done ? "bg-forest" : "bg-warm"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
        <p className="text-xs text-ink-mute">
          Étape <span className="font-numeric">{step}</span> / <span className="font-numeric">{TOTAL_STEPS}</span> —{" "}
          {[
            "Type de projet",
            "Contexte & style",
            "Budget",
            "Description",
            "Références",
            "Délai",
          ][step - 1]}
        </p>
      </div>

      {/* Step content */}
      <div className="dedco-card p-5 sm:p-8 mb-6">
        {/* STEP 1 — Type */}
        {step === 1 && (
          <div>
            <h2 className="display-sm mb-1">Quel type de projet ?</h2>
            <p className="text-sm text-ink-soft mb-5">
              Sélectionnez la catégorie qui correspond le mieux à votre besoin.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {TYPES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => update("type", t.id)}
                  className={`p-5 rounded-lg border-2 text-center transition-all ${
                    data.type === t.id
                      ? "border-amber bg-amber-pale"
                      : "border-border bg-white hover:border-ink-mute"
                  }`}
                >
                  <div
                    className={`mx-auto mb-2 ${
                      data.type === t.id ? "text-amber" : "text-ink-soft"
                    }`}
                  >
                    {t.icon}
                  </div>
                  <p className="font-display font-semibold text-sm">{t.label}</p>
                  <p className="text-xs text-ink-mute mt-1">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2 — Room + Style */}
        {step === 2 && (
          <div>
            <h2 className="display-sm mb-1">Décrivez le contexte</h2>
            <p className="text-sm text-ink-soft mb-5">
              Choisissez la pièce concernée et les styles que vous aimez.
            </p>

            <label className="block text-xs text-ink-mute uppercase tracking-wide mb-2">
              Pièce concernée
            </label>
            <select
              value={data.room}
              onChange={(e) => update("room", e.target.value)}
              className="w-full px-3 py-2.5 mb-5 text-sm border border-border rounded-md bg-white focus:outline-none focus:border-amber"
            >
              <option value="">— Sélectionnez —</option>
              {ROOMS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            <label className="block text-xs text-ink-mute uppercase tracking-wide mb-2">
              Styles de référence ({data.styles.length} sélectionné
              {data.styles.length > 1 ? "s" : ""})
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {STYLE_OPTIONS.map((s) => {
                const active = data.styles.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleStyle(s.id)}
                    className={`relative rounded-lg overflow-hidden border-2 transition-all aspect-[4/5] ${
                      active ? "border-amber" : "border-transparent"
                    }`}
                    aria-pressed={active}
                  >
                    <img
                      src={s.img}
                      alt={s.label}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(30,24,19,0.85) 0%, transparent 60%)",
                      }}
                    />
                    <div className="absolute bottom-2 left-2 right-2 text-white text-xs font-semibold">
                      {s.label}
                    </div>
                    {active && (
                      <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-amber text-white flex items-center justify-center">
                        <Check size={14} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3 — Budget */}
        {step === 3 && (
          <div>
            <h2 className="display-sm mb-1">Quel est votre budget ?</h2>
            <p className="text-sm text-ink-soft mb-5">
              Faites glisser pour définir votre fourchette. Les artisans
              s'adapteront à votre budget.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs text-ink-mute uppercase tracking-wide mb-2">
                  Budget minimum
                </label>
                <input
                  type="number"
                  value={data.budgetMin}
                  onChange={(e) => update("budgetMin", Number(e.target.value))}
                  step={10000}
                  min={0}
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-md bg-white focus:outline-none focus:border-amber"
                />
              </div>
              <div>
                <label className="block text-xs text-ink-mute uppercase tracking-wide mb-2">
                  Budget maximum
                </label>
                <input
                  type="number"
                  value={data.budgetMax}
                  onChange={(e) => update("budgetMax", Number(e.target.value))}
                  step={10000}
                  min={data.budgetMin}
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-md bg-white focus:outline-none focus:border-amber"
                />
              </div>
            </div>

            <div className="dedco-card p-4 bg-warm/50 mb-4">
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-ink-soft">Fourchette</span>
                <span className="font-display font-bold text-amber text-lg">
                  {data.budgetMin.toLocaleString("fr-FR")} —{" "}
                  {data.budgetMax.toLocaleString("fr-FR")} FCFA
                </span>
              </div>
            </div>

            <p className="text-xs text-ink-mute mb-2">Suggestions :</p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Petit budget", min: 20000, max: 80000 },
                { label: "Confort", min: 80000, max: 250000 },
                { label: "Premium", min: 250000, max: 600000 },
                { label: "Haut de gamme", min: 600000, max: 1500000 },
              ].map((sug) => (
                <button
                  key={sug.label}
                  type="button"
                  onClick={() => {
                    update("budgetMin", sug.min);
                    update("budgetMax", sug.max);
                  }}
                  className="dedco-badge dedco-badge-gray hover:dedco-badge-amber cursor-pointer"
                >
                  {sug.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4 — Description */}
        {step === 4 && (
          <div>
            <h2 className="display-sm mb-1">Décrivez votre projet</h2>
            <p className="text-sm text-ink-soft mb-5">
              Plus vous êtes précis, meilleures seront les propositions
              (50 à 1000 caractères).
            </p>
            <textarea
              value={data.description}
              onChange={(e) => {
                const v = e.target.value.slice(0, 1000);
                update("description", v);
                setDescLen(v.length);
              }}
              rows={8}
              placeholder="Ex : Je souhaite une table basse en bois iroko avec plateau wax bleu Ankara pour mon salon de 25m². Style afro-contemporain, dimensions 120×60×45cm environ. J'aimerais un tiroir de rangement..."
              className="w-full px-4 py-3 text-sm border border-border rounded-md bg-white focus:outline-none focus:border-amber resize-none"
            />
            <div className="flex justify-between items-center mt-2 text-xs">
              <span className={descLen < 50 ? "text-terracotta" : "text-forest"}>
                {descLen < 50
                  ? `Encore ${50 - descLen} caractères minimum`
                  : "✓ Description valide"}
              </span>
              <span className="text-ink-mute">{descLen} / 1000</span>
            </div>
          </div>
        )}

        {/* STEP 5 — References */}
        {step === 5 && (
          <div>
            <h2 className="display-sm mb-1">Ajoutez des photos</h2>
            <p className="text-sm text-ink-soft mb-5">
              Optionnel — jusqu'à 5 photos d'inspiration pour aider l'artisan à
              comprendre votre vision (0-5 photos).
            </p>

            <label
              htmlFor="brief-upload"
              className="block border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-amber transition-colors bg-white"
            >
              <Upload size={28} className="mx-auto text-ink-mute mb-2" />
              <p className="text-sm font-semibold mb-1">
                Cliquez pour ajouter des photos
              </p>
              <p className="text-xs text-ink-mute">
                PNG, JPG ou WebP · Max 5 photos · 800px redimensionnées auto
              </p>
              <input
                id="brief-upload"
                type="file"
                multiple
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []).slice(
                    0,
                    5 - data.references.length,
                  );
                  const urls = files.map((f) => URL.createObjectURL(f));
                  update("references", [...data.references, ...urls]);
                }}
              />
            </label>

            {data.references.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-4">
                {data.references.map((ref, i) => (
                  <div
                    key={i}
                    className="relative aspect-square rounded-md overflow-hidden bg-warm"
                  >
                    <img
                      src={ref}
                      alt={`Référence ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        update(
                          "references",
                          data.references.filter((_, idx) => idx !== i),
                        )
                      }
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
                Astuce : des photos de votre pièce actuelle, d'objets similaires
                vus ailleurs, ou de moodboards Pinterest augmentent la qualité
                des propositions reçues.
              </p>
            </div>
          </div>
        )}

        {/* STEP 6 — Delay */}
        {step === 6 && (
          <div>
            <h2 className="display-sm mb-1">Quel est votre délai ?</h2>
            <p className="text-sm text-ink-soft mb-5">
              Soyez honnête — un délai réaliste permet d'obtenir de meilleures
              propositions.
            </p>

            <div className="space-y-3">
              {DELAYS.map((d) => {
                const active = data.delay === d.id;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => update("delay", d.id as BriefData["delay"])}
                    className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 text-left transition-all ${
                      active
                        ? "border-amber bg-amber-pale"
                        : "border-border bg-white hover:border-ink-mute"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        active
                          ? "bg-amber text-white"
                          : d.warning
                            ? "bg-amber-pale text-amber-dark"
                            : "bg-warm text-ink-soft"
                      }`}
                    >
                      {d.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-display font-semibold">{d.label}</p>
                      <p className="text-xs text-ink-mute">{d.desc}</p>
                    </div>
                    {active && <Check size={20} className="text-amber" />}
                  </button>
                );
              })}
            </div>

            {data.delay === "urgent" && (
              <div className="mt-4 dedco-card p-3 bg-terracotta-pale flex items-start gap-2">
                <AlertTriangle
                  size={16}
                  className="text-terracotta flex-shrink-0 mt-0.5"
                />
                <p className="text-xs text-ink-soft">
                  <strong>Attention :</strong> un délai urgent peut limiter le
                  nombre d'artisans disponibles et augmenter le prix. Pensez à
                  étendre le délai si possible.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={prev}
          className="dedco-btn dedco-btn-ghost"
        >
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

      {/* Reassurance footer */}
      <p className="text-xs text-ink-mute text-center mt-4">
        🔒 Votre brief est transmis uniquement aux artisans qualifiés (niveau N2+,
        note ≥4.0). Aucun engagement tant que vous n'avez pas accepté une
        proposition. Paiement 100% sécurisé via séquestre Fedapay.
      </p>
    </div>
  );
}
