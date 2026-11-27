/* Partitura de Enjambres, versión de concierto: mensajes y ETAPAS (ver simulador.js).
   La escribe la app Enjambres Director al apretar "guardar" en la maestra; se puede editar a mano con cuidado. */
window.ENJAMBRES_PARTITURA = {
 "v": 2,
 "mod": 1795797874260,
 "eventos": [
  {
   "id": "m1",
   "t": 0,
   "dur": 12,
   "para": "todos",
   "texto": "Espera unos segundos antes de tu primer agente."
  },
  {
   "id": "m2",
   "t": 170,
   "dur": 20,
   "para": "todos",
   "texto": "PULSO: hacia «en fase»."
  },
  {
   "id": "m3",
   "t": 232,
   "dur": 14,
   "para": "todos",
   "texto": "Más agentes, más caos."
  },
  {
   "id": "m4",
   "t": 372,
   "dur": 16,
   "para": "todos",
   "texto": "Quita agentes de a uno."
  }
 ],
 "etapas": [
  {
   "id": "e1",
   "t": 0,
   "nombre": "Nacimiento",
   "rampa": 4,
   "maxAgentes": 3,
   "texto": "Hasta 3 agentes, de a uno.\nMOVIMIENTO: lento y ordenado.",
   "director": "DER · sube muy lento desde el silencio hasta media altura; al centro (sin caos) y atrás (κ = 0).\nIZQ · abajo los primeros 30 s; después pasea el imán, suave, de un extremo al otro: los glissandi siguen tu mano.",
   "cede": [
    "movimiento"
   ],
   "vals": {
    "mapeo": "directo",
    "voz": "seno",
    "afinacion": "libre",
    "escala": "exp",
    "vNoise": 0.05,
    "vel": 0.08,
    "radio": 0.2,
    "coh": 0,
    "iman": 0,
    "cNoise": 0,
    "fmin": 180,
    "fmax": 2400,
    "nivel": -15,
    "amin": 0.1,
    "b1": 0.78,
    "b2": 0.3
   },
   "conj": {
    "kappa": 0
   },
   "limites": {
    "vNoise": [
     0,
     0.25
    ],
    "vel": [
     0.03,
     0.2
    ]
   },
   "grupos": [],
   "reparto": "bloques",
   "espera": false
  },
  {
   "id": "e2",
   "t": 60,
   "nombre": "Bandada",
   "rampa": 10,
   "maxAgentes": 6,
   "texto": "Hasta 6 agentes.\nFORMA: júntalos o sepáralos.\nSINCRONÍA: que se afinen.",
   "director": "DER · adelanta la mano de a poco (κ de 0 a 1): los enjambres empiezan a verse y a afinarse entre sí.\nIZQ · reúne a todos en un punto y espera el unísono; baja la mano y deja que se dispersen. Repite en otro lugar del arco.",
   "cede": [
    "forma",
    "sincronia"
   ],
   "vals": {
    "mapeo": "osciladores",
    "voz": "seno",
    "vNoise": 0.15,
    "vel": 0.15,
    "radio": 0.22,
    "coh": 0.2,
    "b1": 0.5,
    "b2": 0.3,
    "fmin": 150,
    "fmax": 1800,
    "nivel": -14,
    "amin": 0.15
   },
   "conj": {
    "kappa": 0.6
   },
   "limites": {
    "radio": [
     0.1,
     0.4
    ],
    "coh": [
     -0.3,
     0.8
    ],
    "b1": [
     0.2,
     1
    ],
    "b2": [
     0,
     0.8
    ]
   },
   "grupos": [],
   "reparto": "bloques",
   "espera": false
  },
  {
   "id": "e3",
   "t": 130,
   "nombre": "Pulso",
   "rampa": 6,
   "maxAgentes": 6,
   "texto": "PULSO: de «cada uno» a «en fase», de a poco.\nIMÁN: lleva tus agentes a otras laptops.",
   "director": "IZQ · abajo: los imanes son de los intérpretes.\nDER · adelante (κ alto) para que el pulso se contagie entre enjambres; hacia el final, mano a la izquierda (orden): debe oírse un pulso común. Altura: crece hasta tres cuartos.",
   "cede": [
    "pulso",
    "color",
    "iman"
   ],
   "vals": {
    "mapeo": "osciladores",
    "voz": "pulsos",
    "color": 0.3,
    "pulso": 2,
    "kfase": 0.1,
    "vNoise": 0.2,
    "vel": 0.15,
    "coh": 0.1,
    "fmin": 200,
    "fmax": 3200,
    "nivel": -10
   },
   "conj": {
    "kappa": 0.9
   },
   "limites": {
    "pulso": [
     1,
     8
    ],
    "color": [
     0.1,
     0.7
    ]
   },
   "grupos": [],
   "reparto": "bloques",
   "espera": false
  },
  {
   "id": "e4",
   "t": 200,
   "nombre": "Turbulencia",
   "rampa": 8,
   "maxAgentes": 10,
   "texto": "Hasta 10 agentes.\nMOVIMIENTO: hacia el caos.\nFORMA: sepáralos. TIMBRE: color y nivel.",
   "director": "DER · a la derecha (caos) y arriba: el peak va hacia 4:00. Últimos 10 s: vuelve al centro.\nIZQ · imán fuerte: arrastra la masa de un extremo al otro del arco y suéltala de golpe.",
   "cede": [
    "movimiento",
    "forma",
    "timbre"
   ],
   "vals": {
    "mapeo": "friccion",
    "voz": "fm",
    "moduladora": "osciladores",
    "color": 0.5,
    "vNoise": 0.5,
    "vel": 0.35,
    "radio": 0.25,
    "coh": 0,
    "iman": 0,
    "fmin": 80,
    "fmax": 4000,
    "nivel": -16,
    "amin": 0.2
   },
   "conj": {
    "kappa": 1
   },
   "limites": {
    "vNoise": [
     0.2,
     1
    ],
    "vel": [
     0.15,
     0.8
    ],
    "nivel": [
     -24,
     -12
    ],
    "coh": [
     -1,
     0.5
    ],
    "radio": [
     0.1,
     0.5
    ]
   },
   "grupos": [],
   "reparto": "bloques",
   "espera": false
  },
  {
   "id": "e5",
   "t": 270,
   "nombre": "Tres a la vez",
   "rampa": 10,
   "maxAgentes": 7,
   "texto": "Hasta 7 agentes.\nMOVIMIENTO y FORMA.\nEscucha a los otros grupos.",
   "director": "IZQ · lleva el imán de un grupo a otro: los agentes cambian de parlantes pero conservan su voz; mezcla los tres timbres al centro y vuelve a separarlos.\nDER · atrás (κ bajo) para que los grupos no se fundan; al centro. En los últimos 15 s, adelante (κ = 1).",
   "cede": [
    "movimiento",
    "forma",
    "color"
   ],
   "vals": {
    "vNoise": 0.25,
    "vel": 0.2,
    "radio": 0.22,
    "coh": 0,
    "iman": 0,
    "nivel": -15,
    "moduladora": "friccion",
    "color": 0.5,
    "amin": 0.2
   },
   "conj": {
    "kappa": 0.2
   },
   "limites": {
    "vNoise": [
     0,
     0.6
    ],
    "vel": [
     0.05,
     0.4
    ]
   },
   "reparto": "bloques",
   "grupos": [
    {
     "nombre": "graves · directo (senos)",
     "vals": {
      "mapeo": "directo",
      "voz": "seno",
      "fmin": 80,
      "fmax": 400
     }
    },
    {
     "nombre": "medios · osciladores acoplados (anillo)",
     "vals": {
      "mapeo": "osciladores",
      "voz": "ring",
      "fmin": 300,
      "fmax": 1500
     }
    },
    {
     "nombre": "agudos · fricción (soplo)",
     "vals": {
      "mapeo": "friccion",
      "voz": "resonador",
      "fmin": 1200,
      "fmax": 6000
     }
    }
   ],
   "espera": false
  },
  {
   "id": "e6",
   "t": 345,
   "nombre": "Disolución",
   "rampa": 10,
   "maxAgentes": 4,
   "texto": "Baja a 4 agentes, de a uno.\nFORMA: juntos.",
   "director": "IZQ · imán al centro, arriba: todo converge en un acorde.\nDER · a la izquierda (orden), adelante (κ = 1); baja la altura muy lentamente.",
   "cede": [
    "forma"
   ],
   "vals": {
    "mapeo": "osciladores",
    "voz": "seno",
    "afinacion": "armonicos",
    "fmin": 110,
    "fmax": 1760,
    "vNoise": 0.08,
    "vel": 0.1,
    "radio": 0.3,
    "coh": 0.3,
    "b1": 0.8,
    "b2": 0.1,
    "nivel": -14,
    "amin": 0.2
   },
   "conj": {
    "kappa": 1
   },
   "limites": {
    "coh": [
     0,
     1
    ],
    "radio": [
     0.15,
     0.5
    ]
   },
   "grupos": [],
   "reparto": "bloques",
   "espera": false
  },
  {
   "id": "e7",
   "t": 395,
   "nombre": "Fin",
   "rampa": 3,
   "maxAgentes": 0,
   "texto": "No toques nada.",
   "director": "DER · baja hasta el silencio junto con el último agente.\nIZQ · baja. Manos abajo.",
   "cede": [],
   "vals": {
    "vNoise": 0.03,
    "vel": 0.06
   },
   "conj": {
    "kappa": 1
   },
   "limites": {},
   "grupos": [],
   "reparto": "bloques",
   "espera": false
  }
 ]
};
