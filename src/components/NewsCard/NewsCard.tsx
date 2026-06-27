type NewsCardProps = {
  title: string;
  summary: string;
  impact: 'high' | 'medium' | 'low';
  timestamp: string;
};

const impactStyles = {
  high: 'bg-danger/20 text-danger border-danger/30',
  medium: 'bg-warning/20 text-warning border-warning/30',
  low: 'bg-tactical-sky/20 text-tactical-sky border-tactical-sky/30',
};

const impactLabels = {
  high: 'URGENTE',
  medium: 'IMPORTANTE',
  low: 'INFORMATIVO',
};

export function NewsCard({ title, summary, impact, timestamp }: NewsCardProps) {
  return (
    <div className="rounded-md border border-white/10 bg-surface-secondary p-4 transition-all hover:border-white/20">
      <div className="mb-3 flex items-center justify-between">
        <span className={`rounded-sm border px-2 py-0.5 text-xs font-bold ${impactStyles[impact]}`}>
          {impactLabels[impact]}
        </span>
        <span className="text-xs text-text-tertiary">{timestamp}</span>
      </div>
      <h3 className="text-base font-bold text-text-primary">{title}</h3>
      <p className="mt-2 text-sm text-text-secondary">{summary}</p>
    </div>
  );
}
