// Progressive enhancement only. Every page reads fully without this file.
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 1. Reveal on scroll (fallback where CSS scroll timelines are missing, and for headings)
const targets = document.querySelectorAll('.fig, .gallery, .chapter-head, .loop-wrap, [data-reveal]');
if ('IntersectionObserver' in window && !reduce) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.05 }
  );
  targets.forEach((el) => io.observe(el));
} else {
  targets.forEach((el) => el.classList.add('in'));
}

// 2. Third-party video only loads after an explicit click
document.querySelectorAll('.embed-facade').forEach((box) => {
  const btn = box.querySelector('.embed-load');
  if (!btn) return;
  btn.hidden = false;
  btn.addEventListener('click', () => {
    const f = document.createElement('iframe');
    f.src = box.dataset.src;
    f.title = box.dataset.title || 'Video';
    f.allow = 'fullscreen; picture-in-picture';
    f.allowFullscreen = true;
    box.replaceWith(f);
    f.focus();
  });
});

// 3. Pinned sequence (ReadIt): a sticky figure whose image and caption change with scroll
const wide = window.matchMedia('(min-width: 720px)');
if (!reduce && wide.matches && document.documentElement.classList.contains('t-readit')) {
  document.querySelectorAll('.gallery').forEach((g) => {
    const figs = [...g.querySelectorAll(':scope > .fig')];
    if (figs.length < 2) return;
    const stage = document.createElement('div');
    stage.className = 'sequence-stage';
    const count = document.createElement('p');
    count.className = 'sequence-count';
    count.setAttribute('aria-hidden', 'true');
    const stack = document.createElement('div');
    stack.className = 'sequence-stack';
    figs.forEach((f) => stack.appendChild(f));
    stage.append(count, stack);
    g.appendChild(stage);
    g.classList.add('sequence');
    g.classList.remove('gallery');

    let active = -1;
    const update = () => {
      const r = g.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      const p = span > 0 ? Math.min(0.999, Math.max(0, -r.top / span)) : 0;
      const i = Math.floor(p * figs.length);
      if (i === active) return;
      active = i;
      figs.forEach((f, k) => f.classList.toggle('is-active', k === i));
      count.textContent = String(i + 1).padStart(2, '0') + ' / ' + String(figs.length).padStart(2, '0');
    };
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { ticking = false; update(); });
    }, { passive: true });
    update();
  });
}

// 4. Image zoom: every figure opens full size in a dialog (Esc or click closes)
const figs = document.querySelectorAll('.story .fig');
if (figs.length && 'HTMLDialogElement' in window) {
  const dlg = document.createElement('dialog');
  dlg.className = 'lightbox';
  dlg.setAttribute('aria-label', 'Image, full size');
  dlg.innerHTML = '<div class="lightbox-inner"><div class="lightbox-scroll" tabindex="0"><img alt="" /></div><p></p></div><button type="button" class="lightbox-close">Close</button>';
  document.body.appendChild(dlg);
  const big = dlg.querySelector('img');
  const cap = dlg.querySelector('p');
  const close = () => dlg.close();
  dlg.querySelector('.lightbox-close').addEventListener('click', close);
  big.addEventListener('click', close);
  dlg.addEventListener('click', (e) => { if (e.target === dlg || e.target.classList.contains('lightbox-scroll')) close(); });
  figs.forEach((fig) => {
    const img = fig.querySelector('img');
    const frame = fig.querySelector('.fig-frame');
    if (!img || !frame) return;
    const open = () => {
      big.src = img.currentSrc || img.src;
      big.alt = img.alt;
      cap.textContent = img.alt;
      dlg.classList.toggle('wide', fig.classList.contains('strip'));
      dlg.showModal();
    };
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'fig-zoom';
    btn.setAttribute('aria-label', 'View full size: ' + img.alt);
    btn.textContent = '+';
    btn.addEventListener('click', open);
    frame.appendChild(btn);
    img.classList.add('zoomable');
    img.addEventListener('click', open);
  });
}
