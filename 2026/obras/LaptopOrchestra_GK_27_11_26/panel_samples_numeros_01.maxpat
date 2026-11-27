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
      80,
      1180,
      328
    ],
    "openinpresentation": 1,
    "default_fontsize": 12.0,
    "default_fontname": "Arial",
    "boxes": [
      {
        "box": {
          "id": "in",
          "maxclass": "inlet",
          "numinlets": 0,
          "numoutlets": 1,
          "patching_rect": [
            14,
            14,
            30,
            30
          ],
          "index": 1,
          "outlettype": [
            ""
          ]
        }
      },
      {
        "box": {
          "id": "load",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            70,
            14,
            80,
            22
          ],
          "text": "loadmess init",
          "outlettype": [
            ""
          ]
        }
      },
      {
        "box": {
          "id": "ui",
          "maxclass": "v8ui",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            14,
            58,
            1180.0,
            312.0
          ],
          "filename": "interfaz_samples_numeros_01.js",
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
          "id": "out",
          "maxclass": "outlet",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            14,
            385,
            30,
            30
          ],
          "index": 1
        }
      }
    ],
    "lines": [
      {
        "patchline": {
          "source": [
            "in",
            0
          ],
          "destination": [
            "ui",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "load",
            0
          ],
          "destination": [
            "ui",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "ui",
            0
          ],
          "destination": [
            "out",
            0
          ]
        }
      }
    ],
    "dependency_cache": [
      {
        "name": "interfaz_samples_numeros_01.js",
        "patcherrelativepath": ".",
        "type": "TEXT",
        "implicit": 1
      }
    ],
    "autosave": 0
  }
}
