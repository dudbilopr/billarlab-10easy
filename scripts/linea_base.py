"""Compara la LLEGADA de cada ejemplo del blog con la reflexión especular ideal."""
from billarlab import cargar_sistemas

for s in cargar_sistemas().values():
    if s.calcula != "A":
        print(f"{s.n}. {s.nombre}: calcula el EFECTO, no aplica"); continue
    for ej in s.datos["ejemplos_blog"]:
        try:
            r = s.comparar_con_ideal(ej["S"], ej["L"], ej.get("efecto"))
            imp = " -> ".join(i.banda for i in r["impactos"][:4])
            d = r["delta_diamantes"]
            print(f"{s.n}. {s.nombre}: S={ej['S']} L={ej['L']} A={r['ataque']:g} | bandas ideales {imp} | "
                  f"llegada sistema {r['llegada_sistema']:.2f}, ideal {r['llegada_ideal'] if r['llegada_ideal'] is None else round(r['llegada_ideal'],2)}, delta {d if d is None else round(d,2)}")
        except Exception as e:
            print(f"{s.n}. {s.nombre}: {e}")
