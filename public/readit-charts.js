// ReadIt NYC: charts built from the project's data. Counts computed from the cleaned datasets.
(function () {
  var DATA = {
 "passes": [
  {
   "name": "First pass",
   "counts": [
    299,
    34,
    105
   ]
  },
  {
   "name": "Second pass (RoBERTa)",
   "counts": [
    108,
    250,
    80
   ]
  }
 ],
 "places": [
  {
   "name": "Harlem",
   "counts": [
    20,
    26,
    7
   ],
   "avg": 0.217
  },
  {
   "name": "Astoria",
   "counts": [
    13,
    25,
    7
   ],
   "avg": 0.145
  },
  {
   "name": "Lower East Side",
   "counts": [
    9,
    14,
    7
   ],
   "avg": 0.085
  },
  {
   "name": "East Village",
   "counts": [
    7,
    14,
    4
   ],
   "avg": 0.073
  },
  {
   "name": "Bushwick",
   "counts": [
    11,
    31,
    6
   ],
   "avg": 0.069
  },
  {
   "name": "Chelsea",
   "counts": [
    5,
    20,
    4
   ],
   "avg": 0.036
  },
  {
   "name": "Midtown",
   "counts": [
    15,
    26,
    15
   ],
   "avg": 0.034
  },
  {
   "name": "SoHo",
   "counts": [
    6,
    17,
    6
   ],
   "avg": 0.032
  },
  {
   "name": "Williamsburg",
   "counts": [
    6,
    26,
    7
   ],
   "avg": -0.005
  },
  {
   "name": "West Village",
   "counts": [
    6,
    17,
    8
   ],
   "avg": -0.024
  },
  {
   "name": "Upper West Side",
   "counts": [
    3,
    14,
    5
   ],
   "avg": -0.053
  },
  {
   "name": "Upper East Side",
   "counts": [
    2,
    14,
    4
   ],
   "avg": -0.072
  }
 ]
};
  var COL = { pos: '#2fbf5b', neu: '#7a70e6', neg: '#e0474c' };
  var css = [
    '.rc{background:#0d1117;color:#e6edf3;border-radius:16px;padding:20px;margin:28px 0;font-size:.92rem;line-height:1.4}',
    '.rc *{box-sizing:border-box}',
    '.rc-key{display:flex;flex-wrap:wrap;gap:6px 16px;margin:0 0 14px;padding:0;list-style:none;font-size:.82rem}',
    '.rc-key li{display:flex;align-items:center;gap:6px}',
    '.rc-chip{width:12px;height:12px;border-radius:3px;display:inline-block}',
    '.rc-row{display:grid;grid-template-columns:150px 1fr 150px;gap:6px 12px;align-items:center;margin:8px 0}',
    '.rc-name{font-weight:600}',
    '.rc-name small{display:block;font-weight:400;font-size:.75rem;color:#aab6c6}',
    '.rc-bar{display:flex;height:22px;border-radius:5px;overflow:hidden;background:#1b2330}',
    '.rc-bar span{display:block;height:100%}',
    '.rc-num{font-size:.78rem;color:#aab6c6}',
    '.rc-note{margin:14px 0 0;font-size:.8rem;color:#aab6c6}',
    '@media (max-width:640px){.rc{padding:14px}.rc-row{grid-template-columns:1fr}.rc-num{margin-top:-2px}}'
  ].join('');
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  function pct(n, t) { return Math.round(n / t * 100); }
  function row(host, name, sub, counts, extra) {
    var t = counts[0] + counts[1] + counts[2];
    var r = document.createElement('div');
    r.className = 'rc-row';
    r.setAttribute('role', 'img');
    r.setAttribute('aria-label', name + ': ' + t + ' posts, ' + counts[0] + ' positive, ' + counts[1] + ' neutral, ' + counts[2] + ' negative');
    r.innerHTML =
      '<div class="rc-name">' + name + (sub ? '<small>' + sub + '</small>' : '') + '</div>' +
      '<div class="rc-bar" aria-hidden="true">' +
        '<span style="width:' + counts[0] / t * 100 + '%;background:' + COL.pos + '"></span>' +
        '<span style="width:' + counts[1] / t * 100 + '%;background:' + COL.neu + '"></span>' +
        '<span style="width:' + counts[2] / t * 100 + '%;background:' + COL.neg + '"></span></div>' +
      '<div class="rc-num" aria-hidden="true">' + pct(counts[0], t) + '% pos, ' + pct(counts[1], t) + '% neu, ' + pct(counts[2], t) + '% neg' + (extra || '') + '</div>';
    host.appendChild(r);
  }
  function key(host) {
    var ul = document.createElement('ul');
    ul.className = 'rc-key';
    ul.innerHTML =
      '<li><span class="rc-chip" style="background:' + COL.pos + '"></span>Positive</li>' +
      '<li><span class="rc-chip" style="background:' + COL.neu + '"></span>Neutral</li>' +
      '<li><span class="rc-chip" style="background:' + COL.neg + '"></span>Negative</li>';
    host.appendChild(ul);
  }

  var a = document.getElementById('readit-passes');
  if (a) {
    var box = document.createElement('div'); box.className = 'rc'; a.appendChild(box);
    key(box);
    DATA.passes.forEach(function (p) { row(box, p.name, '438 posts', p.counts, ''); });
    var n = document.createElement('p'); n.className = 'rc-note';
    n.textContent = 'The same 438 posts, scored twice. Only the sentiment method changed.';
    box.appendChild(n);
  }
  var b = document.getElementById('readit-places');
  if (b) {
    var box2 = document.createElement('div'); box2.className = 'rc'; b.appendChild(box2);
    key(box2);
    DATA.places.forEach(function (p) {
      var t = p.counts[0] + p.counts[1] + p.counts[2];
      row(box2, p.name, t + ' posts', p.counts, '');
    });
    var n2 = document.createElement('p'); n2.className = 'rc-note';
    n2.textContent = 'Neighborhoods with at least 20 posts, ordered by average sentiment score, highest first. Small samples from one subreddit, so read the order loosely.';
    box2.appendChild(n2);
  }
})();
