"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useDedcoStore } from "@/lib/store";
import {
  ArrowLeft,
  Bell,
  Calendar,
  CreditCard,
  Eye,
  EyeOff,
  Lock,
  Mail,
  MessageSquare,
  Phone,
  Save,
  Smartphone,
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
// Toggle switch component
// ============================================================

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--amber)] ${
        checked ? "bg-[var(--amber)]" : "bg-[var(--border-dark)]"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition-transform duration-150 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

// ============================================================
// Schedule data
// ============================================================

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const DEFAULT_SCHEDULE: Record<string, string> = {
  Lun: "09:00 – 18:00",
  Mar: "09:00 – 18:00",
  Mer: "09:00 – 18:00",
  Jeu: "09:00 – 18:00",
  Ven: "09:00 – 18:00",
  Sam: "10:00 – 14:00",
  Dim: "Indisponible",
};

// ============================================================
// DesignerSettingsPage
// ============================================================

export function DesignerSettingsPage() {
  const navigate = useDedcoStore((s) => s.navigate);

  // Notifications state
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSMS, setNotifSMS] = useState(false);
  const [notifPush, setNotifPush] = useState(true);

  // Payment state
  const [iban, setIban] = useState("BJ06 B002 0100 1001 0140 0005 582");
  const [withdrawalSchedule, setWithdrawalSchedule] = useState("Mensuel");

  // Availability state
  const [schedule, setSchedule] = useState<Record<string, string>>(
    DEFAULT_SCHEDULE
  );

  // Privacy state
  const [publicProfile, setPublicProfile] = useState(true);

  // Saved state
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const updateScheduleDay = (day: string, value: string) => {
    setSchedule((prev) => ({ ...prev, [day]: value }));
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
            Paramètres
          </h1>
          <p className="text-[var(--text-2)] text-sm mt-1">
            Gérez vos préférences et paramètres de compte
          </p>
        </motion.div>

        {/* ── Notifications ── */}
        <motion.div variants={fadeUp} className="dedco-card p-5 sm:p-6 mb-6">
          <h2 className="font-display text-lg font-semibold text-[var(--text-1)] mb-1 flex items-center gap-2">
            <Bell size={18} />
            Notifications
          </h2>
          <p className="text-sm text-[var(--text-3)] mb-5">
            Choisissez comment vous souhaitez être notifié
          </p>

          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[var(--amber-pale)] flex items-center justify-center">
                  <Mail size={16} className="text-[var(--amber-dark)]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text-1)]">
                    Email
                  </p>
                  <p className="text-xs text-[var(--text-3)]">
                    Nouveaux briefs, messages, mises à jour de projets
                  </p>
                </div>
              </div>
              <ToggleSwitch checked={notifEmail} onChange={setNotifEmail} />
            </div>

            {/* SMS */}
            <div className="flex items-center justify-between py-2 border-t border-[var(--border)]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[var(--forest-pale)] flex items-center justify-center">
                  <Phone size={16} className="text-[var(--forest)]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text-1)]">SMS</p>
                  <p className="text-xs text-[var(--text-3)]">
                    Rappels urgents uniquement
                  </p>
                </div>
              </div>
              <ToggleSwitch checked={notifSMS} onChange={setNotifSMS} />
            </div>

            {/* Push */}
            <div className="flex items-center justify-between py-2 border-t border-[var(--border)]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[var(--terracotta-pale)] flex items-center justify-center">
                  <Smartphone
                    size={16}
                    className="text-[var(--terracotta)]"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text-1)]">
                    Notifications push
                  </p>
                  <p className="text-xs text-[var(--text-3)]">
                    En temps réel sur votre appareil
                  </p>
                </div>
              </div>
              <ToggleSwitch checked={notifPush} onChange={setNotifPush} />
            </div>
          </div>
        </motion.div>

        {/* ── Paiement ── */}
        <motion.div variants={fadeUp} className="dedco-card p-5 sm:p-6 mb-6">
          <h2 className="font-display text-lg font-semibold text-[var(--text-1)] mb-1 flex items-center gap-2">
            <CreditCard size={18} />
            Paiement
          </h2>
          <p className="text-sm text-[var(--text-3)] mb-5">
            Informations de paiement et retraits
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-[var(--text-1)] mb-1.5">
                IBAN / Numéro de compte
              </label>
              <input
                type="text"
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg-card)] text-[var(--text-1)] focus:outline-none focus:ring-2 focus:ring-[var(--amber)] focus:border-transparent font-numeric"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-[var(--text-1)] mb-1.5">
                Calendrier de retrait
              </label>
              <select
                value={withdrawalSchedule}
                onChange={(e) => setWithdrawalSchedule(e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg-card)] text-[var(--text-1)] focus:outline-none focus:ring-2 focus:ring-[var(--amber)] focus:border-transparent appearance-none cursor-pointer"
              >
                <option value="Hebdomadaire">Hebdomadaire</option>
                <option value="Mensuel">Mensuel</option>
                <option value="Manuel">Manuel (sur demande)</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* ── Disponibilité ── */}
        <motion.div variants={fadeUp} className="dedco-card p-5 sm:p-6 mb-6">
          <h2 className="font-display text-lg font-semibold text-[var(--text-1)] mb-1 flex items-center gap-2">
            <Calendar size={18} />
            Disponibilité
          </h2>
          <p className="text-sm text-[var(--text-3)] mb-5">
            Définissez vos créneaux de disponibilité
          </p>

          <div className="space-y-3">
            {DAYS.map((day, idx) => (
              <div
                key={day}
                className={`flex items-center gap-3 py-2 ${
                  idx > 0 ? "border-t border-[var(--border)]" : ""
                }`}
              >
                <span className="w-8 text-sm font-medium text-[var(--text-1)]">
                  {day}
                </span>
                <input
                  type="text"
                  value={schedule[day]}
                  onChange={(e) => updateScheduleDay(day, e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg-card)] text-[var(--text-1)] focus:outline-none focus:ring-2 focus:ring-[var(--amber)] focus:border-transparent font-numeric"
                />
                {schedule[day] === "Indisponible" && (
                  <span className="dedco-badge dedco-badge-gray text-xs">
                    Repos
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Confidentialité ── */}
        <motion.div variants={fadeUp} className="dedco-card p-5 sm:p-6 mb-6">
          <h2 className="font-display text-lg font-semibold text-[var(--text-1)] mb-1 flex items-center gap-2">
            <Lock size={18} />
            Confidentialité
          </h2>
          <p className="text-sm text-[var(--text-3)] mb-5">
            Contrôlez la visibilité de votre profil
          </p>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[var(--amber-pale)] flex items-center justify-center">
                {publicProfile ? (
                  <Eye size={16} className="text-[var(--amber-dark)]" />
                ) : (
                  <EyeOff size={16} className="text-[var(--amber-dark)]" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--text-1)]">
                  Profil public
                </p>
                <p className="text-xs text-[var(--text-3)]">
                  {publicProfile
                    ? "Votre profil est visible par les clients"
                    : "Votre profil est masqué des clients"}
                </p>
              </div>
            </div>
            <ToggleSwitch
              checked={publicProfile}
              onChange={setPublicProfile}
            />
          </div>
        </motion.div>

        {/* ── Save Button ── */}
        <motion.div variants={fadeUp} className="flex justify-end">
          <button
            className={`dedco-btn w-full sm:w-auto justify-center ${
              saved ? "dedco-btn-forest" : "dedco-btn-primary"
            }`}
            onClick={handleSave}
          >
            {saved ? (
              <>
                <MessageSquare size={16} />
                Sauvegardé !
              </>
            ) : (
              <>
                <Save size={16} />
                Sauvegarder
              </>
            )}
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
