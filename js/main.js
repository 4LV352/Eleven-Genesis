// Bottom Navigation
const bottomNavItems = document.querySelectorAll('.bottom-nav__item');

bottomNavItems.forEach(item => {
  item.addEventListener('click', () => {
    bottomNavItems.forEach(i => i.classList.remove('bottom-nav__item--active'));
    item.classList.add('bottom-nav__item--active');
  });
});

// Player Card
const playerCard = {
  info: {
    name: 'player-card__name',
    position: 'player-card__position',
    status: 'player-card__status'
  },
  stats: {
    rating: 'player-card__rating',
    form: 'player-card__form'
  }
};

// News Card
const newsCard = {
  impact: {
    high: 'news-card__impact--high',
    medium: 'news-card__impact--medium',
    low: 'news-card__impact--low'
  }
};

// Result Badge
const resultBadge = {
  win: 'result-badge--win',
  draw: 'result-badge--draw',
  loss: 'result-badge--loss'
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    playerCard,
    newsCard,
    resultBadge
  };
}
