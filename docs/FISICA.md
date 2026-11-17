# El modelo físico de BillarLab10.easy

Motor: `js/fisica.js` (también se usa desde Node). Pruebas: `node tests/fisica.test.js`. Comparación con los sistemas: `node scripts/calibrar_sistemas.js`.

## Estado de cada bola

Posición $(x, y)$, velocidad $\vec v$ y velocidad angular $\vec\omega = (\omega_x, \omega_y, \omega_z)$. Radio $R = 30.75$ mm (bola de carambola de 61.5 mm). Esfera maciza: $I = \tfrac25 mR^2$.

## 1. Golpe de taco

Impulso horizontal $J = m v_0$ en el punto de la cara desplazado $aR$ a un lado y $bR$ arriba del centro:

$$\vec v = v_0\,\hat d,\qquad \vec\omega = \frac{5 v_0}{2R}\left(-a\,\hat z + b\,\hat s\right),\qquad \hat s = \hat z\times\hat d .$$

Con $b = 2/5$ la bola sale rodando. No se modela el *squirt* (Cross, 2008).

## 2. Paño

Velocidad del punto de contacto: $\vec u = \vec v + \vec\omega\times(-R\hat z)$.

- **Desliza:** fricción cinética $\mu_s m g$ opuesta a $\vec u$.
- **Rueda:** resistencia $\mu_r m g$.
- **Giro vertical:** se frena a $\dot\omega_z = -\tfrac{5\,u_{sp}\,g}{2R}$.

Resultados exactos que el motor reproduce en las pruebas: $v_f = \tfrac57 v_0\,(1+h/R)$ y $t_{\text{rodar}} = 2|v_0-\omega_0R|/(7\mu_s g)$.

## 3. Banda: modelo de Han (2005)

La nariz de la banda está a $h = 37$ mm de la mesa, **por encima del centro** de la bola: el contacto forma un ángulo $\theta_a$ con la horizontal,

$$\sin\theta_a = \frac{h}{R} - 1 .$$

Por eso el giro de rodadura y el efecto lateral cambian el rebote. El impulso normal es $P_z = (1+e)\,v_n\cos\theta_a$. El tangencial anula el deslizamiento $\vec s$ del punto de contacto ($\tfrac27|\vec s|$) o, si eso supera el límite de Coulomb, vale $\mu_c P_z$ en la dirección de $\vec s$. Ecuaciones 14 a 23 de Han (2005), portadas de la implementación de Pooltool (Kiefl, 2024; Apache-2.0).

## 4. Bola contra bola

Choque normal entre masas iguales con restitución $e_b$, sin fricción entre bolas. Después, el paño curva la trayectoria: $\vec v_f = \tfrac57\vec v + \tfrac27(\vec\omega\times R\hat z)$.

## 5. Geometría de los sistemas de diamantes

Los diamantes están en el **marco**, a una distancia $d$ de la nariz de la banda; los números de los sistemas se leen en esa línea. El jugador apunta por dos diamantes (salida y ataque). La bola rebota con su centro a $R$ de la nariz. La llegada se lee en el punto donde la bola toca la banda, proyectado perpendicularmente sobre la escala.

## Parámetros

| Parámetro | Valor | Fuente |
|---|---|---|
| Mesa | 2.84 × 1.42 m | Pooltool, `BilliardTableSpecs` |
| Altura de la banda $h$ | 37 mm | Pooltool, `BilliardTableSpecs`. Un foro lo atribuye al reglamento UMB; falta confirmarlo en el reglamento |
| $e$, $\mu_c$ de banda | 0.85, 0.15 | Pooltool, `BILLIARD_GENERIC` (cita a van Balen para 0.85) |
| $\mu_s$, $\mu_r$ del paño | 0.2, 0.01 | Pooltool, `BILLIARD_GENERIC` |
| $u_{sp}$ | $\tfrac{4}{9}R$ | Pooltool |
| $e_b$ | 0.95 | Pooltool |
| Nariz → diamante $d$ | 9 cm | **estimación**; se ajusta en la app; hay que medirla en la mesa |

## Verificación de los sistemas (`node scripts/calibrar_sistemas.js`)

Cada ejemplo del blog se simula apuntando por los diamantes de salida y ataque, con el golpe que muestra su figura original (campo `golpe` de `data/sistemas.json`) y d = 9 cm. Error = llegada simulada − llegada del sistema, en diamantes.

| Sistema | Ejemplo | 2 m/s | 2.5 m/s | 3 m/s | Veredicto |
|---|---|---|---|---|---|
| 1 LCL | S 50, L 0 | +0.74 | +0.71 | +0.71 | ⚠️ |
| 2 CLC | S 20, L 0, efecto 3 | no llega | −0.44 | −0.40 | ✅ con fuerza |
| 3 3-6-9 | S 16, L 6 | +0.29 | +0.10 | −0.05 | ✅ |
| 3 3-6-9 | S 36, L 3 | +0.57 | +0.38 | +0.16 | ✅ |
| 4 CLC efecto cero | S 30, L 10 | −0.05 | −0.05 | −0.05 | ✅ |
| 5 Cajones-Cabañas | S 15, L 5, efecto 1 | +0.02 | +0.01 | +0.00 | ✅ |
| 6 Efecto contrario LCL | S 5, L 10, efecto 2 | no llega | −0.13 | −0.27 | ✅ con fuerza |
| 7 Efecto contrario CLC | S 5, L 8, efecto 3 | −0.35 | −0.50 | −0.58 | ⚠️ |
| 9 Plus | S 30, L 70 | −1.16 | −1.10 | −0.85 | ❌ |
| 8 Pasa bola | — | — | — | — | calcula el efecto; no se simula aún |

Recorrido de referencia 5-3-2 del Corner-5 (salida 50, ataque 20, llegada 30): la simulación da 32.1 a 2 m/s y 33.9 a 4 m/s; con más velocidad la bola llega más lejos, como describe Alciatore.

**Lectura:** con medio diamante como tolerancia práctica, 6 de 8 sistemas de ataque coinciden con la física. El LCL y el Efecto contrario CLC quedan cerca. El Plus se aparta un diamante: su escala de ataque (banda corta izquierda, marcas no uniformes) es la lectura de figura más incierta y es lo primero que hay que revisar con una mesa real. Los resultados están en `data/verificacion_sistemas.json`.

**Cuidado:** si se ajusta d para minimizar el error, el valor se va a 16 cm, más que un marco real; d absorbe otros errores del modelo (posición de la bola, velocidad, coeficientes). Por eso d se mide, no se ajusta.

## Lo que falta para "la realidad"

1. **Medir una mesa real:** $d$, la altura de la banda y el estado del paño.
2. **Grabar tiros** con celular, medirlos en Tracker y ajustar $\mu_s$, $e$ y $\mu_c$ con esos datos (nivel 3 del plan).
3. **Banda a alta velocidad:** el modelo es de banda rígida; por encima de unos 2.5 m/s la banda se deforma (Mathavan et al., 2010).
4. **No se modelan** el squirt, el salto de la bola ni el efecto de la humedad o el uso del paño.
