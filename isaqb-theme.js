(function () {
  const toc = document.getElementById("toc");
  if (!toc || typeof IntersectionObserver === "undefined") {
    return;
  }

  const linkFor = new Map();
  for (const link of toc.querySelectorAll('a[href^="#"]')) {
    const heading = document.getElementById(link.getAttribute("href").slice(1));
    if (heading) {
      linkFor.set(heading, link);
    }
  }
  if (linkFor.size === 0) {
    return;
  }

  let active = null;
  const observer = new IntersectionObserver(
    (entries) => {
      let top = null;
      for (const entry of entries) {
        if (
          entry.isIntersecting &&
          (top === null ||
            entry.boundingClientRect.top < top.boundingClientRect.top)
        ) {
          top = entry;
        }
      }
      if (!top || top.target === active) {
        return;
      }
      if (active) {
        linkFor.get(active).classList.remove("is-active");
      }
      linkFor.get(top.target).classList.add("is-active");
      active = top.target;
    },
    { rootMargin: "0px 0px -70% 0px", threshold: 0 },
  );

  for (const heading of linkFor.keys()) {
    observer.observe(heading);
  }
})();

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

  const prefersDark =
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");
  function effectiveTheme() {
    const attr = root.getAttribute("data-theme");
    if (attr === "dark" || attr === "light") {
      return attr;
    }
    return prefersDark && prefersDark.matches ? "dark" : "light";
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
