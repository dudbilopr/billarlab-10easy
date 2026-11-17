"""BillarLab10.easy: sistemas de diamantes del billar a tres bandas y su física.

Módulos:
- ``sistemas``: carga ``data/sistemas.json``, evalúa las fórmulas y convierte
  valores de escala a posiciones en la mesa.
- ``mesa``: trazado de trayectorias por reflexión especular (modelo ideal).
"""

from .mesa import Impacto, trazar, primer_impacto_en
from .sistemas import Sistema, cargar_sistemas

__all__ = ["Impacto", "Sistema", "cargar_sistemas", "primer_impacto_en", "trazar"]
__version__ = "0.1.0"
