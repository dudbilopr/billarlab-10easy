/* BillarLab10.easy — lección guiada sobre el motor físico (js/fisica.js). */
(() => {
  "use strict";
  const F = window.Fisica, P = F.PARAM, L = P.L, W = P.W, R = P.R;
  const SIS = window.BILLAR_DATOS.sistemas;
  const RAIL = 0.13, CUSH = 0.035;
  let dDiam = 0.09;   // nariz de la banda → línea de diamantes (estimación; medir en la mesa)
  const $ = (id) => document.getElementById(id);
  const deg = (r) => r * 180 / Math.PI, rad = (d) => d * Math.PI / 180;
  const f2 = (v, n = 2) => Number.isFinite(v) ? v.toFixed(n) : "—";
  const reducido = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const COL = { blanca: "#f7f2e6", amarilla: "#f2c94c", roja: "#d8432f" };
  const C = { v: "#38c4e0", w: "#f06aa8", f: "#f0b54c", ideal: "#9be7f5", txt: "#f4ede9", txt2: "#b9aab2", s: "#6fe0a6", l: "#8fb3ff" };

  /* ================= Lienzo y vista ================= */
  const cv = $("mesa"), ctx = cv.getContext("2d");
  let dpr = 1, vista = { s: 300, ox: 0, oy: 0 };
  function ajustar() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = innerWidth * dpr; cv.height = innerHeight * dpr;
  }
  addEventListener("resize", ajustar); ajustar();

  function areaLibre() {
    const W0 = innerWidth, H0 = innerHeight, movil = W0 <= 860;
    const card = $("tarjeta").getBoundingClientRect(), dock = $("dock").getBoundingClientRect();
    let x0 = 16, y0 = movil ? 58 : 70, x1 = W0 - 16, y1 = dock.top - 12;
    if (movil) y1 = Math.min(y1, card.top - 8);
    else if (!$("tarjeta").classList.contains("plegada")) x0 = card.right + 16;
    else x0 = 16;
    return { x0, y0, x1, y1 };
  }
  function encuadrar(xmin, ymin, xmax, ymax) {
    const a = areaLibre();
    const s = Math.min((a.x1 - a.x0) / (xmax - xmin), (a.y1 - a.y0) / (ymax - ymin));
    vista = { s, ox: (a.x0 + a.x1) / 2 - s * (xmin + xmax) / 2, oy: (a.y0 + a.y1) / 2 + s * (ymin + ymax) / 2 };
  }
  const X = (x) => vista.ox + x * vista.s;
  const Y = (y) => vista.oy - y * vista.s;
  const aMundo = (px, py) => [(px - vista.ox) / vista.s, (vista.oy - py) / vista.s];

  /* ================= Dibujo ================= */
  function fondo() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const g = ctx.createRadialGradient(innerWidth * .55, innerHeight * .42, 40, innerWidth * .55, innerHeight * .45, Math.max(innerWidth, innerHeight) * .75);
    g.addColorStop(0, "#ffffff"); g.addColorStop(.6, "#f7f1f4"); g.addColorStop(1, "#ebe0e6");
    ctx.fillStyle = g; ctx.fillRect(0, 0, innerWidth, innerHeight);
  }
  function rr(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }

  function mesa(ox = 0, oy = 0, fantasma = false) {
    const s = vista.s;
    ctx.save();
    if (fantasma) ctx.globalAlpha = 0.22;
    if (!fantasma) {
      // madera
      const gw = ctx.createLinearGradient(0, Y(oy + W + RAIL), 0, Y(oy - RAIL));
      gw.addColorStop(0, "#7a4a2c"); gw.addColorStop(.5, "#5a3520"); gw.addColorStop(1, "#43271a");
      ctx.fillStyle = gw;
      ctx.save(); ctx.shadowColor = "rgba(34,17,27,.28)"; ctx.shadowBlur = 40; ctx.shadowOffsetY = 18;
      rr(X(ox - RAIL), Y(oy + W + RAIL), (L + 2 * RAIL) * s, (W + 2 * RAIL) * s, 0.05 * s); ctx.fill();
      ctx.restore();
      ctx.fillStyle = "#146039";
      ctx.fillRect(X(ox - CUSH), Y(oy + W + CUSH), (L + 2 * CUSH) * s, (W + 2 * CUSH) * s);
    }
    // paño con luz de lámpara
    const gf = ctx.createRadialGradient(X(ox + L / 2), Y(oy + W / 2), 10, X(ox + L / 2), Y(oy + W / 2), L * s * .65);
    gf.addColorStop(0, "#23935f"); gf.addColorStop(1, "#176a43");
    ctx.fillStyle = gf; ctx.fillRect(X(ox), Y(oy + W), L * s, W * s);
    ctx.strokeStyle = "rgba(255,255,255,.07)"; ctx.lineWidth = 1;
    for (let i = 1; i < 8; i++) { ctx.beginPath(); ctx.moveTo(X(ox + i * L / 8), Y(oy)); ctx.lineTo(X(ox + i * L / 8), Y(oy + W)); ctx.stroke(); }
    for (let j = 1; j < 4; j++) { ctx.beginPath(); ctx.moveTo(X(ox), Y(oy + j * W / 4)); ctx.lineTo(X(ox + L), Y(oy + j * W / 4)); ctx.stroke(); }
    if (!fantasma) {
      ctx.fillStyle = "#f3e7c9";
      const d = (x, y) => { const r = Math.max(3, 0.012 * s); ctx.beginPath(); ctx.moveTo(X(x), Y(y) - r); ctx.lineTo(X(x) + r * .8, Y(y)); ctx.lineTo(X(x), Y(y) + r); ctx.lineTo(X(x) - r * .8, Y(y)); ctx.fill(); };
      const off = Math.min(dDiam, RAIL - 0.01);
      for (let i = 0; i <= 8; i++) { d(ox + i * L / 8, oy + W + off); d(ox + i * L / 8, oy - off); }
      for (let j = 0; j <= 4; j++) { d(ox - off, oy + j * W / 4); d(ox + L + off, oy + j * W / 4); }
    } else {
      ctx.strokeStyle = "rgba(255,255,255,.6)"; ctx.setLineDash([6, 6]);
      ctx.strokeRect(X(ox), Y(oy + W), L * s, W * s); ctx.setLineDash([]);
    }
    ctx.restore();
  }

  function bola(b) {
    const x = X(b.x), y = Y(b.y), r = R * vista.s;
    ctx.fillStyle = "rgba(0,0,0,.35)";
    ctx.beginPath(); ctx.ellipse(x + r * .25, y + r * .35, r, r * .8, 0, 0, 7); ctx.fill();
    const g = ctx.createRadialGradient(x - r * .35, y - r * .4, r * .1, x, y, r);
    g.addColorStop(0, "#fff"); g.addColorStop(.35, COL[b.color]); g.addColorStop(1, sombra(COL[b.color]));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
    // marcas en la superficie: se ven rodar, deslizar y girar según la orientación 3D
    const M = b.M || ORIENT0;
    const marca = b.color === "blanca" ? "#b3246b" : b.color === "roja" ? "rgba(255,255,255,.75)" : "rgba(90,60,0,.55)";
    for (const m of MARCAS) {
      const px = M[0] * m[0] + M[1] * m[1] + M[2] * m[2];
      const py = M[3] * m[0] + M[4] * m[1] + M[5] * m[2];
      const pz = M[6] * m[0] + M[7] * m[1] + M[8] * m[2];
      if (pz <= 0) continue;                       // cara oculta
      const rad0 = Math.max(1.2, r * 0.2);
      ctx.save(); ctx.globalAlpha = Math.min(1, 0.25 + pz);
      ctx.fillStyle = marca;
      ctx.beginPath(); ctx.ellipse(x + px * r, y - py * r, rad0, rad0 * Math.max(0.25, pz), Math.atan2(-py, px), 0, 7); ctx.fill();
      ctx.restore();
    }
  }
  // Orientación 3D: matriz cuerpo→mundo; se integra con ω en cada cuadro.
  const MARCAS = [[0, 0, 1], [0, 0, -1], [1, 0, 0], [-1, 0, 0]];
  const ORIENT0 = (() => { const a = 0.6, c = Math.cos(a), s = Math.sin(a); return [c, 0, s, 0, 1, 0, -s, 0, c]; })();
  function girar(b, dt) {
    if (!b.M) b.M = ORIENT0.slice();
    const w = Math.hypot(b.wx, b.wy, b.wz), th = w * dt;
    if (th < 1e-9) return;
    const kx = b.wx / w, ky = b.wy / w, kz = b.wz / w, c = Math.cos(th), s = Math.sin(th), v = 1 - c;
    const Rm = [c + kx * kx * v, kx * ky * v - kz * s, kx * kz * v + ky * s,
      ky * kx * v + kz * s, c + ky * ky * v, ky * kz * v - kx * s,
      kz * kx * v - ky * s, kz * ky * v + kx * s, c + kz * kz * v];
    const M = b.M, N = new Array(9);
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) N[3 * i + j] = Rm[3 * i] * M[j] + Rm[3 * i + 1] * M[3 + j] + Rm[3 * i + 2] * M[6 + j];
    b.M = N;
  }
  function sombra(hex) {
    const n = parseInt(hex.slice(1), 16);
    const k = 0.55;
    return `rgb(${(n >> 16) * k | 0},${((n >> 8) & 255) * k | 0},${(n & 255) * k | 0})`;
  }
  function rastro(b, color, ancho = 2.5, alfa = .85) {
    if (b.rastro.length < 2) return;
    ctx.save(); ctx.globalAlpha = alfa; ctx.strokeStyle = color; ctx.lineWidth = ancho; ctx.lineJoin = "round"; ctx.lineCap = "round";
    ctx.beginPath(); b.rastro.forEach(([x, y], i) => i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y)));
    ctx.lineTo(X(b.x), Y(b.y)); ctx.stroke(); ctx.restore();
  }
  function linea(pts, color, ancho = 2.5, guion = null) {
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = ancho; ctx.lineCap = "round"; if (guion) ctx.setLineDash(guion);
    ctx.shadowColor = "rgba(20,10,15,.45)"; ctx.shadowBlur = 3;
    ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y))); ctx.stroke(); ctx.restore();
  }
  function flecha(x, y, dx, dy, color, etiqueta) {
    const x1 = X(x), y1 = Y(y), x2 = X(x + dx), y2 = Y(y + dy);
    const a = Math.atan2(y2 - y1, x2 - x1), h = 10;
    ctx.save(); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 4; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - h * Math.cos(a - .45), y2 - h * Math.sin(a - .45)); ctx.lineTo(x2 - h * Math.cos(a + .45), y2 - h * Math.sin(a + .45)); ctx.fill();
    if (etiqueta) texto(etiqueta, x2 + 8 * Math.cos(a) + 4, y2 + 8 * Math.sin(a) + 5, color, 16);
    ctx.restore();
  }
  function texto(t, px, py, color = C.txt, tam = 15, alin = "left", peso = 600) {
    ctx.save(); ctx.font = `${peso} ${tam}px "IBM Plex Mono", ui-monospace, monospace`; ctx.fillStyle = color; ctx.textAlign = alin;
    ctx.fillText(t, px, py); ctx.restore();
  }
  function arcoAngulo(x, y, a0, a1, radioPx, color, etiqueta) {
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(X(x), Y(y), radioPx, -a0, -a1, a1 > a0); ctx.stroke();
    const am = (a0 + a1) / 2;
    texto(etiqueta, X(x) + Math.cos(am) * (radioPx + 20), Y(y) - Math.sin(am) * (radioPx + 20) + 5, color, 16, "center");
    ctx.restore();
  }

  /* ================= Estado y simulación ================= */
  const st = { cap: 0, sim: null, vel: 1, nEv: 0, t: 0 };
  function nuevaSim(bolas) { st.sim = new F.Simulacion(bolas); st.nEv = 0; st.t = 0; return st.sim; }
  function avisar(t, clase = "") {
    const d = document.createElement("div"); d.className = `toast ${clase}`; d.textContent = t;
    $("avisos").appendChild(d); setTimeout(() => d.remove(), clase === "big" || clase === "ok" ? 3200 : 1600);
  }

  /* ================= Controles ================= */
  const dock = () => $("controles");
  function perilla(et, min, max, paso, val, fmt, cb) {
    const id = "k" + Math.random().toString(36).slice(2, 7);
    const d = document.createElement("div"); d.className = "knob";
    d.innerHTML = `<label for="${id}">${et}<output></output></label><input id="${id}" type="range" min="${min}" max="${max}" step="${paso}" value="${val}">`;
    const i = d.querySelector("input"), o = d.querySelector("output");
    const up = () => { o.textContent = fmt(Number(i.value)); cb(Number(i.value)); };
    i.addEventListener("input", up); o.textContent = fmt(val);
    dock().appendChild(d); return i;
  }
  function disparo(cb, et = "TIRAR") {
    const b = document.createElement("button"); b.className = "shoot"; b.type = "button"; b.textContent = et;
    b.addEventListener("click", cb); dock().appendChild(b); return b;
  }
  function herramienta(et, cb, presionado = null) {
    const b = document.createElement("button"); b.className = "tool"; b.type = "button"; b.textContent = et;
    if (presionado !== null) b.setAttribute("aria-pressed", String(presionado));
    b.addEventListener("click", () => cb(b)); dock().appendChild(b); return b;
  }
  /** Cara de la bola: elige el punto de golpe (a lateral, b vertical) en fracciones del radio. */
  function cara(estado, cb, soloLateral = false) {
    const d = document.createElement("div"); d.className = "face";
    d.innerHTML = `<svg viewBox="-50 -50 100 100" role="slider" aria-label="Punto de golpe en la bola (efecto)" tabindex="0">
      <defs><radialGradient id="gcara" cx="35%" cy="30%"><stop offset="0" stop-color="#fff"/><stop offset=".6" stop-color="#ece5d6"/><stop offset="1" stop-color="#9c9486"/></radialGradient></defs>
      <circle r="46" fill="url(#gcara)"/><circle r="23" fill="none" stroke="rgba(0,0,0,.25)" stroke-dasharray="3 3"/>
      <line x1="-46" x2="46" stroke="rgba(0,0,0,.15)"/><line y1="-46" y2="46" stroke="rgba(0,0,0,.15)"/>
      <circle class="pt" r="7" fill="#b3246b" stroke="#fff" stroke-width="2"/></svg>
      <span class="face__lbl"><b>Efecto</b><span class="txt"></span></span>`;
    const svg = d.querySelector("svg"), pt = d.querySelector(".pt"), lbl = d.querySelector(".txt");
    const pinta = () => {
      pt.setAttribute("cx", -estado.a * 92); pt.setAttribute("cy", -estado.b * 92);
      const lat = Math.abs(estado.a) < 0.05 ? "centro" : estado.a > 0 ? `izq. ${Math.round(Math.abs(estado.a) / 0.15)}` : `der. ${Math.round(Math.abs(estado.a) / 0.15)}`;
      const ver = estado.b > 0.05 ? "alto" : estado.b < -0.05 ? "bajo" : "medio";
      lbl.textContent = soloLateral ? lat : `${lat} · ${ver}`;
    };
    const mover = (e) => {
      const r = svg.getBoundingClientRect();
      let fx = (e.clientX - r.left) / r.width * 2 - 1, fy = (e.clientY - r.top) / r.height * 2 - 1;
      const n = Math.hypot(fx, fy); if (n > 1) { fx /= n; fy /= n; }
      estado.a = -fx * 0.5; estado.b = soloLateral ? estado.b : -fy * 0.5;
      pinta(); cb && cb();
    };
    svg.addEventListener("pointerdown", (e) => { svg.setPointerCapture(e.pointerId); mover(e); });
    svg.addEventListener("pointermove", (e) => { if (e.buttons) mover(e); });
    svg.addEventListener("keydown", (e) => {
      const k = { ArrowLeft: [0.05, 0], ArrowRight: [-0.05, 0], ArrowUp: [0, 0.05], ArrowDown: [0, -0.05] }[e.key];
      if (!k) return; e.preventDefault();
      estado.a = Math.max(-.5, Math.min(.5, estado.a + k[0])); if (!soloLateral) estado.b = Math.max(-.5, Math.min(.5, estado.b + k[1]));
      pinta(); cb && cb();
    });
    pinta(); dock().appendChild(d); return d;
  }

  /* ================= Tarjeta ================= */
  const tex = (latex, nodo) => { if (window.katex) katex.render(latex, nodo, { displayMode: true, throwOnError: false }); else nodo.textContent = latex; };
  function datos(filas) {
    $("datos").innerHTML = filas.map(([k, v, c]) => `<dt>${k}</dt><dd class="${c || ""}">${v}</dd>`).join("");
  }
  function leyenda(items) {
    return `<div class="legend">${items.map(([c, t, g]) => `<span><i style="background:${c};${g ? "background:repeating-linear-gradient(90deg," + c + " 0 5px,transparent 5px 9px)" : ""}"></i>${t}</span>`).join("")}</div>`;
  }

  /* ================= Predicción: simular el tiro por adelantado ================= */
  const cachePred = { clave: "", rastros: null };
  function predecir(bolas, ang, v0, a, b) {
    const clave = [ang.toFixed(4), v0, a.toFixed(3), b.toFixed(3), ...bolas.map((q) => q.x.toFixed(4) + q.y.toFixed(4))].join("|");
    if (clave === cachePred.clave) return cachePred.rastros;
    const copia = bolas.map((q) => F.nuevaBola(q.id, q.x, q.y, q.color));
    const s = new F.Simulacion(copia);
    F.golpear(copia[0], ang, v0, a, b);
    s.correr(25);
    cachePred.clave = clave; cachePred.rastros = copia.map((q) => ({ color: q.color, pts: [...q.rastro, [q.x, q.y]] }));
    return cachePred.rastros;
  }
  function dibujaPrediccion(rastros) {
    for (const r of rastros) {
      if (r.pts.length < 2) continue;
      linea(r.pts, r.color === "blanca" ? "rgba(255,255,255,.55)" : r.color === "roja" ? "rgba(216,67,47,.6)" : "rgba(242,201,76,.6)", 2, [3, 7]);
    }
  }

  /* ================= Utilidades de tiro ================= */
  function tiroHaciaBanda(thetaDeg) {
    // bola que llega a la banda inferior en x = L/2 con ángulo theta respecto a la normal
    const th = rad(thetaDeg), d = 0.95;
    const x0 = L / 2 - d * Math.sin(th), y0 = Math.min(W - 2 * R, R + d * Math.cos(th));
    return { x0, y0, ang: Math.atan2(-(y0 - R), L / 2 - x0) };
  }

  /* ================= Capítulos ================= */
  const CAPS = [];

  // 0 · Portada --------------------------------------------------------------
  CAPS.push({
    nav: "Inicio", kicker: "Simulador físico",
    titulo: "La física de las tres bandas",
    idea: "Cada bola de esta mesa obedece las leyes de Newton: <strong>rueda</strong>, <strong>desliza</strong>, gira con <em>efecto</em> y rebota en las bandas. Mira el tiro y luego aprende por qué hace lo que hace.",
    setup() {
      $("extra").innerHTML = `<button class="cta" id="empezar" type="button">Empezar la lección →</button>`;
      $("empezar").onclick = () => ir(1);
      this.reinicia();
      disparo(() => this.reinicia(), "OTRA VEZ");
    },
    reinicia() {
      const w = F.nuevaBola("blanca", 0.55, 0.30, "blanca");
      const a = F.nuevaBola("amarilla", 0.40, 1.05, "amarilla");
      const r = F.nuevaBola("roja", 2.25, 0.95, "roja");
      nuevaSim([w, a, r]);
      F.golpear(w, rad(28), 3.4, -0.35, 0.3);
      this.espera = 0;
    },
    frame(dt) { if (!st.sim.activa()) { this.espera += dt; if (this.espera > 2.5) this.reinicia(); } },
    vista() { encuadrar(-RAIL, -RAIL, L + RAIL, W + RAIL); },
    dibujar() { mesa(); st.sim.bolas.forEach((b) => rastro(b, b.color === "blanca" ? "#fff" : COL[b.color], 2.5, .7)); st.sim.bolas.forEach(bola); },
    evento(e) { if (e.tipo === "banda" && e.bola === "blanca") avisar(`Banda ${this.cuenta = (this.cuenta || 0) + 1}`); },
  });

  // 1 · Reflexión --------------------------------------------------------------
  CAPS.push({
    nav: "Reflexión", kicker: "Geometría",
    titulo: "Ángulo de entrada = ángulo de salida",
    idea: "Sin efecto lateral, la bola rebota en la banda <em>casi</em> como la luz en un espejo. Cambia el ángulo y tira.",
    formula: String.raw`\theta_{\text{entrada}} = \theta_{\text{salida}}`,
    th: 40,
    setup() {
      $("extra").innerHTML = leyenda([["#fff", "trayectoria simulada"], [C.ideal, "reflexión ideal", 1], [C.w, "ángulos"]]);
      perilla("Ángulo con la normal", 15, 70, 1, this.th, (v) => v + "°", (v) => { this.th = v; this.prepara(); });
      disparo(() => this.tira());
      this.prepara();
    },
    prepara() {
      const t = tiroHaciaBanda(this.th);
      this.t0 = t; this.golpe = null;
      nuevaSim([F.nuevaBola("blanca", t.x0, t.y0, "blanca")]);
      datos([["Entrada", this.th + "°"], ["Salida (simulada)", "—"]]);
    },
    tira() { this.prepara(); F.golpear(st.sim.bolas[0], this.t0.ang, 1.6, 0, 0.4); },
    evento(e, b) { if (e.tipo === "banda" && !this.golpe) {
      this.golpe = { x: e.x, y: e.y, ang: Math.atan2(b.vy, b.vx) };
      const sal = deg(Math.abs(Math.atan2(b.vx, b.vy)));
      datos([["Entrada", this.th + "°"], ["Salida (simulada)", f2(sal, 1) + "°", "big"], ["Diferencia", f2(sal - this.th, 1) + "° (la banda pierde energía y roza)"]]);
    } },
    vista() { encuadrar(-RAIL, -RAIL, L + RAIL, W + RAIL); },
    dibujar() {
      mesa();
      const t = this.t0, hx = L / 2, hy = R;
      // trayectoria ideal especular
      const th = rad(this.th);
      linea([[t.x0, t.y0], [hx, hy], [hx + (hx - t.x0), t.y0]], C.ideal, 2.5, [10, 8]);
      linea([[hx, 0], [hx, 0.75]], "rgba(255,255,255,.55)", 2, [6, 6]);
      texto("normal", X(hx) + 8, Y(0.72), C.txt2, 14);
      arcoAngulo(hx, hy, Math.PI / 2, Math.PI / 2 + th, 70, C.w, "θ");
      arcoAngulo(hx, hy, Math.PI / 2 - th, Math.PI / 2, 70, C.w, "θ");
      st.sim.bolas.forEach((b) => rastro(b, "#fff", 3)); st.sim.bolas.forEach(bola);
    },
  });

  // 2 · Desdoblar la mesa --------------------------------------------------------
  CAPS.push({
    nav: "Desdoblar", kicker: "Simetría",
    titulo: "Tres bandas, una sola recta",
    idea: "Cada rebote es una <em>simetría axial</em>. Si reflejas la mesa como en un espejo, el zigzag de tres bandas se convierte en una <strong>línea recta</strong>.",
    formula: String.raw`\begin{gathered}\text{rebote en la banda superior}\\(x,\,y)\;\mapsto\;(x,\;2W-y)\end{gathered}`,
    ang: 32, p: 0, obj: 0, s: 0,
    setup() {
      $("extra").innerHTML = leyenda([["#fff", "zigzag en la mesa real"], [C.ideal, "recta en la mesa desdoblada", 1]]);
      perilla("Dirección del tiro", 12, 70, 1, this.ang, (v) => v + "°", (v) => { this.ang = v; this.calcula(); });
      herramienta("Desdoblar ⇄", (b) => { this.obj = this.obj ? 0 : 1; b.setAttribute("aria-pressed", String(!!this.obj)); }, false);
      disparo(() => { this.s = 0; this.anda = true; }, "TIRAR");
      st.sim = null; this.calcula();
    },
    calcula() {
      const x0 = 0.35, y0 = 0.30, a = rad(this.ang), dx = Math.cos(a), dy = Math.sin(a);
      let x = x0, y = y0, vx = dx, vy = dy; const zz = [[x, y]];
      for (let k = 0; k < 3; k++) {
        const c = [];
        if (vx > 0) c.push(((L - R) - x) / vx); if (vx < 0) c.push((R - x) / vx);
        if (vy > 0) c.push(((W - R) - y) / vy); if (vy < 0) c.push((R - y) / vy);
        const t = Math.min(...c.filter((q) => q > 1e-9));
        x += vx * t; y += vy * t; zz.push([x, y]);
        if (Math.abs(x - R) < 1e-9 || Math.abs(x - (L - R)) < 1e-9) vx = -vx;
        if (Math.abs(y - R) < 1e-9 || Math.abs(y - (W - R)) < 1e-9) vy = -vy;
      }
      zz.push([x + vx * 0.4, y + vy * 0.4]);
      let acc = 0; const rec = [[x0, y0]];
      for (let k = 1; k < zz.length; k++) { acc += Math.hypot(zz[k][0] - zz[k - 1][0], zz[k][1] - zz[k - 1][1]); rec.push([x0 + dx * acc, y0 + dy * acc]); }
      this.zz = zz; this.rec = rec; this.largo = acc;
      const xs = rec.map((p) => p[0]), ys = rec.map((p) => p[1]);
      this.caja = [Math.min(0, ...xs), Math.min(0, ...ys), Math.max(L, ...xs), Math.max(W, ...ys)];
      datos([["Bandas", "3"], ["Recorrido", f2(acc, 2) + " m"]]);
    },
    frame(dt) {
      this.p += (this.obj - this.p) * Math.min(1, dt * (reducido ? 99 : 3));
      if (this.anda) { this.s = Math.min(this.largo, this.s + dt * (reducido ? 99 : 1.4)); if (this.s >= this.largo) this.anda = false; }
    },
    vista() { const [a, b, c, d] = this.caja; encuadrar(a - RAIL, b - RAIL, c + RAIL, d + RAIL); },
    dibujar() {
      const lw = L - 2 * R, lh = W - 2 * R;
      if (this.p > 0.02) {
        ctx.save(); ctx.globalAlpha = this.p;
        for (let i = -1; i <= 3; i++) for (let j = -1; j <= 3; j++) {
          if (!i && !j) continue;
          const ox = i * lw, oy = j * lh;
          if (ox + L < this.caja[0] - 0.2 || ox > this.caja[2] + 0.2 || oy + W < this.caja[1] - 0.2 || oy > this.caja[3] + 0.2) continue;
          mesa(ox, oy, true);
        }
        ctx.restore();
      }
      mesa();
      const mezcla = this.zz.map((p, k) => [p[0] + (this.rec[k][0] - p[0]) * this.p, p[1] + (this.rec[k][1] - p[1]) * this.p]);
      linea(this.rec, C.ideal, 2.5, [10, 8]);
      linea(mezcla, "#fff", 3.5);
      mezcla.slice(1, 4).forEach(([x, y], k) => { ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(X(x), Y(y), 11, 0, 7); ctx.fill(); texto(String(k + 1), X(x), Y(y) + 5, "#141012", 13, "center", 700); });
      // bola recorriendo
      let s = this.s, k = 1;
      while (k < mezcla.length && s > Math.hypot(this.zz[k][0] - this.zz[k - 1][0], this.zz[k][1] - this.zz[k - 1][1])) { s -= Math.hypot(this.zz[k][0] - this.zz[k - 1][0], this.zz[k][1] - this.zz[k - 1][1]); k++; }
      k = Math.min(k, mezcla.length - 1);
      const a0 = mezcla[k - 1], a1 = mezcla[k], seg = Math.hypot(this.zz[k][0] - this.zz[k - 1][0], this.zz[k][1] - this.zz[k - 1][1]);
      const u = seg ? Math.min(1, s / seg) : 0;
      bola({ x: a0[0] + (a1[0] - a0[0]) * u, y: a0[1] + (a1[1] - a0[1]) * u, color: "blanca", giro: 0, wz: 0 });
    },
  });

  // 3 · Golpe y rodadura ------------------------------------------------------------
  CAPS.push({
    nav: "Rodadura", kicker: "Cuerpo rígido",
    titulo: "Del deslizamiento a la rodadura",
    idea: "El taco da velocidad <strong>v</strong> y giro <em>ω</em>. Mientras el punto de contacto desliza, el paño frena uno y acelera el otro hasta que <strong>v = ωR</strong>.",
    formula: String.raw`\begin{gathered}\omega_0=\frac{5\,v_0\,h}{2R^2}\qquad v_f=\frac57\,v_0\left(1+\frac{h}{R}\right)\\[4pt] t_{\text{rodar}}=\frac{2\,|v_0-\omega_0R|}{7\,\mu g}\end{gathered}`,
    h: 0, v0: 2,
    setup() {
      $("extra").innerHTML = leyenda([[C.v, "v (velocidad)"], [C.w, "ωR (giro)"], [C.f, "fricción del paño"]]);
      perilla("Altura del golpe h/R", -0.5, 0.5, 0.05, this.h, (v) => (v > 0 ? "+" : "") + v.toFixed(2), (v) => { this.h = v; this.prepara(); });
      perilla("Velocidad inicial", 0.5, 4, 0.1, this.v0, (v) => v.toFixed(1) + " m/s", (v) => { this.v0 = v; this.prepara(); });
      disparo(() => this.tira());
      this.prepara();
    },
    prepara() {
      nuevaSim([F.nuevaBola("blanca", 0.25, W * 0.28, "blanca")]); this.serie = []; this.trod = null;
      const w0R = 5 * this.v0 * this.h / 2, vf = 5 / 7 * this.v0 * (1 + this.h), tr = 2 * Math.abs(this.v0 - w0R) / (7 * P.mu_s * P.g);
      this.teo = { vf, tr };
      datos([["v_f teórica", f2(vf) + " m/s"], ["t para rodar (teoría)", f2(tr, 3) + " s"], ["v_f simulada", "—"], ["t simulado", "—"]]);
    },
    tira() { this.prepara(); F.golpear(st.sim.bolas[0], 0, this.v0, 0, this.h); this.serie = []; },
    frame() {
      const b = st.sim.bolas[0]; if (b.estado === "quieta") return;
      this.serie.push([st.sim.t, b.vx, P.R * b.wy]);
      if (b.estado === "rueda" && this.trod === null) {
        this.trod = st.sim.t;
        datos([["v_f teórica", f2(this.teo.vf) + " m/s"], ["t para rodar (teoría)", f2(this.teo.tr, 3) + " s"], ["v_f simulada", f2(b.vx) + " m/s", "big"], ["t simulado", f2(this.trod, 3) + " s", "ok"]]);
      }
    },
    vista() { encuadrar(-RAIL, -RAIL, L + RAIL, W + RAIL); },
    dibujar() {
      mesa();
      const b = st.sim.bolas[0];
      rastro(b, "#fff", 3); bola(b);
      const k = 0.12;
      if (b.estado !== "quieta") {
        flecha(b.x, b.y + 0.05, b.vx * k, 0, C.v, "v");
        flecha(b.x, b.y + 0.11, P.R * b.wy * k, 0, C.w, "ωR");
        if (b.estado === "desliza") { const sl = b.vx - P.R * b.wy; flecha(b.x, b.y - 0.05, -Math.sign(sl) * 0.12, 0, C.f, "f"); }
      }
      // gráfica v(t) y ωR(t) sobre la mitad superior del paño
      const gx = 0.25, gy = W * 0.5, gw = L - 0.5, gh = W * 0.42;
      const tmax = Math.max(0.6, this.teo.tr * 1.6), vmax = Math.max(this.v0, 5 * this.v0 * Math.abs(this.h) / 2, 0.5) * 1.15;
      ctx.save(); ctx.fillStyle = "rgba(0,0,0,.28)"; rr(X(gx - 0.05), Y(gy + gh + 0.05), (gw + 0.1) * vista.s, (gh + 0.1) * vista.s, 12); ctx.fill(); ctx.restore();
      linea([[gx, gy + gh], [gx, gy], [gx + gw, gy]], "rgba(255,255,255,.45)", 1.5);
      const vy0 = gy + gh * 0.5;   // eje en el centro (ωR puede ser negativo)
      linea([[gx, vy0], [gx + gw, vy0]], "rgba(255,255,255,.2)", 1, [4, 4]);
      texto("t (s)", X(gx + gw) - 4, Y(gy) - 6, C.txt2, 13, "right");
      texto(f2(tmax, 2), X(gx + gw), Y(gy) + 16, C.txt2, 12, "right");
      const map = ([t, v, w]) => [[gx + gw * Math.min(t / tmax, 1), vy0 + (gh / 2) * v / vmax], [gx + gw * Math.min(t / tmax, 1), vy0 + (gh / 2) * w / vmax]];
      if (this.serie.length > 1) {
        linea(this.serie.map((s) => map(s)[0]), C.v, 3);
        linea(this.serie.map((s) => map(s)[1]), C.w, 3);
      }
      if (this.trod !== null) { const xr = gx + gw * Math.min(this.trod / tmax, 1); linea([[xr, gy], [xr, gy + gh]], C.f, 1.5, [5, 5]); texto("rueda", X(xr) + 6, Y(gy + gh) + 16, C.f, 13); }
      texto("v", X(gx) + 8, Y(gy + gh) + 16, C.v, 14); texto("ωR", X(gx) + 28, Y(gy + gh) + 16, C.w, 14);
    },
  });

  // 4 · Efecto en la banda -------------------------------------------------------------
  CAPS.push({
    nav: "Efecto", kicker: "Fricción en la banda",
    titulo: "El efecto abre o cierra el ángulo",
    idea: "El efecto lateral hace que el punto de contacto <em>deslice</em> contra la banda. La fricción cambia la velocidad a lo largo de la banda y el ángulo de salida ya no es el del espejo.",
    formula: String.raw`\begin{gathered}\sin\theta_a=\frac{h}{R}-1\qquad h=37\ \text{mm}\\[4pt] P_z=(1+e)\,v_n\cos\theta_a\\[4pt] P_{xy}=\min\!\Big(\tfrac{2}{7}|\vec s|,\ \mu_c P_z\Big)\,\hat s\\[4pt] e=0.85\quad \mu_c=0.15\end{gathered}`,
    th: 40, ef: { a: 0.3, b: 0.3 },
    setup() {
      $("extra").innerHTML = leyenda([["#fff", "con efecto (simulada)"], [C.ideal, "sin efecto (espejo)", 1]]) +
        `<p class="note" style="font-size:12px;color:var(--txt-2);margin:10px 0 0">La banda toca la bola 6 mm por encima del centro (ángulo θa): por eso el efecto lateral y el alto cambian el rebote. s es el deslizamiento en el punto de contacto. Modelo de Han (2005) para carambola, implementado como en Pooltool (Kiefl, 2024).</p>`;
      cara(this.ef, () => this.prepara());
      perilla("Ángulo de llegada", 15, 70, 1, this.th, (v) => v + "°", (v) => { this.th = v; this.prepara(); });
      herramienta("Cámara lenta", (b) => { st.vel = st.vel === 1 ? 0.35 : 1; b.setAttribute("aria-pressed", String(st.vel !== 1)); }, st.vel !== 1);
      disparo(() => this.tira());
      this.prepara();
    },
    prepara() {
      this.t0 = tiroHaciaBanda(this.th); this.golpe = null;
      nuevaSim([F.nuevaBola("blanca", this.t0.x0, this.t0.y0, "blanca")]);
      datos([["Entrada", this.th + "°"], ["Salida espejo", this.th + "°"], ["Salida con efecto", "—"]]);
    },
    tira() { this.prepara(); F.golpear(st.sim.bolas[0], this.t0.ang, 2.0, this.ef.a, this.ef.b); },
    evento(e, b) { if (e.tipo === "banda" && !this.golpe) {
      this.golpe = e;
      const sal = deg(Math.atan2(b.vx, b.vy));
      datos([["Entrada", this.th + "°"], ["Salida espejo", this.th + "°"], ["Salida con efecto", f2(sal, 1) + "°", "big"], ["Cambio", (sal - this.th > 0 ? "+" : "") + f2(sal - this.th, 1) + "°"]]);
    } },
    vista() { encuadrar(-RAIL, -RAIL, L + RAIL, W + RAIL); },
    dibujar() {
      mesa();
      const t = this.t0, hx = L / 2;
      linea([[t.x0, t.y0], [hx, R], [hx + (hx - t.x0), t.y0]], C.ideal, 2.5, [10, 8]);
      linea([[hx, 0], [hx, 0.6]], "rgba(255,255,255,.5)", 2, [6, 6]);
      if (!this.golpe && !st.sim.activa()) dibujaPrediccion(predecir(st.sim.bolas, t.ang, 2.0, this.ef.a, this.ef.b));
      st.sim.bolas.forEach((b) => rastro(b, "#fff", 3)); st.sim.bolas.forEach(bola);
    },
  });

  // 5 · Choque entre bolas ------------------------------------------------------------
  CAPS.push({
    nav: "Choque", kicker: "Momento lineal",
    titulo: "Noventa grados… y luego la curva",
    idea: "En un choque entre bolas iguales sin giro, salen a <strong>90°</strong>. Pero la tiradora conserva su giro: el paño la curva hacia adelante (golpe alto) o hacia atrás (golpe bajo).",
    formula: String.raw`\vec v_f=\frac57\,\vec v\;+\;\frac27\,(\vec\omega\times R\hat z)\quad\xrightarrow{\text{rodando}}\quad \frac57\,\vec v_t+\frac27\,\vec v_0`,
    corte: 0.5, ef: { a: 0, b: 0.3 }, v0: 2.2,
    setup() {
      $("extra").innerHTML = leyenda([["#fff", "bola blanca"], [COL.roja, "bola roja"], [C.ideal, "90° sin giro", 1], [C.f, "dirección final predicha", 1]]);
      cara(this.ef, () => this.prepara());
      perilla("Grosor del corte", 0.1, 0.9, 0.05, this.corte, (v) => Math.round(v * 100) + " %", (v) => { this.corte = v; this.prepara(); });
      perilla("Velocidad", 1, 4, 0.1, this.v0, (v) => v.toFixed(1) + " m/s", (v) => { this.v0 = v; this.prepara(); });
      disparo(() => this.tira());
      this.prepara();
    },
    prepara() {
      const off = this.corte * 2 * R;
      nuevaSim([F.nuevaBola("blanca", 0.55, W / 2 - 0.25, "blanca"), F.nuevaBola("roja", 1.25, W / 2 - 0.25 + off, "roja")]);
      this.choque = null; this.pred = null; this.medido = null;
      datos([["Separación inicial", "—"], ["Dirección final predicha", "—"], ["Dirección final simulada", "—"]]);
    },
    tira() { this.prepara(); F.golpear(st.sim.bolas[0], 0, this.v0, this.ef.a, this.ef.b); },
    evento(e) {
      if (e.tipo !== "bola" || this.choque) return;
      const [w, r] = st.sim.bolas;
      const sep = Math.abs(deg(Math.atan2(w.vy, w.vx) - Math.atan2(r.vy, r.vx)));
      const fx = (5 * w.vx + 2 * P.R * w.wy) / 7, fy = (5 * w.vy - 2 * P.R * w.wx) / 7;
      this.choque = { x: w.x, y: w.y, rx: r.x, ry: r.y, rvx: r.vx, rvy: r.vy, wvx: w.vx, wvy: w.vy, sep };
      this.pred = Math.atan2(fy, fx);
      datos([["Separación inicial", f2(sep > 180 ? 360 - sep : sep, 1) + "°", "big"], ["Dirección final predicha", f2(deg(this.pred), 1) + "°"], ["Dirección final simulada", "…"]]);
    },
    frame() {
      const w = st.sim.bolas[0];
      if (this.choque && this.medido === null && w.estado === "rueda") {
        this.medido = Math.atan2(w.vy, w.vx);
        datos([["Separación inicial", f2(this.choque.sep > 180 ? 360 - this.choque.sep : this.choque.sep, 1) + "°", "big"], ["Dirección final predicha", f2(deg(this.pred), 1) + "°"], ["Dirección final simulada", f2(deg(this.medido), 1) + "°", "ok"]]);
      }
    },
    vista() { encuadrar(-RAIL, -RAIL, L + RAIL, W + RAIL); },
    dibujar() {
      mesa();
      if (this.choque) {
        const c = this.choque, n1 = Math.hypot(c.wvx, c.wvy) || 1, n2 = Math.hypot(c.rvx, c.rvy) || 1;
        linea([[c.x, c.y], [c.x + c.wvx / n1 * 0.7, c.y + c.wvy / n1 * 0.7]], C.ideal, 2.5, [10, 8]);
        linea([[c.rx, c.ry], [c.rx + c.rvx / n2 * 0.7, c.ry + c.rvy / n2 * 0.7]], "rgba(216,67,47,.8)", 2.5, [10, 8]);
        linea([[c.x, c.y], [c.x + Math.cos(this.pred) * 1.1, c.y + Math.sin(this.pred) * 1.1]], C.f, 2.5, [4, 7]);
      }
      st.sim.bolas.forEach((b) => rastro(b, b.color === "roja" ? COL.roja : "#fff", 3)); st.sim.bolas.forEach(bola);
    },
  });

  // 6 · Los sistemas de diamantes --------------------------------------------------------
  // Geometría real: los diamantes están en el marco, a dDiam de la nariz de la banda.
  // Se apunta por los diamantes; la bola rebota con su centro a R de la nariz.
  const enBanda = (banda, p) => ({ sup: [p * L / 8, W + dDiam], inf: [p * L / 8, -dDiam], izq: [-dDiam, p * W / 4], der: [L + dDiam, p * W / 4] })[banda];
  const posEsc = (m, v) => { const s = [...m].sort((a, b) => a[0] - b[0]); for (let i = 0; i < s.length - 1; i++) { const [v0, p0] = s[i], [v1, p1] = s[i + 1]; if (v >= v0 && v <= v1) return v1 === v0 ? p0 : p0 + (v - v0) * (p1 - p0) / (v1 - v0); } return null; };
  const valEsc = (m, p) => { const s = [...m].sort((a, b) => a[1] - b[1]); for (let i = 0; i < s.length - 1; i++) { const [v0, p0] = s[i], [v1, p1] = s[i + 1]; if (p >= p0 && p <= p1) return p1 === p0 ? v0 : v0 + (p - p0) * (v1 - v0) / (p1 - p0); } return null; };
  const punto = (s, va, v) => { for (const [b, m] of s.escalas[va]) { const p = posEsc(m, v); if (p !== null) return { banda: b, pos: p, xy: enBanda(b, p) }; } return null; };
  const rango = (s, va) => { const v = s.escalas[va].flatMap(([, m]) => m.map((x) => x[0])); return [Math.min(...v), Math.max(...v)]; };
  const evalua = (e, v) => e.trim() === "true" ? true : Function("S", "L", "V", "A", `"use strict";return (${e});`)(v.S, v.L, v.V, v.A ?? 0);
  const calc = (s, v) => { for (const c of s.formula) if (evalua(c.si, v)) return evalua(c.expr, v); return NaN; };
  const posEnBanda = (lado, x, y) => (lado === "sup" || lado === "inf") ? x / (L / 8) : y / (W / 4);

  CAPS.push({
    nav: "Sistemas", kicker: "Los diamantes",
    titulo: "Todo eso, en una resta",
    idea: "Elige un sistema y mueve la salida y la llegada. Se apunta <em>por los diamantes del marco</em>; al simular, la bola rueda con efecto y rebota en bandas de 37 mm de altura. Compara dónde llega con lo que dice la resta.",
    sis: SIS[0], v: { S: 50, L: 30, ef: 3, A: 0, V: 0 }, v0: 2.5,
    setup() {
      $("extra").innerHTML = `<div class="chips" id="lista">${SIS.map((s) => `<button class="chip" type="button" data-id="${s.id}" aria-pressed="${s.id === this.sis.id}">${s.n}. ${s.nombre.split(" (")[0]}</button>`).join("")}</div>` +
        `<div style="margin-top:10px">${leyenda([["#fff", "línea de mira (por los diamantes)"], [C.ideal, "reflexión ideal", 1], ["#e0a800", "simulación con efecto"]])}</div>`;
      $("lista").onclick = (e) => { const b = e.target.closest(".chip"); if (!b) return; this.sis = SIS.find((s) => s.id === b.dataset.id); const ej = this.sis.ejemplos_blog[0]; this.v = { S: ej.S, L: ej.L, ef: ej.efecto ?? 3, A: ej.A ?? 0, V: ej.V ?? 0 }; ir(6); };
      const s = this.sis;
      perilla("Salida", ...rango(s, "S"), 1, this.v.S, (x) => x, (x) => { this.v.S = x; this.calcula(); });
      perilla("Llegada", ...rango(s, "L"), 1, this.v.L, (x) => x, (x) => { this.v.L = x; this.calcula(); });
      if (s.efecto.tipo === "avance") perilla("Efecto", 1, 3, 1, this.v.ef, (x) => `${x} (avance ${Object.fromEntries(s.efecto.tabla)[x]})`, (x) => { this.v.ef = x; this.calcula(); });
      if (s.efecto.tipo === "pasabola") perilla("Efecto de ataque", -4, 4, 1, this.v.A, (x) => x, (x) => { this.v.A = x; this.calcula(); });
      perilla("Velocidad", 1, 5, 0.1, this.v0, (x) => x.toFixed(1) + " m/s", (x) => { this.v0 = x; });
      perilla("Nariz → diamante", 0, 15, 0.5, dDiam * 100, (x) => x.toFixed(1) + " cm", (x) => { dDiam = x / 100; this.calcula(); });
      disparo(() => this.simula(), "SIMULAR");
      this.calcula();
    },
    calcula() {
      const s = this.sis, v = { S: this.v.S, L: this.v.L, A: this.v.A, V: s.efecto.tipo === "avance" ? Object.fromEntries(s.efecto.tabla)[this.v.ef] : s.efecto.tipo === "pasabola" ? this.v.V : 0 };
      const r = calc(s, v); v[s.calcula] = r; this.r = r;
      const caso = s.formula.find((c) => evalua(c.si, v));
      const col = { S: "#1f7a52", L: "#2a5bc4", V: "#6a4bd1", A: "#b3246b" };
      let ex = caso.expr.replace(/\(([^()]+)\) \/ 2/g, "\\frac{$1}{2}").replace(/\b([SLVA]) \/ 2/g, "\\frac{$1}{2}").replace(/\*/g, "\\cdot ");
      ex = ex.replace(/\b([SLVA])\b/g, (m) => `\\textcolor{${col[m]}}{${+f2(v[m])}}`);
      tex(String.raw`\begin{gathered}${s.latex}\\[6pt]\text{${s.calcula === "E" ? "EFECTO" : "ATAQUE"}}=${ex}=\mathbf{${+f2(r)}}\end{gathered}`, $("formula"));
      this.pS = punto(s, "S", v.S); this.pL = punto(s, "L", v.L);
      this.pA = punto(s, "A", s.calcula === "E" ? v.A : r);
      this.ideal = null; this.inicio = null; this.simLlega = null; this.hitsIdeal = null;
      if (this.pS && this.pA) {
        let dx = this.pA.xy[0] - this.pS.xy[0], dy = this.pA.xy[1] - this.pS.xy[1]; const n = Math.hypot(dx, dy);
        if (n > 1e-9) {
          dx /= n; dy /= n; this.dir = [dx, dy];
          // la bola sobre la línea de mira, 12 cm adentro de la mesa
          let [x, y] = this.pS.xy, k = 0;
          while ((x < R + 0.01 || x > L - R - 0.01 || y < R + 0.01 || y > W - R - 0.01) && k++ < 2000) { x += dx * 0.002; y += dy * 0.002; }
          x += dx * 0.12; y += dy * 0.12; this.inicio = [x, y];
          // reflexión ideal del centro de la bola (rectángulo reducido en R)
          const pts = [[x, y]], hits = []; let ddx = dx, ddy = dy;
          for (let q = 0; q < 4; q++) {
            const c = []; if (ddx > 1e-12) c.push([(L - R - x) / ddx, "der"]); if (ddx < -1e-12) c.push([(R - x) / ddx, "izq"]); if (ddy > 1e-12) c.push([(W - R - y) / ddy, "sup"]); if (ddy < -1e-12) c.push([(R - y) / ddy, "inf"]);
            const vv = c.filter((t) => t[0] > 1e-9); if (!vv.length) break; const t = Math.min(...vv.map((u) => u[0])); const lado = vv.find((u) => u[0] === t)[1];
            x += ddx * t; y += ddy * t; pts.push([x, y]); hits.push({ lado, x, y });
            if (lado === "der" || lado === "izq") ddx = -ddx; else ddy = -ddy;
          }
          this.ideal = pts; this.hitsIdeal = hits;
        }
      }
      nuevaSim([]); this.muestra();
    },
    llegadaDe(lista) {   // tercera banda (o segunda) que cae en la banda de la llegada
      const b = this.pL.banda;
      return lista.find((h, i) => i >= 2 && h.lado === b) || lista.find((h, i) => i >= 1 && h.lado === b);
    },
    muestra() {
      const s = this.sis, filas = [[s.calcula === "E" ? "Efecto" : "Ataque", f2(this.r, 1), "big"]];
      if (s.calcula === "A" && !this.pA) filas.push(["Aviso", "fuera de la escala", "warn"]);
      if (this.pL && this.hitsIdeal) {
        const m = s.escalas.L.find(([b]) => b === this.pL.banda)[1];
        const lee = (h) => h ? valEsc(m, posEnBanda(h.lado, h.x, h.y)) : null;
        const hi = this.llegadaDe(this.hitsIdeal);
        filas.push(["Llegada que dice el sistema", f2(this.v.L, 1)]);
        filas.push(["Geometría pura (sin efecto)", hi ? (lee(hi) !== null ? f2(lee(hi), 1) : "fuera de escala") : "no llega"]);
        if (this.simLlega !== null) {
          const ok = this.simLlega && lee(this.simLlega) !== null;
          filas.push(["Simulación con efecto", this.simLlega ? (ok ? f2(lee(this.simLlega), 1) : "fuera de escala") : "no llega", "ok"]);
          if (ok) filas.push(["Error del sistema", f2(Math.abs(posEnBanda(this.simLlega.lado, this.simLlega.x, this.simLlega.y) - this.pL.pos), 2) + " diamantes"]);
        }
      }
      datos(filas);
    },
    simula() {
      if (!this.inicio || !this.hitsIdeal || !this.hitsIdeal.length) return;
      const b = F.nuevaBola("blanca", this.inicio[0], this.inicio[1], "blanca");
      nuevaSim([b]);
      const s = this.sis, [dx, dy] = this.dir;
      const n = { sup: [0, 1], inf: [0, -1], izq: [-1, 0], der: [1, 0] }[this.hitsIdeal[0].lado];
      const vt = dx * -n[1] + dy * n[0];
      // golpe leído de la figura original del sistema (hora del reloj en la cara de la bola)
      const g = s.golpe, q = g.fijo || (g.por_efecto && g.por_efecto[String(this.v.ef)]) ||
        (g.por_cantidad ? { reloj: Math.abs(this.r) * g.por_cantidad.grados_por_unidad / 30, radio: g.por_cantidad.radio } : { reloj: 0, radio: 0 });
      const phi = q.reloj * Math.PI / 6, lat = q.radio * Math.sin(phi), vert = q.radio * Math.cos(phi);
      const signo = (g.lado === "contrario" || (g.por_cantidad && this.r < 0)) ? -1 : 1;
      F.golpear(b, Math.atan2(dy, dx), this.v0, signo * Math.sign(vt) * lat, vert);
      this.simLlega = null; this.bandasSim = [];
    },
    evento(e) {
      if (e.tipo !== "banda") return;
      this.bandasSim.push({ lado: e.lado, x: e.x, y: e.y });
      avisar(`Banda ${this.bandasSim.length}`);
    },
    frame() {
      if (st.sim && st.sim.bolas.length && !st.sim.activa() && this.simLlega === null && this.bandasSim && this.bandasSim.length) {
        this.simLlega = this.pL ? (this.llegadaDe(this.bandasSim) || undefined) : undefined; this.muestra();
      }
    },
    vista() { encuadrar(-RAIL - 0.16, -RAIL - 0.12, L + RAIL + 0.16, W + RAIL + 0.12); },
    dibujar() {
      mesa();
      const s = this.sis, pila = { sup: 0, inf: 0, izq: 0, der: 0 }, colV = { S: "#1f7a52", L: "#2a5bc4", A: "#b3246b" };
      for (const va of ["S", "L", "A"]) for (const [banda, m] of s.escalas[va]) {
        const k = pila[banda]++, off = RAIL + 0.05 + k * 0.07;
        for (const [v, p] of m) {
          const [x, y] = enBanda(banda, p);
          const [tx, ty] = banda === "sup" ? [x, W + off] : banda === "inf" ? [x, -off] : banda === "izq" ? [-off, y] : [L + off, y];
          texto(String(v), X(tx), Y(ty) + 5, colV[va], 13, "center", 600);
        }
      }
      if (this.pS && this.pA) linea([this.pS.xy, this.pA.xy], "rgba(255,255,255,.9)", 2, [2, 6]);
      if (this.ideal) linea(this.ideal, C.ideal, 2.5, [10, 8]);
      const mark = (p, c) => { if (!p) return; ctx.fillStyle = c; ctx.strokeStyle = "#fff"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(X(p.xy[0]), Y(p.xy[1]), 9, 0, 7); ctx.fill(); ctx.stroke(); };
      mark(this.pS, "#1f7a52"); mark(this.pL, "#2a5bc4"); mark(this.pA, "#b3246b");
      if (st.sim && st.sim.bolas.length) { st.sim.bolas.forEach((b) => rastro(b, "#ffd36b", 3.5)); st.sim.bolas.forEach(bola); }
      else if (this.inicio) bola({ x: this.inicio[0], y: this.inicio[1], color: "blanca", wz: 0 });
    },
  });

  // 7 · Juega ------------------------------------------------------------------------
  CAPS.push({
    nav: "Juega", kicker: "Mesa libre",
    titulo: "Tu turno: carambola a tres bandas",
    idea: "<strong>Arrastra</strong> sobre la mesa para apuntar, elige el <em>efecto</em> en la bola de abajo y tira. Vale si la blanca toca las dos bolas con al menos <strong>tres bandas</strong> antes de la segunda.",
    ef: { a: 0, b: 0.2 }, v0: 3, ang: rad(20), pos: null, verPred: true,
    setup() {
      $("extra").innerHTML = leyenda([["#fff", "blanca (tu bola)"], [COL.amarilla, "amarilla"], [COL.roja, "roja"], ["rgba(255,255,255,.6)", "trayectoria predicha", 1]]) +
        `<p style="font-size:12px;color:var(--txt-2);margin:10px 0 0">La predicción es la misma simulación corrida por adelantado: el modelo es determinista. Coincide con la mesa real solo en la medida en que el modelo y sus coeficientes la describen.</p>`;
      cara(this.ef, null);
      perilla("Fuerza", 0.5, 8, 0.1, this.v0, (v) => v.toFixed(1) + " m/s", (v) => { this.v0 = v; });
      herramienta("Predicción", (b) => { this.verPred = !this.verPred; b.setAttribute("aria-pressed", String(this.verPred)); }, this.verPred);
      herramienta("Recolocar", () => this.coloca(true));
      herramienta("Cámara lenta", (b) => { st.vel = st.vel === 1 ? 0.35 : 1; b.setAttribute("aria-pressed", String(st.vel !== 1)); }, st.vel !== 1);
      disparo(() => this.tira());
      this.coloca(!this.pos);
    },
    coloca(inicial) {
      if (inicial || !this.pos) this.pos = { blanca: [0.71, 0.56], amarilla: [0.71, 0.86], roja: [2.13, 0.71] };
      nuevaSim(["blanca", "amarilla", "roja"].map((c) => F.nuevaBola(c, ...this.pos[c], c)));
      datos([["Bandas antes de la 2.ª bola", "—"], ["Resultado", "—"]]);
    },
    tira() {
      if (st.sim.activa()) return;
      const bs = st.sim.bolas; this.pos = Object.fromEntries(bs.map((b) => [b.color, [b.x, b.y]]));
      nuevaSim(bs.map((b) => F.nuevaBola(b.color, b.x, b.y, b.color)));
      F.golpear(st.sim.bolas[0], this.ang, this.v0, this.ef.a, this.ef.b);
      this.juzgado = false; this.disparado = true; this.nB = 0;
    },
    evento(e) { if (e.tipo === "banda" && e.bola === "blanca") avisar(`Banda ${++this.nB}`); if (e.tipo === "bola" && (e.a === "blanca" || e.b === "blanca")) avisar("¡Toque!"); },
    frame() {
      if (this.disparado && !st.sim.activa() && !this.juzgado) {
        this.juzgado = true; this.disparado = false;
        const r = F.evaluarCarambola(st.sim.eventos, "blanca");
        datos([["Bandas antes de la 2.ª bola", String(r.bandas)], ["Resultado", r.valida ? "¡Carambola!" : r.tocadas.length === 2 ? "faltaron bandas" : "no tocó las dos", r.valida ? "ok" : "warn"]]);
        avisar(r.valida ? "¡CARAMBOLA A TRES BANDAS!" : "Sin carambola", r.valida ? "ok" : "big");
        this.pos = Object.fromEntries(st.sim.bolas.map((b) => [b.color, [b.x, b.y]]));
      }
    },
    puntero(x, y) { if (st.sim.activa()) return; const b = st.sim.bolas[0]; this.ang = Math.atan2(y - b.y, x - b.x); },
    vista() { encuadrar(-RAIL, -RAIL, L + RAIL, W + RAIL); },
    dibujar() {
      mesa();
      const b = st.sim.bolas[0];
      if (!st.sim.activa()) {
        const dx = Math.cos(this.ang), dy = Math.sin(this.ang);
        if (this.verPred) dibujaPrediccion(predecir(st.sim.bolas, this.ang, this.v0, this.ef.a, this.ef.b));
        else linea([[b.x, b.y], [b.x + dx * 0.9, b.y + dy * 0.9]], "rgba(255,255,255,.55)", 2, [8, 8]);
        // taco
        ctx.save(); ctx.lineCap = "round";
        ctx.strokeStyle = "#c9a26b"; ctx.lineWidth = 7;
        ctx.beginPath(); ctx.moveTo(X(b.x - dx * 0.06), Y(b.y - dy * 0.06)); ctx.lineTo(X(b.x - dx * 1.1), Y(b.y - dy * 1.1)); ctx.stroke();
        ctx.strokeStyle = "#3f6fb5"; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(X(b.x - dx * 0.06), Y(b.y - dy * 0.06)); ctx.lineTo(X(b.x - dx * 0.075), Y(b.y - dy * 0.075)); ctx.stroke();
        ctx.restore();
      }
      st.sim.bolas.forEach((q) => rastro(q, q.color === "blanca" ? "#fff" : COL[q.color], 2.5, .75)); st.sim.bolas.forEach(bola);
    },
  });

  /* ================= Navegación ================= */
  function construirPasos() {
    $("pasos").innerHTML = CAPS.map((c, i) => `<button class="step" type="button" data-i="${i}"><i>${String(i).padStart(2, "0")}</i><span>${c.nav}</span></button>`).join("");
    $("pasos").onclick = (e) => { const b = e.target.closest(".step"); if (b) ir(Number(b.dataset.i)); };
  }
  function ir(i) {
    i = Math.max(0, Math.min(CAPS.length - 1, i));
    st.cap = i; st.vel = 1; const c = CAPS[i];
    document.querySelectorAll(".step").forEach((b) => b.setAttribute("aria-current", Number(b.dataset.i) === i ? "step" : "false"));
    $("num").textContent = String(i).padStart(2, "0"); $("kicker").textContent = c.kicker;
    $("titulo").textContent = c.titulo; $("idea").innerHTML = c.idea;
    if (c.formula) tex(c.formula, $("formula")); else $("formula").innerHTML = "";
    $("extra").innerHTML = ""; $("datos").innerHTML = ""; dock().innerHTML = "";
    c.cuenta = 0;
    c.setup();
    $("prev").disabled = i === 0; $("next").disabled = i === CAPS.length - 1;
    try { history.replaceState(null, "", `#cap=${i}`); } catch (e) { /* sin historial */ }
  }
  $("prev").onclick = () => ir(st.cap - 1);
  $("next").onclick = () => ir(st.cap + 1);
  addEventListener("keydown", (e) => {
    if (e.target.matches("input, textarea, select, [role=slider]")) return;
    if (e.key === "ArrowRight") ir(st.cap + 1);
    if (e.key === "ArrowLeft") ir(st.cap - 1);
  });
  $("plegar").onclick = () => { const p = $("tarjeta").classList.toggle("plegada"); $("plegar").setAttribute("aria-expanded", String(!p)); };

  // puntero sobre la mesa (apuntar en "Juega")
  const apuntar = (e) => { const c = CAPS[st.cap]; if (!c.puntero) return; const [x, y] = aMundo(e.clientX, e.clientY); c.puntero(x, y); };
  cv.addEventListener("pointerdown", (e) => { cv.setPointerCapture(e.pointerId); apuntar(e); });
  cv.addEventListener("pointermove", (e) => { if (e.buttons) apuntar(e); });

  /* ================= Bucle ================= */
  let antes = performance.now();
  function bucle(ahora) {
    const dt = Math.min(0.05, (ahora - antes) / 1000); antes = ahora;
    const c = CAPS[st.cap];
    if (st.sim && st.sim.bolas.length) {
      if (reducido) st.sim.correr();
      else {
        // pasos cortos para que la orientación siga a ω (que cambia al deslizar y en las bandas)
        const sub = 4, h = dt * st.vel / sub;
        for (let k = 0; k < sub; k++) { st.sim.paso(h); st.sim.bolas.forEach((b) => girar(b, h)); }
      }
      while (st.nEv < st.sim.eventos.length) {
        const e = st.sim.eventos[st.nEv++];
        if (c.evento) c.evento(e, st.sim.bolas.find((b) => b.id === (e.bola || e.a)));
      }
    }
    if (c.frame) c.frame(dt);
    fondo(); c.vista(); c.dibujar();
    requestAnimationFrame(bucle);
  }

  function init() {
    construirPasos();
    const m = /cap=(\d+)/.exec(location.hash);
    ir(m ? Number(m[1]) : 0);
    requestAnimationFrame(bucle);
  }
  if (document.readyState === "loading") addEventListener("DOMContentLoaded", init); else init();
})();
