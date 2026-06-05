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

  // ── Bordas e Sombras ─────────────────────────────
  border:      '#11422B',   // Borda padrão
  borderLight: '#1A5C3A',   // Borda hover/focus
  shadow:      '#000000',   // Sombra de elevação

  // ── Texto ──────────────────────────────────────
  textPrimary:   '#F8FAFC', // Texto principal (quase branco)
  textSecondary: '#94A3B8', // Texto secundário (cinza claro)
  textMuted:     '#64748B', // Texto desativado/muted
  textDark:      '#334155', // Texto escuro sobre superfícies claras

  // ── Acentos ─────────────────────────────────────
  accent:        '#10B981', // Verde esmeralda principal
  accentLight:   '#34D399', // Verde claro para hovers
  accentDark:    '#059669', // Verde escuro para pressed
  accentGlow:    '#10B98126', // Glow effect (15% opacity)

  // ── Status ──────────────────────────────────────
  success:   '#10B981',
  warning:   '#F59E0B',
  danger:    '#EF4444',
  info:      '#3B82F6',
  critical:  '#DC2626',

  // ── Status Backgrounds ─────────────────────────
  successBg: '#10B9811F', // 12% opacity
  warningBg: '#F59E0B1F', // 12% opacity
  dangerBg:  '#EF44441F', // 12% opacity
  infoBg:    '#3B82F61F', // 12% opacity
  criticalBg:'#DC262626', // 15% opacity

  // ── Overlay ─────────────────────────────────────
  overlay: '#04100BD9', // 85% opacity

  // ── Transparências ──────────────────────────────
  white10: '#FFFFFF1A', // 10% opacity
  white05: '#FFFFFF0D', // 05% opacity
} as const;

export type ColorKey = keyof typeof Colors;
