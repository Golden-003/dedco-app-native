// ============================================================
// BRIEF ARTISAN — Notifications
// Définit les déclencheurs de notifications pour chaque transition
// Pas encore de websocket — seulement la structure
// ============================================================

import type { NotificationTrigger } from './types';
import type { TransitionRule } from './transitions';

// ── Configuration des triggers ──

export interface NotificationConfig {
  trigger: NotificationTrigger;
  title: (briefId: string, context?: Record<string, unknown>) => string;
  description: (context?: Record<string, unknown>) => string;
  // Route de navigation au clic
  route: (briefId: string) => { page: string; briefId: string };
  // Type de notification (pour le store)
  type: 'brief_artisan' | 'payment' | 'project' | 'system';
}

export const NOTIFICATION_CONFIGS: Record<NotificationTrigger, NotificationConfig> = {
  brief_submitted: {
    trigger: 'brief_submitted',
    title: (id) => `Brief ${id} soumis`,
    description: () => 'Votre brief est prêt à être publié.',
    route: (id) => ({ page: 'brief-artisan-detail', briefId: id }),
    type: 'brief_artisan',
  },
  brief_published: {
    trigger: 'brief_published',
    title: (id) => `Brief ${id} publié`,
    description: () => 'Votre brief est visible par les artisans vérifiés pendant 14 jours.',
    route: (id) => ({ page: 'brief-artisan-detail', briefId: id }),
    type: 'brief_artisan',
  },
  proposal_received: {
    trigger: 'proposal_received',
    title: (id) => `Nouvelle proposition reçue — Brief ${id}`,
    description: (ctx) => `${ctx?.artisanName || 'Un artisan'} a répondu à votre brief.`,
    route: (id) => ({ page: 'brief-artisan-detail', briefId: id }),
    type: 'brief_artisan',
  },
  discussion_started: {
    trigger: 'discussion_started',
    title: (id) => `Discussion ouverte — Brief ${id}`,
    description: (ctx) => `Discussion en cours avec ${ctx?.artisanName || 'l\'artisan'}.`,
    route: (id) => ({ page: 'brief-artisan-detail', briefId: id }),
    type: 'brief_artisan',
  },
  artisan_selected: {
    trigger: 'artisan_selected',
    title: (id) => `Artisan sélectionné — Brief ${id}`,
    description: (ctx) => `${ctx?.artisanName || 'Artisan'} sélectionné. Confirmez pour payer.`,
    route: (id) => ({ page: 'brief-artisan-detail', briefId: id }),
    type: 'brief_artisan',
  },
  payment_requested: {
    trigger: 'payment_requested',
    title: (id) => `Paiement à effectuer — Brief ${id}`,
    description: (ctx) => `Payez ${ctx?.amount || 'le montant'} pour démarrer la fabrication.`,
    route: (id) => ({ page: 'brief-artisan-detail', briefId: id }),
    type: 'payment',
  },
  payment_confirmed: {
    trigger: 'payment_confirmed',
    title: (id) => `Paiement confirmé — Brief ${id}`,
    description: () => 'Votre paiement a été reçu. L\'artisan démarre la fabrication.',
    route: (id) => ({ page: 'brief-artisan-detail', briefId: id }),
    type: 'payment',
  },
  project_created: {
    trigger: 'project_created',
    title: (id) => `Projet créé — Brief ${id}`,
    description: (ctx) => `Votre projet ${ctx?.projectId || ''} a été créé.`,
    route: (id) => ({ page: 'brief-artisan-detail', briefId: id }),
    type: 'project',
  },
  brief_expired: {
    trigger: 'brief_expired',
    title: (id) => `Brief expiré — ${id}`,
    description: () => 'Aucune proposition reçue dans les 14 jours. Relancez ou dupliquez.',
    route: (id) => ({ page: 'brief-artisan-detail', briefId: id }),
    type: 'system',
  },
  brief_cancelled: {
    trigger: 'brief_cancelled',
    title: (id) => `Brief annulé — ${id}`,
    description: () => 'Votre brief a été annulé.',
    route: (id) => ({ page: 'brief-artisan-detail', briefId: id }),
    type: 'system',
  },
  modification_requested: {
    trigger: 'modification_requested',
    title: (id) => `Modification proposée — Brief ${id}`,
    description: (ctx) => `${ctx?.field || 'Un champ'} modifié. Impact: ${ctx?.priceImpact || '0'} FCFA.`,
    route: (id) => ({ page: 'brief-artisan-detail', briefId: id }),
    type: 'project',
  },
  modification_accepted: {
    trigger: 'modification_accepted',
    title: (id) => `Modification acceptée — Brief ${id}`,
    description: () => 'La modification a été acceptée par le client.',
    route: (id) => ({ page: 'brief-artisan-detail', briefId: id }),
    type: 'project',
  },
  modification_rejected: {
    trigger: 'modification_rejected',
    title: (id) => `Modification refusée — Brief ${id}`,
    description: () => 'La modification a été refusée par le client.',
    route: (id) => ({ page: 'brief-artisan-detail', briefId: id }),
    type: 'project',
  },
};

// ── Helper : générer les notifications pour une transition ──

export function generateNotifications(
  briefId: string,
  triggers: NotificationTrigger[],
  context?: Record<string, unknown>
): Array<{ trigger: NotificationTrigger; title: string; description: string; route: { page: string; briefId: string }; type: string }> {
  return triggers.map(trigger => {
    const config = NOTIFICATION_CONFIGS[trigger];
    return {
      trigger,
      title: config.title(briefId, context),
      description: config.description(context),
      route: config.route(briefId),
      type: config.type,
    };
  });
}
