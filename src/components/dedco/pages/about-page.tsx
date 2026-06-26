"use client";

import { motion } from "framer-motion";
import { Heart, ShieldCheck, Users, Globe, Award, Truck, ArrowRight } from "lucide-react";
import { useDedcoStore } from "@/lib/store";

const VALUES = [
  { icon: <ShieldCheck size={24} />, title: "Confiance & Sécurité", desc: "Paiement séquestré via Fedapay. Votre argent est protégé jusqu'à satisfaction." },
  { icon: <Users size={24} />, title: "Artisans Vérifiés", desc: "Chaque artisan passe par un processus KYC rigoureux. Niveaux N1 à N4." },
  { icon: <Heart size={24} />, title: "Fait main au Bénin", desc: "Chaque produit est fabriqué à la main par des artisans béninois qualifiés." },
  { icon: <Globe size={24} />, title: "Rayonnement africain", desc: "Promouvoir l'artisanat béninois et l'afro-design à l'international." },
];

const TEAM = [
  { name: "Sènna Dossou", role: "Fondatrice & CEO", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&crop=faces&w=200&q=85" },
  { name: "Kofi Ahouandjinou", role: "CTO", avatar: "https://images.unsplash.com/photo-1614023342667-6f060e9d1e04?auto=format&fit=crop&crop=faces&w=200&q=85" },
  { name: "Aminata Zannou", role: "Head of Design", avatar: "https://images.unsplash.com/photo-1509099863731-ef4bff19e808?auto=format&fit=crop&crop=faces&w=200&q=85" },
];

const STATS = [
  { value: "180+", label: "Artisans vérifiés" },
  { value: "2 400+", label: "Clients satisfaits" },
  { value: "4.8/5", label: "Note moyenne" },
  { value: "98%", label: "Taux de confiance" },
];

export function AboutPage() {
  const navigate = useDedcoStore((s) => s.navigate);
  const goBack = useDedcoStore((s) => s.goBack);

  return (
    <div className="dedco-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[var(--text-1)]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center text-white">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              À propos de <span className="text-[var(--amber)]">Dedco</span>
            </h1>
            <p className="text-base sm:text-lg opacity-90 max-w-2xl mx-auto leading-relaxed">
              La marketplace béninoise qui connecte artisans talentueux, designers d&apos;espace
              et passionnés de décoration d&apos;intérieur. Chaque pièce raconte une histoire.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="dedco-card p-4 text-center"
            >
              <p className="font-display text-2xl font-bold text-[var(--amber)] font-numeric">{stat.value}</p>
              <p className="text-xs text-[var(--text-3)] mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="display-lg mb-4">Notre mission</h2>
          <div className="space-y-4 text-sm text-[var(--text-2)] leading-relaxed max-w-3xl">
            <p>
              Dedco est née d&apos;un constat simple : les artisans béninois créent des pièces d&apos;exception
              mais manquent d&apos;une vitrine digitale pour les proposer au monde. Notre mission est de
              créer ce pont entre l&apos;artisanat traditionnel africain et les clients du monde entier.
            </p>
            <p>
              Nous croyons que chaque objet fabriqué à la main porte une valeur unique. Grâce à notre
              système de paiement séquestré Fedapay, nous garantissons une transaction sécurisée pour
              les acheteurs comme pour les artisans. Les niveaux de confiance N1-N4 assurent la
              transparence et la qualité.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Values */}
      <section className="py-12" style={{ background: "var(--bg-warm)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="display-lg mb-6 text-center">Nos valeurs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {VALUES.map((val, i) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.06 }}
                className="dedco-card p-5"
              >
                <div className="w-10 h-10 rounded-lg bg-[var(--amber-pale)] text-[var(--amber)] flex items-center justify-center mb-3">
                  {val.icon}
                </div>
                <h3 className="font-display font-bold text-base mb-2">{val.title}</h3>
                <p className="text-sm text-[var(--text-2)] leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="display-lg mb-6 text-center">L&apos;équipe</h2>
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
          {TEAM.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              className="text-center"
            >
              <img
                src={member.avatar}
                alt={member.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover mx-auto mb-3 border-2 border-[var(--amber-pale)]"
              />
              <p className="font-semibold text-sm text-[var(--text-1)]">{member.name}</p>
              <p className="text-xs text-[var(--text-3)]">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 text-center">
        <div className="dedco-card p-8 sm:p-10">
          <h2 className="display-lg mb-3">Rejoignez Dedco</h2>
          <p className="text-sm text-[var(--text-2)] mb-6 max-w-md mx-auto">
            Que vous soyez artisan, designer ou passionné de déco, Dedco a sa place pour vous.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigate({ page: "register" })}
              className="dedco-btn dedco-btn-primary"
            >
              Créer un compte <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate({ page: "become-artisan" })}
              className="dedco-btn dedco-btn-ghost"
            >
              Devenir artisan
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
