"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Eye,
  Ban,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import { AdminLayout } from "./admin-layout";

// ── Mock users ──
type UserRole = "client" | "artisan" | "designer" | "admin";
type UserStatus = "actif" | "suspendu" | "en_attente";

interface MockUser {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  status: UserStatus;
  city: string;
  joined: string;
  kycVerified: boolean;
}

const USERS: MockUser[] = [
  {
    id: 1,
    name: "Aminata Zannou",
    email: "aminata.zannou@email.bj",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&crop=faces&w=100&q=80",
    role: "client",
    status: "actif",
    city: "Cotonou",
    joined: "2024-01-15",
    kycVerified: true,
  },
  {
    id: 2,
    name: "Kofi Akindélé",
    email: "kofi.akindele@email.bj",
    avatar: "https://images.unsplash.com/photo-1614023342667-6f060e9d1e04?auto=format&fit=crop&crop=faces&w=100&q=80",
    role: "artisan",
    status: "actif",
    city: "Cotonou",
    joined: "2023-11-20",
    kycVerified: true,
  },
  {
    id: 3,
    name: "Rachida Bello",
    email: "rachida.bello@email.bj",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&crop=faces&w=100&q=80",
    role: "client",
    status: "actif",
    city: "Parakou",
    joined: "2024-02-01",
    kycVerified: true,
  },
  {
    id: 4,
    name: "Yao Agbo",
    email: "yao.agbo@email.bj",
    avatar: "https://images.unsplash.com/photo-1509099863731-ef4bff19e808?auto=format&fit=crop&crop=faces&w=100&q=80",
    role: "artisan",
    status: "en_attente",
    city: "Cotonou",
    joined: "2024-03-10",
    kycVerified: false,
  },
  {
    id: 5,
    name: "Fati Houénou",
    email: "fati.houenou@email.bj",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&crop=faces&w=100&q=80",
    role: "designer",
    status: "actif",
    city: "Porto-Novo",
    joined: "2023-09-15",
    kycVerified: true,
  },
  {
    id: 6,
    name: "Marius Dossou",
    email: "marius.dossou@email.bj",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&crop=faces&w=100&q=80",
    role: "client",
    status: "suspendu",
    city: "Abomey-Calavi",
    joined: "2023-12-05",
    kycVerified: true,
  },
  {
    id: 7,
    name: "Kossi Mensah",
    email: "kossi.mensah@email.bj",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&crop=faces&w=100&q=80",
    role: "artisan",
    status: "en_attente",
    city: "Ouidah",
    joined: "2024-03-18",
    kycVerified: false,
  },
  {
    id: 8,
    name: "Adjoua Sossou",
    email: "adjoua.sossou@email.bj",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&crop=faces&w=100&q=80",
    role: "client",
    status: "actif",
    city: "Cotonou",
    joined: "2024-01-28",
    kycVerified: true,
  },
  {
    id: 9,
    name: "Gérard Ahossi",
    email: "gerard.ahossi@email.bj",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&crop=faces&w=100&q=80",
    role: "artisan",
    status: "actif",
    city: "Parakou",
    joined: "2023-08-12",
    kycVerified: true,
  },
  {
    id: 10,
    name: "Sandrine Vignon",
    email: "sandrine.vignon@email.bj",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&crop=faces&w=100&q=80",
    role: "admin",
    status: "actif",
    city: "Cotonou",
    joined: "2023-06-01",
    kycVerified: true,
  },
];

const ROLE_BADGES: Record<UserRole, string> = {
  client: "dedco-badge-gray",
  artisan: "dedco-badge-amber",
  designer: "dedco-badge-forest",
  admin: "dedco-badge-dark",
};

const ROLE_LABELS: Record<UserRole, string> = {
  client: "Client",
  artisan: "Artisan",
  designer: "Designer",
  admin: "Admin",
};

const STATUS_LABELS: Record<UserStatus, string> = {
  actif: "Actif",
  suspendu: "Suspendu",
  en_attente: "En attente",
};

const PER_PAGE = 5;

const stagger = {
  animate: { transition: { staggerChildren: 0.04 } },
};
const fadeUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

export function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "all">("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [page, setPage] = useState(1);

  const cities = useMemo(
    () => [...new Set(USERS.map((u) => u.city))],
    []
  );

  const filtered = useMemo(() => {
    return USERS.filter((u) => {
      if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      if (statusFilter !== "all" && u.status !== statusFilter) return false;
      if (cityFilter !== "all" && u.city !== cityFilter) return false;
      return true;
    });
  }, [search, roleFilter, statusFilter, cityFilter]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <AdminLayout>
      <motion.div variants={stagger} initial="initial" animate="animate">
        <motion.div variants={fadeUp} className="mb-6">
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-[var(--text-1)]">
            Utilisateurs
          </h1>
          <p className="text-sm text-[var(--text-3)] mt-1">
            {filtered.length} utilisateur{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}
          </p>
        </motion.div>

        {/* Search + Filters */}
        <motion.div variants={fadeUp} className="dedco-card p-4 mb-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-3)]"
              />
              <input
                type="text"
                placeholder="Rechercher par nom ou email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-[var(--bg-cream)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--amber)]/30 focus:border-[var(--amber)] transition-colors"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value as UserRole | "all");
                  setPage(1);
                }}
                className="px-3 py-2.5 text-sm bg-[var(--bg-cream)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--amber)]/30 cursor-pointer"
              >
                <option value="all">Tous les rôles</option>
                <option value="client">Client</option>
                <option value="artisan">Artisan</option>
                <option value="designer">Designer</option>
                <option value="admin">Admin</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as UserStatus | "all");
                  setPage(1);
                }}
                className="px-3 py-2.5 text-sm bg-[var(--bg-cream)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--amber)]/30 cursor-pointer"
              >
                <option value="all">Tous les statuts</option>
                <option value="actif">Actif</option>
                <option value="suspendu">Suspendu</option>
                <option value="en_attente">En attente</option>
              </select>
              <select
                value={cityFilter}
                onChange={(e) => {
                  setCityFilter(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2.5 text-sm bg-[var(--bg-cream)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--amber)]/30 cursor-pointer"
              >
                <option value="all">Toutes les villes</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Table */}
        <motion.div variants={fadeUp} className="dedco-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg-cream)]">
                  <th className="text-left px-4 py-3 font-medium text-[var(--text-3)] text-xs uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--text-3)] text-xs uppercase tracking-wider hidden md:table-cell">
                    Email
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--text-3)] text-xs uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--text-3)] text-xs uppercase tracking-wider hidden sm:table-cell">
                    Statut
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--text-3)] text-xs uppercase tracking-wider hidden lg:table-cell">
                    Inscription
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-[var(--text-3)] text-xs uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((user, idx) => (
                  <motion.tr
                    key={user.id}
                    variants={fadeUp}
                    className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-warm)]/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-[var(--text-1)] text-sm">
                            {user.name}
                          </p>
                          <p className="text-xs text-[var(--text-3)] md:hidden">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[var(--text-2)] hidden md:table-cell">
                      {user.email}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`dedco-badge ${ROLE_BADGES[user.role]}`}>
                        {ROLE_LABELS[user.role]}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span
                        className={`dedco-badge ${
                          user.status === "actif"
                            ? "dedco-badge-forest"
                            : user.status === "suspendu"
                              ? "dedco-badge-terra"
                              : "dedco-badge-amber"
                        }`}
                      >
                        {STATUS_LABELS[user.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[var(--text-3)] hidden lg:table-cell font-numeric text-xs">
                      {new Date(user.joined).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          title="Voir"
                          className="p-1.5 rounded-md hover:bg-[var(--bg-warm)] text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors cursor-pointer"
                        >
                          <Eye size={15} />
                        </button>
                        {!user.kycVerified && (
                          <button
                            title="Vérifier KYC"
                            className="p-1.5 rounded-md hover:bg-[var(--forest-pale)] text-[var(--text-3)] hover:text-[var(--forest)] transition-colors cursor-pointer"
                          >
                            <ShieldCheck size={15} />
                          </button>
                        )}
                        {user.status === "actif" && (
                          <button
                            title="Suspendre"
                            className="p-1.5 rounded-md hover:bg-[var(--terracotta-pale)] text-[var(--text-3)] hover:text-[var(--terracotta)] transition-colors cursor-pointer"
                          >
                            <Ban size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-[var(--text-3)]">
                      Aucun utilisateur trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border)]">
              <p className="text-xs text-[var(--text-3)] font-numeric">
                {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} sur {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-md hover:bg-[var(--bg-warm)] disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                      p === page
                        ? "bg-[var(--amber)] text-white"
                        : "text-[var(--text-2)] hover:bg-[var(--bg-warm)]"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-md hover:bg-[var(--bg-warm)] disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
}