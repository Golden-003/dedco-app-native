// ============================================================
// BRIEF ARTISAN — Index public
// Point d'entrée unique pour tout le module brief artisan
// ============================================================

// Types
export type {
  BriefArtisan,
  BriefArtisanProposal,
  BriefModification,
  BriefHistoryEntry,
  BriefAction,
  BriefArtisanStatus,
  TransitionResult,
  NotificationTrigger,
  UserRole,
  ProjectScope,
  CraftCategory,
} from './types';

// Statuts
export {
  BRIEF_ARTISAN_STATUSES,
  getActiveStatuses,
  getTerminalStatuses,
  type StatusConfig,
} from './statuses';

// Transitions
export {
  BRIEF_TRANSITIONS,
  findTransition,
  getAvailableActions,
  canTransition,
  type TransitionRule,
} from './transitions';

// Permissions
export {
  canEditBrief,
  canSubmitBrief,
  canPublishBrief,
  canCancelBrief,
  canStartDiscussion,
  canSelectProposal,
  canConfirmSelection,
  canPayDeposit,
  canDuplicateBrief,
  canRelanceBrief,
  canPerformAction,
  isBriefActive,
  canReceiveProposals,
  canBeCancelled,
} from './permissions';

// Helpers
export {
  getStatusColor,
  getStatusBgColor,
  getStatusLabel,
  getStatusDescription,
  isStatusUrgent,
  isStatusTerminal,
  getProgress,
  getPrimaryAction,
  getRemainingDays,
  isExpired,
  getSelectedProposal,
  getPaymentAmount,
  getAvailableActionsForBrief,
  getBriefSummary,
} from './helpers';

// Notifications
export {
  NOTIFICATION_CONFIGS,
  generateNotifications,
  type NotificationConfig,
} from './notifications';

// Engine
export {
  transitionBrief,
  applyTransition,
} from './engine';

// Mock
export { MOCK_BRIEFS } from './mock';
