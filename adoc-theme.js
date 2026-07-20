// TOC scroll-spy: toggles .is-active on the link for the section in view.
(function () {
  const toc = document.getElementById("toc");
  if (!toc) {
    return;
  }

  const byId = {};
  Array.prototype.slice
    .call(toc.querySelectorAll('a[href^="#"]'))
    .forEach((link) => {
      const heading = document.getElementById(
        link.getAttribute("href").slice(1),
      );
      if (heading) {
        byId[heading.id] = link;
      }
    });

  const headings = Object.keys(byId).map((id) => {
    return document.getElementById(id);
  });
  if (!headings.length || typeof IntersectionObserver === "undefined") {
    return;
  }

  let activeId = null;
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((e) => {
        return e.isIntersecting;
      });
      if (!visible.length) {
        return;
      }
      visible.sort((a, b) => {
        return a.boundingClientRect.top - b.boundingClientRect.top;
      });
      const id = visible[0].target.id;
      if (id === activeId) {
        return;
      }
      if (activeId && byId[activeId]) {
        byId[activeId].classList.remove("is-active");
      }
      if (byId[id]) {
        byId[id].classList.add("is-active");
      }
      activeId = id;
    },
    { rootMargin: "0px 0px -70% 0px", threshold: 0 },
  );

  headings.forEach((heading) => {
    observer.observe(heading);
  });
})();

// Light/dark toggle: no saved choice follows the OS; click sets and persists
// an explicit data-theme on <html>. Button styled as #theme-toggle.
(function () {
  const root = document.documentElement;
  const KEY = "isaqb-theme";

  let saved = null;
  try {
    saved = localStorage.getItem(KEY);
  } catch {
    /* storage blocked */
  }
  if (saved === "dark" || saved === "light") {
    root.setAttribute("data-theme", saved);
  }

  function effectiveTheme() {
    const attr = root.getAttribute("data-theme");
    if (attr === "dark" || attr === "light") {
      return attr;
    }
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  const de = (navigator.language || "en").toLowerCase().indexOf("de") === 0;
  const labels = de
    ? {
        toLight: "Zum hellen Design wechseln",
        toDark: "Zum dunklen Design wechseln",
      }
    : { toLight: "Switch to light theme", toDark: "Switch to dark theme" };

  const btn = document.createElement("button");
  btn.id = "theme-toggle";
  btn.type = "button";

  function render() {
    const dark = effectiveTheme() === "dark";
    btn.textContent = dark ? "☀" : "☾";
    const label = dark ? labels.toLight : labels.toDark;
    btn.setAttribute("aria-label", label);
    btn.setAttribute("title", label);
  }

  btn.addEventListener("click", () => {
    const next = effectiveTheme() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* storage blocked */
    }
    render();
  });

  render();
  document.body.appendChild(btn);
})();
