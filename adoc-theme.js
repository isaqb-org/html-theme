/*
 * Highlights the currently-read section in the AsciiDoctor TOC (#toc,
 * either the in-content macro or the fixed toc2 sidebar) by toggling
 * `.is-active` on the matching link, using IntersectionObserver — no
 * dependencies. Styling for `.is-active` lives in isaqb-theme.css.
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

/*
 * Light/dark theme toggle. Injects a fixed button (styled as #theme-toggle in
 * isaqb-theme.css). Three-state behavior: with no saved choice the page
 * follows the OS `prefers-color-scheme`; clicking sets an explicit choice
 * (`data-theme` on <html>) that overrides the OS pref and persists in
 * localStorage. No dependencies.
 */
(function () {
  var root = document.documentElement;
  var KEY = 'isaqb-theme';

  // Apply a previously saved choice (if any) before the button is built.
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) { /* storage blocked */ }
  if (saved === 'dark' || saved === 'light') root.setAttribute('data-theme', saved);

  function effectiveTheme() {
    var attr = root.getAttribute('data-theme');
    if (attr === 'dark' || attr === 'light') return attr;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  var btn = document.createElement('button');
  btn.id = 'theme-toggle';
  btn.type = 'button';

  function render() {
    var dark = effectiveTheme() === 'dark';
    btn.textContent = dark ? '☀' : '☾'; // ☀ when dark (offers light) / ☾ when light
    var label = dark ? 'Zum hellen Design wechseln' : 'Zum dunklen Design wechseln';
    btn.setAttribute('aria-label', label);
    btn.setAttribute('title', label);
  }

  btn.addEventListener('click', function () {
    var next = effectiveTheme() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem(KEY, next); } catch (e) { /* storage blocked */ }
    render();
  });

  render();
  document.body.appendChild(btn);
})();
