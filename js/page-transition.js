(function () {
  'use strict';
  var leaving = false;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  window.addEventListener('pageshow', function () {
    leaving = false;
    document.body.classList.remove('is-leaving');
  });
  document.addEventListener('click', function (event) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || reduced.matches) return;
    var link = event.target.closest && event.target.closest('a[href]');
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    var destination = new URL(link.href, window.location.href);
    if (destination.origin !== window.location.origin || !/^https?:$/.test(destination.protocol)) return;
    if (destination.pathname === window.location.pathname && destination.search === window.location.search) return;
    event.preventDefault();
    if (leaving) return;
    leaving = true;
    document.body.classList.add('is-leaving');
    var duration = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--page-exit-duration')) || 150;
    window.setTimeout(function () { window.location.assign(destination.href); }, duration);
  });
})();
