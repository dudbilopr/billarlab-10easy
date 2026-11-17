"""Genera js/sistemas.data.js a partir de data/sistemas.json (fuente única)."""
import json
from pathlib import Path

raiz = Path(__file__).resolve().parent.parent
datos = json.loads((raiz / "data" / "sistemas.json").read_text(encoding="utf-8"))
js = "// Generado por scripts/exportar_js.py desde data/sistemas.json. No editar a mano.\n"
js += "window.BILLAR_DATOS = " + json.dumps(datos, ensure_ascii=False, indent=1) + ";\n"
(raiz / "js" / "sistemas.data.js").write_text(js, encoding="utf-8")
print("js/sistemas.data.js actualizado")
