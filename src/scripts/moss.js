// After Us, the Wild: moss that takes the page back.
// It creeps in from the edges as you scroll, and grows where the cursor passes.
// Drawn behind the content in dark greens so text contrast holds. Decorative only.
export function initMoss(canvas) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w = 0, h = 0, tufts = [], trail = [], raf = 0, p = 0;

  let seed = 11;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

  // pre-render a few fuzzy clumps once; drawing them is then one drawImage each
  function sprite(colors, n) {
    const c = document.createElement('canvas');
    c.width = c.height = 96;
    const g = c.getContext('2d');
    for (let i = 0; i < n; i++) {
      const a = rnd() * 6.2832, d = Math.pow(rnd(), 0.7) * 40;
      g.globalAlpha = 0.35 + rnd() * 0.55;
      g.fillStyle = colors[Math.floor(rnd() * colors.length)];
      g.beginPath();
      g.arc(48 + Math.cos(a) * d, 48 + Math.sin(a) * d, 1 + rnd() * 3.2, 0, 6.2832);
      g.fill();
    }
    return c;
  }
  const dark = ['#14230e', '#1c3214', '#26431a', '#31531d'];
  const lit = ['#26431a', '#31531d', '#44702a', '#5c8a36'];
  const sprites = [sprite(dark, 150), sprite(dark, 190), sprite(dark, 120)];
  const edgeSprites = [sprite(lit, 170), sprite(lit, 130)];

  function build() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed = 11; tufts = [];
    const n = Math.max(500, Math.min(2400, Math.round((w * h) / 620)));
    for (let i = 0; i < n; i++) {
      const x = rnd() * w, y = rnd() * h;
      const ex = Math.min(x, w - x) / (w / 2);
      const ey = Math.min(y, h - y) / (h / 2);
      const e = Math.min(ex, ey * 1.5 + 0.1);
      const t = Math.pow(e, 0.75) * 1.12 + rnd() * 0.22 - 0.1;
      if (t > 1.02 || (w < 700 && e > 0.55)) continue; // the middle of the page stays clear
      const edge = e < 0.14 && rnd() < 0.6;
      tufts.push({ x, y, t, a: e > 0.3 ? 0.5 : 1, s: (30 + rnd() * 70) * (w < 700 ? 0.6 : 1), img: edge ? edgeSprites[i % 2] : sprites[i % 3], r: rnd() * 6.2832 });
    }
    tufts.sort((a, b) => a.t - b.t);
  }

  function progress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const raw = max > 0 ? window.scrollY / max : 0;
    return 0.07 + Math.min(1, raw) * 0.93;
  }

  function draw(now) {
    ctx.clearRect(0, 0, w, h);
    for (const m of tufts) {
      if (m.t > p) break;
      const g = Math.min(1, (p - m.t) / 0.1);
      const s = m.s * (0.4 + 0.6 * g);
      ctx.globalAlpha = g * m.a;
      ctx.drawImage(m.img, m.x - s / 2, m.y - s / 2, s, s);
    }
    let growing = false;
    for (const m of trail) {
      const g = Math.min(1, (now - m.born) / 700);
      if (g < 1) growing = true;
      const s = m.s * (0.25 + 0.75 * g);
      ctx.globalAlpha = g * 0.9;
      ctx.drawImage(m.img, m.x - s / 2, m.y - s / 2, s, s);
    }
    ctx.globalAlpha = 1;
    return growing;
  }
  function tick(now) {
    raf = 0;
    p = progress();
    if (draw(now)) raf = requestAnimationFrame(tick);
  }
  const request = () => { if (!raf) raf = requestAnimationFrame(tick); };

  build();
  p = reduce ? 0.55 : progress();
  draw(performance.now());

  let resizeT;
  window.addEventListener('resize', () => { clearTimeout(resizeT); resizeT = setTimeout(() => { build(); request(); }, 150); });
  if (reduce) return;
  window.addEventListener('scroll', request, { passive: true });

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let lx = -999, ly = -999;
    window.addEventListener('pointermove', (e) => {
      if (Math.hypot(e.clientX - lx, e.clientY - ly) < 22) return;
      lx = e.clientX; ly = e.clientY;
      trail.push({ x: lx + (Math.random() - 0.5) * 26, y: ly + (Math.random() - 0.5) * 26, s: 26 + Math.random() * 44, img: sprites[trail.length % 3], born: performance.now() });
      if (trail.length > 320) trail.shift();
      request();
    }, { passive: true });
  }
}
