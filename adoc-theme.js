/*
 * Highlights the currently-read section in the AsciiDoctor TOC (#toc,
 * either the in-content macro or the fixed toc2 sidebar) by toggling
 * `.is-active` on the matching link, using IntersectionObserver — no
 * dependencies. Styling for `.is-active` lives in adoc-github.css.
 * No-ops safely if there's no #toc or no matching headings on the page.
 */
(function () {
  var toc = document.getElementById('toc');
  if (!toc) return;

  var links = Array.prototype.slice.call(toc.querySelectorAll('a[href^="#"]'));
  var byId = {};
  links.forEach(function (link) {
    var id = link.getAttribute('href').slice(1);
    var heading = document.getElementById(id);
    if (heading) byId[id] = { link: link, heading: heading };
  });

  var headings = Object.keys(byId).map(function (id) { return byId[id].heading; });
  if (!headings.length || typeof IntersectionObserver === 'undefined') return;

  var activeId = null;
  function setActive(id) {
    if (id === activeId) return;
    if (activeId && byId[activeId]) byId[activeId].link.classList.remove('is-active');
    if (id && byId[id]) byId[id].link.classList.add('is-active');
    activeId = id;
  }

  var observer = new IntersectionObserver(function (entries) {
    var visible = entries.filter(function (entry) { return entry.isIntersecting; });
    if (!visible.length) return;
    visible.sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top; });
    setActive(visible[0].target.id);
  }, { rootMargin: '0px 0px -70% 0px', threshold: 0 });

  headings.forEach(function (heading) { observer.observe(heading); });
})();
