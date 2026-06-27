type NavItem = {
  id: string;
  label: string;
  icon: 'club' | 'squad' | 'matches' | 'market' | 'finances';
};

type BottomNavProps = {
  activeTab: string;
  onTabChange: (tabId: string) => void;
};

const navItems: NavItem[] = [
  { id: 'club', label: 'Clube', icon: 'club' },
  { id: 'squad', label: 'Elenco', icon: 'squad' },
  { id: 'matches', label: 'Partidas', icon: 'matches' },
  { id: 'market', label: 'Mercado', icon: 'market' },
  { id: 'finances', label: 'Finanças', icon: 'finances' },
];

function NavIcon({ type }: { type: NavItem['icon'] }) {
  const common = {
    width: 24,
    height: 24,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  if (type === 'club') {
    return (
      <svg {...common}>
        <path d="M4 10 12 5l8 5" />
        <path d="M6 10v8h12v-8" />
        <path d="M10 18v-5h4v5" />
      </svg>
    );
  }

  if (type === 'squad') {
    return (
      <svg {...common}>
        <path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        <path d="M16 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
        <path d="M3 20a5 5 0 0 1 10 0" />
        <path d="M13 18a4 4 0 0 1 8 0" />
      </svg>
    );
  }

  if (type === 'matches') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="8" />
        <path d="m12 8 3 2v4l-3 2-3-2v-4l3-2Z" />
        <path d="m5.5 10 3.5.5" />
        <path d="m18.5 10-3.5.5" />
        <path d="m8 18 2-3" />
        <path d="m16 18-2-3" />
      </svg>
    );
  }

  if (type === 'market') {
    return (
      <svg {...common}>
        <path d="M6 7h12l1 13H5L6 7Z" />
        <path d="M9 7a3 3 0 0 1 6 0" />
        <path d="M9 13h6" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M4 18h16" />
      <path d="M7 18V9" />
      <path d="M12 18V5" />
      <path d="M17 18v-7" />
      <path d="M6 9h2" />
      <path d="M11 5h2" />
      <path d="M16 11h2" />
    </svg>
  );
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-surface-primary/95 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-around px-2 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex min-h-12 min-w-14 flex-col items-center gap-1 rounded-md px-3 py-2 transition-all active:scale-95 ${
              activeTab === item.id
                ? 'text-legacy-gold'
                : 'text-text-tertiary hover:text-text-secondary'
            }`}
          >
            <NavIcon type={item.icon} />
            <span className="text-xs font-semibold">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
