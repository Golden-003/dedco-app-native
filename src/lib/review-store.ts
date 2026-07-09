"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ============================================================
// REVIEW STORE — Avis vérifiés (liés à une commande livrée)
// ============================================================

export interface Review {
  id: string;
  orderId: string;
  productId: number;
  artisanId: number;
  rating: number;          // 1-5
  subRatings: {
    qualite: number;
    delais: number;
    communication: number;
  };
  comment: string;
  authorName: string;
  authorAvatar: string;
  createdAt: string;       // ISO date
  verified: boolean;       // toujours true (lié à commande)
}

// ============================================================
// SEED DATA — Avis de démo répartis sur plusieurs produits
// (injectés au 1er chargement si le store est vide)
// ============================================================

const SEED_REVIEWS: Review[] = [
  // ── Produit 1 : Table basse Bénin Wax (Kofi Akindélé, artisan 1)
  {
    id: 'SEED-1', orderId: 'CMD-2026-0011', productId: 1, artisanId: 1,
    rating: 5, subRatings: { qualite: 5, delais: 4, communication: 5 },
    comment: 'Table basse magnifique, finitions impeccables. Le tissu wax est superbe. Kofi a respecté les délais.',
    authorName: 'Sophie Kossou',
    authorAvatar: 'https://images.unsplash.com/photo-1614317226704-aba58b1ce153?auto=format&fit=crop&crop=faces&w=80&q=80',
    createdAt: '2026-06-18T10:30:00.000Z', verified: true,
  },
  {
    id: 'SEED-2', orderId: 'CMD-2026-0012', productId: 1, artisanId: 1,
    rating: 4, subRatings: { qualite: 5, delais: 3, communication: 4 },
    comment: 'Très belle pièce, fabrication soignée. Livraison avec 3 jours de retard mais l\'artisan a communiqué tout au long.',
    authorName: 'Marc Adjovi',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&crop=faces&w=80&q=80',
    createdAt: '2026-06-10T14:20:00.000Z', verified: true,
  },
  // ── Produit 2 : Fauteuil Sahel Tressé (Amara Dossou, artisan 2)
  {
    id: 'SEED-3', orderId: 'CMD-2026-0013', productId: 2, artisanId: 2,
    rating: 5, subRatings: { qualite: 5, delais: 5, communication: 5 },
    comment: 'Fauteuil encore plus beau en vrai. Rotin solide et confortable. Amara est très professionnelle.',
    authorName: 'Aïcha Sanni',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&crop=faces&w=80&q=80',
    createdAt: '2026-06-15T09:00:00.000Z', verified: true,
  },
  {
    id: 'SEED-4', orderId: 'CMD-2026-0014', productId: 2, artisanId: 2,
    rating: 5, subRatings: { qualite: 5, delais: 5, communication: 4 },
    comment: 'Qualité au top, exactement comme sur les photos. Je recommande à 100%.',
    authorName: 'Paul Hounkpatin',
    authorAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&crop=faces&w=80&q=80',
    createdAt: '2026-05-28T16:45:00.000Z', verified: true,
  },
  // ── Produit 3 : Lampe Abat-jour Bogolan (Fatou Loko, artisan 3)
  {
    id: 'SEED-5', orderId: 'CMD-2026-0015', productId: 3, artisanId: 3,
    rating: 4, subRatings: { qualite: 4, delais: 4, communication: 5 },
    comment: 'Lampe jolie, abat-jour bogolan authentique. Lumière tamisée parfaite pour le salon.',
    authorName: 'Lucie Bokossa',
    authorAvatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&crop=faces&w=80&q=80',
    createdAt: '2026-06-05T11:15:00.000Z', verified: true,
  },
  // ── Produit 5 : Commode Porto-Novo (Kofi Akindélé, artisan 1)
  {
    id: 'SEED-6', orderId: 'CMD-2026-0016', productId: 5, artisanId: 1,
    rating: 5, subRatings: { qualite: 5, delais: 5, communication: 5 },
    comment: 'Commode en teck superbe, exactement comme sur les photos du portfolio. Poignées en laiton gravé magnifiques.',
    authorName: 'Lucie Bokossa',
    authorAvatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&crop=faces&w=80&q=80',
    createdAt: '2026-05-20T13:00:00.000Z', verified: true,
  },
  // ── Produit 6 : Coussins Kente Set (Aïssatou Bello, artisan 5)
  {
    id: 'SEED-7', orderId: 'CMD-2026-0017', productId: 6, artisanId: 5,
    rating: 4, subRatings: { qualite: 4, delais: 5, communication: 4 },
    comment: 'Coussins kente colorés et de bonne qualité. Livraison rapide depuis Porto-Novo.',
    authorName: 'David Akplogan',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&crop=faces&w=80&q=80',
    createdAt: '2026-06-22T08:30:00.000Z', verified: true,
  },
  {
    id: 'SEED-8', orderId: 'CMD-2026-0018', productId: 6, artisanId: 5,
    rating: 5, subRatings: { qualite: 5, delais: 5, communication: 5 },
    comment: 'Excellents coussins, tissu kente authentique. Mes enfants adorent les couleurs.',
    authorName: 'Mariam Touré',
    authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&crop=faces&w=80&q=80',
    createdAt: '2026-06-08T15:20:00.000Z', verified: true,
  },
  // ── Produit 10 : Suspension Bambou Tressé (Fatou Loko, artisan 3)
  {
    id: 'SEED-9', orderId: 'CMD-2026-0019', productId: 10, artisanId: 3,
    rating: 5, subRatings: { qualite: 5, delais: 4, communication: 5 },
    comment: 'Suspension bambou magnifique, ambiances chaleureuse garantie. Installation facile.',
    authorName: 'Olivier Zinsou',
    authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&crop=faces&w=80&q=80',
    createdAt: '2026-06-12T17:45:00.000Z', verified: true,
  },
  {
    id: 'SEED-10', orderId: 'CMD-2026-0020', productId: 10, artisanId: 3,
    rating: 4, subRatings: { qualite: 4, delais: 5, communication: 4 },
    comment: 'Belle suspension, bambou de bonne qualité. Douille E27 standard, parfait.',
    authorName: 'Carole Adjovi',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&crop=faces&w=80&q=80',
    createdAt: '2026-05-30T10:00:00.000Z', verified: true,
  },
  // ── Produit 11 : Canapé Tropique (artisan 7)
  {
    id: 'SEED-11', orderId: 'CMD-2026-0021', productId: 11, artisanId: 7,
    rating: 5, subRatings: { qualite: 5, delais: 4, communication: 5 },
    comment: 'Canapé très confortable, structure bois solide. Housse lavable pratique avec les enfants.',
    authorName: 'Bernard Hounsa',
    authorAvatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&crop=faces&w=80&q=80',
    createdAt: '2026-06-01T14:30:00.000Z', verified: true,
  },
  // ── Produit 12 : Tête de lit Bogolan (artisan 3) — vérifions si existe
  // (utilisons 13 à la place pour rester safe)
  // ── Produit 8 : Tapis Sable du Sahara (artisan 6)
  {
    id: 'SEED-12', orderId: 'CMD-2026-0022', productId: 8, artisanId: 6,
    rating: 5, subRatings: { qualite: 5, delais: 5, communication: 4 },
    comment: 'Tapis berbère superbe, douceur au toucher. Motifs sahéliens magnifiques dans notre salon.',
    authorName: 'Sandrine Aguia',
    authorAvatar: 'https://images.unsplash.com/photo-1559548331-f9cb98001426?auto=format&fit=crop&crop=faces&w=80&q=80',
    createdAt: '2026-06-19T12:10:00.000Z', verified: true,
  },
  {
    id: 'SEED-13', orderId: 'CMD-2026-0023', productId: 8, artisanId: 6,
    rating: 4, subRatings: { qualite: 4, delais: 4, communication: 5 },
    comment: 'Bon tapis, épais et confortable. Couleur conforme aux photos. Délai un peu long mais ça valait la peine.',
    authorName: 'Eric Dossou',
    authorAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&crop=faces&w=80&q=80',
    createdAt: '2026-05-15T09:25:00.000Z', verified: true,
  },
  // ── Produit 9 : Bibliothèque Yoruba (artisan 1)
  {
    id: 'SEED-14', orderId: 'CMD-2026-0024', productId: 9, artisanId: 1,
    rating: 4, subRatings: { qualite: 5, delais: 3, communication: 4 },
    comment: 'Bibliothèque modulaire pratique, montage sans outils comme promis. Couleur terracotta superbe.',
    authorName: 'Fatima Karim',
    authorAvatar: 'https://images.unsplash.com/photo-1558898479-33c0057a5d12?auto=format&fit=crop&crop=faces&w=80&q=80',
    createdAt: '2026-06-07T16:00:00.000Z', verified: true,
  },
  // ── Produit 4 : Miroir Encadré Raffia (artisan 4)
  {
    id: 'SEED-15', orderId: 'CMD-2026-0025', productId: 4, artisanId: 4,
    rating: 5, subRatings: { qualite: 5, delais: 5, communication: 5 },
    comment: 'Miroir raffia magnifique, pièce unique. Cadre tressé avec soin. Notre entrée est transformée.',
    authorName: 'Gisèle Lawson',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&crop=faces&w=80&q=80',
    createdAt: '2026-06-14T13:40:00.000Z', verified: true,
  },
];

interface ReviewState {
  reviews: Review[];
  seeded: boolean;  // éviter de re-seeder après que l'utilisateur ait ajouté son 1er avis
  hasReviewed: (orderId: string) => boolean;
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'verified'>) => void;
  getReviewsByProduct: (productId: number) => Review[];
  getReviewsByArtisan: (artisanId: number) => Review[];
  getAverageRating: (productId: number) => { rating: number; count: number };
  getArtisanAverage: (artisanId: number) => { rating: number; count: number };
  getArtisanSubRatings: (artisanId: number) => { qualite: number; delais: number; communication: number };
}

export const useReviewStore = create<ReviewState>()(
  persist(
    (set, get) => ({
      reviews: SEED_REVIEWS,
      seeded: true,

      hasReviewed: (orderId) => {
        return get().reviews.some(r => r.orderId === orderId);
      },

      addReview: (review) => {
        const newReview: Review = {
          ...review,
          id: `REV-${Date.now()}`,
          createdAt: new Date().toISOString(),
          verified: true, // toujours vérifié car lié à une commande
        };
        set((state) => ({ reviews: [newReview, ...state.reviews] }));
      },

      getReviewsByProduct: (productId) => {
        return get().reviews
          .filter(r => r.productId === productId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },

      getReviewsByArtisan: (artisanId) => {
        return get().reviews
          .filter(r => r.artisanId === artisanId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },

      getAverageRating: (productId) => {
        const reviews = get().reviews.filter(r => r.productId === productId);
        if (reviews.length === 0) return { rating: 0, count: 0 };
        const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
        return { rating: Math.round((sum / reviews.length) * 10) / 10, count: reviews.length };
      },

      getArtisanAverage: (artisanId) => {
        const reviews = get().reviews.filter(r => r.artisanId === artisanId);
        if (reviews.length === 0) return { rating: 0, count: 0 };
        const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
        return { rating: Math.round((sum / reviews.length) * 10) / 10, count: reviews.length };
      },

      getArtisanSubRatings: (artisanId) => {
        const reviews = get().reviews.filter(r => r.artisanId === artisanId);
        if (reviews.length === 0) return { qualite: 0, delais: 0, communication: 0 };
        const sum = reviews.reduce((acc, r) => ({
          qualite: acc.qualite + r.subRatings.qualite,
          delais: acc.delais + r.subRatings.delais,
          communication: acc.communication + r.subRatings.communication,
        }), { qualite: 0, delais: 0, communication: 0 });
        return {
          qualite: Math.round((sum.qualite / reviews.length) * 10) / 10,
          delais: Math.round((sum.delais / reviews.length) * 10) / 10,
          communication: Math.round((sum.communication / reviews.length) * 10) / 10,
        };
      },
    }),
    {
      name: 'dedco-reviews',
      version: 2,
      // Forcer la version 2 : si l'utilisateur a déjà l'ancien store (vide),
      // on merge avec les seeds. Si nouveau, on prend l'état initial.
      merge: (persistedState: any, currentState) => {
        const persisted = persistedState as Partial<ReviewState> | undefined;
        // Si rien de persisté → état initial (avec seeds)
        if (!persisted || !Array.isArray(persisted.reviews)) {
          return currentState;
        }
        // Si reviews persistés mais pas de seed mélangé (ancien store vide)
        // → on charge les seeds
        if (persisted.reviews.length === 0 && !persisted.seeded) {
          return {
            ...currentState,
            ...persisted,
            reviews: SEED_REVIEWS,
            seeded: true,
          };
        }
        // Sinon on garde l'état persisté (l'utilisateur a peut-être ajouté ses propres avis)
        return { ...currentState, ...persisted };
      },
    }
  )
);
