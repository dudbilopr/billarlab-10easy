// Verifica cada sistema de diamantes contra la simulación física (node scripts/calibrar_sistemas.js).
// Geometría real: los diamantes están en el marco, a una distancia d de la nariz de la banda.
// El jugador apunta por los diamantes de SALIDA y ATAQUE; la bola rebota con su centro a R de la nariz.
// El golpe (punto de la cara de la bola) de cada sistema sale de sus figuras originales (data/sistemas.json, "golpe").
const F = require("../js/fisica.js");
const datos = require("../data/sistemas.json");
const P = F.PARAM, L = P.L, W = P.W, R = P.R;

const posEsc = (m, v) => { const s = [...m].sort((a, b) => a[0] - b[0]); for (let i = 0; i < s.length - 1; i++) { const [v0, p0] = s[i], [v1, p1] = s[i + 1]; if (v >= v0 && v <= v1) return v1 === v0 ? p0 : p0 + (v - v0) * (p1 - p0) / (v1 - v0); } return null; };
const valEsc = (m, p) => { const s = [...m].sort((a, b) => a[1] - b[1]); for (let i = 0; i < s.length - 1; i++) { const [v0, p0] = s[i], [v1, p1] = s[i + 1]; if (p >= p0 && p <= p1) return p1 === p0 ? v0 : v0 + (p - p0) * (v1 - v0) / (p1 - p0); } return null; };
const evalua = (e, v) => e.trim() === "true" ? true : Function("S", "L", "V", "A", `"use strict";return (${e});`)(v.S, v.L, v.V, v.A ?? 0);

function diamante(banda, pos, d) {
  return { sup: [pos * L / 8, W + d], inf: [pos * L / 8, -d], izq: [-d, pos * W / 4], der: [L + d, pos * W / 4] }[banda];
}
function punto(sis, va, v, d) {
  for (const [banda, m] of sis.escalas[va]) { const p = posEsc(m, v); if (p !== null) return { banda, pos: p, xy: diamante(banda, p, d) }; }
  return null;
}
/** Punto de golpe (lateral, vertical) en fracciones de R, a partir de la hora del reloj de la figura. */
function golpe(sis, efecto) {
  const g = sis.golpe;
  const q = g.fijo || (g.por_efecto && g.por_efecto[String(efecto)]) || { reloj: 0, radio: 0 };
  const phi = q.reloj * Math.PI / 6;
  return { lat: q.radio * Math.sin(phi), vert: q.radio * Math.cos(phi), signo: g.lado === "contrario" ? -1 : 1 };
}

/** Simula el tiro del sistema y devuelve la llegada leída en la escala del sistema. */
function simular(sis, S, Lg, { d = 0.09, v0 = 2.5, efecto = 3, adentro = 0.12 } = {}) {
  const V = sis.efecto.tipo === "avance" ? Object.fromEntries(sis.efecto.tabla)[efecto] : 0;
  const v = { S, L: Lg, V };
  const caso = sis.formula.find((c) => evalua(c.si, v));
  const A = evalua(caso.expr, v);
  const pS = punto(sis, "S", S, d), pA = punto(sis, "A", A, d), pL = punto(sis, "L", Lg, d);
  if (!pS || !pA || !pL) return { A, error: "fuera de escala" };
  let dx = pA.xy[0] - pS.xy[0], dy = pA.xy[1] - pS.xy[1]; const n = Math.hypot(dx, dy); dx /= n; dy /= n;
  let [x, y] = pS.xy, k = 0;
  while ((x < R + 0.01 || x > L - R - 0.01 || y < R + 0.01 || y > W - R - 0.01) && k++ < 2000) { x += dx * 0.002; y += dy * 0.002; }
  x += dx * adentro; y += dy * adentro;
  const bola = F.nuevaBola("w", x, y, "blanca");
  const nA = { sup: [0, 1], inf: [0, -1], izq: [-1, 0], der: [1, 0] }[pA.banda];
  const vt = dx * -nA[1] + dy * nA[0];
  const g = golpe(sis, efecto);
  F.golpear(bola, Math.atan2(dy, dx), v0, g.signo * Math.sign(vt) * g.lat, g.vert);
  const sim = new F.Simulacion([bola]).correr(20);
  const bandas = sim.eventos.filter((e) => e.tipo === "banda");
  const llega = bandas.find((e, i) => i >= 2 && e.lado === pL.banda) || bandas.find((e, i) => i >= 1 && e.lado === pL.banda);
  if (!llega) return { A, bandas: bandas.map((e) => e.lado), error: "no llega" };
  const pos = (llega.lado === "sup" || llega.lado === "inf") ? llega.x / (L / 8) : llega.y / (W / 4);
  const m = sis.escalas.L.find(([bd]) => bd === pL.banda)[1];
  return { A, llegada: valEsc(m, pos), pos, sistema: pL.pos, delta: pos - pL.pos, bandas: bandas.map((e) => e.lado) };
}

module.exports = { simular, diamante, golpe };

if (require.main === module) {
  const filas = [];
  for (const s of datos.sistemas) {
    if (s.calcula !== "A") { console.log(`${s.n}. ${s.nombre}: calcula el EFECTO; no se simula todavía`); continue; }
    for (const ej of s.ejemplos_blog) {
      const res = [2, 2.5, 3].map((v0) => simular(s, ej.S, ej.L, { v0, efecto: ej.efecto ?? 3 }));
      const txt = res.map((r, i) => `${[2, 2.5, 3][i]} m/s: ${r.delta != null ? (r.delta >= 0 ? "+" : "") + r.delta.toFixed(2) : r.error}`).join(" | ");
      console.log(`${s.n}. ${s.nombre}  S=${ej.S} L=${ej.L} -> A=${res[0].A}  ·  error de llegada (diamantes): ${txt}  ·  bandas ${res[1].bandas ? res[1].bandas.slice(0, 4).join("-") : ""}`);
      filas.push({ id: s.id, n: s.n, S: ej.S, L: ej.L, A: res[0].A, errores: res.map((r) => r.delta ?? null) });
    }
  }
  require("fs").writeFileSync(require("path").join(__dirname, "..", "data", "verificacion_sistemas.json"), JSON.stringify({ d_m: 0.09, velocidades: [2, 2.5, 3], filas }, null, 1));
  console.log("\nCorner-5 / LCL — recorrido de referencia 5-3-2 (salida 50, ataque 20 -> llegada 30):");
  const lcl = datos.sistemas.find((s) => s.id === "lcl");
  for (const v0 of [2, 2.5, 3, 4]) { const r = simular(lcl, 50, 30, { v0 }); console.log(`  ${v0} m/s -> llegada ${r.llegada?.toFixed(1)}`); }
}
