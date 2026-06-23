(function () {
  var COURSE = {
    W:    { ko: "글쓰기",        en: "Writing",              fill: "#dbe8f7", stroke: "#7aa9dd" },
    Lit:  { ko: "문학개론",      en: "Intro. to Literature", fill: "#d6efe6", stroke: "#5cc0a0" },
    Comm: { ko: "커뮤니케이션",  en: "Communication",        fill: "#f7e6c4", stroke: "#e3ab4f" },
    Hum:  { ko: "인문학과 삶",   en: "Humanities & Life",    fill: "#e4e1f6", stroke: "#9a8fdc" }
  };

  // oldest -> newest (drawn left to right). u = sections taught that semester.
  // 대학작문 + 교양글쓰기 = 글쓰기(W).
  var SEM = [
    { y: "2019", u: ["W", "W", "Comm"] },
    { y: "2019", u: ["W", "W", "Lit"] },
    { y: "2020", u: ["W", "W", "W"] },
    { y: "2020", u: ["W", "W", "Hum"] },
    { y: "2021", u: ["W", "W", "Lit"] },
    { y: "2021", u: ["W", "W", "Lit"] },
    { y: "2022", u: ["W", "W", "Lit"] },
    { y: "2022", u: ["W", "W", "Lit"] },
    { y: "2023", u: ["W", "W", "Lit"] },
    { y: "2023", u: ["W", "W", "Lit"] },
    { y: "2024", u: ["W", "W", "Comm"] },
    { y: "2024", u: ["W", "W", "Lit"] },
    { y: "2025", u: ["W", "Lit"] },
    { y: "2025", u: ["W", "Comm"] },
    { y: "2026", u: ["W", "W"] }
  ];

  function stats(c) {
    var sem = 0, years = {};
    SEM.forEach(function (s) {
      if (s.u.indexOf(c) !== -1) { sem++; years[s.y] = 1; }
    });
    return { sem: sem, yr: Object.keys(years).length };
  }

  function render(el, lang) {
    var X0 = 50, PITCH = 42, BW = 30, BASE = 210, BH = 46, GAP = 3;
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 720 250");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", lang === "ko" ? "학기별 강의 구성" : "Teaching by semester");
    var used = {};

    var ax = document.createElementNS(ns, "line");
    ax.setAttribute("x1", 44); ax.setAttribute("y1", BASE);
    ax.setAttribute("x2", X0 + (SEM.length - 1) * PITCH + BW + 8); ax.setAttribute("y2", BASE);
    ax.setAttribute("stroke", "#e0e0e0"); ax.setAttribute("stroke-width", 1);
    svg.appendChild(ax);

    SEM.forEach(function (s, i) {
      var x = X0 + i * PITCH;
      s.u.forEach(function (c, k) {
        used[c] = true;
        var y = BASE - (k + 1) * BH - k * GAP;
        var r = document.createElementNS(ns, "rect");
        r.setAttribute("x", x); r.setAttribute("y", y);
        r.setAttribute("width", BW); r.setAttribute("height", BH);
        r.setAttribute("rx", 3);
        r.setAttribute("fill", COURSE[c].fill);
        r.setAttribute("stroke", COURSE[c].stroke);
        r.setAttribute("stroke-width", 1);
        svg.appendChild(r);
      });
    });

    var i = 0;
    while (i < SEM.length) {
      var j = i; while (j < SEM.length && SEM[j].y === SEM[i].y) j++;
      var cx = ((X0 + i * PITCH) + (X0 + (j - 1) * PITCH + BW)) / 2;
      var t = document.createElementNS(ns, "text");
      t.setAttribute("x", cx); t.setAttribute("y", BASE + 20);
      t.setAttribute("text-anchor", "middle");
      t.setAttribute("font-size", "12.5"); t.setAttribute("fill", "#6b6b6b");
      t.textContent = "'" + SEM[i].y.slice(2);
      svg.appendChild(t);
      i = j;
    }

    var scroll = document.createElement("div");
    scroll.className = "chart-scroll";
    scroll.appendChild(svg);
    el.appendChild(scroll);

    var legend = document.createElement("div");
    legend.className = "legend";
    Object.keys(COURSE).forEach(function (c) {
      if (!used[c]) return;
      var st = stats(c);
      var span = document.createElement("span");
      var sw = document.createElement("i");
      sw.style.background = COURSE[c].fill;
      sw.style.borderColor = COURSE[c].stroke;
      span.appendChild(sw);
      var label = COURSE[c][lang] + (lang === "ko"
        ? "  ·  " + st.sem + "학기 / " + st.yr + "년"
        : "  ·  " + st.sem + " sem / " + st.yr + " yr");
      span.appendChild(document.createTextNode(label));
      legend.appendChild(span);
    });
    el.appendChild(legend);

    var cap = document.createElement("div");
    cap.className = "cap";
    cap.textContent = lang === "ko"
      ? "막대 한 칸 = 한 과목(분반) · 각 연도 좌:1학기 / 우:2학기 (2019–2026, 공군사관학교)"
      : "Each block = one course section · per year: left = spring, right = fall (2019–2026, KAFA)";
    el.appendChild(cap);
  }

  function init() {
    var el = document.getElementById("teaching-chart");
    if (!el) return;
    var lang = (el.getAttribute("data-lang") || document.documentElement.lang || "ko").indexOf("en") === 0 ? "en" : "ko";
    render(el, lang);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
