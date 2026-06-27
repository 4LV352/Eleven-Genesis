type LogoProps = {
  variant?: 'full' | 'symbol';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const sizes = {
  sm: { width: 120, height: 32 },
  md: { width: 180, height: 48 },
  lg: { width: 240, height: 64 },
};

const symbolSizes = {
  sm: { width: 32, height: 32 },
  md: { width: 48, height: 48 },
  lg: { width: 64, height: 64 },
};

export function Logo({ variant = 'full', size = 'md', className = '' }: LogoProps) {
  if (variant === 'symbol') {
    const { width, height } = symbolSizes[size];
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Shield shape */}
        <path
          d="M32 4L8 14V32C8 46 18 58 32 60C46 58 56 46 56 32V14L32 4Z"
          fill="var(--color-surface-tertiary)"
          stroke="var(--color-legacy-gold)"
          strokeWidth="2"
        />
        {/* Inner shield */}
        <path
          d="M32 10L14 18V32C14 43 22 52 32 54C42 52 50 43 50 32V18L32 10Z"
          fill="var(--color-surface-primary)"
          stroke="var(--color-genesis-turf)"
          strokeWidth="1.5"
        />
        {/* Eleven symbol */}
        <g>
          {/* First I */}
          <rect x="22" y="24" width="3" height="16" fill="var(--color-legacy-gold)" />
          <rect x="21" y="23" width="5" height="2" fill="var(--color-legacy-gold)" />
          <rect x="21" y="39" width="5" height="2" fill="var(--color-legacy-gold)" />
          {/* Second I */}
          <rect x="39" y="24" width="3" height="16" fill="var(--color-legacy-gold)" />
          <rect x="38" y="23" width="5" height="2" fill="var(--color-legacy-gold)" />
          <rect x="38" y="39" width="5" height="2" fill="var(--color-legacy-gold)" />
          {/* Football */}
          <circle cx="32" cy="32" r="6" fill="var(--color-genesis-turf)" stroke="var(--color-floodlight-ivory)" strokeWidth="0.5" />
          <path
            d="M32 26L34.5 28L34.5 36L32 38L29.5 36L29.5 28L32 26Z"
            fill="none"
            stroke="var(--color-floodlight-ivory)"
            strokeWidth="0.5"
          />
        </g>
        {/* Star */}
        <path
          d="M32 16L33.5 19.5L37 19.5L34.5 21.5L35.5 25L32 23L28.5 25L29.5 21.5L27 19.5L30.5 19.5L32 16Z"
          fill="var(--color-legacy-gold)"
        />
      </svg>
    );
  }

  const { width, height } = sizes[size];
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 240 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Symbol */}
      <g transform="translate(0, 0)">
        <path
          d="M32 4L8 14V32C8 46 18 58 32 60C46 58 56 46 56 32V14L32 4Z"
          fill="var(--color-surface-tertiary)"
          stroke="var(--color-legacy-gold)"
          strokeWidth="2"
        />
        <path
          d="M32 10L14 18V32C14 43 22 52 32 54C42 52 50 43 50 32V18L32 10Z"
          fill="var(--color-surface-primary)"
          stroke="var(--color-genesis-turf)"
          strokeWidth="1.5"
        />
        <g>
          <rect x="22" y="24" width="3" height="16" fill="var(--color-legacy-gold)" />
          <rect x="21" y="23" width="5" height="2" fill="var(--color-legacy-gold)" />
          <rect x="21" y="39" width="5" height="2" fill="var(--color-legacy-gold)" />
          <rect x="39" y="24" width="3" height="16" fill="var(--color-legacy-gold)" />
          <rect x="38" y="23" width="5" height="2" fill="var(--color-legacy-gold)" />
          <rect x="38" y="39" width="5" height="2" fill="var(--color-legacy-gold)" />
          <circle cx="32" cy="32" r="6" fill="var(--color-genesis-turf)" stroke="var(--color-floodlight-ivory)" strokeWidth="0.5" />
          <path
            d="M32 26L34.5 28L34.5 36L32 38L29.5 36L29.5 28L32 26Z"
            fill="none"
            stroke="var(--color-floodlight-ivory)"
            strokeWidth="0.5"
          />
        </g>
        <path
          d="M32 16L33.5 19.5L37 19.5L34.5 21.5L35.5 25L32 23L28.5 25L29.5 21.5L27 19.5L30.5 19.5L32 16Z"
          fill="var(--color-legacy-gold)"
        />
      </g>
      
      {/* Wordmark */}
      <text
        x="72"
        y="38"
        fontFamily="Bebas Neue, sans-serif"
        fontSize="32"
        fontWeight="700"
        fill="var(--color-floodlight-ivory)"
        letterSpacing="0"
      >
        ELEVEN
      </text>
      <text
        x="72"
        y="52"
        fontFamily="Bebas Neue, sans-serif"
        fontSize="14"
        fontWeight="700"
        fill="var(--color-legacy-gold)"
        letterSpacing="0"
      >
        GENESIS
      </text>
    </svg>
  );
}
