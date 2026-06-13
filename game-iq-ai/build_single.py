#!/usr/bin/env python3
"""Bundle the multi-page prototype into one self-contained app.html.

Each page body becomes a .screen section; navigation switches screens via
hash routing so the whole app works as a single hosted file.
"""
import re
from pathlib import Path

ROOT = Path(__file__).parent
PAGES = [
    ("index.html", "home"),
    ("signup.html", "signup"),
    ("upload.html", "upload"),
    ("analysis.html", "analysis"),
    ("progress.html", "progress"),
    ("pricing.html", "pricing"),
]
LINK_MAP = {src: name for src, name in PAGES}

EXTRA_CSS = """
.screen { display: none; }
.screen.is-active { display: block; }
.page--landing { padding-bottom: 110px; }
"""

TABBAR = """
<nav class="tabbar">
  <div class="tabbar-inner">
    <a href="#upload">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/></svg>
      Upload
    </a>
    <a href="#analysis">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>
      Reports
    </a>
    <a href="#progress">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/></svg>
      Progress
    </a>
    <a href="#pricing">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z"/></svg>
      Plan
    </a>
  </div>
</nav>
"""

ROUTER_JS = """
(function () {
  "use strict";
  var screens = document.querySelectorAll(".screen");
  var tabs = document.querySelectorAll(".tabbar a");
  function route() {
    var name = (location.hash || "#home").slice(1);
    var target = document.getElementById("screen-" + name);
    if (!target) { name = "home"; target = document.getElementById("screen-home"); }
    screens.forEach(function (s) { s.classList.toggle("is-active", s === target); });
    tabs.forEach(function (a) {
      a.classList.toggle("is-active", a.getAttribute("href") === "#" + name);
    });
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", route);
  route();
})();
"""


def extract_screen(filename, name):
    html = (ROOT / filename).read_text()
    body = re.search(r"<body>(.*)</body>", html, re.S).group(1)
    body = re.sub(r'<nav class="tabbar">.*?</nav>', "", body, flags=re.S)
    body = body.replace('<script src="app.js"></script>', "")
    for src, target in LINK_MAP.items():
        body = body.replace('href="%s"' % src, 'href="#%s"' % target)
    return '<div class="screen" id="screen-%s">%s</div>' % (name, body.strip())


def main():
    css = (ROOT / "styles.css").read_text() + EXTRA_CSS
    js = (ROOT / "app.js").read_text()
    js = js.replace(
        'window.location.href = "analysis.html";',
        'window.location.hash = "#analysis";',
    )
    screens = "\n".join(extract_screen(src, name) for src, name in PAGES)
    out = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>Game IQ AI</title>
<style>%s</style>
</head>
<body>
%s
%s
<script>%s
%s</script>
</body>
</html>
""" % (css, screens, TABBAR, js, ROUTER_JS)
    (ROOT / "app.html").write_text(out)
    print("wrote app.html (%d bytes)" % len(out))


if __name__ == "__main__":
    main()
