export const colors = {
  // Primary Palette
  genesisTurf: '#00A65A',
  midnightStadium: '#071A12',
  legacyGold: '#D4A63A',
  floodlightIvory: '#F5F5EF',

  // Secondary Palette
  tacticalSky: '#27B4E8',
  derbyViolet: '#4C5DFF',
  rivalFlame: '#E64141',
  lockerSteel: '#7E8A93',
  youthMint: '#7FD98D',
  terraceSmoke: '#192B25',

  // Surfaces
  surfacePrimary: '#06150F',
  surfaceSecondary: '#0E2219',
  surfaceTertiary: '#192B25',

  // States
  success: '#00A65A',
  warning: '#D4A63A',
  danger: '#E64141',
  info: '#27B4E8',

  // Text
  textPrimary: '#F5F5EF',
  textSecondary: '#B8C4BF',
  textTertiary: '#8EA09A',
  textAccent: '#D4A63A',
} as const;

export type Color = keyof typeof colors;
