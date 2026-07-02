"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useDedcoStore } from "@/lib/store";
import { Mail, Lock, Eye, EyeOff, Shield, Wrench, Palette, Briefcase, ChevronRight, Home } from "lucide-react";

const DEMO_ROLES = [
  { page: "profile" as const, label: "Client", desc: "Espace personnel", icon: <Home size={20} />, color: "var(--text-1)", bg: "var(--bg-warm)" },
  { page: "admin-dashboard" as const, label: "Admin", desc: "Gestion plateforme", icon: <Shield size={20} />, color: "var(--terracotta)", bg: "var(--terracotta-pale)" },
  { page: "artisan-dashboard" as const, label: "Artisan", desc: "Espace vendeur", icon: <Wrench size={20} />, color: "var(--forest)", bg: "var(--forest-pale)" },
  { page: "designer-dashboard" as const, label: "Designer", desc: "Espace créatif", icon: <Palette size={20} />, color: "var(--amber-dark)", bg: "var(--amber-pale)" },
  { page: "maison-dashboard" as const, label: "Maison déco", desc: "Marque boutique", icon: <Briefcase size={20} />, color: "var(--text-1)", bg: "var(--bg-warm)" },
];

export function LoginPage() {
  const navigate = useDedcoStore((s) => s.navigate);
  const login = useDedcoStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  // Connecte en tant que client (rôle par défaut pour login classique)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      login({
        role: "client",
        name: email.split("@")[0] || "Client Dedco",
        email: email || "client@dedco.bj",
        avatar: "https://images.unsplash.com/photo-1614317226704-aba58b1ce153?auto=format&fit=crop&crop=faces&w=120&q=80",
      });
      navigate({ page: "home" });
    }, 1000);
  };

  // Connecte en tant que rôle démo (depuis le sélecteur "Accéder aux tableaux de bord")
  const handleDemoLogin = (page: typeof DEMO_ROLES[number]["page"]) => {
    const role = DEMO_ROLES.find((r) => r.page === page);
    if (!role) return;

    // Map page → UserRole
    const roleMap: Record<string, "client" | "admin" | "artisan" | "designer" | "maison"> = {
      "profile": "client",
      "admin-dashboard": "admin",
      "artisan-dashboard": "artisan",
      "designer-dashboard": "designer",
      "maison-dashboard": "maison",
    };
    const userRole = roleMap[page] || "client";

    // Mock user selon le rôle
    const mockUsers = {
      client: {
        name: "Sophie Kossou",
        email: "sophie.kossou@email.bj",
        avatar: "https://images.unsplash.com/photo-1614317226704-aba58b1ce153?auto=format&fit=crop&crop=faces&w=120&q=80",
      },
      admin: {
        name: "Admin Dedco",
        email: "admin@dedco.bj",
        avatar: "https://images.unsplash.com/photo-1616805765352-beedbad46b2a?auto=format&fit=crop&crop=faces&w=120&q=80",
      },
      artisan: {
        name: "Kofi Akindélé",
        email: "kofi@akindele-wood.bj",
        avatar: "https://images.unsplash.com/photo-1614023342667-6f060e9d1e04?auto=format&fit=crop&crop=faces&w=120&q=80",
      },
      designer: {
        name: "Ndèye Sarr",
        email: "ndeye@sarr-design.bj",
        avatar: "https://images.unsplash.com/photo-1729355796906-10a9809e0864?auto=format&fit=crop&crop=faces&w=120&q=80",
      },
      maison: {
        name: "Atelier Bohème",
        email: "contact@atelier-boheme.bj",
        avatar: "https://images.unsplash.com/photo-1533674689012-136b487b7736?auto=format&fit=crop&crop=faces&w=120&q=80",
      },
    };

    login({
      role: userRole,
      ...mockUsers[userRole],
    });
    navigate({ page });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="dedco-card p-8 md:p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <button
              onClick={() => navigate({ page: "home" })}
              className="inline-block cursor-pointer"
            >
              <span className="font-display text-3xl font-bold" style={{ color: "var(--terracotta)" }}>
                Dedco
              </span>
              <span className="font-display text-3xl font-bold" style={{ color: "var(--amber)" }}>
                .
              </span>
            </button>
            <p className="mt-2 text-sm" style={{ color: "var(--text-2)" }}>
              Connectez-vous à votre compte
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-1)" }}>
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2" size={18} style={{ color: "var(--text-3)" }} />
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-md border focus:outline-none focus:ring-2 transition-all"
                  style={{ background: "var(--bg-cream)", borderColor: "var(--border)", color: "var(--text-1)" }}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-1)" }}>
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2" size={18} style={{ color: "var(--text-3)" }} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 text-sm rounded-md border focus:outline-none focus:ring-2 transition-all"
                  style={{ background: "var(--bg-cream)", borderColor: "var(--border)", color: "var(--text-1)" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 cursor-pointer"
                  style={{ color: "var(--text-3)" }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={() => navigate({ page: "forgot-password" })}
                className="text-sm font-medium cursor-pointer hover:underline"
                style={{ color: "var(--amber)" }}
              >
                Mot de passe oublié?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="dedco-btn dedco-btn-primary dedco-btn-lg w-full"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Connexion...
                </span>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
            <span className="text-xs font-medium" style={{ color: "var(--text-3)" }}>
              Prototype — Accès rapide
            </span>
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
          </div>

          {/* Demo Role Switcher */}
          <div>
            <button
              type="button"
              onClick={() => setShowDemo(!showDemo)}
              className="w-full text-center text-sm font-medium cursor-pointer flex items-center justify-center gap-1"
              style={{ color: "var(--amber)" }}
            >
              Accéder aux tableaux de bord
              <ChevronRight size={14} className={`transition-transform ${showDemo ? "rotate-90" : ""}`} />
            </button>

            {showDemo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="grid grid-cols-2 gap-2 mt-3"
              >
                {DEMO_ROLES.map((role) => (
                  <button
                    key={role.page}
                    type="button"
                    onClick={() => handleDemoLogin(role.page)}
                    className="p-3 rounded-lg border-2 text-left transition-all cursor-pointer hover:shadow-sm"
                    style={{
                      borderColor: role.color,
                      background: `${String(role.bg)}30`,
                    }}
                  >
                    <div className="mb-1.5" style={{ color: role.color }}>{role.icon}</div>
                    <p className="font-semibold text-xs" style={{ color: "var(--text-1)" }}>{role.label}</p>
                    <p className="text-[10px]" style={{ color: "var(--text-3)" }}>{role.desc}</p>
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Mobile Money mention */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full" style={{ background: "var(--bg-warm)", color: "var(--text-3)" }}>
              Paiements sécurisés via Mobile Money
            </div>
          </div>
        </div>

        {/* Register link */}
        <p className="text-center mt-6 text-sm" style={{ color: "var(--text-2)" }}>
          Pas de compte?{" "}
          <button
            onClick={() => navigate({ page: "register" })}
            className="font-semibold cursor-pointer hover:underline"
            style={{ color: "var(--amber)" }}
          >
            Créer un compte
          </button>
        </p>
      </motion.div>
    </div>
  );
}
