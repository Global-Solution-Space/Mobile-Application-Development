// ═══════════════════════════════════════════════════════════════
// Terra Nova — Design System Colors
// Tema: Sci-fi dark com acentos verde-esmeralda
// ═══════════════════════════════════════════════════════════════

export const Colors = {
  // ── Fundos ──────────────────────────────────────
  bgPrimary:   '#04100B',   // Fundo principal (quase preto)
  bgSecondary: '#0A1F16',   // Header, tab bar, cards
  bgTertiary:  '#0D2B1F',   // Cards elevados
  bgCard:      '#0F3326',   // Card hover/selecionado
  bgInput:     '#0A1F16',   // Campos de input

  // ── Bordas ──────────────────────────────────────
  border:      '#11422B',   // Borda padrão
  borderLight: '#1A5C3A',   // Borda hover/focus

  // ── Texto ──────────────────────────────────────
  textPrimary:   '#F8FAFC', // Texto principal (quase branco)
  textSecondary: '#94A3B8', // Texto secundário (cinza claro)
  textMuted:     '#64748B', // Texto desativado/muted
  textDark:      '#334155', // Texto escuro sobre superfícies claras

  // ── Acentos ─────────────────────────────────────
  accent:        '#10B981', // Verde esmeralda principal
  accentLight:   '#34D399', // Verde claro para hovers
  accentDark:    '#059669', // Verde escuro para pressed
  accentGlow:    'rgba(16, 185, 129, 0.15)', // Glow effect

  // ── Status ──────────────────────────────────────
  success:   '#10B981',
  warning:   '#F59E0B',
  danger:    '#EF4444',
  info:      '#3B82F6',
  critical:  '#DC2626',

  // ── Status Backgrounds ─────────────────────────
  successBg: 'rgba(16, 185, 129, 0.12)',
  warningBg: 'rgba(245, 158, 11, 0.12)',
  dangerBg:  'rgba(239, 68, 68, 0.12)',
  infoBg:    'rgba(59, 130, 246, 0.12)',
  criticalBg:'rgba(220, 38, 38, 0.15)',

  // ── Overlay ─────────────────────────────────────
  overlay: 'rgba(4, 16, 11, 0.85)',

  // ── Transparências ──────────────────────────────
  white10: 'rgba(255, 255, 255, 0.10)',
  white05: 'rgba(255, 255, 255, 0.05)',
} as const;

export type ColorKey = keyof typeof Colors;
