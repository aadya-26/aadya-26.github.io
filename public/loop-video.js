// Seamless looping videos: no browser controls, autoplay muted loop.
// Accessibility: click, tap, Enter or Space pauses/plays; reduced-motion users get a still frame.
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('video.loop').forEach(function (v) {
    var wrap = v.parentElement;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'loop-toggle';
    wrap.appendChild(btn);

    function label() {
      var paused = v.paused;
      btn.textContent = paused ? 'Play' : 'Pause';
      btn.setAttribute('aria-label', (paused ? 'Play: ' : 'Pause: ') + (v.getAttribute('aria-label') || 'video'));
    }
    function toggle() {
      if (v.paused) { v.play().catch(function () {}); } else { v.pause(); }
    }

    if (reduce) { v.removeAttribute('autoplay'); v.pause(); }
    btn.addEventListener('click', toggle);
    v.addEventListener('click', toggle);
    v.addEventListener('play', label);
    v.addEventListener('pause', label);
    label();
  });
})();
