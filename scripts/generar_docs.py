"""Genera docs/SISTEMAS.md desde data/sistemas.json (fórmulas en LaTeX para GitHub)."""
import json
from pathlib import Path

raiz = Path(__file__).resolve().parent.parent
d = json.loads((raiz / "data" / "sistemas.json").read_text(encoding="utf-8"))
nom = {"S": "SALIDA", "L": "LLEGADA", "A": "ATAQUE"}
banda = d["mesa"]["bandas"]
out = ["# Los nueve sistemas de diamantes", "",
       "Documento generado por `scripts/generar_docs.py` desde `data/sistemas.json`. "
       "Sistemas publicados por Dudbil Pabón en el blog *Bases de billar tres bandas* (2014–2015); "
       "los sistemas de diamantes son tradición del juego y aquí se documentan, se corrigen y se ponen a prueba.", "",
       f"**Mesa:** {d['mesa']['descripcion']}", "", f"**Escalas:** {d['nota_escalas']}", ""]
for s in d["sistemas"]:
    out += [f"## {s['n']}. {s['nombre']}", "",
            f"![Figura original del sistema {s['nombre']}]({Path(s['figura']).relative_to('docs').as_posix()})", "",
            f"Publicado: {s['publicado']} · Familia: {s['familia']}", "", "$$", s["latex"], "$$", ""]
    ef = s["efecto"]
    if ef["tipo"] == "avance":
        lado = "contrario a la trayectoria" if ef["lado"] == "contrario" else "a favor de la trayectoria"
        out += [f"**Efecto ({lado}) → AVANCE:** " + ", ".join(f"efecto {e} → {a}" for e, a in ef["tabla"]), ""]
    else:
        out += [f"**Efecto:** {ef['descripcion']}", ""]
    out += ["| Variable | Banda | Marcas (valor → posición en diamantes) |", "|---|---|---|"]
    for var, lista in s["escalas"].items():
        for b, marcas in lista:
            out.append(f"| {nom[var]} | {banda[b]} | " + ", ".join(f"{v} → {p:g}" for v, p in marcas) + " |")
    out += ["", "**Ejemplos del blog (pruebas automáticas en `tests/`):** " + "; ".join(
        ", ".join(f"{k} = {v}" for k, v in ej.items() if k != "resultado") + f" ⇒ {ej['resultado']}"
        for ej in s["ejemplos_blog"]), ""]
    if s.get("nota"):
        out += [f"> Nota: {s['nota']}", ""]
    if s.get("errata"):
        out += [f"> ⚠️ **Errata:** {s['errata']}", ""]
(raiz / "docs" / "SISTEMAS.md").write_text("\n".join(out), encoding="utf-8")
print("docs/SISTEMAS.md generado")
