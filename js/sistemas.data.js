// Generado por scripts/exportar_js.py desde data/sistemas.json. No editar a mano.
window.BILLAR_DATOS = {
 "version": "0.1.0",
 "mesa": {
  "descripcion": "Mesa de carambola en unidades de diamante: 8 intervalos en la banda larga y 4 en la corta. Origen en la esquina inferior izquierda de las figuras de 2015.",
  "largo_diamantes": 8,
  "ancho_diamantes": 4,
  "superficie_juego_m": [
   2.84,
   1.42
  ],
  "diametro_bola_m": 0.0615,
  "bandas": {
   "sup": "banda larga superior (y = 4)",
   "inf": "banda larga inferior (y = 0)",
   "izq": "banda corta izquierda (x = 0)",
   "der": "banda corta derecha (x = 8)"
  }
 },
 "nota_escalas": "Las posiciones se leyeron de las figuras originales del blog (2014-2015). En las bandas sup/inf la posicion es x (0 a 8); en izq/der es y (0 a 4). Entre marcas se interpola linealmente.",
 "sistemas": [
  {
   "id": "lcl",
   "n": 1,
   "nombre": "LCL (Larga-Corta-Larga)",
   "familia": "LCL",
   "publicado": "2014-05-31",
   "figura": "docs/figuras_2015/01_01.gif",
   "calcula": "A",
   "formula": [
    {
     "si": "true",
     "expr": "S - L"
    }
   ],
   "latex": "\\text{ATAQUE} = \\text{SALIDA} - \\text{LLEGADA}",
   "efecto": {
    "tipo": "fijo",
    "descripcion": "Efecto máximo del lado de la trayectoria (efecto 3 a la derecha en la figura)."
   },
   "escalas": {
    "S": [
     [
      "sup",
      [
       [
        10,
        0
       ],
       [
        15,
        1
       ],
       [
        20,
        2
       ],
       [
        25,
        3
       ],
       [
        30,
        4
       ],
       [
        35,
        5
       ],
       [
        40,
        6
       ],
       [
        45,
        7
       ],
       [
        50,
        8
       ]
      ]
     ],
     [
      "der",
      [
       [
        50,
        4
       ],
       [
        60,
        3
       ],
       [
        70,
        2
       ],
       [
        80,
        1.5
       ],
       [
        90,
        1
       ],
       [
        100,
        0.5
       ]
      ]
     ]
    ],
    "L": [
     [
      "sup",
      [
       [
        0,
        0
       ],
       [
        10,
        1
       ],
       [
        20,
        2
       ],
       [
        30,
        3
       ],
       [
        40,
        4
       ],
       [
        50,
        4.5
       ],
       [
        60,
        5
       ],
       [
        70,
        5.5
       ],
       [
        80,
        6
       ],
       [
        90,
        6.5
       ],
       [
        100,
        7
       ]
      ]
     ]
    ],
    "A": [
     [
      "inf",
      [
       [
        10,
        1
       ],
       [
        20,
        2
       ],
       [
        30,
        3
       ],
       [
        40,
        4
       ],
       [
        50,
        5
       ],
       [
        60,
        5.5
       ],
       [
        70,
        6
       ],
       [
        80,
        6.5
       ],
       [
        90,
        7
       ],
       [
        100,
        7.5
       ]
      ]
     ]
    ]
   },
   "continuacion_cuarta_banda": {
    "descripcion": "Correspondencia de llegada en la tercera banda con la cuarta banda (figura 01_04 del blog).",
    "tabla": [
     [
      0,
      "80"
     ],
     [
      10,
      "100"
     ],
     [
      20,
      "esquina"
     ],
     [
      30,
      "90"
     ],
     [
      40,
      "80"
     ],
     [
      50,
      "70"
     ],
     [
      60,
      "60 2/3"
     ],
     [
      70,
      "60 1/3"
     ],
     [
      80,
      "60"
     ],
     [
      90,
      "50 2/3"
     ]
    ]
   },
   "ejemplos_blog": [
    {
     "S": 50,
     "L": 0,
     "resultado": 50
    }
   ],
   "golpe": {
    "lado": "favor",
    "fijo": {
     "reloj": 3,
     "radio": 0.45
    },
    "fuente": "figura 01_01: marca a las 3"
   }
  },
  {
   "id": "clc",
   "n": 2,
   "nombre": "CLC (Corta-Larga-Corta)",
   "familia": "CLC",
   "publicado": "2015-01-14",
   "figura": "docs/figuras_2015/02_01.gif",
   "calcula": "A",
   "formula": [
    {
     "si": "true",
     "expr": "V + (S - L)"
    }
   ],
   "latex": "\\text{ATAQUE} = \\text{AVANCE} + (\\text{SALIDA} - \\text{LLEGADA})",
   "efecto": {
    "tipo": "avance",
    "lado": "favor",
    "tabla": [
     [
      1,
      5
     ],
     [
      2,
      10
     ],
     [
      3,
      15
     ]
    ]
   },
   "escalas": {
    "S": [
     [
      "der",
      [
       [
        0,
        4
       ],
       [
        5,
        3
       ],
       [
        10,
        2
       ],
       [
        15,
        1
       ],
       [
        20,
        0
       ]
      ]
     ],
     [
      "inf",
      [
       [
        23,
        8
       ],
       [
        24,
        7
       ],
       [
        26,
        6
       ],
       [
        28,
        5
       ],
       [
        30,
        4
       ],
       [
        32,
        3
       ],
       [
        35,
        2
       ],
       [
        38,
        1
       ]
      ]
     ]
    ],
    "L": [
     [
      "der",
      [
       [
        0,
        4
       ],
       [
        5,
        3
       ],
       [
        10,
        2
       ],
       [
        15,
        1
       ],
       [
        20,
        0
       ]
      ]
     ]
    ],
    "A": [
     [
      "izq",
      [
       [
        0,
        4
       ],
       [
        10,
        3
       ],
       [
        20,
        2
       ],
       [
        30,
        1
       ],
       [
        40,
        0
       ]
      ]
     ]
    ]
   },
   "ejemplos_blog": [
    {
     "S": 20,
     "L": 0,
     "efecto": 3,
     "resultado": 35
    }
   ],
   "golpe": {
    "lado": "favor",
    "por_efecto": {
     "1": {
      "reloj": 1,
      "radio": 0.45
     },
     "2": {
      "reloj": 2,
      "radio": 0.45
     },
     "3": {
      "reloj": 3,
      "radio": 0.45
     }
    },
    "fuente": "figura 02_03: efecto 1, 2 y 3 a la 1, 2 y 3 en punto"
   }
  },
  {
   "id": "s369",
   "n": 3,
   "nombre": "3-6-9 (Larga-Corta-Larga)",
   "familia": "LCL",
   "publicado": "2015-01-15",
   "figura": "docs/figuras_2015/03_01.gif",
   "calcula": "A",
   "formula": [
    {
     "si": "S <= 20",
     "expr": "(S - L) / 2"
    },
    {
     "si": "true",
     "expr": "S / 2 - L"
    }
   ],
   "latex": "\\text{ATAQUE} = \\begin{cases} \\dfrac{\\text{SALIDA} - \\text{LLEGADA}}{2}, & \\text{SALIDA} \\le 20 \\\\[6pt] \\dfrac{\\text{SALIDA}}{2} - \\text{LLEGADA}, & \\text{SALIDA} > 20 \\end{cases}",
   "efecto": {
    "tipo": "fijo",
    "descripcion": "Efecto alto a favor (marca superior de la bola en la figura)."
   },
   "escalas": {
    "S": [
     [
      "inf",
      [
       [
        0,
        8
       ],
       [
        5,
        7.5
       ],
       [
        10,
        7
       ],
       [
        15,
        6.5
       ],
       [
        20,
        6
       ],
       [
        25,
        5.5
       ],
       [
        30,
        5
       ],
       [
        35,
        4.5
       ],
       [
        40,
        4
       ]
      ]
     ]
    ],
    "L": [
     [
      "der",
      [
       [
        0,
        0
       ],
       [
        3,
        1
       ],
       [
        6,
        2
       ],
       [
        9,
        3
       ],
       [
        12,
        4
       ]
      ]
     ]
    ],
    "A": [
     [
      "sup",
      [
       [
        0,
        8
       ],
       [
        5,
        7.5
       ],
       [
        10,
        7
       ],
       [
        15,
        6.5
       ],
       [
        20,
        6
       ]
      ]
     ]
    ]
   },
   "errata": "El blog dice 'si el valor de ataque es <= 20', pero ese valor es el que se calcula. Los dos ejemplos solo cuadran si la condición se aplica a la SALIDA (16 usa la ec. 1; 36 usa la ec. 2). En la escala de llegada la figura rotula 0 (esquina superior), 9, 6, 3 de arriba hacia abajo: los valores bajan un 3 por diamante. Por continuidad se toma la esquina inferior como 0 y la superior como 12 (lectura a confirmar por el autor).",
   "ejemplos_blog": [
    {
     "S": 16,
     "L": 6,
     "resultado": 5
    },
    {
     "S": 36,
     "L": 3,
     "resultado": 15
    }
   ],
   "golpe": {
    "lado": "favor",
    "fijo": {
     "reloj": 0,
     "radio": 0.45
    },
    "fuente": "figura 03_01: marca arriba al centro"
   },
   "recorrido": "SALIDA: recta desde la esquina superior derecha que pasa por el centro de la bola hasta la banda inferior. La bola va al ATAQUE (banda superior) y llega a la corta derecha (figura 03_03)."
  },
  {
   "id": "clc0",
   "n": 4,
   "nombre": "CLC Efecto cero",
   "familia": "CLC",
   "publicado": "2015-01-18",
   "figura": "docs/figuras_2015/04_01.jpg",
   "calcula": "A",
   "formula": [
    {
     "si": "true",
     "expr": "S - 1.5 * L"
    }
   ],
   "latex": "\\text{ATAQUE} = \\text{SALIDA} - 1.5\\,\\text{LLEGADA}",
   "efecto": {
    "tipo": "fijo",
    "descripcion": "Sin efecto lateral (bola al centro, un poco arriba)."
   },
   "escalas": {
    "S": [
     [
      "der",
      [
       [
        0,
        4
       ],
       [
        10,
        3
       ],
       [
        20,
        2
       ],
       [
        30,
        1
       ],
       [
        40,
        0
       ]
      ]
     ]
    ],
    "L": [
     [
      "der",
      [
       [
        0,
        4
       ],
       [
        10,
        3
       ],
       [
        20,
        2
       ],
       [
        30,
        1
       ],
       [
        40,
        0
       ]
      ]
     ]
    ],
    "A": [
     [
      "izq",
      [
       [
        0,
        4
       ],
       [
        10,
        3.5
       ],
       [
        20,
        3
       ],
       [
        30,
        2.5
       ],
       [
        40,
        2
       ]
      ]
     ]
    ]
   },
   "nota": "Si la LLEGADA se renumera como 0, 15, 30, 45, 60, la ecuación queda ATAQUE = SALIDA - LLEGADA.",
   "ejemplos_blog": [
    {
     "S": 30,
     "L": 10,
     "resultado": 15
    }
   ],
   "golpe": {
    "lado": "favor",
    "fijo": {
     "reloj": 0,
     "radio": 0.25
    },
    "fuente": "figura 04_01: marca arriba, cerca del centro (efecto cero)"
   }
  },
  {
   "id": "cajones",
   "n": 5,
   "nombre": "Cajones-Cabañas (LCL, efecto 1, 2 y 3)",
   "familia": "LCL",
   "publicado": "2015-01-18",
   "figura": "docs/figuras_2015/05_01.jpg",
   "calcula": "A",
   "formula": [
    {
     "si": "true",
     "expr": "V + (S - L)"
    }
   ],
   "latex": "\\text{ATAQUE} = \\text{AVANCE} + (\\text{SALIDA} - \\text{LLEGADA})",
   "efecto": {
    "tipo": "avance",
    "lado": "favor",
    "tabla": [
     [
      1,
      5
     ],
     [
      2,
      10
     ],
     [
      3,
      15
     ]
    ]
   },
   "escalas": {
    "S": [
     [
      "inf",
      [
       [
        0,
        8
       ],
       [
        5,
        7.5
       ],
       [
        10,
        7
       ],
       [
        15,
        6.5
       ],
       [
        20,
        6
       ]
      ]
     ]
    ],
    "L": [
     [
      "inf",
      [
       [
        0,
        8
       ],
       [
        5,
        7.5
       ],
       [
        10,
        7
       ],
       [
        15,
        6.5
       ],
       [
        20,
        6
       ]
      ]
     ]
    ],
    "A": [
     [
      "sup",
      [
       [
        0,
        8
       ],
       [
        10,
        7.5
       ],
       [
        20,
        7
       ],
       [
        30,
        6.5
       ],
       [
        40,
        6
       ]
      ]
     ]
    ]
   },
   "ejemplos_blog": [
    {
     "S": 15,
     "L": 5,
     "efecto": 1,
     "resultado": 15
    }
   ],
   "golpe": {
    "lado": "favor",
    "por_efecto": {
     "1": {
      "reloj": 1,
      "radio": 0.45
     },
     "2": {
      "reloj": 2,
      "radio": 0.45
     },
     "3": {
      "reloj": 3,
      "radio": 0.45
     }
    },
    "fuente": "figura 05_03 (igual a 02_03)"
   }
  },
  {
   "id": "ec_lcl",
   "n": 6,
   "nombre": "Efecto contrario (LCL)",
   "familia": "LCL",
   "publicado": "2015-01-20",
   "figura": "docs/figuras_2015/06_01.gif",
   "calcula": "A",
   "formula": [
    {
     "si": "true",
     "expr": "(2 * V - L) - S"
    }
   ],
   "latex": "\\text{ATAQUE} = \\left[\\,2\\,\\text{AVANCE} - \\text{LLEGADA}\\,\\right] - \\text{SALIDA}",
   "efecto": {
    "tipo": "avance",
    "lado": "contrario",
    "tabla": [
     [
      1,
      5
     ],
     [
      2,
      10
     ],
     [
      3,
      15
     ]
    ]
   },
   "escalas": {
    "S": [
     [
      "der",
      [
       [
        0,
        4
       ],
       [
        10,
        3
       ],
       [
        20,
        2
       ],
       [
        30,
        1
       ],
       [
        40,
        0
       ]
      ]
     ]
    ],
    "L": [
     [
      "der",
      [
       [
        0,
        4
       ],
       [
        10,
        3
       ],
       [
        20,
        2
       ],
       [
        30,
        1
       ],
       [
        40,
        0
       ]
      ]
     ]
    ],
    "A": [
     [
      "sup",
      [
       [
        0,
        0
       ],
       [
        5,
        1
       ],
       [
        10,
        2
       ],
       [
        15,
        3
       ],
       [
        20,
        4
       ]
      ]
     ]
    ]
   },
   "errata": "El texto del blog dice SALIDA = 10 y LLEGADA = 5, pero la ecuación resuelta usa LLEGADA = 10 y SALIDA = 5. Se toma la ecuación como correcta.",
   "ejemplos_blog": [
    {
     "S": 5,
     "L": 10,
     "efecto": 2,
     "resultado": 5
    }
   ],
   "golpe": {
    "lado": "contrario",
    "por_efecto": {
     "1": {
      "reloj": 1,
      "radio": 0.45
     },
     "2": {
      "reloj": 2,
      "radio": 0.45
     },
     "3": {
      "reloj": 3,
      "radio": 0.45
     }
    },
    "fuente": "figura 06_03 (igual a 02_03), efecto contrario"
   }
  },
  {
   "id": "ec_clc",
   "n": 7,
   "nombre": "Efecto contrario (CLC)",
   "familia": "CLC",
   "publicado": "2015-01-25",
   "figura": "docs/figuras_2015/07_01.jpg",
   "calcula": "A",
   "formula": [
    {
     "si": "true",
     "expr": "(V - L) - S"
    }
   ],
   "latex": "\\text{ATAQUE} = (\\text{AVANCE} - \\text{LLEGADA}) - \\text{SALIDA}",
   "efecto": {
    "tipo": "avance",
    "lado": "contrario",
    "tabla": [
     [
      1,
      5
     ],
     [
      2,
      10
     ],
     [
      3,
      15
     ]
    ]
   },
   "escalas": {
    "S": [
     [
      "inf",
      [
       [
        0,
        0
       ],
       [
        5,
        0.5
       ],
       [
        10,
        1
       ],
       [
        15,
        1.5
       ],
       [
        20,
        2
       ]
      ]
     ],
     [
      "der",
      [
       [
        0,
        4
       ],
       [
        10,
        3
       ],
       [
        20,
        2
       ],
       [
        30,
        1
       ],
       [
        40,
        0
       ]
      ]
     ]
    ],
    "L": [
     [
      "inf",
      [
       [
        0,
        0
       ],
       [
        5,
        0.5
       ],
       [
        10,
        1
       ],
       [
        15,
        1.5
       ],
       [
        20,
        2
       ]
      ]
     ]
    ],
    "A": [
     [
      "izq",
      [
       [
        0,
        4
       ],
       [
        5,
        3.5
       ],
       [
        10,
        3
       ],
       [
        15,
        2.5
       ],
       [
        20,
        2
       ]
      ]
     ]
    ]
   },
   "ejemplos_blog": [
    {
     "S": 5,
     "L": 8,
     "efecto": 3,
     "resultado": 2
    }
   ],
   "golpe": {
    "lado": "contrario",
    "por_efecto": {
     "1": {
      "reloj": 1,
      "radio": 0.45
     },
     "2": {
      "reloj": 2,
      "radio": 0.45
     },
     "3": {
      "reloj": 3,
      "radio": 0.45
     }
    },
    "fuente": "figura 07_03: marcas a las 11, 10 y 9 (efecto contrario)"
   },
   "errata": "La SALIDA tiene dos escalas (banda corta derecha y banda inferior). El ejemplo del blog (salida 5, bolas junto a la esquina inferior izquierda) usa la inferior."
  },
  {
   "id": "pasabola",
   "n": 8,
   "nombre": "Pasa bola (LCL)",
   "familia": "LCL",
   "publicado": "2015-01-31",
   "figura": "docs/figuras_2015/08_01.gif",
   "calcula": "E",
   "formula": [
    {
     "si": "true",
     "expr": "V + L + S + A"
    }
   ],
   "latex": "\\text{EFECTO} = \\text{AVANCE} + \\text{LLEGADA} + \\text{SALIDA} + \\text{ATAQUE}",
   "efecto": {
    "tipo": "pasabola",
    "descripcion": "AVANCE = -1 si la bola a atacar está a un diamante de la primera banda; si no, 0. El resultado es la cantidad de efecto (de -4 a +4)."
   },
   "escalas": {
    "S": [
     [
      "sup",
      [
       [
        4,
        4
       ],
       [
        3,
        5
       ],
       [
        2,
        6
       ],
       [
        1,
        7
       ],
       [
        0,
        8
       ]
      ]
     ],
     [
      "der",
      [
       [
        0,
        4
       ],
       [
        -1,
        3
       ],
       [
        -2,
        2
       ],
       [
        -3,
        1.5
       ],
       [
        -4,
        1
       ]
      ]
     ]
    ],
    "L": [
     [
      "sup",
      [
       [
        0,
        0
       ],
       [
        1,
        0.5
       ],
       [
        2,
        1
       ],
       [
        3,
        1.5
       ],
       [
        4,
        2
       ]
      ]
     ]
    ],
    "A": [
     [
      "inf",
      [
       [
        -4,
        0
       ],
       [
        -3,
        0.5
       ],
       [
        -2,
        1
       ],
       [
        -1,
        1.5
       ],
       [
        0,
        2
       ],
       [
        1,
        2.5
       ],
       [
        2,
        3
       ],
       [
        3,
        3.5
       ],
       [
        4,
        4
       ]
      ]
     ]
    ]
   },
   "ejemplos_blog": [
    {
     "S": 0,
     "L": 2,
     "A": 2,
     "V": 0,
     "resultado": 4
    }
   ],
   "golpe": {
    "lado": "favor",
    "por_cantidad": {
     "grados_por_unidad": 22.5,
     "radio": 0.45
    },
    "fuente": "figura 08_01: -4 a las 9, 0 arriba, +4 a las 3"
   }
  },
  {
   "id": "plus",
   "n": 9,
   "nombre": "Plus (CLC)",
   "familia": "CLC",
   "publicado": "2015-02-01",
   "figura": "docs/figuras_2015/09_01.jpg",
   "calcula": "A",
   "formula": [
    {
     "si": "true",
     "expr": "L - S"
    }
   ],
   "latex": "\\text{ATAQUE} = \\text{LLEGADA} - \\text{SALIDA}",
   "efecto": {
    "tipo": "fijo",
    "descripcion": "Efecto +4 (máximo, a favor)."
   },
   "escalas": {
    "S": [
     [
      "inf",
      [
       [
        0,
        0
       ],
       [
        10,
        1
       ],
       [
        20,
        2
       ],
       [
        30,
        3
       ],
       [
        40,
        4
       ],
       [
        50,
        5
       ],
       [
        60,
        6
       ],
       [
        70,
        7
       ],
       [
        80,
        8
       ]
      ]
     ]
    ],
    "L": [
     [
      "inf",
      [
       [
        0,
        0
       ],
       [
        10,
        1
       ],
       [
        20,
        2
       ],
       [
        30,
        3
       ],
       [
        40,
        4
       ],
       [
        50,
        5
       ],
       [
        60,
        6
       ],
       [
        70,
        7
       ],
       [
        80,
        8
       ]
      ]
     ]
    ],
    "A": [
     [
      "izq",
      [
       [
        0,
        4
       ],
       [
        10,
        3.5
       ],
       [
        20,
        3
       ],
       [
        30,
        2.75
       ],
       [
        40,
        2.5
       ],
       [
        50,
        2
       ],
       [
        60,
        1.75
       ],
       [
        70,
        1.5
       ],
       [
        80,
        1.25
       ],
       [
        90,
        1
       ]
      ]
     ]
    ]
   },
   "ejemplos_blog": [
    {
     "S": 30,
     "L": 70,
     "resultado": 40
    }
   ],
   "golpe": {
    "lado": "favor",
    "fijo": {
     "reloj": 3,
     "radio": 0.45
    },
    "fuente": "figura 09_01: efecto +4 a las 3"
   },
   "recorrido": "La bola sale de la banda inferior, toca primero la corta izquierda (ATAQUE), luego la larga superior, y la LLEGADA se lee de nuevo en la inferior (figura 09_04)."
  }
 ]
};
