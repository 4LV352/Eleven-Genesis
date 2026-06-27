export const typography = {
  families: {
    display: 'Bebas Neue, sans-serif',
    body: 'Inter, system-ui, sans-serif',
  },

  scales: {
    display: {
      fontSize: '4rem',
      lineHeight: '0.9',
      fontWeight: '900',
      letterSpacing: '0',
    },
    h1: {
      fontSize: '2.5rem',
      lineHeight: '1.1',
      fontWeight: '700',
      letterSpacing: '0',
    },
    h2: {
      fontSize: '2rem',
      lineHeight: '1.2',
      fontWeight: '700',
    },
    h3: {
      fontSize: '1.5rem',
      lineHeight: '1.3',
      fontWeight: '600',
    },
    body: {
      fontSize: '1rem',
      lineHeight: '1.5',
      fontWeight: '400',
    },
    bodySmall: {
      fontSize: '0.875rem',
      lineHeight: '1.5',
      fontWeight: '400',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: '1.4',
      fontWeight: '500',
    },
    label: {
      fontSize: '0.625rem',
      lineHeight: '1.3',
      fontWeight: '700',
      letterSpacing: '0.15em',
      textTransform: 'uppercase' as const,
    },
  },
} as const;

export type TypographyScale = keyof typeof typography.scales;
