import { useState } from 'react';
import type { ReactNode } from 'react';
import { ClubHeader } from '../components/ClubHeader';
import { BottomNav } from '../components/BottomNav';
import { StatCard } from '../components/StatCard';
import { NewsCard } from '../components/NewsCard';
import { Logo } from '../components/Logo';
import { clubData } from '../data/clubData';

export function ClubDashboard() {
  const [activeTab, setActiveTab] = useState('club');

  return (
    <div className="stadium-world min-h-screen bg-surface-primary text-text-primary">
      <ClubHeader
        clubName={clubData.name}
        season={clubData.season}
        league={clubData.league}
        reputation={clubData.reputation}
        recentForm={[...clubData.recentForm]}
      />

      <main className="mx-auto max-w-6xl px-5 pb-32 pt-6 sm:px-8">
        {/* Hero: Próxima Partida */}
        <section className="hero-spotlight matchday-hero relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-surface-secondary via-surface-tertiary to-surface-secondary p-6 sm:p-8">
          <div className="pitch-lines pointer-events-none absolute inset-0 opacity-40" aria-hidden />
          <div className="relative z-10">
            <div className="mb-4 flex items-center gap-2">
              <span className="live-dot inline-block h-2 w-2 rounded-full bg-danger" />
              <p className="text-xs font-bold uppercase text-danger">Próxima Partida</p>
            </div>
            <h2 className="font-display text-4xl leading-none font-black text-text-primary sm:text-6xl">
              GENESIS FC
              <span className="mx-3 text-text-tertiary">×</span>
              AURORA SC
            </h2>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="rounded-sm border border-legacy-gold/40 bg-legacy-gold/10 px-3 py-1 text-xs font-bold text-legacy-gold">
                Primeira Liga • Rodada 26
              </span>
              <span className="text-sm text-text-secondary">{clubData.stats.nextMatchDate} • 20:30</span>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => setActiveTab('squad')}
                className="cta-button min-h-11 rounded-sm bg-genesis-turf px-5 py-3 text-sm font-bold text-surface-primary transition active:scale-95"
              >
                Definir Escalação
              </button>
              <button
                onClick={() => setActiveTab('matches')}
                className="min-h-11 rounded-sm border border-white/30 px-5 py-3 text-sm font-semibold text-text-primary transition hover:border-white/60 active:scale-95"
              >
                Ver Partidas
              </button>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="mt-8">
          <h3 className="mb-4 text-xl font-bold text-text-primary">Panorama do Clube</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="Posição na Liga" value={`${clubData.stats.leaguePosition}º`} trend="up" icon={<TrophyIcon />} />
            <StatCard label="Pontos" value={clubData.stats.points} icon={<StarIcon />} />
            <StatCard label="Saldo de Gols" value={`+${clubData.stats.goalDifference}`} trend="up" icon={<BallIcon />} />
            <StatCard label="Moral" value="Alta" trend="up" icon={<PulseIcon />} />
          </div>
        </section>

        {/* Últimas Notícias */}
        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-text-primary">Últimas Notícias</h3>
            <button
              onClick={() => setActiveTab('club')}
              className="min-h-11 px-2 text-xs font-semibold text-legacy-gold hover:text-legacy-gold/80 active:scale-95"
            >
              Ver todas →
            </button>
          </div>
          <div className="space-y-3">
            {clubData.news.map((item) => (
              <NewsCard
                key={item.id}
                title={item.title}
                summary={item.summary}
                impact={item.impact}
                timestamp={item.timestamp}
              />
            ))}
          </div>
        </section>

        {/* Destaques do Elenco */}
        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-text-primary">Destaques do Elenco</h3>
            <button
              onClick={() => setActiveTab('squad')}
              className="min-h-11 px-2 text-xs font-semibold text-legacy-gold hover:text-legacy-gold/80 active:scale-95"
            >
              Ver elenco →
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <PlayerHighlight
              name="M. Silva"
              position="MEI"
              rating={8.7}
              form="up"
              status="Titular"
            />
            <PlayerHighlight
              name="J. Oliveira"
              position="ATA"
              rating={8.2}
              form="up"
              status="Titular"
            />
            <PlayerHighlight
              name="R. Costa"
              position="ZAG"
              rating={7.5}
              form="neutral"
              status="Reserva"
            />
          </div>
        </section>

        <footer className="mt-12 flex items-center justify-center border-t border-white/10 pt-6">
          <Logo variant="full" size="sm" />
        </footer>
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

function IconShell({ children }: { children: ReactNode }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function TrophyIcon() {
  return (
    <IconShell>
      <path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" />
      <path d="M8 6H4v2a4 4 0 0 0 4 4" />
      <path d="M16 6h4v2a4 4 0 0 1-4 4" />
      <path d="M12 13v5" />
      <path d="M9 20h6" />
    </IconShell>
  );
}

function StarIcon() {
  return (
    <IconShell>
      <path d="m12 3 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7L6.8 19l1-5.8L3.6 9.1l5.8-.8L12 3Z" />
    </IconShell>
  );
}

function BallIcon() {
  return (
    <IconShell>
      <circle cx="12" cy="12" r="8" />
      <path d="m12 8 3 2v4l-3 2-3-2v-4l3-2Z" />
      <path d="m5.5 10 3.5.5" />
      <path d="m18.5 10-3.5.5" />
      <path d="m8 18 2-3" />
      <path d="m16 18-2-3" />
    </IconShell>
  );
}

function PulseIcon() {
  return (
    <IconShell>
      <path d="M4 13h3l2-6 4 12 2-6h5" />
    </IconShell>
  );
}

type PlayerHighlightProps = {
  name: string;
  position: string;
  rating: number;
  form: 'up' | 'down' | 'neutral';
  status: string;
};

function PlayerHighlight({ name, position, rating, form, status }: PlayerHighlightProps) {
  return (
    <div className="rounded-md border border-white/10 bg-surface-secondary p-4 transition hover:border-white/20">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-text-tertiary">{position}</p>
          <p className="mt-1 text-base font-bold text-text-primary">{name}</p>
          <p className="mt-1 text-xs text-text-secondary">{status}</p>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-black text-legacy-gold">{rating.toFixed(1)}</span>
          <span
            className={`text-xs font-bold ${
              form === 'up' ? 'text-success' : form === 'down' ? 'text-danger' : 'text-text-tertiary'
            }`}
          >
            {form === 'up' ? 'Em alta' : form === 'down' ? 'Em baixa' : 'Estável'}
          </span>
        </div>
      </div>
    </div>
  );
}
