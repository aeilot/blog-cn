(function () {
  'use strict';
  var collection = document.querySelector('.works-grid--reveal');
  if (!collection || !window.matchMedia || !window.IntersectionObserver) return;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var works = Array.from(collection.querySelectorAll('.work'));
  var active = new Set();
  var scheduled = false;

  function paint() {
    scheduled = false;
    if (reduced.matches) return;
    var viewport = window.innerHeight;
    // Read all positions before updating styles; avoid interleaved layout work.
    var updates = Array.from(active).map(function (work) {
      var top = work.getBoundingClientRect().top;
      var progress = Math.max(0, Math.min(1, (viewport * .98 - top) / (viewport * .32)));
      return [work, progress];
    });
    updates.forEach(function (update) { update[0].style.setProperty('--reveal', update[1].toFixed(3)); });
  }
  function schedule() {
    if (!scheduled) { scheduled = true; window.requestAnimationFrame(paint); }
  }
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) active.add(entry.target);
      else {
        active.delete(entry.target);
        entry.target.style.setProperty('--reveal', entry.boundingClientRect.top < 0 ? '1' : '0');
      }
    });
    schedule();
  }, { rootMargin: '80px 0px' });

  works.forEach(function (work) { work.style.setProperty('--reveal', '0'); observer.observe(work); });
  function preferenceChanged() {
    document.documentElement.classList.toggle('scroll-reveal-ready', !reduced.matches);
    schedule();
  }
  preferenceChanged();
  if (reduced.addEventListener) reduced.addEventListener('change', preferenceChanged);
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
})();
