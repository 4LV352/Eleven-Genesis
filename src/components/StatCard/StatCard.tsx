import type { ReactNode } from 'react';

type StatCardProps = {
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: ReactNode;
};

export function StatCard({ label, value, trend = 'neutral', icon }: StatCardProps) {
  return (
    <div className="rounded-md border border-white/10 bg-surface-secondary p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-text-tertiary">{label}</p>
          <p className="mt-2 text-2xl font-bold text-text-primary">{value}</p>
        </div>
        {icon && <span className="text-legacy-gold">{icon}</span>}
      </div>
      {trend !== 'neutral' && (
        <div className="mt-2 flex items-center gap-1">
          <span className={`text-xs font-semibold ${trend === 'up' ? 'text-success' : 'text-danger'}`}>
            {trend === 'up' ? '↑' : '↓'}
          </span>
          <span className="text-xs text-text-secondary">vs última semana</span>
        </div>
      )}
    </div>
  );
}
