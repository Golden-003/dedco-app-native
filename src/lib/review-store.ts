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

interface ReviewState {
  reviews: Review[];
  hasReviewed: (orderId: string) => boolean;
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'verified'>) => void;
  getReviewsByProduct: (productId: number) => Review[];
  getReviewsByArtisan: (artisanId: number) => Review[];
  getAverageRating: (productId: number) => { rating: number; count: number };
  getArtisanAverage: (artisanId: number) => { rating: number; count: number };
}

export const useReviewStore = create<ReviewState>()(
  persist(
    (set, get) => ({
      reviews: [],

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
        set((state) => ({ reviews: [...state.reviews, newReview] }));
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
    }),
    {
      name: 'dedco-reviews',
    }
  )
);
