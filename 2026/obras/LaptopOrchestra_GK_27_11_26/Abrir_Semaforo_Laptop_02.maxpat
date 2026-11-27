{
  "patcher": {
    "fileversion": 1,
    "appversion": {
      "major": 9,
      "minor": 0,
      "revision": 0,
      "architecture": "x64",
      "modernui": 1
    },
    "classnamespace": "box",
    "rect": [
      0,
      66,
      1180,
      328
    ],
    "openinpresentation": 1,
    "default_fontsize": 12.0,
    "default_fontname": "Arial",
    "boxes": [
      {
        "box": {
          "id": "read",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            14,
            14,
            184,
            22
          ],
          "text": "partitura partitura_semaforo_02.json",
          "outlettype": [
            ""
          ]
        }
      },
      {
        "box": {
          "id": "reload",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            210,
            14,
            45,
            22
          ],
          "text": "reload",
          "outlettype": [
            ""
          ]
        }
      },
      {
        "box": {
          "id": "reset",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            267,
            14,
            63,
            22
          ],
          "text": "reiniciar",
          "outlettype": [
            ""
          ]
        }
      },
      {
        "box": {
          "id": "start",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            342,
            14,
            46,
            22
          ],
          "text": "inicio",
          "outlettype": [
            ""
          ]
        }
      },
      {
        "box": {
          "id": "panel",
          "maxclass": "bpatcher",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            14,
            52,
            1180.0,
            312.0
          ],
          "name": "panel_semaforo_02.maxpat",
          "embed": 0,
          "offset": [
            0,
            0
          ],
          "outlettype": [
            ""
          ],
          "presentation": 1,
          "presentation_rect": [
            0.0,
            0.0,
            1180.0,
            312.0
          ]
        }
      },
      {
        "box": {
          "id": "monitor",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            14,
            382,
            109,
            22
          ],
          "text": "print panel_orquesta"
        }
      },
      {
        "box": {
          "id": "route",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 10,
          "patching_rect": [
            180,
            382,
            450,
            22
          ],
          "text": "route inicio preset instruccion movimiento fin reiniciar pausa continuar stop",
          "outlettype": [
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            ""
          ]
        }
      }
    ],
    "lines": [
      {
        "patchline": {
          "source": [
            "read",
            0
          ],
          "destination": [
            "panel",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "reload",
            0
          ],
          "destination": [
            "panel",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "reset",
            0
          ],
          "destination": [
            "panel",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "start",
            0
          ],
          "destination": [
            "panel",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "panel",
            0
          ],
          "destination": [
            "monitor",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "panel",
            0
          ],
          "destination": [
            "route",
            0
          ]
        }
      }
    ],
    "dependency_cache": [
      {
        "name": "panel_semaforo_02.maxpat",
        "patcherrelativepath": ".",
        "type": "JSON",
        "implicit": 1
      },
      {
        "name": "interfaz_semaforo_02.js",
        "patcherrelativepath": ".",
        "type": "TEXT",
        "implicit": 1
      }
    ],
    "autosave": 0
  }
}
