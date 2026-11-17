# Bibliografía comentada — BillarLab10.easy

Estado: 2026-11-17. ✅ = DOI verificado en Crossref (metadatos tomados de ahí). ⚠️ = existe, pero falta verificar o leer. Lo que se atribuye a cada trabajo sale **de su resumen**; los trabajos sin resumen se citan solo por su tema hasta leerlos.

> **Método.** Búsqueda en OpenAlex, Crossref, Semantic Scholar, ERIC, arXiv y DOAJ (Scopus y CORE omitidos: sin clave de API). 11 consultas en inglés y castellano ("billiard ball cushion impact", "three-cushion billiards", "carom billiards dynamics", "billiard ball spin friction cloth", "billiard ball rail rebound", "pool cue ball english squirt", "snooker ball dynamics", "billiards physics", "billar tres bandas", "billar física", "diamond system billiards"), período 1980–2026. Registros brutos 2163 → únicos 1726 → filtro temático 725 → sin billares matemáticos/cuánticos 441 → cribado manual por título y resumen. Registro completo: `busqueda_fisica/registro_busqueda.md`. Complementado con búsqueda web de libros, cartillas y material docente.

## 1. Sistemas de diamantes (el objeto de estudio)

| Trabajo | Qué aporta | Uso en el proyecto |
|---|---|---|
| ✅ Cohen, G. L. (2002). Three cushion billiards: notes on the diamond system. *Sports Engineering*, 5(1), 43–51. doi:10.1046/j.1460-2687.2002.00095.x | Único artículo revisado por pares encontrado que trata el sistema de diamantes de tres bandas. **Sin resumen en Crossref: hay que leerlo.** | Antecedente principal. Conseguir por la biblioteca UNAB. |
| ⚠️ Berrío Valbuena, J. D., Valbuena Duarte, S. y Sánchez Anillo, R. (2017). Simulación de composición de simetrías en GeoGebra para simplificar la teoría de los diamantes en la práctica del billar. *Pensamiento Americano*, 10(19), 55–67. DOI declarado: 10.21803/penamer.10.19.464 (no resuelve en Crossref) | Simula la "teoría de los diamantes" **sin efecto** con composición de simetrías axiales en GeoGebra (Universidad del Atlántico, Colombia). PDF leído. | Antecedente colombiano directo. BillarLab10.easy se diferencia en que incluye los sistemas **con efecto** y mide su desviación respecto a la geometría. |
| ✅ Park, J. y Park, J. (2022). Intelligent Carom Billiards Assistive System… *Int. J. Adv. Robotic Systems*, 19(4). doi:10.1177/17298806221118865 | Implementa el sistema "cinco y medio" (*five and half*) para calcular trayectorias de la bola y las proyecta sobre una mesa real. | Muestra que los sistemas se usan como algoritmo; referencia para la validación experimental. |
| ⚠️ Alciatore, D. (s. f.). *Corner-5 System*, prueba técnica TP 7.2 y columnas de *Billiards Digest*. billiards.colostate.edu | Formula el Corner-5 como T = D − F; dice que vale con bola rodando y efecto a favor, que el recorrido 5-3-2 es la referencia, y que la precisión cae lejos de esa referencia. No es revisado por pares. | Fuente de contraste para los sistemas LCL; comparar su numeración con la del blog. |
| ⚠️ Leandro, D. (2009; ed. digital 2020). *De la geometría básica y el billar a tres bandas para principiantes*. Editorial UCR (Costa Rica). | Libro docente: sistemas LL, CL y Plus, con efecto contrario y nociones del sistema de diamantes. | Cartilla en español para contrastar numeraciones. |
| ⚠️ Ceulemans, R. *Mister 100*; Hoppe, W. *Billiards As It Should Be Played*; Gilbert, A. *Systematic Billiards* | Libros clásicos citados en foros como fuentes del Corner-5 y del Plus. No verificados. | Buscar ediciones y fechas antes de citarlos. |

## 2. Física de la bola y de la banda

| Trabajo | Qué encontró (según el resumen) | Uso |
|---|---|---|
| ✅ Mathavan, S., Jackson, M. R. y Parkin, R. M. (2010). A theoretical analysis of billiard ball dynamics under cushion impacts. *Proc. IMechE C*, 224(9), 1863–1873. doi:10.1243/09544062jmes1964 | Modelo del choque bola–banda con efecto; coeficiente de restitución 0.98 y fricción de deslizamiento 0.14; la banda rígida vale por debajo de 2.5 m/s. | Modelo de nivel 2 para BillarLab: rebote con efecto en la banda. Hay versión en el repositorio de Loughborough. |
| ✅ Mathavan, S., Jackson, M. R. y Parkin, R. M. (2009). Application of high-speed imaging to determine the dynamics of billiards. *Am. J. Phys.*, 77(9), 788–794. doi:10.1119/1.3157159 | Con una cámara rápida siguen bolas de snooker con 1 mm de precisión y miden los coeficientes de fricción de rodadura y deslizamiento. | Protocolo experimental de video. |
| ✅ Han, I. (2005). Dynamics in carom and three cushion billiards. *J. Mech. Sci. Technol.*, 19(4), 976–984. doi:10.1007/bf02919180 | Dinámica de la carambola y las tres bandas. **Sin resumen: leer.** | Antecedente físico específico de tres bandas. |
| ✅ Wallace, R. E. y Schroeder, M. C. (1988). Analysis of billiard ball collisions in two dimensions. *Am. J. Phys.*, 56(9), 815–819. doi:10.1119/1.15455 | Con fricción, el ángulo entre las bolas después del choque no es 90° y depende del parámetro de impacto. | Física bola–bola; buen tema de clase. |
| ✅ Cross, R. (2008). Cue and ball deflection (or "squirt") in billiards. *Am. J. Phys.*, 76(3), 205–212. doi:10.1119/1.2825392 | Al dar efecto lateral, la bola se desvía unos grados de la línea del taco; con tiza la desviación es menor. | Error del ataque cuando se pone efecto. |
| ✅ Cross, R. (2018). Backward bounce of a spinning ball. *Eur. J. Phys.*, 39(4), 045007. doi:10.1088/1361-6404/aabece | Rebote hacia atrás de una bola con efecto retrógrado; propone experimentos para estudiantes. | Actividad de clase. |
| ✅ Doménech-Carbó, A. (2023). Independent friction-restitution description of billiard ball collisions. *Mech. Res. Commun.*, 131, 104149. doi:10.1016/j.mechrescom.2023.104149 | Modelo de choque bola–bola con efecto arbitrario; coincide con experimentos con bolas reglamentarias. | Modelo bola–bola. |
| ✅ Gismeros Moreno, R. et al. (2021). Modelling multiple-simultaneous impact problems… pool/billiard application. *Nonlinear Dyn.*, 107(3), 1859–1886. doi:10.1007/s11071-021-07117-4 | Modelo multicuerpo con contactos y fricción entre bolas, bandas y paño, verificado con experimentos. | Referencia de modelado avanzado. PDF descargado. |
| ✅ Alharbi, M. K. M. (2026). Contact geometry and hysteretic damping in the rebound of a billiard ball from a cushion. *Research Square* (preprint). doi:10.21203/rs.3.rs-11060228/v1 | Modelo de contacto con el perfil real de la banda; reproduce 24 tiros con 3.3 % de error medio. **Preprint, no revisado.** | Estado del arte del rebote. PDF descargado. |
| ✅ Kiefl, E. (2024). Pooltool: A Python package for realistic billiards simulation. *JOSS*, 9(101), 7301. doi:10.21105/joss.07301 | Simulador de billar en Python, con física configurable, para ciencia e ingeniería. | Comparar BillarLab con un simulador establecido; posible integración. PDF descargado. |

## 3. Enseñanza de la física y de las matemáticas con billar

| Trabajo | Qué aporta | Uso |
|---|---|---|
| ✅ Ozkanlar, A. (2020). Billiard Physics: Motion of a Cue Ball after Hit by a Cue Stick Horizontally. *The Physics Educator*, 2(1), 2050003. doi:10.1142/s2661339520500031 | Analiza el movimiento de la bola tras el golpe hasta que rueda sin deslizar; lo propone para enseñar leyes de Newton, fricción, impulso y rodadura. | Base del módulo "del golpe a la rodadura". |
| ✅ White, C. (2017). A comparative study of two types of ball-on-ball collision. *Phys. Educ.*, 52(4), 045013. doi:10.1088/1361-6552/aa6d2a | Mide el coeficiente de restitución con material barato y el programa **Tracker**. | Protocolo de laboratorio con Tracker (ya tienes un video tutorial de Tracker). |
| ✅ Hart, M. y Kuzyk, M. G. (2020). Collecting data with a mobile phone… *Am. J. Phys.*, 88(11), 948–957. doi:10.1119/10.0001686 | Videos de celular del choque de dos bolas para estudiar energía y momento; las bolas deslizan parte del tiempo. | Laboratorio en casa con celular. PDF descargado. |
| ✅ Cross, R. (2016). Newton's cradle in billiards and croquet. *Phys. Educ.*, 51(6), 065020. doi:10.1088/0031-9120/51/6/065020 | Choques en línea con tres bolas. | Actividad de momento lineal. |
| ✅ Bertz, M. D. (1997). Billiards in the Classroom: Learning Physics with Microworlds. *NASSP Bulletin*, 81(592), 31–38. doi:10.1177/019263659708159206 | Un entorno de simulación donde los estudiantes experimentan favorece el aprendizaje activo. | Justificación pedagógica del simulador. |
| ✅ Bosch Giral, C. y Castañeda, P. (2025). El billar a tres hojas. *Miscelánea Matemática*, 80, 115–132. doi:10.47234/mm.8009 | Trayectorias de billar, mesas rectangulares, máximos y mínimos (PDF leído). | Matemáticas del billar en español. |
| ✅ Rozikov, U. A. (2018). Billiards and geometry. En *An Introduction to Mathematical Billiards* (pp. 61–157). World Scientific. doi:10.1142/9789813276475_0003 | Trayectorias en mesas rectangulares, triángulos, elipses y polígonos. | Fundamento del método de desdoblar la mesa. |
| ⚠️ Beltrán L., V. (1996). Colisiones de carambola entre esferas elásticas sin rotación (y jugar billar, 2). *Rev. Mex. Fís.*, 42(5), 844–866 | Parámetro de impacto para hacer carambola con esferas sin rotación, con programas en Mathematica (PDF leído). | Antecedente latinoamericano de la carambola. La parte 1 está en *Rev. Mex. Fís.* 40 (1994) 323. |
| ⚠️ NCTM, "Bank Shot"; Amplify Polypad, "Pool Table Problem"; Universidad de Houston, "Hole-in-One" | Actividades escolares con la ley de reflexión; Polypad relaciona los rebotes con el mcd y el mcm de las dimensiones de la mesa. | Ideas de actividades para colegio. |

## 4. Contexto (análisis de rendimiento y juego)

| Trabajo | Uso |
|---|---|
| ✅ Bouville, M. (2007). Position Play in Carom Billiards as a Markov Process. *J. Quant. Anal. Sports*, 3(4). doi:10.2202/1559-0410.1075 | Modelo estadístico del juego posicional; PDF descargado. |
| ✅ Pekdemir, H. y Akman, T. (2026). Match performance analysis of elite three-cushion billiards players. *J. ROL Sport Sci.*, 8, 1–12. doi:10.70736/jrolss.2402 | 3228 tiros de 52 partidos: los tiros exitosos son más cortos (unos 24 s). |
| ✅ Di Corrado, D. et al. (2015). Self-Efficacy, Emotional States, and Performance in Carom Billiards. *Percept. Mot. Skills*, 121(1), 14–25. doi:10.2466/30.pms.121c11x6 | Psicología del deporte en carambola. |

## Pendiente

- **Leer** Cohen (2002) y Han (2005); no tienen resumen. Pedirlos a la biblioteca UNAB.
- **PDF faltantes** (11): ver `PDF/FALTANTES.md`. Vías legales: biblioteca UNAB, préstamo interbibliotecario o pedírselos al autor.
- **Clásico histórico:** Coriolis, G. (1835). *Théorie mathématique des effets du jeu de billard*. Buscar la edición digitalizada (Gallica/BnF) antes de citarla.
- **Origen de cada sistema** (3-6-9, Cajones-Cabañas, Pasa bola): no aparece en la literatura indexada. Fuentes posibles: libros de Ceulemans y Leandro, y la Federación Colombiana de Billar.
