// Pruebas del motor físico (node tests/fisica.test.js). Comparan con resultados analíticos.
const assert = require("node:assert/strict");
const F = require("../js/fisica.js");
const P = F.PARAM;
const cerca = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg}: ${a} vs ${b}`);

function hastaRodar(h, v0 = 2) {
  const b = F.nuevaBola("w", 0.3, 0.71, "blanca");
  F.golpear(b, 0, v0, 0, h);
  const s = new F.Simulacion([b]);
  while (b.estado === "desliza") s.paso(0.0005);
  return { v: Math.hypot(b.vx, b.vy), t: s.t };
}

// 1. Golpe al centro: v_f = 5/7 v0 y t = 2 v0 / (7 mu g)
let r = hastaRodar(0);
cerca(r.v, 5 / 7 * 2, 2e-3, "v_f golpe al centro");
cerca(r.t, 2 * 2 / (7 * P.mu_s * P.g), 2e-3, "tiempo hasta rodar");

// 2. v_f = 5/7 v0 (1 + h/R) para varias alturas
for (const h of [-0.4, -0.2, 0.2, 0.5]) cerca(hastaRodar(h).v, 5 / 7 * 2 * (1 + h), 3e-3, `v_f con h/R=${h}`);

// 3. Golpe a 2R/5: rueda desde el inicio
const b = F.nuevaBola("w", 0.3, 0.71, "blanca"); F.golpear(b, 0, 2, 0, 0.4);
const [ux, uy] = F.deslizamiento(b, P); cerca(Math.hypot(ux, uy), 0, 1e-9, "rodadura natural");

// 4. Banda (Han 2005): rebota, pierde energía, y el efecto cambia el rebote
const banda = (vx, vy, wx, wy, wz) => { const q = F.nuevaBola("w", 1, P.R, "blanca"); Object.assign(q, { vx, vy, wx, wy, wz }); F.chocarBanda(q, 0, -1, P); return q; };
const sinGiro = banda(0, -1, 0, 0, 0);
assert.ok(sinGiro.vy > 0 && sinGiro.vy < 1, "rebota con menos velocidad normal");
cerca(sinGiro.vx, 0, 1e-12, "choque perpendicular sin giro: no aparece velocidad lateral");
const conLateral = banda(0, -1, 0, 0, 30);
assert.ok(Math.abs(conLateral.vx) > 0.05, "el efecto lateral desvía la bola en un choque perpendicular");
const izq = banda(0, -1, 0, 0, 30), der = banda(0, -1, 0, 0, -30);
assert.ok(Math.sign(izq.vx) === -Math.sign(der.vx), "efectos opuestos desvían hacia lados opuestos");
const rodando = banda(0, -1, 1 / P.R, 0, 0);      // bola que rueda hacia la banda (w x r)
assert.ok(Math.abs(rodando.vy - sinGiro.vy) > 1e-3, "el giro de rodadura cambia el rebote: la banda toca por encima del centro");
assert.ok(Math.hypot(sinGiro.vx, sinGiro.vy) < 1, "la banda disipa energía");

// 5. Choque bola-bola de frente con e_b: la tiradora conserva (1-e)/2 de la velocidad
const w = F.nuevaBola("w", 1, 0.7, "blanca"), o = F.nuevaBola("r", 1 + 2 * P.R - 1e-6, 0.7, "roja");
w.vx = 2; w.estado = "desliza";
new F.Simulacion([w, o]).paso(0.0005);
cerca(o.vx, (1 + P.e_b) / 2 * 2, 0.02, "velocidad de la bola golpeada");

// 6. Conservación: tras rodar, el momento angular respecto al punto de contacto se conserva en el deslizamiento
const d = F.nuevaBola("w", 0.3, 0.71, "blanca"); F.golpear(d, 0, 2, 0, -0.3);
const Lc = (q) => q.vx * P.R + 0.4 * P.R * P.R * q.wy;     // por unidad de masa
const L0 = Lc(d), s6 = new F.Simulacion([d]);
while (d.estado === "desliza") s6.paso(0.0005);
cerca(Lc(d), L0, 1e-3 * Math.abs(L0) + 1e-6, "L respecto al contacto");

console.log("fisica.test.js: todas las pruebas pasan");
