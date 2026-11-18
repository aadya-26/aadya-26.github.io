// Signature interaction: a field of conductive threads.
// - threads part around the cursor and twang back like plucked strings
// - a click or tap sends a pulse of current through the cloth
// - small sewn "LEDs" wake when the cursor or a pulse reaches them
// Decorative only (aria-hidden). Static under prefers-reduced-motion.
// On touch screens it stays still until a tap sends one pulse.
export function initThreads(canvas, host) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const live = !reduce && fine;
  const GAP = 24, STEP = 26, R = 200;
  const COLORS = ['#c7d4ff'];
  let w = 0, h = 0, cols = 0, rows = 0, off = null, vel = null, leds = [], pulses = [];
  let px = -9999, py = -9999, scrollK = 0, raf = 0, running = false, visible = true, t0 = 0;

  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

  function build() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(w / GAP) + 1; rows = Math.ceil(h / STEP) + 2;
    off = new Float32Array(cols * rows); vel = new Float32Array(cols * rows);
    seed = 7; leds = [];
    const n = Math.max(5, Math.round((w * h) / 105000));
    for (let i = 0; i < n; i++) {
      leds.push({ c: Math.floor(rnd() * cols), r: 1 + Math.floor(rnd() * (rows - 3)), color: COLORS[i % COLORS.length], glow: reduce ? (i % 3 === 0 ? 0.7 : 0.15) : 0 });
    }
  }

  function draw(now) {
    const t = now / 1000;
    const intro = live ? Math.max(0, 1 - (now - t0) / 1800) : 0;
    const introK = intro * intro;
    ctx.clearRect(0, 0, w, h);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(239, 238, 234, 0.17)';
    let energy = 0;
    for (let c = 0; c < cols; c++) {
      const x = c * GAP;
      ctx.beginPath();
      let prevX = 0, prevY = 0;
      for (let r = 0; r < rows; r++) {
        const y = r * STEP - STEP / 2;
        const i = c * rows + r;
        let target = 0;
        if (live) {
          target = Math.sin(y * 0.011 + t * 0.55 + c * 0.33) * 2.4;
          target += Math.sin(y * 0.018 - scrollK * 7 + c * 0.2) * scrollK * 14;
          target += Math.sin(y * 0.02 + c * 0.5 + t * 3) * 46 * introK;
          const dx = x - px, dy = y - py, d2 = dx * dx + dy * dy;
          if (d2 < R * R) {
            const f = 1 - Math.sqrt(d2) / R;
            target += f * f * 44 * (dx >= 0 ? 1 : -1);
          }
        }
        for (const p of pulses) {
          const dx = x - p.x, dy = y - p.y, d = Math.sqrt(dx * dx + dy * dy);
          const band = Math.abs(d - p.rad);
          if (band < 70) target += (1 - band / 70) * 30 * p.life * (dx >= 0 ? 1 : -1);
        }
        if (reduce) off[i] = target;
        else {
          vel[i] = (vel[i] + (target - off[i]) * 0.09) * 0.84;
          off[i] += vel[i];
          energy += Math.abs(vel[i]);
        }
        const xx = x + off[i];
        if (r === 0) ctx.moveTo(xx, y);
        else ctx.quadraticCurveTo(prevX, prevY, (prevX + xx) / 2, (prevY + y) / 2);
        prevX = xx; prevY = y;
      }
      ctx.lineTo(prevX, prevY);
      ctx.stroke();
    }
    for (const p of pulses) {
      ctx.strokeStyle = `rgba(199, 212, 255, ${0.3 * p.life})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.rad, 0, 6.2832); ctx.stroke();
    }
    for (const l of leds) {
      const y = l.r * STEP - STEP / 2;
      const x = l.c * GAP + off[l.c * rows + l.r];
      if (!reduce) {
        let hit = live && Math.hypot(x - px, y - py) < R * 0.9;
        for (const p of pulses) if (Math.abs(Math.hypot(x - p.x, y - p.y) - p.rad) < 60) hit = true;
        if (hit) l.glow = Math.min(1, l.glow + 0.14);
        else l.glow *= 0.985;
        energy += l.glow > 0.03 ? 1 : 0;
      }
      const g = l.glow;
      if (g > 0.02) {
        const rad = 8 + g * 38;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, rad);
        grad.addColorStop(0, l.color + 'cc');
        grad.addColorStop(1, l.color + '00');
        ctx.globalAlpha = g;
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(x, y, rad, 0, 6.2832); ctx.fill();
      }
      ctx.globalAlpha = 0.35 + g * 0.65;
      ctx.fillStyle = l.color;
      ctx.beginPath(); ctx.arc(x, y, 2.2 + g * 1.4, 0, 6.2832); ctx.fill();
      ctx.globalAlpha = 1;
    }
    return energy;
  }

  let last = 0;
  function frame(now) {
    if (!running) return;
    const dt = Math.min(0.05, (now - (last || now)) / 1000); last = now;
    for (const p of pulses) { p.rad += 620 * dt; p.life -= dt / 1.9; }
    pulses = pulses.filter((p) => p.life > 0);
    const energy = draw(now);
    // on touch screens, go still again once the cloth has settled
    if (!live && !pulses.length && energy < 0.5) { running = false; return; }
    raf = requestAnimationFrame(frame);
  }
  function start() { if (!reduce && visible && !running) { running = true; last = 0; raf = requestAnimationFrame(frame); } }
  function stop() { running = false; cancelAnimationFrame(raf); }

  build();
  t0 = performance.now();
  draw(t0);

  let resizeT;
  window.addEventListener('resize', () => { clearTimeout(resizeT); resizeT = setTimeout(() => { build(); draw(performance.now()); }, 120); });
  if (reduce) return;

  (host || canvas).addEventListener('pointerdown', (e) => {
    const b = canvas.getBoundingClientRect();
    if (pulses.length < 4) pulses.push({ x: e.clientX - b.left, y: e.clientY - b.top, rad: 0, life: 1 });
    start();
  }, { passive: true });
  new IntersectionObserver((es) => { visible = es[0].isIntersecting; visible && live && !document.hidden ? start() : (!visible && stop()); }).observe(canvas);
  if (!live) return;

  window.addEventListener('pointermove', (e) => {
    const b = canvas.getBoundingClientRect();
    px = e.clientX - b.left; py = e.clientY - b.top;
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => { px = py = -9999; });
  window.addEventListener('scroll', () => { scrollK = Math.min(1, window.scrollY / Math.max(1, window.innerHeight)); }, { passive: true });
  document.addEventListener('visibilitychange', () => { document.hidden ? stop() : start(); });
}
