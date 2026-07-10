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
  RotateCcw,
  Wrench,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";
import { useDedcoStore } from "@/lib/store";
import { formatFCFA } from "@/lib/dedco-data";

// ============================================================
// Dispute Data
// ============================================================

interface TimelineEntry {
  id: string;
  date: string;
  author: string;
  role: string;
  message: string;
}

const DISPUTE = {
  id: "LIT-001",
  status: "en_cours",
  orderRef: "ORD-003",
  productName: "Suspension Bambou Tressé",
  productPrice: 78000,
  artisanName: "Fatou Loko",
  reason: "Produit arrivé endommagé",
  description:
    "Le bambou était fissuré à la réception. J'ai des photos qui montrent les dommages.",
  photos: [
    "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=85",
    "https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&w=600&q=85",
  ],
  reportDate: "22 Jan 2024",
  timeline: [
    {
      id: "t1",
      date: "22 Jan 2024",
      author: "Vous",
      role: "client",
      message:
        "Signalement du litige: le produit est arrivé endommagé. Photos jointes.",
    },
    {
      id: "t2",
      date: "23 Jan 2024",
      author: "Fatou Loko",
      role: "artisan",
      message:
        "Bonjour, je suis désolée pour cet incident. Je peux vérifier et proposer une réparation ou un remplacement.",
    },
    {
      id: "t3",
      date: "24 Jan 2024",
      author: "Service Client Dedco",
      role: "admin",
      message:
        "Nous examinons le litige. Merci de patienter. Nous vous tiendrons informé sous 48h.",
    },
  ] as TimelineEntry[],
};

const STEPPER_STEPS = [
  { label: "Signalé", done: true },
  { label: "En médiation", active: true },
  { label: "Résolu", done: false },
];

const RESOLUTION_OPTIONS = [
  {
    id: "refund",
    label: "Remboursement total",
    desc: `${formatFCFA(78000)} remboursés sur votre compte`,
    icon: RotateCcw,
  },
  {
    id: "repair",
    label: "Réparation",
    desc: "L'artisan répare le produit gratuitement",
    icon: Wrench,
  },
  {
    id: "exchange",
    label: "Échange",
    desc: "Remplacement par un produit identique",
    icon: RefreshCw,
  },
];

// ============================================================
// LitigePage
// ============================================================

export function LitigePage({ litigeId }: { litigeId?: string }) {
  const goBack = useDedcoStore((s) => s.goBack);
  const navigate = useDedcoStore((s) => s.navigate);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [imageModal, setImageModal] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  // Utilise l'id passé par la route si disponible, sinon fallback mock
  const disputeId = litigeId || DISPUTE.id;

  return (
    <div className="dedco-fade-in max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
      <button
        type="button"
        onClick={goBack}
        className="inline-flex items-center gap-1 text-sm text-ink-soft hover:text-amber transition-colors mb-4 font-medium"
      >
        <ChevronLeft size={16} /> Retour
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="display-lg">Litige {disputeId}</h1>
            <span className="dedco-badge dedco-badge-terra flex items-center gap-1">
              <Clock size={12} />
              En cours de traitement
            </span>
          </div>
          <p className="text-sm text-ink-soft mt-1">
            Signalé le {DISPUTE.reportDate}
          </p>
        </div>
      </div>

      {/* Stepper */}
      <motion.div
        className="dedco-card p-5 sm:p-6 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between relative">
          {/* Line background */}
          <div className="absolute top-5 left-[10%] right-[10%] h-0.5 bg-border hidden sm:block" />
          <div
            className="absolute top-5 left-[10%] h-0.5 bg-amber hidden sm:block"
            style={{ width: "calc(40% - 10%)" }}
          />

          {STEPPER_STEPS.map((step, i) => (
            <div key={step.label} className="flex flex-col items-center z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mb-2 transition-colors ${
                  step.done
                    ? "bg-forest text-white"
                    : step.active
                      ? "bg-amber text-white ring-4 ring-amber/20"
                      : "bg-warm text-ink-mute"
                }`}
              >
                {step.done ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <span className="font-numeric">{i + 1}</span>
                )}
              </div>
              <span
                className={`text-xs font-medium ${
                  step.active
                    ? "text-amber"
                    : step.done
                      ? "text-forest"
                      : "text-ink-mute"
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Dispute Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product details */}
          <motion.div
            className="dedco-card p-5 sm:p-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
              <AlertTriangle size={18} className="text-terracotta" />
              Détails du litige
            </h2>
            <div className="space-y-3">
              <DetailRow
                icon={<Package size={16} />}
                label="Commande"
                value={
                  <button
                    type="button"
                    onClick={() => navigate({ page: "order-tracking", id: DISPUTE.orderRef })}
                    className="text-amber hover:underline font-medium"
                  >
                    {DISPUTE.orderRef}
                  </button>
                }
              />
              <DetailRow
                icon={<Package size={16} />}
                label="Produit"
                value={`${DISPUTE.productName} (${formatFCFA(DISPUTE.productPrice)})`}
              />
              <DetailRow
                icon={<User size={16} />}
                label="Artisan"
                value={DISPUTE.artisanName}
              />
              <DetailRow
                icon={<AlertTriangle size={16} />}
                label="Raison"
                value={
                  <span className="dedco-badge dedco-badge-terra">
                    {DISPUTE.reason}
                  </span>
                }
              />
              <DetailRow
                icon={<Calendar size={16} />}
                label="Date du signalement"
                value={DISPUTE.reportDate}
              />
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-ink-mute uppercase tracking-wide mb-1">
                Description
              </p>
              <p className="text-sm text-ink-soft leading-relaxed">
                {DISPUTE.description}
              </p>
            </div>

            {/* Photos */}
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-ink-mute uppercase tracking-wide mb-2">
                Photos jointes
              </p>
              <div className="grid grid-cols-2 gap-3">
                {DISPUTE.photos.map((photo, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setImageModal(photo)}
                    className="aspect-[4/3] rounded-lg overflow-hidden bg-warm border border-border hover:shadow-md transition-shadow"
                  >
                    <img
                      src={photo}
                      alt={`Preuve ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div
            className="dedco-card p-5 sm:p-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-display font-bold text-lg mb-4">
              Historique de médiation
            </h2>
            <div className="space-y-0">
              {DISPUTE.timeline.map((entry, i) => (
                <motion.div
                  key={entry.id}
                  className="flex gap-3 pb-5 last:pb-0"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.08 }}
                >
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                        entry.role === "admin"
                          ? "bg-amber"
                          : entry.role === "artisan"
                            ? "bg-forest"
                            : "bg-ink"
                      }`}
                    >
                      {entry.role === "admin"
                        ? "SC"
                        : entry.role === "artisan"
                          ? "FA"
                          : "VO"}
                    </div>
                    {i < DISPUTE.timeline.length - 1 && (
                      <div className="w-0.5 flex-1 bg-border mt-1" />
                    )}
                  </div>
                  <div className="flex-1 -mt-0.5">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold">{entry.author}</span>
                      <span className="text-xs text-ink-mute">{entry.date}</span>
                    </div>
                    <p className="text-sm text-ink-soft leading-relaxed">
                      {entry.message}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Admin message */}
            <div className="mt-4 p-3 rounded-lg bg-amber-pale border border-amber/20">
              <p className="text-xs font-semibold text-amber-dark mb-1 flex items-center gap-1">
                <Clock size={12} />
                Message du service client
              </p>
              <p className="text-sm text-ink-soft">
                Nous examinons le litige. Merci de patienter. Vous recevrez une
                réponse sous 48 heures ouvrées.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right — Resolution */}
        <div>
          <motion.div
            className="dedco-card p-5 sm:p-6 sticky top-20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <h2 className="font-display font-bold text-lg mb-4">
              Options de résolution
            </h2>
            <div className="space-y-3">
              {RESOLUTION_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedOption(option.id)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedOption === option.id
                      ? "border-amber bg-amber-pale/50"
                      : "border-border hover:border-amber/40 hover:bg-warm"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        selectedOption === option.id
                          ? "bg-amber text-white"
                          : "bg-warm text-ink-soft"
                      }`}
                    >
                      <option.icon size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold mb-0.5">
                        {option.label}
                      </p>
                      <p className="text-xs text-ink-mute">{option.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <button
              type="button"
              disabled={!selectedOption || submitted}
              onClick={() => {
                setSubmitted(true);
              }}
              className="dedco-btn dedco-btn-primary w-full mt-4"
            >
              {submitted ? (
                <>
                  <CheckCircle2 size={16} /> Demande envoyée
                </>
              ) : (
                "Confirmer mon choix"
              )}
            </button>
            {submitted && (
              <p className="text-xs text-center text-[var(--forest)] mt-2">
                Votre demande de résolution a été transmise à l'équipe Dedco. Vous serez notifié sous 48h.
              </p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Image Modal */}
      {imageModal && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setImageModal(null)}
        >
          <motion.img
            src={imageModal}
            alt="Photo agrandie"
            className="max-w-full max-h-[85vh] rounded-xl object-contain"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          />
        </motion.div>
      )}
    </div>
  );
}

// ============================================================
// DetailRow helper
// ============================================================

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="text-ink-mute">{icon}</div>
      <p className="text-xs text-ink-mute w-28 flex-shrink-0">{label}</p>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}
