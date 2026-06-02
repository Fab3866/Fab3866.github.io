// glitch.js — Effet glitch subtil pour Le Nouveau Léviathan
(function () {
  const MIN_INTERVAL = 4000;   // ms entre deux glitches
  const MAX_INTERVAL = 12000;

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function activate(hero, title) {
    // Position aléatoire de la ligne de scan
    hero.style.setProperty('--glitch-y', Math.floor(rand(8, 88)) + '%');
    hero.classList.add('is-glitching');
    if (title) title.classList.add('is-glitching');
  }

  function deactivate(hero, title) {
    hero.classList.remove('is-glitching');
    if (title) title.classList.remove('is-glitching');
  }

  function triggerGlitch(hero, title) {
    activate(hero, title);

    const duration = rand(240, 320);

    setTimeout(() => {
      deactivate(hero, title);

      // 40 % de chance d'un double-hit (deux impulsions rapprochées)
      if (Math.random() < 0.4) {
        setTimeout(() => {
          activate(hero, title);
          setTimeout(() => deactivate(hero, title), rand(50, 110));
        }, rand(90, 180));
      }
    }, duration);

    // Planifier le prochain glitch
    setTimeout(() => triggerGlitch(hero, title), rand(MIN_INTERVAL, MAX_INTERVAL));
  }

  window.addEventListener('load', function () {
    const hero  = document.getElementById('hero');
    const title = document.querySelector('.hero-title');
    if (!hero) return;

    // Délai initial avant le premier glitch
    setTimeout(() => triggerGlitch(hero, title), rand(2500, 6000));
  });
})();
