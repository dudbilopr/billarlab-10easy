"""Sistemas de diamantes definidos en ``data/sistemas.json``."""

from __future__ import annotations

import ast
import json
import operator
from dataclasses import dataclass, field
from pathlib import Path

from .mesa import Impacto, primer_impacto_en, punto_en_banda, trazar

RUTA_DATOS = Path(__file__).resolve().parent.parent / "data" / "sistemas.json"

_OPS = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
    ast.USub: operator.neg,
    ast.UAdd: operator.pos,
    ast.LtE: operator.le,
    ast.Lt: operator.lt,
    ast.GtE: operator.ge,
    ast.Gt: operator.gt,
}


def evaluar(expr: str, variables: dict[str, float]) -> float:
    """Evalúa una expresión aritmética simple sin usar ``eval``."""
    if expr.strip() == "true":
        return True

    def ev(n):
        if isinstance(n, ast.Expression):
            return ev(n.body)
        if isinstance(n, ast.Constant) and isinstance(n.value, (int, float)):
            return n.value
        if isinstance(n, ast.Name):
            if n.id not in variables:
                raise KeyError(f"Falta la variable {n.id!r}")
            return variables[n.id]
        if isinstance(n, ast.BinOp) and type(n.op) in _OPS:
            return _OPS[type(n.op)](ev(n.left), ev(n.right))
        if isinstance(n, ast.UnaryOp) and type(n.op) in _OPS:
            return _OPS[type(n.op)](ev(n.operand))
        if isinstance(n, ast.Compare) and len(n.ops) == 1 and type(n.ops[0]) in _OPS:
            return _OPS[type(n.ops[0])](ev(n.left), ev(n.comparators[0]))
        raise ValueError(f"Expresión no permitida: {ast.dump(n)}")

    return ev(ast.parse(expr, mode="eval"))


@dataclass
class Escala:
    banda: str
    marcas: list[tuple[float, float]]  # (valor, posición)

    def contiene(self, valor: float) -> bool:
        vals = [v for v, _ in self.marcas]
        return min(vals) <= valor <= max(vals)

    def posicion(self, valor: float) -> float:
        marcas = sorted(self.marcas)
        for (v0, p0), (v1, p1) in zip(marcas, marcas[1:]):
            if v0 <= valor <= v1:
                return p0 if v1 == v0 else p0 + (valor - v0) * (p1 - p0) / (v1 - v0)
        raise ValueError(f"Valor {valor} fuera de la escala de la banda {self.banda}")


@dataclass
class Sistema:
    id: str
    n: int
    nombre: str
    calcula: str
    formula: list[dict]
    efecto: dict
    escalas: dict[str, list[Escala]]
    datos: dict = field(repr=False)

    def avance(self, efecto: int | None) -> float:
        if self.efecto.get("tipo") != "avance":
            return 0.0
        tabla = dict(self.efecto["tabla"])
        if efecto not in tabla:
            raise ValueError(f"Efecto {efecto} no está en la tabla {sorted(tabla)}")
        return float(tabla[efecto])

    def calcular(self, S: float, L: float, efecto: int | None = None,
                 A: float | None = None, V: float | None = None) -> float:
        variables = {"S": S, "L": L}
        variables["V"] = V if V is not None else self.avance(efecto)
        if A is not None:
            variables["A"] = A
        for caso in self.formula:
            if evaluar(caso["si"], variables):
                return evaluar(caso["expr"], variables)
        raise ValueError("Ningún caso de la fórmula aplica.")

    def punto(self, variable: str, valor: float) -> tuple[str, tuple[float, float]]:
        """Convierte un valor de escala en (banda, (x, y))."""
        for escala in self.escalas[variable]:
            if escala.contiene(valor):
                return escala.banda, punto_en_banda(escala.banda, escala.posicion(valor))
        raise ValueError(f"{variable} = {valor} no está en ninguna escala de {self.id}")

    def comparar_con_ideal(self, S: float, L: float, efecto: int | None = None,
                           margen: float = 0.0) -> dict:
        """Compara la LLEGADA del sistema con la reflexión especular ideal.

        Traza la recta SALIDA -> ATAQUE, la continúa con reflexión especular y
        busca el primer impacto posterior en la banda de la LLEGADA. Devuelve la
        diferencia en diamantes (positiva hacia valores crecientes de posición).
        Solo aplica a sistemas que calculan el ATAQUE.
        """
        if self.calcula != "A":
            raise ValueError("La comparación solo aplica a sistemas que calculan el ATAQUE.")
        A = self.calcular(S, L, efecto)
        _, p_s = self.punto("S", S)
        banda_a, p_a = self.punto("A", A)
        banda_l, p_l = self.punto("L", L)
        direccion = (p_a[0] - p_s[0], p_a[1] - p_s[1])
        impactos = trazar(p_s, direccion, n_bandas=5, margen=margen)
        ideal = primer_impacto_en(impactos, banda_l, despues_de=1)
        pos_l = p_l[0] if banda_l in ("sup", "inf") else p_l[1]
        return {
            "ataque": A,
            "banda_ataque": banda_a,
            "primer_impacto": impactos[0] if impactos else None,
            "impactos": impactos,
            "llegada_sistema": pos_l,
            "llegada_ideal": ideal.posicion if ideal else None,
            "delta_diamantes": (ideal.posicion - pos_l) if ideal else None,
        }


def cargar_sistemas(ruta: Path | str = RUTA_DATOS) -> dict[str, Sistema]:
    datos = json.loads(Path(ruta).read_text(encoding="utf-8"))
    out: dict[str, Sistema] = {}
    for s in datos["sistemas"]:
        escalas = {
            var: [Escala(banda, [tuple(m) for m in marcas]) for banda, marcas in lista]
            for var, lista in s["escalas"].items()
        }
        out[s["id"]] = Sistema(
            id=s["id"], n=s["n"], nombre=s["nombre"], calcula=s["calcula"],
            formula=s["formula"], efecto=s["efecto"], escalas=escalas, datos=s,
        )
    return out


__all__ = ["Escala", "Impacto", "Sistema", "cargar_sistemas", "evaluar"]
