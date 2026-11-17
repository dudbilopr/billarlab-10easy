import math

import pytest

from billarlab import cargar_sistemas, trazar
from billarlab.sistemas import evaluar

SISTEMAS = cargar_sistemas()
CASOS = [
    (sid, ej)
    for sid, s in SISTEMAS.items()
    for ej in s.datos["ejemplos_blog"]
]


def test_hay_nueve_sistemas():
    assert sorted(s.n for s in SISTEMAS.values()) == list(range(1, 10))


@pytest.mark.parametrize("sid,ej", CASOS, ids=[f"{s}-{i}" for i, (s, _) in enumerate(CASOS)])
def test_ejemplos_del_blog(sid, ej):
    s = SISTEMAS[sid]
    r = s.calcular(ej["S"], ej["L"], efecto=ej.get("efecto"), A=ej.get("A"), V=ej.get("V"))
    assert r == pytest.approx(ej["resultado"])


def test_369_usa_la_condicion_sobre_la_salida():
    s = SISTEMAS["s369"]
    assert s.calcular(16, 6) == 5  # ec. 1
    assert s.calcular(36, 3) == 15  # ec. 2 (la ec. 1 daría 16.5)


def test_evaluador_rechaza_codigo():
    with pytest.raises(ValueError):
        evaluar("__import__('os')", {})


@pytest.mark.parametrize("sid", list(SISTEMAS))
def test_ejemplos_caen_en_las_escalas(sid):
    s = SISTEMAS[sid]
    for ej in s.datos["ejemplos_blog"]:
        s.punto("S", ej["S"])
        s.punto("L", ej["L"])
        if s.calcula == "A":
            s.punto("A", s.calcular(ej["S"], ej["L"], efecto=ej.get("efecto")))


def test_reflexion_especular_conserva_angulo():
    imp = trazar((8, 4), (-6, -4), n_bandas=3)
    assert [i.banda for i in imp] == ["inf", "izq", "sup"]
    assert imp[0].x == pytest.approx(2.0)
    assert imp[1].y == pytest.approx(4 / 3)
    assert imp[2].x == pytest.approx(4.0)


def test_esquina_invierte_ambas_componentes():
    imp = trazar((4, 2), (1, 0.5), n_bandas=2)
    assert imp[0].banda in ("der", "sup")
    assert (imp[0].x, imp[0].y) == pytest.approx((8, 4))
    assert (imp[1].x, imp[1].y) == pytest.approx((0, 0))


def test_lcl_linea_base_ideal():
    """Esquina (S = 50) hacia ATAQUE 20: la geometría pura llega a 40, el sistema dice 30."""
    r = SISTEMAS["lcl"].comparar_con_ideal(50, 30)
    assert r["ataque"] == 20
    assert r["llegada_ideal"] == pytest.approx(4.0)
    assert r["llegada_sistema"] == pytest.approx(3.0)
    assert r["delta_diamantes"] == pytest.approx(1.0)
    assert math.isfinite(r["delta_diamantes"])
