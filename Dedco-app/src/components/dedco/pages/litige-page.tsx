"use client";

import { useState } from "react";
import {
  ChevronLeft,
  Package,
  User,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Upload,
  X,
  RotateCcw,
  Wrench,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";
import { useDedcoStore } from "@/lib/store";
import { formatFCFA } from "@/lib/dedco-data";

// ============================================================
// Pistes de résolution potentielles (informatif, pas cliquable)
// ============================================================

const RESOLUTION_PISTES = [
  {
    icon: RotateCcw,
    label: "Remboursement",
    desc: "Remboursement total ou partiel selon l'analyse du litige",
  },
  {
    icon: Wrench,
    label: "Réparation",
    desc: "L'artisan répare ou refabrique la pièce à ses frais",
  },
  {
    icon: RefreshCw,
    label: "Échange",
    desc: "Remplacement par un produit identique ou équivalent",
  },
];

// ============================================================
// LitigePage — Formulaire d'ouverture de litige
// ============================================================

export function LitigePage({ litigeId }: { litigeId?: string }) {
  const goBack = useDedcoStore((s) => s.goBack);
  const navigate = useDedcoStore((s) => s.navigate);

  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const reasons = [
    "Produit endommagé à la réception",
    "Produit non conforme à la description",
    "Produit non reçu",
    "Délai de livraison non respecté",
    "Problème de qualité",
    "Autre",
  ];

  function handleSubmit() {
    if (!reason || description.trim().length < 10) return;
    setSubmitted(true);
  }

  function addPhoto() {
    // Simule l'ajout d'une photo (en production: input file + upload)
    const mockPhotos = [
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=400&q=85",
      "https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&w=400&q=85",
    ];
    const next = mockPhotos[photos.length % mockPhotos.length];
    setPhotos([...photos, next]);
  }

  function removePhoto(idx: number) {
    setPhotos(photos.filter((_, i) => i !== idx));
  }

  // ── État : litige envoyé ──
  if (submitted) {
    return (
      <div className="dedco-fade-in max-w-2xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-[var(--forest-pale)] mx-auto flex items-center justify-center mb-5">
            <CheckCircle2 size={40} className="text-[var(--forest)]" />
          </div>
          <h1 className="display-xl mb-3">Litige ouvert</h1>
          <p className="text-sm text-[var(--text-2)] mb-2">
            Votre signalement a été transmis à l'équipe Dedco.
          </p>
          <p className="text-xs text-[var(--text-3)] mb-6">
            Nous examinons votre demande et vous répondons sous 48h ouvrées. L'artisan a également été notifié.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => navigate({ page: "client-projets" })}
              className="dedco-btn dedco-btn-primary"
            >
              Retour à mes projets
            </button>
            <button onClick={goBack} className="dedco-btn dedco-btn-ghost">
              Retour
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Formulaire d'ouverture ──
  return (
    <div className="dedco-fade-in max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
      <button
        type="button"
        onClick={goBack}
        className="inline-flex items-center gap-1 text-sm text-ink-soft hover:text-amber transition-colors mb-4 font-medium"
      >
        <ChevronLeft size={16} /> Retour
      </button>

      {/* Header */}
      <div className="mb-6">
        <h1 className="display-lg mb-2">Ouvrir un litige</h1>
        <p className="text-sm text-ink-soft">
          Décrivez le problème rencontré. Notre équipe médiera entre vous et l'artisan pour trouver une solution.
        </p>
      </div>

      {/* Formulaire */}
      <div className="dedco-card p-5 sm:p-6 mb-6">
        {/* Raison du litige */}
        <div className="mb-5">
          <label className="text-xs text-ink-mute uppercase tracking-wide mb-2 block">
            Raison du litige <span className="text-terracotta">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {reasons.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setReason(r)}
                className={`px-3 py-2 text-xs font-medium rounded-md border-2 transition-all ${
                  reason === r
                    ? "border-amber bg-amber-pale text-amber-dark"
                    : "border-border text-ink-soft hover:border-ink-mute"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="mb-5">
          <label className="text-xs text-ink-mute uppercase tracking-wide mb-2 block">
            Décrivez le problème <span className="text-terracotta">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="Expliquez ce qui s'est passé, ce qui ne va pas avec le produit ou la livraison..."
            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-card resize-none focus:outline-none focus:border-amber"
          />
          <p className="text-xs text-ink-mute mt-1">
            {description.trim().length < 10 && "Minimum 10 caractères"}
          </p>
        </div>

        {/* Preuves photos */}
        <div className="mb-5">
          <label className="text-xs text-ink-mute uppercase tracking-wide mb-2 block">
            Preuves photos (optionnel)
          </label>
          {photos.length === 0 ? (
            <button
              type="button"
              onClick={addPhoto}
              className="w-full border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-amber transition-colors"
            >
              <Upload size={20} className="mx-auto text-ink-mute mb-2" />
              <p className="text-sm text-ink-soft">Ajouter des photos</p>
              <p className="text-xs text-ink-mute mt-1">Photos du produit endommagé, non conforme, etc.</p>
            </button>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {photos.map((photo, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-warm">
                  <img src={photo} alt={`Preuve ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-terracotta transition-colors"
                    aria-label="Retirer la photo"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              {photos.length < 6 && (
                <button
                  type="button"
                  onClick={addPhoto}
                  className="aspect-square border-2 border-dashed border-border rounded-lg flex items-center justify-center hover:border-amber transition-colors"
                >
                  <Upload size={20} className="text-ink-mute" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Bouton soumettre */}
        <button
          type="button"
          disabled={!reason || description.trim().length < 10}
          onClick={handleSubmit}
          className="dedco-btn dedco-btn-primary w-full"
        >
          <AlertTriangle size={16} /> Ouvrir le litige
        </button>
      </div>

      {/* Pistes de résolution potentielles (informatif) */}
      <div className="dedco-card p-5 sm:p-6">
        <h2 className="font-display font-bold text-base mb-1">
          Solutions possibles
        </h2>
        <p className="text-xs text-ink-mute mb-4">
          Selon l'analyse de votre litige, voici les pistes de résolution que Dedco peut proposer :
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {RESOLUTION_PISTES.map((piste) => (
            <div key={piste.label} className="p-3 rounded-lg bg-warm">
              <div className="flex items-center gap-2 mb-1.5">
                <piste.icon size={16} className="text-amber" />
                <p className="text-sm font-semibold">{piste.label}</p>
              </div>
              <p className="text-xs text-ink-mute">{piste.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 rounded-lg bg-amber-pale/50 border border-amber/20 flex items-start gap-2">
          <Clock size={14} className="text-amber flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-dark">
            Notre équipe traite chaque litige sous 48h ouvrées. Le paiement à l'artisan est suspendu jusqu'à résolution.
          </p>
        </div>
      </div>
    </div>
  );
}
