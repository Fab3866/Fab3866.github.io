// sound.js — Ambiance sonore ominous — Le Nouveau Léviathan
// Web Audio API, aucun fichier externe
// Démarre sur la première interaction utilisateur (politique navigateur)
(function () {
  let ctx        = null;
  let masterGain = null;
  let started    = false;
  let muted      = false;

  /* ── Oscillateur drone avec LFO lent ── */
  function createDrone(freq, amplitude) {
    const osc   = ctx.createOscillator();
    const gain  = ctx.createGain();

    // Trémolo très lent (0.06–0.10 Hz — quasi imperceptible comme tel)
    const lfo     = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type            = 'sine';
    lfo.frequency.value = 0.06 + Math.random() * 0.04;
    lfoGain.gain.value  = amplitude * 0.35;
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);

    // Dérive légère de pitch (tension)
    const pitchLfo     = ctx.createOscillator();
    const pitchLfoGain = ctx.createGain();
    pitchLfo.frequency.value = 0.025 + Math.random() * 0.02;
    pitchLfoGain.gain.value  = 0.18;
    pitchLfo.connect(pitchLfoGain);
    pitchLfoGain.connect(osc.frequency);

    osc.type            = 'sine';
    osc.frequency.value = freq;
    gain.gain.value     = amplitude;

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(); lfo.start(); pitchLfo.start();
  }

  /* ── Bruit grave filtré (rumble) ── */
  function createRumble() {
    const bufSize = ctx.sampleRate * 3;
    const buffer  = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data    = buffer.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;

    const src    = ctx.createBufferSource();
    src.buffer   = buffer;
    src.loop     = true;

    const filter      = ctx.createBiquadFilter();
    filter.type       = 'lowpass';
    filter.frequency.value = 120;
    filter.Q.value    = 0.7;

    const gain       = ctx.createGain();
    gain.gain.value  = 0.035;

    src.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);
    src.start();
  }

  /* ── Init contexte + lancement ── */
  function init() {
    if (started) return;
    started = true;

    ctx        = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.connect(ctx.destination);

    // Quinte sombre : A1 (55 Hz) + E2 (82.4 Hz) + sub A0 (27.5 Hz)
    createDrone(27.5, 0.18);
    createDrone(55,   0.38);
    createDrone(82.4, 0.22);

    createRumble();

    // Fondu d'entrée en 4 secondes
    masterGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 4);

    createToggleBtn();
  }

  /* ── Son de glitch (static digital bref) ── */
  function playGlitch() {
    if (!ctx || muted) return;

    const dur    = 0.12;
    const buf    = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * dur), ctx.sampleRate);
    const data   = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 1.5);
    }

    const src  = ctx.createBufferSource();
    src.buffer = buf;

    const bpf      = ctx.createBiquadFilter();
    bpf.type       = 'bandpass';
    bpf.frequency.value = 1800 + Math.random() * 3200;
    bpf.Q.value    = 0.9;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);

    src.connect(bpf);
    bpf.connect(gain);
    gain.connect(ctx.destination);
    src.start();
  }

  /* ── Bouton son (style site) ── */
  function createToggleBtn() {
    const btn = document.createElement('button');
    btn.id    = 'btn-sound';
    btn.setAttribute('aria-label', 'Activer / couper le son');
    btn.innerHTML = '<span class="sound-icon">))</span>';
    document.body.appendChild(btn);

    btn.addEventListener('click', () => {
      muted = !muted;
      if (muted) {
        masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
        btn.classList.add('muted');
      } else {
        masterGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.6);
        btn.classList.remove('muted');
      }
    });
  }

  /* ── API publique pour glitch.js ── */
  window.leviathan      = window.leviathan || {};
  window.leviathan.playGlitch = playGlitch;

  /* ── Démarrage sur première interaction ── */
  function onInteraction() {
    init();
  }

  window.addEventListener('load', () => {
    ['scroll', 'click', 'keydown', 'touchstart'].forEach(evt =>
      document.addEventListener(evt, onInteraction, { once: true, passive: true })
    );
  });
})();
