export const clubData = {
  name: 'Genesis FC',
  season: '2025/26',
  league: 'Primeira Liga',
  reputation: 4,
  recentForm: ['W', 'W', 'D', 'L', 'W'] as const,
  stats: {
    leaguePosition: 3,
    points: 67,
    goalDifference: 24,
    nextMatch: 'vs Aurora SC',
    nextMatchDate: 'Sáb, 15 Fev',
  },
  news: [
    {
      id: 1,
      title: 'Torcida lota a arena para estreia do novo técnico',
      summary: 'Mais de 45 mil ingressos vendidos para o clássico de sábado. Expectativa é de casa cheia.',
      impact: 'high' as const,
      timestamp: '2h atrás',
    },
    {
      id: 2,
      title: 'Meia-armador renova contrato até 2028',
      summary: 'Cláusula de rescisão aumenta para €60M. Jogador demonstra comprometimento com o projeto.',
      impact: 'medium' as const,
      timestamp: '5h atrás',
    },
    {
      id: 3,
      title: 'Centro de treinamento recebe nova tecnologia',
      summary: 'Sistema de análise de desempenho será instalado na próxima semana.',
      impact: 'low' as const,
      timestamp: '1 dia atrás',
    },
  ],
};
