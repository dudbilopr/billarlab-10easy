"""Trayectorias ideales en la mesa (unidades de diamante).

Modelo de referencia (nivel 0): la bola es un punto que viaja en línea recta y
rebota en las bandas con reflexión especular (ángulo de incidencia igual al de
reflexión). No incluye efecto (spin), fricción, compresión de la banda ni la
diferencia entre la línea de diamantes y la nariz de la banda. Sirve como línea
base para medir cuánto "corrigen" los sistemas de diamantes respecto a la
geometría pura.

El parámetro ``margen`` reduce el rectángulo efectivo por el que se mueve el
centro de la bola: ``margen = (radio + distancia diamante-nariz) / paso``.
Con ``margen = 0`` se asume que la bola rebota sobre la línea de diamantes.
"""

from __future__ import annotations

from dataclasses import dataclass
import math

LARGO = 8.0
ANCHO = 4.0


@dataclass(frozen=True)
class Impacto:
    banda: str  # "sup", "inf", "izq", "der"
    x: float
    y: float

    @property
    def posicion(self) -> float:
        """Coordenada a lo largo de la banda (x en sup/inf, y en izq/der)."""
        return self.x if self.banda in ("sup", "inf") else self.y


def punto_en_banda(banda: str, pos: float) -> tuple[float, float]:
    return {
        "sup": (pos, ANCHO),
        "inf": (pos, 0.0),
        "izq": (0.0, pos),
        "der": (LARGO, pos),
    }[banda]


def trazar(
    origen: tuple[float, float],
    direccion: tuple[float, float],
    n_bandas: int = 4,
    margen: float = 0.0,
) -> list[Impacto]:
    """Devuelve los ``n_bandas`` primeros impactos con reflexión especular."""
    x, y = origen
    dx, dy = direccion
    norma = math.hypot(dx, dy)
    if norma == 0:
        raise ValueError("La dirección no puede ser nula.")
    dx, dy = dx / norma, dy / norma
    x0, x1, y0, y1 = margen, LARGO - margen, margen, ANCHO - margen
    eps = 1e-12
    impactos: list[Impacto] = []
    for _ in range(n_bandas):
        candidatos = []
        if dx > eps:
            candidatos.append(((x1 - x) / dx, "der"))
        if dx < -eps:
            candidatos.append(((x0 - x) / dx, "izq"))
        if dy > eps:
            candidatos.append(((y1 - y) / dy, "sup"))
        if dy < -eps:
            candidatos.append(((y0 - y) / dy, "inf"))
        candidatos = [c for c in candidatos if c[0] > eps]
        if not candidatos:
            break
        t, banda = min(candidatos)
        x, y = x + t * dx, y + t * dy
        # Una esquina exacta refleja ambas componentes.
        golpes = [b for tt, b in candidatos if abs(tt - t) < 1e-9]
        if "der" in golpes or "izq" in golpes:
            dx = -dx
        if "sup" in golpes or "inf" in golpes:
            dy = -dy
        impactos.append(Impacto(banda, x, y))
    return impactos


def primer_impacto_en(
    impactos: list[Impacto], banda: str, despues_de: int = 0
) -> Impacto | None:
    """Primer impacto en ``banda`` con índice mayor o igual que ``despues_de``."""
    for imp in impactos[despues_de:]:
        if imp.banda == banda:
            return imp
    return None
