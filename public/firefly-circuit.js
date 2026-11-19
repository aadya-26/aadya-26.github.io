// Animated circuit diagram for Jugnu: Firefly Flash Patterns.
// The board appears, each species' thread trace is stitched from the board to its LED,
// then the LEDs replay their real flash patterns (Martin et al., 2024).
(function () {
  var root = document.getElementById('firefly-circuit');
  if (!root) return;

  var STATUS = {
    least: { label: 'Least concern', color: '#3ddc57' },
    threat: { label: 'Threatened', color: '#f5a524' },
    crit: { label: 'Critically endangered', color: '#ff5d5d' }
  };
  var REST = 2.0;
  var SP = [
    { slug: 'frontalis', name: 'P. frontalis', n: 16, gap: 0.66, dur: 0.04, status: 'least' },
    { slug: 'carolinus', name: 'P. carolinus', n: 6, gap: 0.42, dur: 0.12, status: 'least' },
    { slug: 'wickershamorum', name: 'B. wickershamorum', n: 6, gap: 0.82, dur: 0.17, status: 'threat' },
    { slug: 'forresti', name: 'P. forresti', n: 5, gap: 0.51, dur: 0.08, status: 'threat' },
    { slug: 'knulli', name: 'P. knulli', n: 3, gap: 0.34, dur: 0.08, status: 'threat' },
    { slug: 'obscurellus', name: 'P. obscurellus', n: 2, gap: 0.41, dur: 0.22, status: 'least' },
    { slug: 'bethaniensis', name: 'P. bethaniensis', n: 2, gap: 0.22, dur: 0.07, status: 'crit' }
  ];
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var css = [
    '.fc{background:#0d1117;color:#e6edf3;border-radius:16px;padding:20px;margin:32px 0;font-size:.95rem;line-height:1.4}',
    '.fc *{box-sizing:border-box}',
    '.fc-top{display:flex;flex-wrap:wrap;gap:10px 20px;align-items:center;justify-content:space-between;margin-bottom:12px}',
    '.fc-key{display:flex;flex-wrap:wrap;gap:6px 16px;margin:0;padding:0;list-style:none;font-size:.85rem}',
    '.fc-key li{display:flex;align-items:center;gap:6px}',
    '.fc-chip{width:12px;height:12px;border-radius:50%;display:inline-block}',
    '.fc-line{width:18px;height:0;display:inline-block;border-top:3px solid #c7d4ff}',
    '.fc-line.gnd{border-top:3px solid #5d6878}',
    '.fc-btn{font:inherit;font-size:.85rem;color:#e6edf3;background:#1b2330;border:1px solid #3a4658;border-radius:999px;padding:6px 14px;cursor:pointer}',
    '.fc-btn:focus-visible,.fc-frame:focus-visible{outline:3px solid #7cc4ff;outline-offset:2px}',
    '.fc-frame{overflow-x:auto;border-radius:10px}',
    '.fc-frame svg{display:block;width:100%;min-width:540px;max-width:720px;height:auto;margin:0 auto}',
    '.fc-svg .fc-board,.fc-svg .fc-battery{opacity:0;transition:opacity .7s}',
    '.fc-svg.s-board .fc-board,.fc-svg.s-board .fc-battery{opacity:1}',
    '.fc-svg .fc-battery rect{fill:#1b2330;stroke:#3a4658;stroke-width:2}',
    '.fc-svg .fc-battery path{fill:none;stroke:#aab6c6;stroke-width:3}',
    '.fc-svg .fc-trace path,.fc-svg .fc-trace polyline{fill:none;stroke:#c7d4ff;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset var(--td,.7s) ease-in-out}',
    '.fc-svg .fc-trace.on path,.fc-svg .fc-trace.on polyline{stroke-dashoffset:0}',
    '.fc-svg .fc-ground path,.fc-svg .fc-ground polyline,.fc-svg .fc-ground line{fill:none;stroke:#5d6878;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset 1.2s ease-in-out}',
    '.fc-svg.s-ground .fc-ground path,.fc-svg.s-ground .fc-ground polyline,.fc-svg.s-ground .fc-ground line{stroke-dashoffset:0}',
    '.fc-svg .fc-res{fill:#7f93c9;opacity:0;transition:opacity .4s}',
    '.fc-svg .fc-res.on{opacity:1}',
    '.fc-svg .fc-led{opacity:0;transition:opacity .5s}',
    '.fc-svg .fc-led.on{opacity:1}',
    '.fc-svg .fc-led path{fill:#e6edf3}',
    '.fc-svg .fc-led line{stroke:#6b7686;stroke-width:1}',
    '.fc-svg .fc-dot{fill:var(--c);opacity:.35}',
    '.fc-svg .fc-dot.flash{opacity:1}',
    '.fc-svg .fc-halo{fill:var(--c);opacity:0;filter:url(#fc-blur)}',
    '.fc-svg .fc-halo.flash{opacity:.85}',
    '.fc-note{margin:12px 0 0;font-size:.8rem;color:#aab6c6}',
    '@media (prefers-reduced-motion:reduce){.fc-svg *{transition:none!important}}'
  ].join('');
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  var wrap = document.createElement('div');
  wrap.className = 'fc';
  var top = document.createElement('div');
  top.className = 'fc-top';
  var key = document.createElement('ul');
  key.className = 'fc-key';
  key.setAttribute('aria-label', 'Diagram key');
  key.innerHTML =
    '<li><span class="fc-line"></span>Signal thread</li><li><span class="fc-line gnd"></span>Ground thread</li>' +
    Object.keys(STATUS).map(function (k) {
      return '<li><span class="fc-chip" style="background:' + STATUS[k].color + '"></span>' + STATUS[k].label + '</li>';
    }).join('');
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'fc-btn';
  btn.textContent = reduce ? 'Show diagram' : 'Replay';
  top.appendChild(key);
  if (!reduce) top.appendChild(btn);
  var frame = document.createElement('div');
  frame.className = 'fc-frame';
  frame.tabIndex = 0;
  frame.setAttribute('role', 'region');
  frame.setAttribute('aria-label', 'Circuit diagram, scrolls sideways on small screens');
  var note = document.createElement('p');
  note.className = 'fc-note';
  note.textContent = 'One stitched trace per species runs from the board through a resistor to its LED. LED color is conservation status. Once built, each LED replays its species’ real flash pattern.';
  wrap.appendChild(top);
  wrap.appendChild(frame);
  wrap.appendChild(note);
  var fallback = root.innerHTML;
  root.innerHTML = '';
  root.appendChild(wrap);

  var svg, timers = [], raf = 0, visible = true, started = false, flashing = false;

  function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
  }
  function later(fn, ms) {
    timers.push(setTimeout(fn, ms));
  }
  function q(sel) {
    return svg.querySelectorAll(sel);
  }

  function prep() {
    q('.fc-trace > *, .fc-ground > *').forEach(function (el) {
      el.setAttribute('pathLength', '1');
    });
    SP.forEach(function (s) {
      var g = svg.querySelector('#led-' + s.slug);
      var c = STATUS[s.status].color;
      g.style.setProperty('--c', c);
      s.dot = g.querySelector('.fc-dot');
      s.halo = g.querySelector('.fc-halo');
      s.led = g;
      s.trace = svg.querySelector('#trace-' + s.slug);
      s.res = svg.querySelector('.fc-res[data-for="' + s.slug + '"]');
    });
  }

  function reset() {
    clearTimers();
    cancelAnimationFrame(raf);
    flashing = false;
    svg.setAttribute('class', 'fc-svg');
    q('.on').forEach(function (e) { e.classList.remove('on'); });
    SP.forEach(function (s) {
      s.dot.classList.remove('flash');
      s.halo.classList.remove('flash');
    });
  }

  function showAll() {
    svg.setAttribute('class', 'fc-svg s-board s-ground');
    q('.fc-trace, .fc-res, .fc-led').forEach(function (e) { e.classList.add('on'); });
    SP.forEach(function (s) {
      s.dot.classList.add('flash');
    });
  }

  function build() {
    reset();
    svg.classList.add('s-board');
    var t = 700;
    SP.forEach(function (s, i) {
      later(function () { s.trace.classList.add('on'); }, t + i * 650);
      later(function () { s.res.classList.add('on'); }, t + i * 650 + 450);
      later(function () { s.led.classList.add('on'); }, t + i * 650 + 650);
    });
    var end = t + SP.length * 650 + 300;
    later(function () { svg.classList.add('s-ground'); }, end);
    later(startFlash, end + 1400);
  }

  var t0 = 0;
  function startFlash() {
    flashing = true;
    t0 = performance.now();
    loop(t0);
  }
  function loop(now) {
    if (!flashing) return;
    if (visible) {
      var el = (now - t0) / 1000;
      SP.forEach(function (s) {
        var burst = s.n * s.gap;
        var ph = el % (burst + REST);
        var on = false;
        if (ph < burst) on = (ph % s.gap) < s.dur;
        s.dot.classList.toggle('flash', on);
        s.halo.classList.toggle('flash', on);
      });
    }
    raf = requestAnimationFrame(loop);
  }

  function begin() {
    if (started) return;
    started = true;
    if (reduce) showAll();
    else build();
  }

  btn.addEventListener('click', function () {
    started = true;
    build();
  });

  fetch('/images/firefly/firefly-circuit.svg')
    .then(function (r) {
      if (!r.ok) throw new Error('svg');
      return r.text();
    })
    .then(function (txt) {
      frame.innerHTML = txt;
      svg = frame.querySelector('svg');
      prep();
      if (reduce) {
        begin();
        return;
      }
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (ents) {
          visible = ents[0].isIntersecting;
          if (visible) begin();
        }, { threshold: 0.35 }).observe(frame);
      } else begin();
    })
    .catch(function () {
      root.innerHTML = fallback;
    });
})();
