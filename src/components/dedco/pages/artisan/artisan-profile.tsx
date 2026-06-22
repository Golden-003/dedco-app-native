"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  MapPin,
  Award,
  Shield,
  Upload,
  Plus,
  X,
  Check,
  User,
  Briefcase,
} from "lucide-react";
import { useDedcoStore } from "@/lib/store";
import { ARTISANS } from "@/lib/dedco-data-expanded";

const container = {
  animate: { transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export function ArtisanProfilePage() {
  const navigate = useDedcoStore((s) => s.navigate);
  const artisan = ARTISANS.find((a) => a.id === 1)!;

  const [form, setForm] = useState({
    name: artisan.name,
    specialty: artisan.specialty,
    city: artisan.city,
    bio: artisan.bio,
  });
  const [saved, setSaved] = useState(false);

  const levelLabel = {
    N1: "N1 — Apprenti",
    N2: "N2 — Artisan",
    N3: "N3 — Expert",
    N4: "N4 — Maître",
  }[artisan.level];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <motion.section
      variants={container}
      initial="initial"
      animate="animate"
      className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10"
    >
      {/* ── Header ── */}
      <motion.div variants={fadeUp}>
        <button
          type="button"
          onClick={() => navigate({ page: "artisan-dashboard" })}
          className="text-sm text-[var(--text-3)] hover:text-[var(--amber)] transition-colors mb-1 inline-flex items-center gap-1"
        >
          ← Tableau de bord
        </button>
        <h1 className="display-lg font-bold text-[var(--text-1)]">
          Mon Profil
        </h1>
        <p className="text-sm text-[var(--text-3)] mt-1">
          Gérez vos informations publiques et votre portfolio
        </p>
      </motion.div>

      {/* ── Avatar Section ── */}
      <motion.div variants={fadeUp} className="mt-6">
        <div className="dedco-card p-6">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative group">
              <img
                src={artisan.avatar}
                alt={artisan.name}
                className="w-24 h-24 rounded-full object-cover border-2 border-[var(--amber)]"
              />
              <button
                type="button"
                className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera size={20} className="text-white" />
              </button>
            </div>
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <Award className="text-[var(--amber)]" size={18} />
                <span className="text-sm font-semibold text-[var(--amber)]">
                  {levelLabel}
                </span>
              </div>
              <div className="flex items-center gap-2 justify-center sm:justify-start mt-1.5">
                <Shield className="text-[var(--forest)]" size={14} />
                <span className="text-sm text-[var(--text-2)]">
                  Score de confiance : {artisan.trust}%
                </span>
              </div>
              <div className="mt-2.5">
                <button
                  type="button"
                  className="dedco-btn dedco-btn-ghost dedco-btn-sm"
                >
                  <Upload size={14} />
                  Changer la photo
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Form ── */}
      <motion.div variants={fadeUp} className="mt-4">
        <div className="dedco-card p-6">
          <h2 className="display-sm font-semibold text-[var(--text-1)] mb-5">
            Informations personnelles
          </h2>
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-2)] mb-1.5">
                <User size={14} className="inline mr-1.5 -mt-0.5" />
                Nom complet
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-[var(--border)] bg-white focus:outline-none focus:border-[var(--amber)] focus:ring-1 focus:ring-[var(--amber)]/30"
              />
            </div>

            {/* Specialty */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-2)] mb-1.5">
                <Briefcase size={14} className="inline mr-1.5 -mt-0.5" />
                Spécialité
              </label>
              <input
                type="text"
                value={form.specialty}
                onChange={(e) => updateField("specialty", e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-[var(--border)] bg-white focus:outline-none focus:border-[var(--amber)] focus:ring-1 focus:ring-[var(--amber)]/30"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-2)] mb-1.5">
                <MapPin size={14} className="inline mr-1.5 -mt-0.5" />
                Ville
              </label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-[var(--border)] bg-white focus:outline-none focus:border-[var(--amber)] focus:ring-1 focus:ring-[var(--amber)]/30"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-2)] mb-1.5">
                Biographie
              </label>
              <textarea
                rows={4}
                value={form.bio}
                onChange={(e) => updateField("bio", e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-[var(--border)] bg-white resize-y focus:outline-none focus:border-[var(--amber)] focus:ring-1 focus:ring-[var(--amber)]/30"
              />
              <p className="text-xs text-[var(--text-3)] mt-1">
                {form.bio.length} caractères
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Portfolio ── */}
      <motion.div variants={fadeUp} className="mt-4">
        <div className="dedco-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="display-sm font-semibold text-[var(--text-1)]">
              Portfolio
            </h2>
            <button
              type="button"
              className="dedco-btn dedco-btn-ghost dedco-btn-sm"
            >
              <Plus size={14} />
              Ajouter
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {artisan.portfolio.map((img, i) => (
              <div
                key={i}
                className="relative group aspect-square rounded-lg overflow-hidden bg-[var(--bg-warm)]"
              >
                <img
                  src={img}
                  alt={`Portfolio ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <button
                    type="button"
                    className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 rounded-full bg-white flex items-center justify-center"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
            {/* Add new */}
            <div className="aspect-square rounded-lg border-2 border-dashed border-[var(--border)] flex flex-col items-center justify-center text-[var(--text-3)] hover:border-[var(--amber)] hover:text-[var(--amber)] transition-colors cursor-pointer">
              <Plus size={24} />
              <span className="text-xs mt-1">Ajouter</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Trust Score ── */}
      <motion.div variants={fadeUp} className="mt-4">
        <div className="dedco-card p-6">
          <h2 className="display-sm font-semibold text-[var(--text-1)] mb-4">
            Score de confiance
          </h2>
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 flex-shrink-0">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="var(--bg-warm)"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="var(--forest)"
                  strokeWidth="3"
                  strokeDasharray={`${artisan.trust}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-numeric text-sm font-bold text-[var(--forest)]">
                {artisan.trust}%
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text-1)]">
                Excellent
              </p>
              <p className="text-xs text-[var(--text-3)] mt-0.5">
                Basé sur {artisan.reviews} avis clients et 12 ans d'expérience
              </p>
              <div className="flex items-center gap-1 mt-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`star ${i < Math.round(artisan.rating) ? "" : "empty"}`}
                  >
                    ★
                  </span>
                ))}
                <span className="font-numeric text-xs text-[var(--text-2)] ml-1">
                  {artisan.rating}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Save Button ── */}
      <motion.div variants={fadeUp} className="mt-6 mb-10">
        <button
          type="button"
          onClick={handleSave}
          className={`dedco-btn dedco-btn-primary dedco-btn-lg w-full sm:w-auto px-10 transition-all ${
            saved
              ? "bg-[var(--forest)] !border-[var(--forest)]"
              : ""
          }`}
        >
          {saved ? (
            <>
              <Check size={18} />
              Modifications enregistrées !
            </>
          ) : (
            "Enregistrer les modifications"
          )}
        </button>
      </motion.div>
    </motion.section>
  );
}
