"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Sofa,
  BedDouble,
  Briefcase,
  CookingPot,
  DoorOpen,
  UtensilsCrossed,
  Sparkles,
  Leaf,
  Wind,
  Layers,
  TreePine,
  Castle,
  Upload,
  X,
  Plus,
  Lock,
} from "lucide-react";
import { useDedcoStore } from "@/lib/store";
import { formatFCFA } from "@/lib/dedco-data-expanded";
import { BackButton } from "../layout";

// ============================================================
// Step data constants
// ============================================================

const ROOMS = [
  { id: "Salon", label: "Salon", icon: <Sofa size={28} />, desc: "Séjour & espace de vie" },
  { id: "Chambre", label: "Chambre", icon: <BedDouble size={28} />, desc: "Chambre à coucher" },
  { id: "Bureau", label: "Bureau", icon: <Briefcase size={28} />, desc: "Espace de travail" },
  { id: "Cuisine", label: "Cuisine", icon: <CookingPot size={28} />, desc: "Cuisine & coin repas" },
  { id: "Entrée", label: "Entrée", icon: <DoorOpen size={28} />, desc: "Vestibule & couloir" },
  { id: "Salle à manger", label: "Salle à manger", icon: <UtensilsCrossed size={28} />, desc: "Salle de réception" },
];

const STYLES = [
  { id: "Afro-contemporain", label: "Afro-contemporain", icon: <Sparkles size={24} />, desc: "Afrique moderne", color: "var(--amber)" },
  { id: "Tropical luxe", label: "Tropical luxe", icon: <Layers size={24} />, desc: "Luxe tropical", color: "var(--forest)" },
  { id: "Zen minimaliste", label: "Zen minimaliste", icon: <Wind size={24} />, desc: "Simplicité zen", color: "var(--text-3)" },
  { id: "Éclectique", label: "Éclectique", icon: <Sparkles size={24} />, desc: "Mix audacieux", color: "var(--terracotta)" },
  { id: "Biophilique", label: "Biophilique", icon: <TreePine size={24} />, desc: "Nature intégrée", color: "var(--forest)" },
  { id: "Traditionnel revisité", label: "Traditionnel revisité", icon: <Castle size={24} />, desc: "Héritage moderne", color: "var(--amber-dark)" },
];

const BUDGET_PRESETS = [
  { label: "< 100k", min: 0, max: 100000 },
  { label: "100 - 300k", min: 100000, max: 300000 },
  { label: "300 - 500k", min: 300000, max: 500000 },
  { label: "500k - 1M", min: 500000, max: 1000000 },
  { label: "> 1M", min: 1000000, max: 5000000 },
];

const SUGGESTED_REQUIREMENTS = [
  "Mobilier",
  "Éclairage",
  "Rideaux & Textiles",
  "Art mural",
  "Tapis",
  "Rangement",
  "Plantes",
  "Accessoires",
  "Peinture",
  "Parquet / Revêtement",
];

const TOTAL_STEPS = 5;

const STEP_LABELS = [
  "Espace",
  "Style",
  "Budget",
  "Description",
  "Confirmation",
];

// ============================================================
// Form state type
// ============================================================

type BriefFormData = {
  room: string;
  style: string;
  budgetMin: number;
  budgetMax: number;
  title: string;
  description: string;
  photos: string[];
  requirements: string[];
};

// ============================================================
// Step content components
// ============================================================

function StepRoom({
  value,
  onChange,
}: {
  value: string;
  onChange: (room: string) => void;
}) {
  return (
    <div>
      <h2 className="display-sm mb-1">Quelle pièce souhaitez-vous aménager ?</h2>
      <p className="text-sm text-[var(--text-2)] mb-5">
        Sélectionnez l&apos;espace concerné par votre projet.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {ROOMS.map((room) => {
          const active = value === room.id;
          return (
            <button
              key={room.id}
              type="button"
              onClick={() => onChange(room.id)}
              className={`p-5 rounded-xl border-2 text-center transition-all ${
                active
                  ? "border-[var(--amber)] bg-[var(--amber-pale)]"
                  : "border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--text-3)]"
              }`}
            >
              <div
                className={`mx-auto mb-2 ${
                  active ? "text-[var(--amber)]" : "text-[var(--text-3)]"
                }`}
              >
                {room.icon}
              </div>
              <p className="font-display font-semibold text-sm">{room.label}</p>
              <p className="text-xs text-[var(--text-3)] mt-1">{room.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepStyle({
  value,
  onChange,
}: {
  value: string;
  onChange: (style: string) => void;
}) {
  return (
    <div>
      <h2 className="display-sm mb-1">Quel style recherchez-vous ?</h2>
      <p className="text-sm text-[var(--text-2)] mb-5">
        Choisissez le style d&apos;aménagement qui vous inspire.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {STYLES.map((style) => {
          const active = value === style.id;
          return (
            <button
              key={style.id}
              type="button"
              onClick={() => onChange(style.id)}
              className={`relative p-5 rounded-xl border-2 text-left transition-all ${
                active
                  ? "border-[var(--amber)] bg-[var(--amber-pale)]"
                  : "border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--text-3)]"
              }`}
            >
              {active && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[var(--amber)] text-white flex items-center justify-center">
                  <Check size={14} />
                </div>
              )}
              <div
                className="mb-2"
                style={{ color: active ? "var(--amber)" : style.color }}
              >
                {style.icon}
              </div>
              <p className="font-display font-semibold text-sm">{style.label}</p>
              <p className="text-xs text-[var(--text-3)] mt-1">{style.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepBudget({
  budgetMin,
  budgetMax,
  onChangeMin,
  onChangeMax,
}: {
  budgetMin: number;
  budgetMax: number;
  onChangeMin: (v: number) => void;
  onChangeMax: (v: number) => void;
}) {
  return (
    <div>
      <h2 className="display-sm mb-1">Quel est votre budget ?</h2>
      <p className="text-sm text-[var(--text-2)] mb-5">
        Définissez votre fourchette de budget en FCFA.
      </p>

      {/* Preset buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {BUDGET_PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => {
              onChangeMin(preset.min);
              onChangeMax(preset.max);
            }}
            className={`dedco-badge cursor-pointer transition-colors ${
              budgetMin === preset.min && budgetMax === preset.max
                ? "dedco-badge-amber"
                : "dedco-badge-gray hover:dedco-badge-amber"
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Min / Max inputs */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs text-[var(--text-3)] uppercase tracking-wide mb-2">
            Budget min
          </label>
          <div className="relative">
            <input
              type="number"
              value={budgetMin}
              onChange={(e) => onChangeMin(Number(e.target.value))}
              step={10000}
              min={0}
              className="w-full px-3 py-2.5 pr-16 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg-card)] focus:outline-none focus:border-[var(--amber)] font-numeric"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-3)]">
              FCFA
            </span>
          </div>
        </div>
        <div>
          <label className="block text-xs text-[var(--text-3)] uppercase tracking-wide mb-2">
            Budget max
          </label>
          <div className="relative">
            <input
              type="number"
              value={budgetMax}
              onChange={(e) => onChangeMax(Number(e.target.value))}
              step={10000}
              min={budgetMin}
              className="w-full px-3 py-2.5 pr-16 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg-card)] focus:outline-none focus:border-[var(--amber)] font-numeric"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-3)]">
              FCFA
            </span>
          </div>
        </div>
      </div>

      {/* Budget display */}
      <div className="dedco-card p-4 bg-[var(--bg-warm)]/50">
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-[var(--text-2)]">Fourchette</span>
          <span className="font-display font-bold text-[var(--amber)] text-lg font-numeric">
            {formatFCFA(budgetMin)} — {formatFCFA(budgetMax)}
          </span>
        </div>
      </div>
    </div>
  );
}

function StepDescription({
  title,
  description,
  photos,
  requirements,
  onTitleChange,
  onDescriptionChange,
  onPhotosChange,
  onToggleRequirement,
}: {
  title: string;
  description: string;
  photos: string[];
  requirements: string[];
  onTitleChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
  onPhotosChange: (v: string[]) => void;
  onToggleRequirement: (req: string) => void;
}) {
  const [descLen, setDescLen] = useState(description.length);

  const handleDescChange = (v: string) => {
    const trimmed = v.slice(0, 1000);
    onDescriptionChange(trimmed);
    setDescLen(trimmed.length);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 5 - photos.length);
    const urls = files.map((f) => URL.createObjectURL(f));
    onPhotosChange([...photos, ...urls]);
  };

  const removePhoto = (index: number) => {
    onPhotosChange(photos.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h2 className="display-sm mb-1">Décrivez votre projet</h2>
      <p className="text-sm text-[var(--text-2)] mb-5">
        Plus de détails = meilleures propositions des designers.
      </p>

      {/* Title */}
      <label className="block text-xs text-[var(--text-3)] uppercase tracking-wide mb-2">
        Titre du projet
      </label>
      <input
        type="text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Ex : Aménagement salon afro-contemporain"
        className="w-full px-3 py-2.5 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg-card)] focus:outline-none focus:border-[var(--amber)] mb-4"
      />

      {/* Description */}
      <label className="block text-xs text-[var(--text-3)] uppercase tracking-wide mb-2">
        Description
      </label>
      <textarea
        value={description}
        onChange={(e) => handleDescChange(e.target.value)}
        rows={5}
        placeholder="Décrivez votre pièce actuelle, vos goûts, vos contraintes, les couleurs que vous aimez..."
        className="w-full px-3 py-2.5 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg-card)] focus:outline-none focus:border-[var(--amber)] resize-none mb-1"
      />
      <div className="flex justify-between items-center mb-5 text-xs">
        <span className={descLen < 50 ? "text-[var(--terracotta)]" : "text-[var(--forest)]"}>
          {descLen < 50
            ? `Encore ${50 - descLen} caractères minimum`
            : "Description valide"}
        </span>
        <span className="text-[var(--text-3)] font-numeric">{descLen} / 1000</span>
      </div>

      {/* Photos upload */}
      <label className="block text-xs text-[var(--text-3)] uppercase tracking-wide mb-2">
        Photos (optionnel)
      </label>
      {photos.length < 5 && (
        <label
          htmlFor="create-brief-photos"
          className="block border-2 border-dashed border-[var(--border)] rounded-lg p-6 text-center cursor-pointer hover:border-[var(--amber)] transition-colors bg-[var(--bg-card)] mb-4"
        >
          <Upload size={24} className="mx-auto text-[var(--text-3)] mb-2" />
          <p className="text-sm font-semibold mb-1">Ajouter des photos</p>
          <p className="text-xs text-[var(--text-3)]">
            PNG, JPG · Max 5 photos
          </p>
          <input
            id="create-brief-photos"
            type="file"
            multiple
            accept="image/*"
            className="sr-only"
            onChange={handlePhotoUpload}
          />
        </label>
      )}
      {photos.length > 0 && (
        <div className="flex gap-2 mb-5 overflow-x-auto dedco-hide-scroll -mx-4 px-4 sm:mx-0 sm:px-0">
          {photos.map((photo, i) => (
            <div
              key={i}
              className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-[var(--bg-warm)]"
            >
              <img
                src={photo}
                alt={`Photo ${i + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removePhoto(i)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white/90 flex items-center justify-center text-[var(--text-1)] hover:text-[var(--terracotta)]"
                aria-label={`Supprimer photo ${i + 1}`}
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Requirements checklist */}
      <label className="block text-xs text-[var(--text-3)] uppercase tracking-wide mb-2">
        Besoins & exigences
      </label>
      <div className="flex flex-wrap gap-2">
        {SUGGESTED_REQUIREMENTS.map((req) => {
          const active = requirements.includes(req);
          return (
            <button
              key={req}
              type="button"
              onClick={() => onToggleRequirement(req)}
              className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-full border transition-all cursor-pointer ${
                active
                  ? "border-[var(--amber)] bg-[var(--amber-pale)] text-[var(--amber-dark)]"
                  : "border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-2)] hover:border-[var(--text-3)]"
              }`}
            >
              {active ? <Check size={12} /> : <Plus size={12} />}
              {req}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepConfirmation({ data }: { data: BriefFormData }) {
  const roomData = ROOMS.find((r) => r.id === data.room);
  const styleData = STYLES.find((s) => s.id === data.style);

  return (
    <div>
      <h2 className="display-sm mb-1">Confirmez votre brief</h2>
      <p className="text-sm text-[var(--text-2)] mb-5">
        Vérifiez les informations avant de publier votre brief.
      </p>

      <div className="space-y-4">
        {/* Room */}
        <div className="dedco-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--amber-pale)] text-[var(--amber)] flex items-center justify-center flex-shrink-0">
            {roomData?.icon || <Sofa size={20} />}
          </div>
          <div>
            <p className="text-xs text-[var(--text-3)]">Espace</p>
            <p className="font-display font-semibold text-sm">{data.room}</p>
          </div>
        </div>

        {/* Style */}
        <div className="dedco-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--forest-pale)] text-[var(--forest)] flex items-center justify-center flex-shrink-0">
            {styleData?.icon || <Sparkles size={20} />}
          </div>
          <div>
            <p className="text-xs text-[var(--text-3)]">Style</p>
            <p className="font-display font-semibold text-sm">{data.style}</p>
          </div>
        </div>

        {/* Budget */}
        <div className="dedco-card p-4">
          <p className="text-xs text-[var(--text-3)] mb-1">Budget</p>
          <p className="font-display font-bold text-[var(--amber)] font-numeric">
            {formatFCFA(data.budgetMin)} — {formatFCFA(data.budgetMax)}
          </p>
        </div>

        {/* Title & Description */}
        {data.title && (
          <div className="dedco-card p-4">
            <p className="text-xs text-[var(--text-3)] mb-1">Titre</p>
            <p className="font-display font-semibold text-sm">{data.title}</p>
          </div>
        )}
        {data.description && (
          <div className="dedco-card p-4">
            <p className="text-xs text-[var(--text-3)] mb-1">Description</p>
            <p className="text-sm text-[var(--text-2)] leading-relaxed line-clamp-4">
              {data.description}
            </p>
          </div>
        )}

        {/* Requirements */}
        {data.requirements.length > 0 && (
          <div className="dedco-card p-4">
            <p className="text-xs text-[var(--text-3)] mb-2">Besoins</p>
            <div className="flex flex-wrap gap-1.5">
              {data.requirements.map((req) => (
                <span
                  key={req}
                  className="dedco-badge dedco-badge-amber"
                >
                  {req}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Photos */}
        {data.photos.length > 0 && (
          <div className="dedco-card p-4">
            <p className="text-xs text-[var(--text-3)] mb-2">Photos ({data.photos.length})</p>
            <div className="flex gap-2">
              {data.photos.map((photo, i) => (
                <div
                  key={i}
                  className="w-16 h-16 rounded-md overflow-hidden bg-[var(--bg-warm)]"
                >
                  <img
                    src={photo}
                    alt={`Photo ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// BriefCreatePage — main multi-step creation page
// ============================================================

export function BriefCreatePage() {
  const navigate = useDedcoStore((s) => s.navigate);
  const goBack = useDedcoStore((s) => s.goBack);

  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<BriefFormData>({
    room: "",
    style: "",
    budgetMin: 200000,
    budgetMax: 500000,
    title: "",
    description: "",
    photos: [],
    requirements: [],
  });

  const update = <K extends keyof BriefFormData>(key: K, value: BriefFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleRequirement = (req: string) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.includes(req)
        ? prev.requirements.filter((r) => r !== req)
        : [...prev.requirements, req],
    }));
  };

  const canNext = () => {
    switch (step) {
      case 1:
        return !!formData.room;
      case 2:
        return !!formData.style;
      case 3:
        return formData.budgetMax > formData.budgetMin;
      case 4:
        return formData.description.length >= 50;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      setSubmitted(true);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate({ page: "brief" });
    }
  };

  // ── Submitted state ──
  if (submitted) {
    return (
      <div className="dedco-fade-in max-w-2xl mx-auto px-4 sm:px-6 py-12 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="w-20 h-20 rounded-full bg-[var(--forest-pale)] mx-auto flex items-center justify-center mb-6">
            <Check size={40} className="text-[var(--forest)]" />
          </div>
          <h1 className="display-xl mb-4">Brief publié !</h1>
          <p className="text-base text-[var(--text-2)] mb-6 max-w-md mx-auto">
            Votre brief a été publié avec succès. Les designers qualifiés
            correspondant à votre demande vous contacteront sous{" "}
            <strong>48 heures</strong>.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              type="button"
              onClick={() => navigate({ page: "brief" })}
              className="dedco-btn dedco-btn-primary"
            >
              Voir mes briefs
            </button>
            <button
              type="button"
              onClick={() => navigate({ page: "home" })}
              className="dedco-btn dedco-btn-ghost"
            >
              Retour à l&apos;accueil
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="dedco-fade-in max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <BackButton onBack={goBack} />

      {/* Header */}
      <div className="mb-6">
        <h1 className="display-lg mb-2">Créer un brief</h1>
        <p className="text-sm text-[var(--text-2)]">
          Décrivez votre projet pour recevoir des propositions de designers qualifiés.
        </p>
      </div>

      {/* Progress bar */}
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
                      ? "bg-[var(--forest)] text-white"
                      : current
                        ? "bg-[var(--amber)] text-white"
                        : "bg-[var(--bg-warm)] text-[var(--text-3)]"
                  }`}
                >
                  {done ? <Check size={16} /> : n}
                </div>
                {n < TOTAL_STEPS && (
                  <div
                    className={`h-0.5 flex-1 mx-1 transition-colors ${
                      done ? "bg-[var(--forest)]" : "bg-[var(--bg-warm)]"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
        <p className="text-xs text-[var(--text-3)]">
          Étape <span className="font-numeric">{step}</span> /{" "}
          <span className="font-numeric">{TOTAL_STEPS}</span> — {STEP_LABELS[step - 1]}
        </p>
      </div>

      {/* Step content with AnimatePresence */}
      <div className="dedco-card p-5 sm:p-8 mb-6 min-h-[320px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {step === 1 && (
              <StepRoom
                value={formData.room}
                onChange={(v) => update("room", v)}
              />
            )}
            {step === 2 && (
              <StepStyle
                value={formData.style}
                onChange={(v) => update("style", v)}
              />
            )}
            {step === 3 && (
              <StepBudget
                budgetMin={formData.budgetMin}
                budgetMax={formData.budgetMax}
                onChangeMin={(v) => update("budgetMin", v)}
                onChangeMax={(v) => update("budgetMax", v)}
              />
            )}
            {step === 4 && (
              <StepDescription
                title={formData.title}
                description={formData.description}
                photos={formData.photos}
                requirements={formData.requirements}
                onTitleChange={(v) => update("title", v)}
                onDescriptionChange={(v) => update("description", v)}
                onPhotosChange={(v) => update("photos", v)}
                onToggleRequirement={toggleRequirement}
              />
            )}
            {step === 5 && <StepConfirmation data={formData} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handlePrev}
          className="dedco-btn dedco-btn-ghost"
        >
          <ArrowLeft size={16} />
          {step === 1 ? "Annuler" : "Précédent"}
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!canNext()}
          className="dedco-btn dedco-btn-primary flex-1"
        >
          {step === TOTAL_STEPS ? "Publier le brief" : "Suivant"}
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Reassurance */}
      <p className="text-xs text-[var(--text-3)] text-center mt-4 flex items-center justify-center gap-1.5">
        <Lock size={12} className="text-[var(--forest)]" />
        Votre brief est visible uniquement par les designers vérifiés. Aucun
        engagement tant que vous n&apos;acceptez pas une proposition.
      </p>
    </div>
  );
}
