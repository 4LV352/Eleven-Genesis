import { Logo } from '../Logo';

type ClubHeaderProps = {
  clubName: string;
  season: string;
  league: string;
  reputation: number;
  recentForm: ('W' | 'D' | 'L')[];
};

export function ClubHeader({ clubName, season, league, reputation, recentForm }: ClubHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 bg-surface-primary px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-md border border-legacy-gold/30 bg-legacy-gold/10">
          <Logo variant="symbol" size="sm" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-text-primary">{clubName}</h1>
          <p className="text-xs text-text-secondary">{season} • {league}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-xs text-text-tertiary">Reputação</p>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`text-sm ${i < reputation ? 'text-legacy-gold' : 'text-text-tertiary'}`}
              >
                ★
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex gap-1">
          {recentForm.map((result, i) => (
            <span
              key={i}
              className={`flex h-7 w-7 items-center justify-center rounded-sm text-xs font-bold ${
                result === 'W'
                  ? 'bg-success/20 text-success'
                  : result === 'D'
                  ? 'bg-warning/20 text-warning'
                  : 'bg-danger/20 text-danger'
              }`}
            >
              {result === 'W' ? 'V' : result === 'D' ? 'E' : 'D'}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
