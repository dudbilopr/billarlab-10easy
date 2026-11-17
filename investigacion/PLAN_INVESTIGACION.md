# Plan de investigación — BillarLab10.easy

## Pregunta

Los sistemas de diamantes del billar a tres bandas son reglas empíricas: con una resta, el jugador elige a qué diamante atacar. **¿Cuánto se apartan de la geometría de la reflexión, y qué parte de esa diferencia explican el efecto, la fricción y la deformación de la banda?**

## Qué hay ya publicado (ver `BIBLIOGRAFIA.md`)

- El sistema de diamantes tiene **un** antecedente revisado por pares (Cohen, 2002, *Sports Engineering*), todavía sin leer.
- Berrío Valbuena et al. (2017) simulan en GeoGebra la teoría de los diamantes **sin efecto** con simetrías axiales.
- La física del choque bola–banda con efecto está modelada y medida (Mathavan et al., 2009 y 2010; Alharbi, 2026, preprint).
- Hay simuladores abiertos (Pooltool, 2024) y artículos de enseñanza con video y Tracker (White, 2017; Hart y Kuzyk, 2020).

**Hueco:** nadie ha puesto lado a lado varios sistemas de diamantes, incluidos los que usan efecto, con modelos físicos de complejidad creciente y con tiros medidos, ni lo ha llevado a una herramienta de clase abierta.

## Hipótesis de trabajo

1. **H1.** Los sistemas sin efecto o con poco efecto (3-6-9, CLC efecto cero) quedan a menos de medio diamante de la reflexión especular con el tamaño de la bola incluido.
2. **H2.** En los sistemas con efecto a favor, la diferencia con la geometría crece con el efecto pedido, y el modelo de banda con efecto de Mathavan et al. (2010) la reduce.
3. **H3.** Usar el simulador y el reto mejora la comprensión de la ley de reflexión y de la fricción en la rodadura frente a una clase expositiva (pregunta educativa, con pre y postest).

## Niveles del modelo

| Nivel | Modelo | Estado |
|---|---|---|
| 0 | Punto con reflexión especular en el rectángulo de diamantes | ✅ `billarlab/mesa.py`, web |
| 1 | Bola con radio y diferencia diamante–nariz de la banda (parámetro `margen`) | Parámetro listo; falta medir la mesa |
| 2 | Choque bola–banda con efecto y fricción (Mathavan et al., 2010) y rodadura sobre el paño | Por implementar; comparar con Pooltool |
| 3 | Tiros reales grabados con celular y analizados con Tracker | Por hacer |

## Protocolo experimental (nivel 3)

1. Una mesa de carambola en Bucaramanga: medir superficie de juego, posición de diamantes y altura de la nariz de la banda.
2. Celular fijo cenital a 120 o 240 fps; marcas de calibración en las esquinas.
3. Por sistema, 10 tiros de los ejemplos del blog y 10 aleatorios; 3 repeticiones; registrar efecto pedido y jugador.
4. Analizar en Tracker: impactos en cada banda (en diamantes) e incertidumbre de posición.
5. Comparar llegada medida con la del sistema y con los niveles 0, 1 y 2 (error medio y dispersión).

## Productos

| Producto | Destino | Estado |
|---|---|---|
| Repositorio y web interactiva | GitHub + GitHub Pages; DOI de Zenodo por versión | v0.1 lista en local |
| Video corto por sistema | Canal physics.10easy (lista "Física del billar") | Por hacer |
| Artículo de enseñanza: "Los sistemas de diamantes como laboratorio de reflexión y cuerpo rígido" | *Physics Education*, *European Journal of Physics*, *Revista Brasileira de Ensino de Física* o *Latin-American Journal of Physics Education* | Por escribir tras el nivel 2 |
| Artículo de física (niveles 0–3 con datos) | *American Journal of Physics* o *Sports Engineering* | Tras el nivel 3 |
| Semillero de investigación | Estudiantes: medición en mesa y análisis en Tracker | Por proponer |

## Riesgos y cuidados

- **Escalas leídas de figuras:** algunas posiciones son aproximadas. Hay que confirmarlas con el autor y con una mesa real.
- **Origen de los sistemas:** no se atribuye la invención a nadie sin fuente; los sistemas se presentan como tradición del juego.
- **Coautoría de estudiantes:** se agregan en una versión posterior, cuando entreguen su parte verificada.
- **Declaración de IA:** las revistas exigen declarar las herramientas de IA usadas en la búsqueda bibliográfica, el código y la redacción.
