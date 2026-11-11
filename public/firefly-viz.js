// Firefly flash patterns: the dataset, replayed in real time.
// Data: Martin et al. (2024), Scientific Reports 14, 3432. Conservation status: Fallon et al. (2021).
(function () {
  var root = document.getElementById('firefly-viz');
  if (!root) return;

  var REST = 2.0; // seconds of dark between bursts, a display choice for this page
  var STATUS = {
    least: { label: 'Least concern', color: '#3ddc57' },
    threat: { label: 'Threatened', color: '#f5a524' }, // check each against Fallon et al. (2021)
    crit: { label: 'Critically endangered', color: '#ff5d5d' }
  };
  var DATA = [
    { name: 'P. frontalis', n: 16, gap: 0.66, dur: 0.04, status: 'least' },
    { name: 'P. carolinus', n: 6, gap: 0.42, dur: 0.12, status: 'least' },
    { name: 'B. wickershamorum', n: 6, gap: 0.82, dur: 0.17, status: 'threat' },
    { name: 'P. forresti', n: 5, gap: 0.51, dur: 0.08, status: 'threat' },
    { name: 'P. knulli', n: 3, gap: 0.34, dur: 0.08, status: 'threat' },
    { name: 'P. obscurellus', n: 2, gap: 0.41, dur: 0.22, status: 'least' },
    { name: 'P. bethaniensis', n: 2, gap: 0.22, dur: 0.07, status: 'crit' }
  ];

  var css = [
    '.fv{background:#0d1117;color:#e6edf3;border-radius:16px;padding:20px;margin:32px 0;font-size:.95rem;line-height:1.4}',
    '.fv *{box-sizing:border-box}',
    '.fv-top{display:flex;flex-wrap:wrap;gap:12px 20px;align-items:center;justify-content:space-between;margin-bottom:16px}',
    '.fv-key{display:flex;flex-wrap:wrap;gap:6px 16px;margin:0;padding:0;list-style:none;font-size:.85rem}',
    '.fv-key li{display:flex;align-items:center;gap:6px}',
    '.fv-chip{width:12px;height:12px;border-radius:50%;display:inline-block}',
    '.fv-ctl{display:flex;gap:8px;flex-wrap:wrap}',
    '.fv-btn{font:inherit;font-size:.85rem;color:#e6edf3;background:#1b2330;border:1px solid #3a4658;border-radius:999px;padding:6px 14px;cursor:pointer}',
    '.fv-btn[aria-pressed="true"]{background:#e6edf3;color:#0d1117}',
    '.fv-btn:focus-visible,.fv-row:focus-visible{outline:3px solid #7cc4ff;outline-offset:2px}',
    '.fv-list{list-style:none;margin:0;padding:0;display:grid;gap:8px}',
    '.fv-row{width:100%;display:grid;grid-template-columns:28px minmax(150px,200px) 1fr;grid-template-areas:"led name track" "led nums track";gap:2px 14px;align-items:center;text-align:left;font:inherit;color:inherit;background:#141b26;border:1px solid #232d3b;border-radius:12px;padding:12px 14px;cursor:pointer;transition:opacity .2s,border-color .2s}',
    '.fv-row:hover{border-color:#4a5a72}',
    '.fv-row[aria-pressed="true"]{border-color:#e6edf3}',
    '.fv.has-solo .fv-row[aria-pressed="false"]{opacity:.35}',
    '.fv-led{grid-area:led;width:22px;height:22px;border-radius:50%;background:var(--c);opacity:.18;transition:opacity .07s,box-shadow .07s}',
    '.fv-led.on{opacity:1;box-shadow:0 0 14px 5px var(--c),0 0 36px 12px var(--c)}',
    '.fv-name{grid-area:name;font-weight:600}',
    '.fv-name i{font-style:italic}',
    '.fv-name small{display:block;font-weight:400;font-size:.8rem;color:#aab6c6}',
    '.fv-nums{grid-area:nums;font-size:.8rem;color:#aab6c6}',
    '.fv-track{grid-area:track;position:relative;height:28px;border-radius:6px;background:#0d1117;overflow:hidden}',
    '.fv-bar{position:absolute;top:4px;bottom:4px;min-width:3px;border-radius:2px;background:var(--c);opacity:.4}',
    '.fv-bar.on{opacity:1}',
    '.fv-note{margin:14px 0 0;font-size:.8rem;color:#aab6c6}',
    '@media (max-width:640px){.fv{padding:14px}.fv-row{grid-template-columns:28px 1fr;grid-template-areas:"led name" "led nums" "track track"}.fv-track{margin-top:8px}}'
  ].join('');
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var running = !reduce, visible = true, sameScale = false, solo = null;
  var elapsed = 0, last = performance.now();

  var fv = document.createElement('div');
  fv.className = 'fv';
  fv.innerHTML =
    '<div class="fv-top"><ul class="fv-key" aria-label="LED color key"></ul>' +
    '<div class="fv-ctl"><button type="button" class="fv-btn" data-act="play" aria-pressed="false"></button>' +
    '<button type="button" class="fv-btn" data-act="scale" aria-pressed="false">Same time scale</button></div></div>' +
    '<ul class="fv-list"></ul>' +
    '<p class="fv-note">Shown in real time. Select a species to isolate it. Each pattern repeats after a ' + REST +
    ' second rest, a choice made for this page.</p>';
  root.appendChild(fv);

  var key = fv.querySelector('.fv-key');
  Object.keys(STATUS).forEach(function (k) {
    var li = document.createElement('li');
    li.innerHTML = '<span class="fv-chip" style="background:' + STATUS[k].color + '"></span>' + STATUS[k].label;
    key.appendChild(li);
  });

  DATA.forEach(function (d) {
    d.burst = d.n * d.dur + (d.n - 1) * d.gap;
    d.cycle = d.burst + REST;
  });
  var maxBurst = Math.max.apply(null, DATA.map(function (d) { return d.burst; }));

  var list = fv.querySelector('.fv-list');
  DATA.forEach(function (d) {
    var s = STATUS[d.status];
    var li = document.createElement('li');
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'fv-row';
    b.setAttribute('aria-pressed', 'false');
    b.style.setProperty('--c', s.color);
    b.innerHTML =
      '<span class="fv-led" aria-hidden="true"></span>' +
      '<span class="fv-name"><i>' + d.name + '</i><small>' + s.label + '</small></span>' +
      '<span class="fv-nums">' + d.n + ' flashes, ' + d.gap + ' s gap, ' + d.dur + ' s each</span>' +
      '<span class="fv-track" aria-hidden="true"></span>';
    li.appendChild(b);
    list.appendChild(li);
    d.btn = b;
    d.led = b.querySelector('.fv-led');
    d.track = b.querySelector('.fv-track');
    d.bars = [];
    for (var k = 0; k < d.n; k++) {
      var bar = document.createElement('span');
      bar.className = 'fv-bar';
      d.track.appendChild(bar);
      d.bars.push(bar);
    }
    b.addEventListener('click', function () {
      solo = solo === d ? null : d;
      DATA.forEach(function (x) { x.btn.setAttribute('aria-pressed', String(x === solo)); });
      fv.classList.toggle('has-solo', !!solo);
    });
  });

  function layout() {
    DATA.forEach(function (d) {
      var T = sameScale ? maxBurst : d.burst;
      d.bars.forEach(function (bar, k) {
        bar.style.left = (k * (d.dur + d.gap) / T * 100) + '%';
        bar.style.width = (d.dur / T * 100) + '%';
      });
    });
  }
  layout();

  var playBtn = fv.querySelector('[data-act="play"]');
  var scaleBtn = fv.querySelector('[data-act="scale"]');
  function playLabel() {
    playBtn.textContent = running ? 'Pause' : 'Play';
    playBtn.setAttribute('aria-pressed', String(!running));
  }
  playBtn.addEventListener('click', function () { running = !running; last = performance.now(); playLabel(); frame(); });
  scaleBtn.addEventListener('click', function () {
    sameScale = !sameScale;
    scaleBtn.setAttribute('aria-pressed', String(sameScale));
    layout();
  });
  playLabel();

  function paint() {
    DATA.forEach(function (d) {
      var tt = elapsed % d.cycle;
      var k = Math.floor(tt / (d.dur + d.gap));
      var within = tt - k * (d.dur + d.gap);
      var on = k < d.n && within < d.dur;
      d.led.classList.toggle('on', on);
      d.bars.forEach(function (bar, i) { bar.classList.toggle('on', on && i === k); });
    });
  }
  function clearAll() {
    DATA.forEach(function (d) {
      d.led.classList.remove('on');
      d.bars.forEach(function (bar) { bar.classList.remove('on'); });
    });
  }

  var raf = null;
  function frame() {
    if (raf) return;
    raf = requestAnimationFrame(tick);
  }
  function tick(now) {
    raf = null;
    if (!running || !visible) { clearAll(); return; }
    elapsed += (now - last) / 1000;
    last = now;
    paint();
    raf = requestAnimationFrame(tick);
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      visible = es[0].isIntersecting;
      last = performance.now();
      if (visible && running) frame();
    }).observe(fv);
  }
  if (running) frame();

  window.__fv = { data: DATA, get running() { return running; } };
})();
