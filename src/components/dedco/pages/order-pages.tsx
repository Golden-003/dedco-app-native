"use client";

import { useState } from "react";
import {
  CheckCircle2, Clock, Truck, Package, FileText, Printer,
  ShieldCheck, ChevronRight, Camera, AlertTriangle, MessageSquare,
  MapPin, ShoppingBag,
} from "lucide-react";
import { useDedcoStore, type Order, type OrderStatus } from "@/lib/store";
import { formatFCFA } from "@/lib/dedco-data";
import { useReviewStore } from "@/lib/review-store";

function formatDate(d: Date) {
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

function formatDateFromISO(iso?: string) {
  if (!iso) return "";
  return formatDate(new Date(iso));
}

// ============================================================
// STATUTS DE COMMANDE — badge + label
// ============================================================

const STATUS_BADGES: Record<OrderStatus, { label: string; badge: string }> = {
  'payé':            { label: 'Payé',            badge: 'dedco-badge dedco-badge-amber' },
  'en_fabrication':  { label: 'En fabrication',  badge: 'dedco-badge dedco-badge-terra' },
  'expédié':         { label: 'Expédié',         badge: 'dedco-badge dedco-badge-amber' },
  'livré':           { label: 'Livré',           badge: 'dedco-badge dedco-badge-forest' },
  'litige':          { label: 'Litige',          badge: 'dedco-badge dedco-badge-terra-solid' },
};

// ============================================================
// 2 TYPES DE COMMANDES (mocks fallback utilisés pour les anciens
// orderId non trouvés dans le store — démo / liens partagés)
// ============================================================

const MOCK_MARKETPLACE_ORDER = {
  id: "CMD-2026-0042",
  invoiceId: "FAC-202606-0042",
  date: new Date("2026-06-23"),
  type: "marketplace" as const,
  status: "livré" as OrderStatus,
  items: [
    { productId: 1, name: "Table basse Bénin Wax", artisanName: "Kofi Akindélé", artisanId: 1, price: 185000, qty: 1, color: "Naturel & Wax bleu", image: "https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&w=400&q=80", dimensions: "120 x 60 x 45 cm" },
    { productId: 3, name: "Lampe Abat-jour Bogolan", artisanName: "Fatou Loko", artisanId: 3, price: 68000, qty: 2, color: "Bogolan classique", image: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=400&q=80" },
  ],
  subtotal: 321000,
  shipping: 5000,
  garantie: 4815,
  total: 330815,
  paymentMethod: "MTN Mobile Money",
  paymentRef: "FEDAPAY-TX-789456123",
  delivery: { firstName: "Sophie", lastName: "Kossou", phone: "+229 01 97 45 23 10", ville: "Cotonou", quartier: "Akpakpa", adresse: "12 rue des Lagunes", livreur: "Jean-Baptiste A.", livreurPhone: "+229 01 96 78 45 12" },
  // Marketplace: simple shipping timeline (NO fabrication, NO livraison)
  timeline: [
    { label: "Paiement confirmé", date: "23 juin 2026, 14:30", done: true },
    { label: "Préparation de l'expédition", date: "24 juin 2026", done: true },
    { label: "Expédié", date: "25 juin 2026", done: true },
    { label: "Livré", date: "26 juin 2026, 11:20", done: true },
  ],
};

const MOCK_CUSTOM_ORDER = {
  id: "CMD-2026-0051",
  invoiceId: "FAC-202606-0051",
  date: new Date("2026-06-20"),
  type: "custom" as const,
  status: "livré" as OrderStatus,
  items: [
    { productId: 0, name: "Table basse sur mesure (bois iroko + wax)", artisanName: "Kofi Akindélé", artisanId: 1, price: 220000, qty: 1, color: "Naturel + wax bleu Ankara", image: "https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&w=400&q=80", dimensions: "120 x 60 x 45 cm" },
  ],
  subtotal: 220000,
  shipping: 5000,
  garantie: 3300,
  total: 228300,
  paymentMethod: "Moov Money",
  paymentRef: "FEDAPAY-TX-789456789",
  delivery: { firstName: "Sophie", lastName: "Kossou", phone: "+229 01 97 45 23 10", ville: "Cotonou", quartier: "Akpakpa", adresse: "12 rue des Lagunes", livreur: "Jean-Baptiste A.", livreurPhone: "+229 01 96 78 45 12" },
  timeline: [
    { label: "Paiement confirmé (Mobile Money)", date: "20 juin 2026, 16:00", done: true },
    { label: "Fabrication en atelier", date: "21 juin → 10 juillet", done: true },
    { label: "T1 — Produit prêt (photo enlèvement)", date: "10 juillet 2026", done: true },
    { label: "T2 — En transit (photo transport)", date: "12 juillet 2026", done: true },
    { label: "T3 — Remis au client (photo livraison)", date: "12 juillet 2026, 16:45", done: true },
  ],
};

// Normalise une commande (mock legacy OU Order du store) en objet unifié
// utilisable par les composants ci-dessous.
type NormalizedOrder = {
  id: string;
  invoiceId: string;
  date: Date;
  type: "marketplace" | "custom";
  status: OrderStatus;
  items: { productId: number; name: string; artisanName: string; artisanId?: number; price: number; qty: number; color?: string; image: string; dimensions?: string }[];
  subtotal: number;
  shipping: number;
  garantie: number;
  total: number;
  paymentMethod: string;
  paymentRef: string;
  delivery: { firstName?: string; lastName?: string; phone: string; ville: string; quartier: string; adresse?: string; indication?: string; livreur?: string; livreurPhone?: string };
  timeline: { label: string; date: string; done: boolean }[];
  deliveredAt?: string;
};

function normalizeOrder(o: Order): NormalizedOrder {
  return {
    id: o.id,
    invoiceId: o.invoiceId,
    date: new Date(o.createdAt),
    type: o.type,
    status: o.status,
    items: o.items,
    subtotal: o.subtotal,
    shipping: o.shipping,
    garantie: o.garantie,
    total: o.total,
    paymentMethod: o.paymentMethod,
    paymentRef: o.paymentRef,
    delivery: {
      firstName: o.delivery.firstName,
      lastName: o.delivery.lastName,
      phone: o.delivery.phone,
      ville: o.delivery.ville,
      quartier: o.delivery.quartier,
      indication: o.delivery.indication,
    },
    timeline: o.timeline,
    deliveredAt: o.deliveredAt,
  };
}

// ============================================================
// PAGE: Order Confirmation
// ============================================================

export function OrderConfirmationPage({ orderId }: { orderId: string }) {
  const navigate = useDedcoStore((s) => s.navigate);
  const storeOrder = useDedcoStore((s) => s.orders.find((o) => o.id === orderId));

  // Fallback sur mock si la commande n'est pas dans le store (legacy / démo)
  let order: NormalizedOrder;
  if (storeOrder) {
    order = normalizeOrder(storeOrder);
  } else if (orderId.includes("0051")) {
    order = MOCK_CUSTOM_ORDER as NormalizedOrder;
  } else {
    order = MOCK_MARKETPLACE_ORDER as NormalizedOrder;
  }
  const isCustom = order.type === "custom";

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 rounded-full bg-[var(--forest-pale)] mx-auto flex items-center justify-center mb-5">
          <CheckCircle2 size={40} className="text-[var(--forest)]" />
        </div>
        <h1 className="display-xl mb-2">Commande confirmée !</h1>
        <p className="text-sm text-[var(--text-2)]">
          {isCustom ? "Votre paiement est sécurisé. L'artisan démarre la fabrication." : "Votre paiement a été reçu. Préparation de l'expédition."}
        </p>
      </div>

      <div className="dedco-card p-5 mb-4">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-[var(--border)]">
          <div>
            <p className="text-xs text-[var(--text-3)] uppercase tracking-wide">N° de commande</p>
            <p className="font-display font-bold text-lg font-numeric">{order.id}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[var(--text-3)] uppercase tracking-wide">Type</p>
            <p className="text-sm font-medium">
              {isCustom ? (
                <span className="dedco-badge dedco-badge-amber">Sur mesure</span>
              ) : (
                <span className="dedco-badge dedco-badge-forest">En stock</span>
              )}
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <img src={item.image} alt={item.name} className="w-12 h-12 rounded-md object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <p className="text-xs text-[var(--text-3)]">{item.color} · x{item.qty}</p>
              </div>
              <p className="font-numeric font-semibold text-sm">{formatFCFA(item.price * item.qty)}</p>
            </div>
          ))}
        </div>

        <div className="space-y-1 text-sm pt-3 border-t border-[var(--border)]">
          <div className="flex justify-between"><span className="text-[var(--text-2)]">Sous-total</span><span className="font-numeric">{formatFCFA(order.subtotal)}</span></div>
          <div className="flex justify-between"><span className="text-[var(--text-2)]">Livraison</span><span className="font-numeric text-[var(--forest)]">Gratuite</span></div>
          <div className="flex justify-between"><span className="text-[var(--text-2)] flex items-center gap-1">Fonds de garantie (1,5%)<ShieldCheck size={12} className="text-[var(--forest)]" /></span><span className="font-numeric">{formatFCFA(order.garantie)}</span></div>
          <div className="flex justify-between font-display font-bold pt-1 border-t border-[var(--border)]"><span>Total payé</span><span className="font-numeric text-[var(--amber)]">{formatFCFA(order.total)}</span></div>
        </div>

        <div className="mt-4 p-3 bg-[var(--bg-warm)] rounded-md flex items-center gap-2 text-xs">
          <span className="dedco-badge dedco-badge-forest">{order.paymentMethod}</span>
          <span className="text-[var(--text-3)] font-numeric">Réf : {order.paymentRef}</span>
        </div>
      </div>

      {/* Info spécifique au type */}
      {isCustom ? (
        <div className="p-4 bg-[var(--amber-pale)]/30 rounded-lg mb-4">
          <p className="text-xs text-[var(--text-2)] leading-relaxed">
            <Package size={14} className="inline text-[var(--amber)]" />
            {" "}<strong>Commande sur mesure :</strong> L'artisan va fabriquer votre pièce.
            Vous recevrez des photos à chaque étape (T1 : produit prêt, T2 : en transit, T3 : remise).
            Le paiement est sécurisé jusqu'à validation de la livraison.
          </p>
        </div>
      ) : (
        <div className="p-4 bg-[var(--forest-pale)]/30 rounded-lg mb-4">
          <p className="text-xs text-[var(--text-2)] leading-relaxed">
            <ShoppingBag size={14} className="inline text-[var(--forest)]" />
            {" "}<strong>Produit en stock :</strong> Expédition sous 24-48h.
            Vous recevrez une photo à l'expédition et à la livraison.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <button onClick={() => navigate({ page: "invoice", orderId: order.id })} className="dedco-btn dedco-btn-primary">
          <FileText size={16} /> Voir la facture
        </button>
        <button onClick={() => navigate({ page: "order-tracking", id: order.id })} className="dedco-btn dedco-btn-secondary">
          <Truck size={16} /> Suivre
        </button>
        <button onClick={() => navigate({ page: "marketplace" })} className="dedco-btn dedco-btn-ghost">
          Continuer mes achats
        </button>
      </div>
    </div>
  );
}

// ============================================================
// PAGE: Invoice
// ============================================================

export function InvoicePage({ orderId }: { orderId: string }) {
  const navigate = useDedcoStore((s) => s.navigate);
  const currentUser = useDedcoStore((s) => s.currentUser);
  const isArtisan = currentUser?.role === "artisan";
  const storeOrder = useDedcoStore((s) => s.orders.find((o) => o.id === orderId));

  let order: NormalizedOrder;
  if (storeOrder) {
    order = normalizeOrder(storeOrder);
  } else if (orderId.includes("0051")) {
    order = MOCK_CUSTOM_ORDER as NormalizedOrder;
  } else {
    order = MOCK_MARKETPLACE_ORDER as NormalizedOrder;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-cream)] py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate({ page: "order-tracking", id: order.id })} className="text-sm text-[var(--text-3)] hover:text-[var(--amber)] flex items-center gap-1">
            <ChevronRight size={16} className="rotate-180" /> Retour
          </button>
          <button onClick={() => window.print()} className="dedco-btn dedco-btn-ghost dedco-btn-sm">
            <Printer size={14} /> Imprimer
          </button>
        </div>

        <div className="bg-card rounded-xl shadow-lg p-8 sm:p-12">
          <div className="flex items-start justify-between mb-8 pb-8 border-b-2 border-[var(--amber)]">
            <div>
              <div className="font-display text-3xl font-bold mb-1">
                <span className="text-[var(--terracotta)]">Dedco</span><span className="text-[var(--amber)]">.</span>
              </div>
              <p className="text-xs text-[var(--text-3)]">Marketplace aménagement intérieur</p>
              <p className="text-xs text-[var(--text-3)]">Cotonou, Bénin · contact@dedco.bj</p>
            </div>
            <div className="text-right">
              <h1 className="font-display text-2xl font-bold mb-1">FACTURE</h1>
              <p className="text-sm font-numeric font-semibold text-[var(--amber)]">{order.invoiceId}</p>
              <p className="text-xs text-[var(--text-3)] mt-2 font-numeric">Commande : {order.id}</p>
              <p className="text-xs text-[var(--text-3)]">{formatDate(order.date)}</p>
              <span className={`dedco-badge mt-2 ${order.type === "custom" ? "dedco-badge-amber" : "dedco-badge-forest"}`}>
                {order.type === "custom" ? "Sur mesure" : "En stock"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-2">Facturé à</p>
              <p className="font-semibold text-sm">
                {order.delivery.firstName ? `${order.delivery.firstName} ${order.delivery.lastName}`.trim() : "Client Dedco"}
              </p>
              {order.delivery.indication && (
                <p className="text-sm text-[var(--text-2)]">{order.delivery.indication}</p>
              )}
              <p className="text-sm text-[var(--text-2)]">{order.delivery.quartier}, {order.delivery.ville}</p>
              <p className="text-sm text-[var(--text-2)] font-numeric">{order.delivery.phone}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-2">Paiement</p>
              <p className="text-sm font-medium">{order.paymentMethod}</p>
              <p className="text-xs text-[var(--text-3)] font-numeric">Réf : {order.paymentRef}</p>
              <p className="text-xs text-[var(--forest)] mt-1">{order.type === "custom" ? "Sécurisé via Mobile Money" : "Payé via Mobile Money"}</p>
            </div>
          </div>

          <table className="w-full text-sm mb-8">
            <thead>
              <tr className="border-b-2 border-[var(--border)]">
                <th className="text-left py-3 px-2 text-xs text-[var(--text-3)] uppercase">Produit</th>
                <th className="text-center py-3 px-2 text-xs text-[var(--text-3)] uppercase">Artisan</th>
                <th className="text-center py-3 px-2 text-xs text-[var(--text-3)] uppercase">Qté</th>
                <th className="text-right py-3 px-2 text-xs text-[var(--text-3)] uppercase">Prix</th>
                <th className="text-right py-3 px-2 text-xs text-[var(--text-3)] uppercase">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, i) => (
                <tr key={i} className="border-b border-[var(--border)]">
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <img src={item.image} alt="" className="w-10 h-10 rounded object-cover" />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        {item.color && <p className="text-xs text-[var(--text-3)]">{item.color}</p>}
                        {item.dimensions && <p className="text-xs text-[var(--text-3)] font-numeric">{item.dimensions}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-center text-[var(--text-2)]">{item.artisanName}</td>
                  <td className="py-3 px-2 text-center font-numeric">{item.qty}</td>
                  <td className="py-3 px-2 text-right font-numeric">{formatFCFA(item.price)}</td>
                  <td className="py-3 px-2 text-right font-numeric font-semibold">{formatFCFA(item.price * item.qty)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end mb-8">
            <div className="w-full sm:w-72 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-[var(--text-2)]">Sous-total</span><span className="font-numeric">{formatFCFA(order.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-2)]">Livraison</span><span className="font-numeric text-[var(--forest)]">Gratuite</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-2)] flex items-center gap-1">Garantie (1,5%)<ShieldCheck size={12} className="text-[var(--forest)]" /></span><span className="font-numeric">{formatFCFA(order.garantie)}</span></div>
              <div className="flex justify-between font-display font-bold text-base pt-2 border-t-2 border-[var(--amber)]"><span>Total TTC</span><span className="font-numeric text-[var(--amber)]">{formatFCFA(order.total)}</span></div>
            </div>
          </div>

          <div className="pt-6 border-t border-[var(--border)] text-xs text-[var(--text-3)] space-y-1">
            {order.type === "custom" ? (
              <>
                <p><strong>Commande sur mesure :</strong> Paiement sécurisé. Artisan payé après validation T3.</p>
                <p><strong>Livraison sécurisée :</strong> T1 (produit prêt), T2 (transit), T3 (remise client).</p>
              </>
            ) : (
              <>
                <p><strong>Produit en stock :</strong> Expédition sous 24-48h.</p>
                {!isArtisan && <p><strong>Garantie :</strong> 7 jours pour ouvrir un litige après livraison.</p>}
              </>
            )}
            <p className="pt-2 text-center">Dedco SARL · Cotonou, Bénin · RCCM BJ-2026-0456</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PAGE: Order Tracking — adapté au type de commande
// ============================================================

export function OrderTrackingPage({ orderId }: { orderId: string }) {
  const navigate = useDedcoStore((s) => s.navigate);
  const currentUser = useDedcoStore((s) => s.currentUser);
  const markOrderDelivered = useDedcoStore((s) => s.markOrderDelivered);
  const storeOrder = useDedcoStore((s) => s.orders.find((o) => o.id === orderId));
  const hasReviewed = useReviewStore((s) => s.hasReviewed);
  const isArtisan = currentUser?.role === "artisan";

  // Fallback sur mock si commande non trouvée dans le store
  let order: NormalizedOrder;
  if (storeOrder) {
    order = normalizeOrder(storeOrder);
  } else if (orderId.includes("0051")) {
    order = MOCK_CUSTOM_ORDER as NormalizedOrder;
  } else {
    order = MOCK_MARKETPLACE_ORDER as NormalizedOrder;
  }
  const isCustom = order.type === "custom";
  const isDelivered = order.status === "livré";
  const alreadyReviewed = hasReviewed(order.id);
  const [showPhoto] = useState<number | null>(null);

  // Icônes Lucide pour chaque étape de timeline — déterminées par mot-clé
  // dans le label (au lieu d'être stockées dans l'objet timeline).
  function iconForLabel(label: string) {
    if (/paiement/i.test(label)) return ShieldCheck;
    if (/préparation|fabrication/i.test(label)) return Package;
    if (/expédié|transit|t2/i.test(label)) return Truck;
    if (/livré|remis|t3|t1.*prêt/i.test(label)) return CheckCircle2;
    return Clock;
  }

  const statusBadge = STATUS_BADGES[order.status];

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <button onClick={() => navigate({ page: isArtisan ? "artisan-projets" : "client-projets" })} className="text-sm text-[var(--text-3)] hover:text-[var(--amber)] mb-4 flex items-center gap-1">
        <ChevronRight size={16} className="rotate-180" /> {isArtisan ? "Projets en cours" : "Mes projets"}
      </button>

      <header className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={statusBadge.badge}>
                <CheckCircle2 size={11} /> {statusBadge.label}
              </span>
              <span className={`dedco-badge ${isCustom ? "dedco-badge-amber" : "dedco-badge-gray"}`}>
                {isCustom ? "Sur mesure" : "En stock"}
              </span>
            </div>
            <h1 className="display-lg">Commande {order.id}</h1>
            <p className="text-sm text-[var(--text-2)] font-numeric">
              Passée le {formatDate(order.date)}
              {isDelivered && order.deliveredAt && (
                <> · Livrée le {formatDateFromISO(order.deliveredAt)}</>
              )}
            </p>
          </div>
          <button onClick={() => navigate({ page: "invoice", orderId: order.id })} className="dedco-btn dedco-btn-ghost dedco-btn-sm">
            <FileText size={14} /> Facture
          </button>
        </div>
      </header>

      {/* Timeline — différente selon le type */}
      <div className="dedco-card p-5 mb-5">
        <h2 className="font-display font-bold mb-5">
          {isCustom ? "Suivi fabrication & livraison — confirmation" : "Suivi d'expédition"}
        </h2>
        <div className="space-y-4">
          {order.timeline.map((t, i) => {
            const Icon = iconForLabel(t.label);
            return (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${t.done ? "bg-[var(--forest)] text-white" : "bg-[var(--bg-warm)] text-[var(--text-3)]"}`}>
                    <Icon size={18} />
                  </div>
                  {i < order.timeline.length - 1 && <div className={`w-0.5 h-12 ${t.done ? "bg-[var(--forest)]" : "bg-[var(--border)]"}`} />}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className={`text-sm font-semibold ${t.done ? "" : "text-[var(--text-3)]"}`}>{t.label}</p>
                      <p className="text-xs text-[var(--text-3)] font-numeric">{t.date}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bouton démo : marquer comme livré (pour activer le parcours d'avis) */}
        {!isDelivered && (
          <div className="mt-5 pt-5 border-t border-[var(--border)]">
            <p className="text-xs text-[var(--text-3)] mb-2 italic">
              Démo : pour tester le parcours d'avis, simulez la livraison.
            </p>
            <button
              onClick={() => markOrderDelivered(order.id)}
              className="dedco-btn dedco-btn-secondary dedco-btn-sm"
            >
              <CheckCircle2 size={14} /> Marquer cette commande comme livrée
            </button>
          </div>
        )}
      </div>

      {/* Articles */}
      <div className="dedco-card p-5 mb-5">
        <h2 className="font-display font-bold mb-4">Articles ({order.items.length})</h2>
        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-3 pb-3 border-b border-[var(--border)] last:border-0">
              <img src={item.image} alt={item.name} className="w-14 h-14 rounded-md object-cover" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{item.name}</p>
                <p className="text-xs text-[var(--text-3)]">par {item.artisanName}</p>
                <p className="text-xs text-[var(--text-3)]">{item.color} · x{item.qty}</p>
              </div>
              <p className="font-numeric font-semibold text-sm">{formatFCFA(item.price * item.qty)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Livraison */}
      <div className="dedco-card p-5 mb-5">
        <h2 className="font-display font-bold mb-3">Livraison</h2>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Adresse</p>
            <p>
              {order.delivery.firstName ? `${order.delivery.firstName} ${order.delivery.lastName}`.trim() : ""}
            </p>
            {order.delivery.indication && <p>{order.delivery.indication}</p>}
            <p>{order.delivery.quartier}, {order.delivery.ville}</p>
            <p className="font-numeric">{order.delivery.phone}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Livreur</p>
            <p>{order.delivery.livreur ?? "À assigner"}</p>
            <p className="font-numeric text-[var(--text-3)]">{order.delivery.livreurPhone ?? "—"}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 flex-wrap">
        {isArtisan ? (
          <>
            <button
              onClick={() => navigate({ page: "messages", conversationId: `order-${order.id}` })}
              className="dedco-btn dedco-btn-primary"
            >
              <MessageSquare size={16} /> Contacter le client
            </button>
            <button onClick={() => navigate({ page: "invoice", orderId: order.id })} className="dedco-btn dedco-btn-ghost">
              <FileText size={16} /> Facture
            </button>
          </>
        ) : (
          <>
            {isDelivered && !alreadyReviewed && (
              <button
                onClick={() => navigate({ page: "avis-livraison", orderId: order.id })}
                className="dedco-btn dedco-btn-primary"
              >
                <CheckCircle2 size={16} /> Laisser un avis
              </button>
            )}
            {isDelivered && alreadyReviewed && (
              <span className="dedco-badge dedco-badge-forest px-3 py-2 text-sm">
                <CheckCircle2 size={14} /> Avis déjà publié — merci !
              </span>
            )}
            <button
              onClick={() => navigate({ page: "messages", conversationId: `order-${order.id}` })}
              className="dedco-btn dedco-btn-ghost"
            >
              <MessageSquare size={16} /> Contacter l'artisan
            </button>
            <button
              onClick={() => navigate({ page: "litige", id: `REC-${order.id}` })}
              className="dedco-btn dedco-btn-ghost text-[var(--terracotta)]"
            >
              <AlertTriangle size={16} /> Ouvrir un litige
            </button>
          </>
        )}
      </div>
    </div>
  );
}
