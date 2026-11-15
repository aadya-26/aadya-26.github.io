(function () {
  var host = document.getElementById('readit-embed');
  if (!host) return;
  var URL_ = 'https://aadya-26.github.io/readit-nyc/';
  var css = document.createElement('style');
  css.textContent =
    '.re{margin:1.5rem 0;border-radius:12px;overflow:hidden;background:#080810;position:relative}' +
    '.re img{display:block;width:100%;height:auto;opacity:.55}' +
    '.re-go{position:absolute;inset:0;margin:auto;width:max-content;height:max-content;padding:.8rem 1.4rem;' +
    'font:inherit;font-weight:600;color:#fff;background:#4f46e5;border:2px solid #fff;border-radius:8px;cursor:pointer}' +
    '.re-go:hover,.re-go:focus-visible{background:#6366f1;outline:3px solid #a5b4fc;outline-offset:2px}' +
    '.re iframe{display:block;width:100%;height:min(80vh,680px);border:0}' +
    '.re-note{margin:.5rem 0 0;font-size:.85em}';
  document.head.appendChild(css);

  var box = document.createElement('div');
  box.className = 're';
  var img = document.createElement('img');
  img.src = '/images/readit/readit-overview.jpg';
  img.alt = '';
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 're-go';
  btn.textContent = 'Explore the live map';
  btn.addEventListener('click', function () {
    var f = document.createElement('iframe');
    f.src = URL_;
    f.title = 'ReadIt NYC interactive map';
    f.loading = 'lazy';
    box.innerHTML = '';
    box.appendChild(f);
    f.focus();
  });
  box.appendChild(img);
  box.appendChild(btn);
  host.appendChild(box);

  var note = document.createElement('p');
  note.className = 're-note';
  note.innerHTML = 'Drag to rotate, scroll to zoom. <a href="' + URL_ + '">Open it full screen</a> for the best view.';
  host.appendChild(note);
})();
