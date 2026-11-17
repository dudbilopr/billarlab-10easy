# BillarLab10.easy

**Los sistemas de diamantes del billar a tres bandas, puestos a prueba con física.**

Los jugadores de tres bandas calculan el tiro con una resta: *ataque = salida − llegada*. BillarLab10.easy documenta nueve de esos sistemas, los convierte en datos y código verificados, y compara cada predicción con la geometría pura de la reflexión. La diferencia entre las dos es la física del efecto, la fricción y la banda.

🎱 **Simulador interactivo:** abre `index.html` (o la versión publicada en GitHub Pages). Es una lección guiada a pantalla completa en 8 capítulos: reflexión, desdoblar la mesa, rodadura, efecto en la banda, choque entre bolas, los sistemas de diamantes y una mesa libre para jugar carambola a tres bandas con predicción de trayectorias. Las bolas se mueven con un motor físico de cuerpo rígido (`js/fisica.js`, ver `docs/FISICA.md`).

## Qué incluye

| Carpeta | Contenido |
|---|---|
| `index.html`, `css/`, `js/app.js` | Simulador y lección guiada (lienzo a pantalla completa, fórmulas con KaTeX). Funciona sin servidor. |
| `js/fisica.js` | Motor físico: deslizamiento y rodadura en el paño, choque con banda con efecto, choque entre bolas, golpe de taco con efecto. |
| `data/sistemas.json` | **Fuente única** de los 9 sistemas: fórmulas, escalas por banda, tablas de efecto, ejemplos y erratas. |
| `billarlab/` | Paquete Python: evaluación segura de fórmulas, escalas, trazado con reflexión especular y comparación sistema–geometría. |
| `tests/` | 25 pruebas en Python (los 10 ejemplos del blog se reproducen exactamente) y 6 del motor físico en Node contra resultados analíticos. |
| `docs/FISICA.md` | El modelo físico, sus parámetros y sus límites. |
| `docs/SISTEMAS.md` | Los nueve sistemas, con sus figuras originales de 2014–2015. |
| `investigacion/` | Plan de investigación y bibliografía comentada con DOI verificados. |
| `fuente_blog_2015/entradas/` | Texto archivado de las entradas originales del blog. |

## Los nueve sistemas

| # | Sistema | Fórmula |
|---|---|---|
| 1 | LCL (Larga-Corta-Larga) | ataque = salida − llegada |
| 2 | CLC (Corta-Larga-Corta) | ataque = avance + (salida − llegada) |
| 3 | 3-6-9 | ataque = (salida − llegada)/2 si salida ≤ 20; si no, salida/2 − llegada |
| 4 | CLC efecto cero | ataque = salida − 1.5 · llegada |
| 5 | Cajones-Cabañas | ataque = avance + (salida − llegada) |
| 6 | Efecto contrario (LCL) | ataque = (2 · avance − llegada) − salida |
| 7 | Efecto contrario (CLC) | ataque = (avance − llegada) − salida |
| 8 | Pasa bola | efecto = avance + llegada + salida + ataque |
| 9 | Plus (CLC) | ataque = llegada − salida |

## Uso rápido (Python ≥ 3.10)

```bash
pip install -e ".[test]"
pytest
node tests/fisica.test.js         # motor físico
python scripts/linea_base.py      # compara cada ejemplo con la reflexión ideal
python scripts/exportar_js.py     # tras editar data/sistemas.json
python scripts/generar_docs.py
```

```python
from billarlab import cargar_sistemas
s = cargar_sistemas()["s369"]
s.calcular(S=16, L=6)                 # 5.0
s.comparar_con_ideal(16, 6)["delta_diamantes"]   # ≈ 0.18
```

## Primer resultado (preliminar)

Con reflexión especular ideal (nivel 0), los dos ejemplos del sistema **3-6-9** quedan a menos de 0.2 diamantes de lo que predice el sistema. En LCL, CLC y Cajones-Cabañas la diferencia es de 1 a 3 diamantes: esos sistemas incorporan el efecto. Las escalas se leyeron de las figuras originales; falta validar con el modelo de banda con efecto y con tiros reales (ver `investigacion/PLAN_INVESTIGACION.md`).

## Cómo citar

Ver `CITATION.cff`. El DOI de Zenodo se asigna al publicar la primera versión.

## Licencias

Código (`billarlab/`, `js/`, `scripts/`, `tests/`): Apache-2.0. Textos, datos y figuras (`docs/`, `data/`, `investigacion/`, `fuente_blog_2015/`): CC BY 4.0. Detalles en `NOTICE`.

---
por Dudbil Pabón · 10.Easy
