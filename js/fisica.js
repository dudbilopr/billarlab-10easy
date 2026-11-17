/* BillarLab10.easy — motor físico de bolas de carambola (unidades SI).
   Modelo (documentado en docs/FISICA.md y verificado en tests/):
   - Paño: deslizamiento con fricción cinética mu_s hasta que el punto de
     contacto deja de deslizar (u = v + w x r = 0); luego rodadura con mu_r.
     El giro vertical wz se frena con una desaceleración angular constante.
   - Banda: modelo de Han (2005) con la nariz a 37 mm (por encima del centro),
     portado de Pooltool (Kiefl, 2024; Apache-2.0). Ver NOTICE.
   - Bola–bola: choque normal sin fricción entre masas iguales (restitución e_b);
     el giro se conserva y el paño curva la trayectoria después.
   - Taco: impulso horizontal J = m v0 en el punto (a, b) de la cara de la bola
     (fracciones del radio): w = 5 v0 / (2R) * (-a z + b s), con s = z x d.
*/
(function (raiz) {
  "use strict";
  const PARAM = {
    L: 2.84, W: 1.42,            // superficie de juego (m)
    R: 0.0615 / 2,               // radio de bola de carambola (m)
    g: 9.81,
    // Valores por defecto de Pooltool para carambola (BilliardTableSpecs, BILLIARD_GENERIC)
    mu_s: 0.2,                   // fricción de deslizamiento bola–paño
    mu_r: 0.01,                  // resistencia a la rodadura
    u_sp: (10 * 2 / 5 / 9) * (0.0615 / 2), // fricción de giro vertical (proporcional a R)
    h_c: 0.037,                  // altura de la nariz de la banda (m)
    e_c: 0.85, f_c: 0.15,        // restitución y fricción bola–banda
    e_b: 0.95,                   // bola–bola
    h: 0.0005,                   // paso de integración (s)
  };

  function nuevaBola(id, x, y, color) {
    return { id, x, y, vx: 0, vy: 0, wx: 0, wy: 0, wz: 0, color, giro: 0, estado: "quieta", rastro: [[x, y]] };
  }

  /** Golpe de taco: direccion en rad, v0 en m/s, a (lateral, + = izquierda), b (vertical, + = arriba). */
  function golpear(b, angulo, v0, a, bb, P = PARAM) {
    const dx = Math.cos(angulo), dy = Math.sin(angulo);
    const k = 5 * v0 / (2 * P.R);
    b.vx = v0 * dx; b.vy = v0 * dy;
    b.wx = k * bb * (-dy);
    b.wy = k * bb * dx;
    b.wz = -k * a;
    b.estado = "desliza";
  }

  function deslizamiento(b, P) {
    return [b.vx - P.R * b.wy, b.vy + P.R * b.wx];
  }

  function pasoPano(b, P, dt) {
    if (b.estado === "quieta") return;
    const [ux, uy] = deslizamiento(b, P);
    const un = Math.hypot(ux, uy);
    const I_m = 0.4 * P.R * P.R;            // I/m
    if (un > 3.5 * P.mu_s * P.g * dt) {
      const fx = -P.mu_s * P.g * ux / un, fy = -P.mu_s * P.g * uy / un; // fuerza/m
      b.vx += fx * dt; b.vy += fy * dt;
      b.wx += (P.R * fy / I_m) * dt;
      b.wy += (-P.R * fx / I_m) * dt;
      b.estado = "desliza";
    } else {
      // rueda sin deslizar
      const v = Math.hypot(b.vx, b.vy);
      const dv = P.mu_r * P.g * dt;
      if (v <= dv) { b.vx = 0; b.vy = 0; }
      else { b.vx -= dv * b.vx / v; b.vy -= dv * b.vy / v; }
      b.wx = -b.vy / P.R; b.wy = b.vx / P.R;
      b.estado = (b.vx || b.vy) ? "rueda" : "gira";
    }
    const dz = 5 * P.u_sp * P.g / (2 * P.R) * dt;
    b.wz = Math.abs(b.wz) <= dz ? 0 : b.wz - Math.sign(b.wz) * dz;
    if (!b.vx && !b.vy && !b.wz && b.estado !== "desliza") b.estado = "quieta";
    b.x += b.vx * dt; b.y += b.vy * dt;
    b.giro += b.wz * dt;
  }

  /** Choque con banda: modelo de Han (2005), "Dynamics in carom and three cushion
      billiards", J. Mech. Sci. Technol. 19(4). Portado de la implementación de
      Pooltool (Kiefl, 2024; Apache-2.0). La banda toca la bola a la altura h_c,
      por encima del centro: theta_a = asin(h_c/R - 1).
      n = normal unitaria hacia la banda. */
  function chocarBanda(b, nx, ny, P) {
    if (b.vx * nx + b.vy * ny <= 0) return false;
    const R = P.R, c = nx, s = ny;
    // al marco de la banda (la normal pasa a ser +x)
    let vx = c * b.vx + s * b.vy, vy = -s * b.vx + c * b.vy;
    let wx = c * b.wx + s * b.wy, wy = -s * b.wx + c * b.wy, wz = b.wz;
    const th = Math.asin(P.h_c / R - 1), sT = Math.sin(th), cT = Math.cos(th);
    // ec. 14: deslizamiento en el punto de contacto (vz = 0)
    const sx = vx * sT + R * wy;
    const sy = -vy - R * wz * cT + R * wx * sT;
    const cc = -vx * cT;
    // ec. 16 (por unidad de masa)
    const II = 0.4 * R * R, A = 3.5, B = 1;
    // ec. 17 y 20
    const PzE = -(1 + P.e_c) * cc / B;
    const s0 = Math.hypot(sx, sy), PzS = s0 / A;
    let PxE, PyE;
    if (PzS <= P.f_c * PzE) { PxE = sx / A; PyE = sy / A; }          // ec. 18: se adhiere
    else { PxE = P.f_c * PzE * sx / s0; PyE = P.f_c * PzE * sy / s0; } // ec. 19: desliza
    // ec. 21 y 22: impulso en el marco de la banda
    const PX = -PxE * sT - PzE * cT, PY = PyE, PZ = PxE * cT - PzE * sT;
    // ec. 23
    vx += PX; vy += PY;
    wx += -R / II * PY * sT;
    wy += R / II * (PX * sT - PZ * cT);
    wz += R / II * PY * cT;
    // de vuelta al marco de la mesa
    b.vx = c * vx - s * vy; b.vy = s * vx + c * vy;
    b.wx = c * wx - s * wy; b.wy = s * wx + c * wy; b.wz = wz;
    b.estado = "desliza";
    return true;
  }

  function chocarBolas(a, c, P) {
    const dx = c.x - a.x, dy = c.y - a.y, d = Math.hypot(dx, dy);
    if (d >= 2 * P.R || d === 0) return false;
    const nx = dx / d, ny = dy / d;
    const vrel = (a.vx - c.vx) * nx + (a.vy - c.vy) * ny;
    const solape = 2 * P.R - d;
    a.x -= nx * solape / 2; a.y -= ny * solape / 2;
    c.x += nx * solape / 2; c.y += ny * solape / 2;
    if (vrel <= 0) return false;
    const j = (1 + P.e_b) / 2 * vrel;
    a.vx -= j * nx; a.vy -= j * ny;
    c.vx += j * nx; c.vy += j * ny;
    a.estado = "desliza"; c.estado = "desliza";
    return true;
  }

  class Simulacion {
    constructor(bolas, P = PARAM) {
      this.P = P; this.bolas = bolas; this.t = 0; this.eventos = [];
    }
    activa() { return this.bolas.some((b) => b.estado !== "quieta"); }
    paso(dtTotal) {
      const P = this.P;
      let n = Math.max(1, Math.round(dtTotal / P.h));
      while (n-- > 0) {
        for (const b of this.bolas) pasoPano(b, P, P.h);
        for (const b of this.bolas) {
          if (b.estado === "quieta") continue;
          const lados = [];
          if (b.x < P.R) { b.x = P.R; lados.push(["izq", -1, 0]); }
          if (b.x > P.L - P.R) { b.x = P.L - P.R; lados.push(["der", 1, 0]); }
          if (b.y < P.R) { b.y = P.R; lados.push(["inf", 0, -1]); }
          if (b.y > P.W - P.R) { b.y = P.W - P.R; lados.push(["sup", 0, 1]); }
          for (const [lado, nx, ny] of lados) {
            if (chocarBanda(b, nx, ny, P)) {
              this.eventos.push({ tipo: "banda", bola: b.id, lado, x: b.x, y: b.y, t: this.t });
              b.rastro.push([b.x, b.y]);
            }
          }
        }
        for (let i = 0; i < this.bolas.length; i++)
          for (let k = i + 1; k < this.bolas.length; k++) {
            const a = this.bolas[i], c = this.bolas[k];
            if (chocarBolas(a, c, P)) {
              this.eventos.push({ tipo: "bola", a: a.id, b: c.id, x: (a.x + c.x) / 2, y: (a.y + c.y) / 2, t: this.t });
              a.rastro.push([a.x, a.y]); c.rastro.push([c.x, c.y]);
            }
          }
        this.t += P.h;
        for (const b of this.bolas) {
          if (b.estado === "quieta") continue;
          const u = b.rastro[b.rastro.length - 1];
          if (Math.hypot(b.x - u[0], b.y - u[1]) > 0.012) b.rastro.push([b.x, b.y]);
        }
      }
    }
    /** Simula hasta que todo se detenga (o tmax). */
    correr(tmax = 30) {
      while (this.activa() && this.t < tmax) this.paso(0.01);
      return this;
    }
  }

  /** Carambola a tres bandas: la tiradora toca ambas bolas y al menos 3 bandas antes de la segunda. */
  function evaluarCarambola(eventos, tiradora) {
    let bandas = 0; const tocadas = [];
    for (const e of eventos) {
      if (e.tipo === "banda" && e.bola === tiradora) bandas++;
      if (e.tipo === "bola" && (e.a === tiradora || e.b === tiradora)) {
        const otra = e.a === tiradora ? e.b : e.a;
        if (!tocadas.includes(otra)) {
          tocadas.push(otra);
          if (tocadas.length === 2) return { valida: bandas >= 3, bandas, tocadas };
        }
      }
    }
    return { valida: false, bandas, tocadas };
  }

  const API = { PARAM, nuevaBola, golpear, Simulacion, chocarBanda, deslizamiento, evaluarCarambola };
  if (typeof module !== "undefined" && module.exports) module.exports = API;
  else raiz.Fisica = API;
})(typeof window !== "undefined" ? window : globalThis);
