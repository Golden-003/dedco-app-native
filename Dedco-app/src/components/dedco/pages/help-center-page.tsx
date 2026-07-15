"use client";

import { motion } from "framer-motion";
import { HelpCircle, MessageSquare, BookOpen, ShieldCheck, ChevronRight, Search } from "lucide-react";
import { useDedcoStore } from "@/lib/store";

const FAQ = [
  { q: "Comment fonctionne le paiement sécurisé ?", a: "Dedco utilise Mobile Money. Votre paiement est bloqué jusqu'à confirmation de réception. L'artisan est payé uniquement après votre validation." },
  { q: "Quels sont les délais de livraison ?", a: "Les délais varient selon le produit (artisanal = 7-21 jours). Chaque commande est tracée en 3 étapes : fabrication, expédition, livraison." },
  { q: "Comment devenir artisan sur Dedco ?", a: "Inscrivez-vous avec le rôle Artisan, complétez votre profil, soumettez vos documents KYC. Notre équipe valide en 48-72h." },
  { q: "Que faire en cas de litige ?", a: "Ouvrez un litige depuis votre commande. Notre équipe médie entre vous et l'artisan. Le Mobile Money protège votre paiement pendant la résolution." },
  { q: "Comment fonctionne le service Designer ?", a: "Créez un brief gratuit décrivant votre projet. Les designers vous envoient des propositions. Paiement via Mobile Money, livrables PDF." },
  { q: "Qu'est-ce que les niveaux N1-N4 ?", a: "Ce sont les niveaux de confiance des artisans. N1 = nouveau vérifié, N4 = maître artisan avec 50+ avis et 98% de confiance." },
];

const HELP_CATEGORIES = [
  { label: "Commandes & Livraison", icon: <BookOpen size={20} />, count: 8 },
  { label: "Paiement & Remboursement", icon: <ShieldCheck size={20} />, count: 6 },
  { label: "Compte & Profil", icon: <HelpCircle size={20} />, count: 5 },
  { label: "Artisans", icon: <MessageSquare size={20} />, count: 7 },
];

export function HelpCenterPage() {
  const navigate = useDedcoStore((s) => s.navigate);
  const goBack = useDedcoStore((s) => s.goBack);

  return (
    <div className="dedco-fade-in max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <button
        onClick={goBack}
        className="text-sm text-[var(--text-3)] hover:text-[var(--amber)] transition-colors mb-4 inline-flex items-center gap-1 cursor-pointer"
      >
        ← Retour
      </button>

      <div className="text-center mb-8">
        <h1 className="display-xl mb-2">Centre d&apos;aide</h1>
        <p className="text-sm text-[var(--text-3)] max-w-lg mx-auto">
          Trouvez des réponses aux questions les plus fréquentes sur Dedco.
        </p>
      </div>

      {/* Search */}
      <div className="max-w-lg mx-auto mb-8">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-3)]" />
          <input
            type="text"
            placeholder="Rechercher dans l'aide..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-[var(--border)] bg-card text-sm focus:outline-none focus:border-[var(--amber)] transition-colors"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {HELP_CATEGORIES.map((cat, i) => (
          <motion.div
            key={cat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="dedco-card p-4 flex flex-col items-center text-center cursor-pointer hover:border-[var(--amber)] transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-[var(--amber-pale)] text-[var(--amber)] flex items-center justify-center mb-3">
              {cat.icon}
            </div>
            <p className="text-sm font-semibold text-[var(--text-1)]">{cat.label}</p>
            <p className="text-xs text-[var(--text-3)] mt-0.5">{cat.count} articles</p>
          </motion.div>
        ))}
      </div>

      {/* FAQ */}
      <div className="dedco-card p-5 sm:p-6">
        <h2 className="font-display font-bold text-lg mb-4">Questions fréquentes</h2>
        <div className="space-y-3">
          {FAQ.map((item, i) => (
            <motion.details
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.04 }}
              className="group border-b border-[var(--border)] last:border-0 pb-3"
            >
              <summary className="flex items-center justify-between cursor-pointer py-2 text-sm font-medium text-[var(--text-1)] hover:text-[var(--amber)] transition-colors list-none">
                {item.q}
                <ChevronRight size={16} className="text-[var(--text-3)] group-open:rotate-90 transition-transform" />
              </summary>
              <p className="text-sm text-[var(--text-2)] leading-relaxed pb-2 pl-0">
                {item.a}
              </p>
            </motion.details>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="mt-6 dedco-card p-5 sm:p-6 text-center">
        <p className="text-sm text-[var(--text-2)] mb-3">Vous ne trouvez pas votre réponse ?</p>
        <button
          onClick={() => navigate({ page: "messages" })}
          className="dedco-btn dedco-btn-primary"
        >
          <MessageSquare size={16} />
          Contacter le support
        </button>
      </div>
    </div>
  );
}
