"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useDedcoStore } from "@/lib/store";
import { getDesigner, formatFCFA } from "@/lib/dedco-data-expanded";
import {
  ArrowLeft,
  Camera,
  Edit3,
  MapPin,
  Save,
  Star,
  Trash2,
  Upload,
} from "lucide-react";

// ============================================================
// Animation variants
// ============================================================

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

// ============================================================
// Portfolio placeholder images
// ============================================================

const PORTFOLIO_IMAGES = [
  "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=600&q=85",
  "https://images.unsplash.com/photo-1617364852223-75f57e78dc96?auto=format&fit=crop&w=600&q=85",
  "https://images.unsplash.com/photo-1655276602527-ca7c0c44d6de?auto=format&fit=crop&w=600&q=85",
  "https://images.unsplash.com/photo-1604264726154-26480e76f4e1?auto=format&fit=crop&w=600&q=85",
  "https://images.unsplash.com/photo-1656403002413-2ac6137237d6?auto=format&fit=crop&w=600&q=85",
  "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=85",
];

// ============================================================
// DesignerProfilePage
// ============================================================

export function DesignerProfilePage() {
  const navigate = useDedcoStore((s) => s.navigate);
  const designer = getDesigner(1); // Ndèye Sarr

  const [name, setName] = useState(designer?.name ?? "Ndèye Sarr");
  const [specialty, setSpecialty] = useState(
    designer?.specialty ?? "Design d'intérieur contemporain-africain"
  );
  const [city, setCity] = useState(designer?.city ?? "Cotonou");
  const [hourlyRate, setHourlyRate] = useState(
    String(designer?.hourlyRate ?? 25000)
  );
  const [bio, setBio] = useState(
    designer?.bio ??
      "Designer diplômée de l'École de Design de Nantes, Ndèye crée des intérieurs qui fusionnent modernité et héritage africain."
  );
  const [style, setStyle] = useState(
    designer?.style ?? "Afro-contemporain minimaliste"
  );
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
      <motion.div variants={stagger} initial="initial" animate="animate">
        {/* ── Header ── */}
        <motion.div variants={fadeUp} className="mb-6">
          <button
            className="dedco-btn dedco-btn-ghost dedco-btn-sm mb-3"
            onClick={() => navigate({ page: "designer-dashboard" })}
          >
            <ArrowLeft size={14} />
            Retour
          </button>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[var(--text-1)]">
            Mon profil
          </h1>
          <p className="text-[var(--text-2)] text-sm mt-1">
            Gérez vos informations publiques
          </p>
        </motion.div>

        {/* ── Avatar & Quick Info ── */}
        <motion.div variants={fadeUp} className="dedco-card p-5 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-[var(--border)]">
                <img
                  src={designer?.avatar}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera size={20} className="text-white" />
              </button>
            </div>

            {/* Quick info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-display text-xl font-semibold text-[var(--text-1)]">
                  {name}
                </h2>
                <Edit3 size={14} className="text-[var(--text-3)]" />
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--text-2)] mb-2">
                <MapPin size={14} />
                <span>{city}, Bénin</span>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-[var(--amber)]" />
                  <span className="font-numeric text-sm font-medium text-[var(--text-1)]">
                    {designer?.rating ?? 4.9}
                  </span>
                  <span className="text-xs text-[var(--text-3)]">
                    ({designer?.reviews ?? 34} avis)
                  </span>
                </div>
                <span className="dedco-badge dedco-badge-amber">
                  {style}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Editable Fields ── */}
        <motion.div variants={fadeUp} className="dedco-card p-5 sm:p-6 mb-6">
          <h2 className="font-display text-lg font-semibold text-[var(--text-1)] mb-5">
            Informations
          </h2>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-1)] mb-1.5">
                Nom complet
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg-card)] text-[var(--text-1)] focus:outline-none focus:ring-2 focus:ring-[var(--amber)] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-1)] mb-1.5">
                Spécialité
              </label>
              <input
                type="text"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg-card)] text-[var(--text-1)] focus:outline-none focus:ring-2 focus:ring-[var(--amber)] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-1)] mb-1.5">
                Ville
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg-card)] text-[var(--text-1)] focus:outline-none focus:ring-2 focus:ring-[var(--amber)] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-1)] mb-1.5">
                Tarif horaire (FCFA)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg-card)] text-[var(--text-1)] focus:outline-none focus:ring-2 focus:ring-[var(--amber)] focus:border-transparent font-numeric"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-3)]">
                  FCFA/h
                </span>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[var(--text-1)] mb-1.5">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg-card)] text-[var(--text-1)] focus:outline-none focus:ring-2 focus:ring-[var(--amber)] focus:border-transparent resize-none"
            />
          </div>

          {/* Style */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-1)] mb-1.5">
              Description de votre style
            </label>
            <textarea
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              rows={2}
              className="w-full px-4 py-2.5 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg-card)] text-[var(--text-1)] focus:outline-none focus:ring-2 focus:ring-[var(--amber)] focus:border-transparent resize-none"
            />
          </div>
        </motion.div>

        {/* ── Portfolio Gallery ── */}
        <motion.div variants={fadeUp} className="dedco-card p-5 sm:p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-semibold text-[var(--text-1)]">
              Portfolio
            </h2>
            <button className="dedco-btn dedco-btn-secondary dedco-btn-sm">
              <Upload size={14} />
              Ajouter
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {PORTFOLIO_IMAGES.map((img, idx) => (
              <div
                key={idx}
                className="relative group aspect-[4/3] rounded-lg overflow-hidden border border-[var(--border)]"
              >
                <img
                  src={img}
                  alt={`Portfolio ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-white/90 rounded-full">
                    <Trash2 size={14} className="text-[var(--terracotta)]" />
                  </button>
                </div>
              </div>
            ))}
            {/* Add new placeholder */}
            <button className="aspect-[4/3] rounded-lg border-2 border-dashed border-[var(--border)] flex flex-col items-center justify-center gap-2 text-[var(--text-3)] hover:border-[var(--amber)] hover:text-[var(--amber)] transition-colors cursor-pointer">
              <Upload size={20} />
              <span className="text-xs">Ajouter</span>
            </button>
          </div>
        </motion.div>

        {/* ── Save Button ── */}
        <motion.div variants={fadeUp} className="flex justify-end">
          <button
            className={`dedco-btn w-full sm:w-auto justify-center ${
              saved
                ? "dedco-btn-forest"
                : "dedco-btn-primary"
            }`}
            onClick={handleSave}
          >
            {saved ? (
              <>
                <Star size={16} />
                Enregistré !
              </>
            ) : (
              <>
                <Save size={16} />
                Enregistrer
              </>
            )}
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
