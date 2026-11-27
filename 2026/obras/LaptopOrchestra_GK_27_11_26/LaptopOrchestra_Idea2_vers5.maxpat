{
    "patcher": {
        "fileversion": 1,
        "appversion": {
            "major": 9,
            "minor": 2,
            "revision": 0,
            "architecture": "x64",
            "modernui": 1
        },
        "classnamespace": "box",
        "rect": [ 50.0, 105.0, 1244.0, 893.0 ],
        "openinpresentation": 1,
        "boxes": [
            {
                "box": {
                    "id": "obj-309",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 48.0, 428.0, 73.0, 22.0 ],
                    "text": "jit.ndi.send~"
                }
            },
            {
                "box": {
                    "id": "obj-351",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 598.833333333333, 3453.0, 76.0, 22.0 ],
                    "text": "-13., 0. 8000"
                }
            },
            {
                "box": {
                    "id": "obj-350",
                    "maxclass": "newobj",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "bang" ],
                    "patching_rect": [ 598.833333333333, 3403.0, 74.0, 22.0 ],
                    "text": "delay 10000"
                }
            },
            {
                "box": {
                    "id": "obj-349",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 498.0, 3453.0, 76.0, 22.0 ],
                    "text": "0., -13. 8000"
                }
            },
            {
                "box": {
                    "id": "obj-348",
                    "maxclass": "newobj",
                    "numinlets": 2,
                    "numoutlets": 2,
                    "outlettype": [ "bang", "" ],
                    "patching_rect": [ 498.0, 3373.0, 34.0, 22.0 ],
                    "text": "sel 2"
                }
            },
            {
                "box": {
                    "id": "obj-347",
                    "maxclass": "newobj",
                    "numinlets": 2,
                    "numoutlets": 2,
                    "outlettype": [ "bang", "" ],
                    "patching_rect": [ 385.0, 3384.0, 34.0, 22.0 ],
                    "text": "sel 4"
                }
            },
            {
                "box": {
                    "id": "obj-333",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 383.0, 3453.0, 83.0, 22.0 ],
                    "text": "0., -80. 22000"
                }
            },
            {
                "box": {
                    "id": "obj-334",
                    "maxclass": "newobj",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "bang" ],
                    "patching_rect": [ 383.0, 3417.0, 74.0, 22.0 ],
                    "text": "delay 24000"
                }
            },
            {
                "box": {
                    "id": "obj-335",
                    "maxclass": "newobj",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 385.0, 3320.0, 55.0, 22.0 ],
                    "text": "r sample"
                }
            },
            {
                "box": {
                    "id": "obj-332",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 290.0, 3453.0, 83.0, 22.0 ],
                    "text": "-80., 0. 15000"
                }
            },
            {
                "box": {
                    "id": "obj-323",
                    "maxclass": "newobj",
                    "numinlets": 3,
                    "numoutlets": 2,
                    "outlettype": [ "", "bang" ],
                    "patching_rect": [ 587.833333333333, 3538.0, 40.0, 22.0 ],
                    "text": "line"
                }
            },
            {
                "box": {
                    "id": "obj-322",
                    "maxclass": "newobj",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "bang" ],
                    "patching_rect": [ 290.0, 3405.0, 67.0, 22.0 ],
                    "text": "delay 6000"
                }
            },
            {
                "box": {
                    "id": "obj-304",
                    "maxclass": "newobj",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 294.0, 3368.0, 39.0, 22.0 ],
                    "text": "r start"
                }
            },
            {
                "box": {
                    "id": "obj-293",
                    "maxclass": "newobj",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 168.0, 3417.0, 43.0, 22.0 ],
                    "text": "r reset"
                }
            },
            {
                "box": {
                    "fontface": 1,
                    "fontsize": 20.0,
                    "id": "obj-292",
                    "maxclass": "comment",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 292.0, 426.0, 199.0, 29.0 ],
                    "presentation": 1,
                    "presentation_rect": [ 264.0, 318.0, 144.0, 29.0 ],
                    "text": "Select Laptop",
                    "textjustification": 1
                }
            },
            {
                "box": {
                    "id": "obj-320",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 451.0, 3719.0, 70.0, 22.0 ],
                    "text": "loadmess 1"
                }
            },
            {
                "box": {
                    "id": "obj-313",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 158.0, 187.0, 70.0, 22.0 ],
                    "text": "loadmess 1"
                }
            },
            {
                "box": {
                    "id": "obj-312",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 168.0, 3460.0, 84.0, 22.0 ],
                    "text": "loadmess -80."
                }
            },
            {
                "box": {
                    "id": "obj-311",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 438.0, 1648.0, 70.0, 22.0 ],
                    "text": "loadmess 1"
                }
            },
            {
                "box": {
                    "id": "obj-307",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 2970.4, 3637.6, 136.8, 22.0 ],
                    "text": "open Sample4D_R.wav"
                }
            },
            {
                "box": {
                    "id": "obj-308",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 2930.4, 3604.8, 133.0, 22.0 ],
                    "text": "open Sample4D_L.wav"
                }
            },
            {
                "box": {
                    "id": "obj-310",
                    "maxclass": "newobj",
                    "numinlets": 2,
                    "numoutlets": 2,
                    "outlettype": [ "signal", "bang" ],
                    "patching_rect": [ 2847.2, 3830.769230769231, 57.0, 22.0 ],
                    "text": "sfplay~ 1"
                }
            },
            {
                "box": {
                    "id": "obj-306",
                    "linecount": 3,
                    "maxclass": "comment",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 2698.792899408284, 3434.6, 150.0, 60.0 ],
                    "text": "A + D (Extremos)\nC (Centro)\nB (Centro - Abierto)\n"
                }
            },
            {
                "box": {
                    "id": "obj-305",
                    "linecount": 2,
                    "maxclass": "comment",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 2125.3333333333335, 3401.3333333333335, 150.0, 33.0 ],
                    "text": "A (Extremos)\nB (Centros)"
                }
            },
            {
                "box": {
                    "id": "obj-302",
                    "maxclass": "newobj",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 2517.333333333333, 3453.6, 49.0, 22.0 ],
                    "text": "r laptop"
                }
            },
            {
                "box": {
                    "id": "obj-303",
                    "maxclass": "newobj",
                    "numinlets": 11,
                    "numoutlets": 11,
                    "outlettype": [ "bang", "bang", "bang", "bang", "bang", "bang", "bang", "bang", "bang", "bang", "" ],
                    "patching_rect": [ 2517.333333333333, 3485.6, 124.0, 22.0 ],
                    "text": "sel 0 1 2 3 4 5 6 7 8 9"
                }
            },
            {
                "box": {
                    "id": "obj-301",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 710.333333333333, 4136.0, 51.0, 22.0 ],
                    "text": "s laptop"
                }
            },
            {
                "box": {
                    "id": "obj-300",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 2058.0, 3782.0, 29.5, 22.0 ],
                    "text": "0"
                }
            },
            {
                "box": {
                    "id": "obj-299",
                    "maxclass": "newobj",
                    "numinlets": 5,
                    "numoutlets": 5,
                    "outlettype": [ "bang", "bang", "bang", "bang", "" ],
                    "patching_rect": [ 1900.0, 3740.0, 64.0, 22.0 ],
                    "text": "sel 1 2 3 4"
                }
            },
            {
                "box": {
                    "id": "obj-298",
                    "maxclass": "newobj",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 1900.0, 3711.0, 55.0, 22.0 ],
                    "text": "r sample"
                }
            },
            {
                "box": {
                    "id": "obj-297",
                    "maxclass": "newobj",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 2058.0, 3740.0, 39.0, 22.0 ],
                    "text": "r stop"
                }
            },
            {
                "box": {
                    "id": "obj-296",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 1042.0, 4950.0, 41.0, 22.0 ],
                    "text": "s stop"
                }
            },
            {
                "box": {
                    "id": "obj-294",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 2786.98224852071, 3726.6272189349106, 135.0, 22.0 ],
                    "text": "open Sample4C_R.wav"
                }
            },
            {
                "box": {
                    "id": "obj-295",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 2759.171597633136, 3701.7751479289936, 133.0, 22.0 ],
                    "text": "open Sample4C_L.wav"
                }
            },
            {
                "box": {
                    "id": "obj-284",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 2747.9289940828403, 3676.3313609467455, 134.0, 22.0 ],
                    "text": "open Sample4B_R.wav"
                }
            },
            {
                "box": {
                    "id": "obj-285",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 2736.094674556213, 3649.112426035503, 132.0, 22.0 ],
                    "text": "open Sample4B_L.wav"
                }
            },
            {
                "box": {
                    "id": "obj-286",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 2714.792899408284, 3623.0769230769233, 134.0, 22.0 ],
                    "text": "open Sample4A_R.wav"
                }
            },
            {
                "box": {
                    "id": "obj-288",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 2648.0, 3779.569230769231, 29.5, 22.0 ],
                    "text": "1"
                }
            },
            {
                "box": {
                    "id": "obj-290",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 2686.98224852071, 3598.224852071006, 132.0, 22.0 ],
                    "text": "open Sample4A_L.wav"
                }
            },
            {
                "box": {
                    "id": "obj-291",
                    "maxclass": "newobj",
                    "numinlets": 2,
                    "numoutlets": 2,
                    "outlettype": [ "signal", "bang" ],
                    "patching_rect": [ 2686.98224852071, 3830.769230769231, 57.0, 22.0 ],
                    "text": "sfplay~ 1"
                }
            },
            {
                "box": {
                    "id": "obj-277",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 2507.3333333333335, 3711.9999999999995, 134.0, 22.0 ],
                    "text": "open Sample3B_R.wav"
                }
            },
            {
                "box": {
                    "id": "obj-278",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 2485.3333333333335, 3685.9999999999995, 132.0, 22.0 ],
                    "text": "open Sample3B_L.wav"
                }
            },
            {
                "box": {
                    "id": "obj-279",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 2460.0, 3658.0000000000005, 134.0, 22.0 ],
                    "text": "open Sample3A_R.wav"
                }
            },
            {
                "box": {
                    "id": "obj-281",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 2397.0414201183435, 3797.6331360946747, 29.5, 22.0 ],
                    "text": "1"
                }
            },
            {
                "box": {
                    "id": "obj-282",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 2437.2781065088757, 3631.333333333334, 132.0, 22.0 ],
                    "text": "open Sample3A_L.wav"
                }
            },
            {
                "box": {
                    "id": "obj-283",
                    "maxclass": "newobj",
                    "numinlets": 2,
                    "numoutlets": 2,
                    "outlettype": [ "signal", "bang" ],
                    "patching_rect": [ 2437.2781065088757, 3830.769230769231, 57.0, 22.0 ],
                    "text": "sfplay~ 1"
                }
            },
            {
                "box": {
                    "id": "obj-190",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 2278.6666666666665, 3712.0, 134.0, 22.0 ],
                    "text": "open Sample2B_R.wav"
                }
            },
            {
                "box": {
                    "id": "obj-203",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 2255.3333333333335, 3683.3333333333335, 132.0, 22.0 ],
                    "text": "open Sample2B_L.wav"
                }
            },
            {
                "box": {
                    "id": "obj-207",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 2234.6666666666665, 3658.0000000000005, 134.0, 22.0 ],
                    "text": "open Sample2A_R.wav"
                }
            },
            {
                "box": {
                    "id": "obj-220",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 2173.0, 3788.0, 29.5, 22.0 ],
                    "text": "1"
                }
            },
            {
                "box": {
                    "id": "obj-224",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 2213.0, 3631.3333333333335, 132.0, 22.0 ],
                    "text": "open Sample2A_L.wav"
                }
            },
            {
                "box": {
                    "id": "obj-228",
                    "maxclass": "newobj",
                    "numinlets": 2,
                    "numoutlets": 2,
                    "outlettype": [ "signal", "bang" ],
                    "patching_rect": [ 2213.0, 3821.0, 57.0, 22.0 ],
                    "text": "sfplay~ 1"
                }
            },
            {
                "box": {
                    "id": "obj-123",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 2036.051948051948, 3712.0, 134.0, 22.0 ],
                    "text": "open Sample1B_R.wav"
                }
            },
            {
                "box": {
                    "id": "obj-120",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 2018.051948051948, 3686.0, 132.0, 22.0 ],
                    "text": "open Sample1B_L.wav"
                }
            },
            {
                "box": {
                    "id": "obj-114",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 2000.051948051948, 3658.0, 134.0, 22.0 ],
                    "text": "open Sample1A_R.wav"
                }
            },
            {
                "box": {
                    "id": "obj-14",
                    "maxclass": "ezdac~",
                    "numinlets": 2,
                    "numoutlets": 0,
                    "patching_rect": [ 1981.3852813852814, 4018.1034482758623, 45.0, 45.0 ]
                }
            },
            {
                "box": {
                    "id": "obj-173",
                    "lastchannelcount": 0,
                    "maxclass": "live.gain~",
                    "numinlets": 2,
                    "numoutlets": 5,
                    "outlettype": [ "signal", "signal", "", "float", "list" ],
                    "parameter_enable": 1,
                    "patching_rect": [ 1981.3852813852814, 3865.5172413793107, 48.0, 136.0 ],
                    "presentation": 1,
                    "presentation_rect": [ 354.0, 19.0, 54.0, 124.0 ],
                    "saved_attribute_attributes": {
                        "valueof": {
                            "parameter_longname": "live.gain~",
                            "parameter_mmax": 6.0,
                            "parameter_mmin": -70.0,
                            "parameter_modmode": 3,
                            "parameter_shortname": "live.gain~",
                            "parameter_type": 0,
                            "parameter_unitstyle": 4
                        }
                    },
                    "varname": "live.gain~"
                }
            },
            {
                "box": {
                    "id": "obj-170",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 1941.9913419913419, 3787.9999999999995, 29.5, 22.0 ],
                    "text": "1"
                }
            },
            {
                "box": {
                    "id": "obj-122",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 1981.3852813852814, 3631.3333333333335, 132.0, 22.0 ],
                    "text": "open Sample1A_L.wav"
                }
            },
            {
                "box": {
                    "id": "obj-116",
                    "maxclass": "newobj",
                    "numinlets": 2,
                    "numoutlets": 2,
                    "outlettype": [ "signal", "bang" ],
                    "patching_rect": [ 1981.3852813852814, 3820.779220779221, 57.0, 22.0 ],
                    "text": "sfplay~ 1"
                }
            },
            {
                "box": {
                    "id": "obj-111",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 1138.333333333333, 4920.0, 57.0, 22.0 ],
                    "text": "s sample"
                }
            },
            {
                "box": {
                    "id": "obj-4",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 1066.333333333333, 4924.0, 50.0, 22.0 ],
                    "text": "3"
                }
            },
            {
                "box": {
                    "id": "obj-16",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 714.333333333333, 4924.0, 41.0, 22.0 ],
                    "text": "s start"
                }
            },
            {
                "box": {
                    "id": "obj-18",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 952.333333333333, 4924.0, 45.0, 22.0 ],
                    "text": "s reset"
                }
            },
            {
                "box": {
                    "id": "obj-43",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 760.333333333333, 4924.0, 57.0, 22.0 ],
                    "text": "s presets"
                }
            },
            {
                "box": {
                    "id": "reload",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 732.333333333333, 4508.0, 45.0, 22.0 ],
                    "text": "reload"
                }
            },
            {
                "box": {
                    "id": "reset",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 790.333333333333, 4508.0, 63.0, 22.0 ],
                    "text": "reiniciar"
                }
            },
            {
                "box": {
                    "id": "start",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 866.333333333333, 4508.0, 46.0, 22.0 ],
                    "text": "inicio"
                }
            },
            {
                "box": {
                    "bgmode": 0,
                    "border": 0,
                    "clickthrough": 0,
                    "enablehscroll": 0,
                    "enablevscroll": 0,
                    "id": "panel",
                    "lockeddragscroll": 0,
                    "lockedsize": 0,
                    "maxclass": "bpatcher",
                    "name": "panel_samples_numeros_01.maxpat",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "offset": [ 0.0, 0.0 ],
                    "outlettype": [ "" ],
                    "patching_rect": [ 536.333333333333, 4546.0, 1180.0, 312.0 ],
                    "presentation": 1,
                    "presentation_rect": [ 12.0, 402.0, 1180.0, 312.0 ],
                    "viewvisibility": 1
                }
            },
            {
                "box": {
                    "id": "monitor",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 536.333333333333, 4874.0, 118.0, 22.0 ],
                    "text": "print panel_orquesta"
                }
            },
            {
                "box": {
                    "id": "route",
                    "maxclass": "newobj",
                    "numinlets": 11,
                    "numoutlets": 11,
                    "outlettype": [ "", "", "", "", "", "", "", "", "", "", "" ],
                    "patching_rect": [ 702.333333333333, 4874.0, 450.0, 22.0 ],
                    "text": "route inicio preset instruccion movimiento fin reiniciar pausa continuar stop sample"
                }
            },
            {
                "box": {
                    "fontsize": 36.0,
                    "id": "obj-289",
                    "maxclass": "number",
                    "numinlets": 1,
                    "numoutlets": 2,
                    "outlettype": [ "", "bang" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 1375.9666666666676, 246.33333333333337, 89.0, 49.0 ],
                    "presentation": 1,
                    "presentation_rect": [ 458.0, 66.0, 89.0, 49.0 ]
                }
            },
            {
                "box": {
                    "id": "obj-287",
                    "maxclass": "newobj",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 1375.9666666666676, 206.33333333333337, 55.0, 22.0 ],
                    "text": "r presets"
                }
            },
            {
                "box": {
                    "id": "obj-280",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 762.6666666666665, 5238.75, 50.0, 22.0 ]
                }
            },
            {
                "box": {
                    "id": "obj-275",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 730.333333333333, 4254.0, 134.0, 22.0 ],
                    "text": "partitura laptop_09.json"
                }
            },
            {
                "box": {
                    "id": "obj-276",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 754.333333333333, 4228.0, 134.0, 22.0 ],
                    "text": "partitura laptop_10.json"
                }
            },
            {
                "box": {
                    "id": "obj-268",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 688.333333333333, 4308.0, 134.0, 22.0 ],
                    "text": "partitura laptop_07.json"
                }
            },
            {
                "box": {
                    "id": "obj-269",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 710.333333333333, 4280.0, 134.0, 22.0 ],
                    "text": "partitura laptop_08.json"
                }
            },
            {
                "box": {
                    "id": "obj-270",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 634.333333333333, 4358.0, 134.0, 22.0 ],
                    "text": "partitura laptop_05.json"
                }
            },
            {
                "box": {
                    "id": "obj-271",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 662.333333333333, 4332.0, 134.0, 22.0 ],
                    "text": "partitura laptop_06.json"
                }
            },
            {
                "box": {
                    "id": "obj-266",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 590.333333333333, 4412.0, 134.0, 22.0 ],
                    "text": "partitura laptop_03.json"
                }
            },
            {
                "box": {
                    "id": "obj-267",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 612.333333333333, 4386.0, 134.0, 22.0 ],
                    "text": "partitura laptop_04.json"
                }
            },
            {
                "box": {
                    "id": "obj-238",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 536.333333333333, 4464.0, 134.0, 22.0 ],
                    "text": "partitura laptop_01.json"
                }
            },
            {
                "box": {
                    "id": "obj-169",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 564.333333333333, 4436.0, 134.0, 22.0 ],
                    "text": "partitura laptop_02.json"
                }
            },
            {
                "box": {
                    "id": "obj-15",
                    "maxclass": "newobj",
                    "numinlets": 11,
                    "numoutlets": 11,
                    "outlettype": [ "bang", "bang", "bang", "bang", "bang", "bang", "bang", "bang", "bang", "bang", "" ],
                    "patching_rect": [ 560.333333333333, 4150.0, 124.0, 22.0 ],
                    "text": "sel 0 1 2 3 4 5 6 7 8 9"
                }
            },
            {
                "box": {
                    "id": "obj-11",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 434.33333333333303, 4160.0, 50.0, 22.0 ],
                    "text": "1"
                }
            },
            {
                "box": {
                    "fontsize": 20.0,
                    "id": "obj-1",
                    "items": [ "Laptop", 1, ",", "Laptop", 2, ",", "Laptop", 3, ",", "Laptop", 4, ",", "Laptop", 5, ",", "Laptop", 6, ",", "Laptop", 7, ",", "Laptop", 8, ",", "Laptop", 9, ",", "Laptop", 10 ],
                    "maxclass": "umenu",
                    "numinlets": 1,
                    "numoutlets": 3,
                    "outlettype": [ "int", "", "" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 560.333333333333, 4082.0, 148.0, 31.0 ],
                    "presentation": 1,
                    "presentation_rect": [ 274.0, 357.0, 134.0, 31.0 ]
                }
            },
            {
                "box": {
                    "id": "obj-364",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 1150.833333333333, 1720.0, 29.5, 22.0 ],
                    "text": "2"
                }
            },
            {
                "box": {
                    "id": "obj-362",
                    "maxclass": "newobj",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "bang" ],
                    "patching_rect": [ 1150.833333333333, 1690.0, 67.0, 22.0 ],
                    "text": "delay 4300"
                }
            },
            {
                "box": {
                    "id": "obj-360",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 1226.833333333333, 1720.0, 29.5, 22.0 ],
                    "text": "2"
                }
            },
            {
                "box": {
                    "id": "obj-359",
                    "maxclass": "newobj",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "bang" ],
                    "patching_rect": [ 1226.833333333333, 1690.0, 67.0, 22.0 ],
                    "text": "delay 2800"
                }
            },
            {
                "box": {
                    "id": "obj-357",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 1308.833333333333, 1684.0, 29.5, 22.0 ],
                    "text": "2"
                }
            },
            {
                "box": {
                    "id": "obj-355",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 1102.833333333333, 1664.0, 29.5, 22.0 ],
                    "text": "1"
                }
            },
            {
                "box": {
                    "id": "obj-352",
                    "linecount": 7,
                    "maxclass": "comment",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 1278.833333333333, 1558.0, 150.0, 100.0 ],
                    "text": "1=1\n2=1\n3=1\n4=1\n5=2\n6=2\n7=2"
                }
            },
            {
                "box": {
                    "id": "obj-342",
                    "maxclass": "newobj",
                    "numinlets": 3,
                    "numoutlets": 3,
                    "outlettype": [ "bang", "bang", "" ],
                    "patching_rect": [ 1102.833333333333, 1632.0, 44.0, 22.0 ],
                    "text": "sel 1 2"
                }
            },
            {
                "box": {
                    "id": "obj-331",
                    "maxclass": "number",
                    "numinlets": 1,
                    "numoutlets": 2,
                    "outlettype": [ "", "bang" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 1102.833333333333, 1522.0, 50.0, 22.0 ]
                }
            },
            {
                "box": {
                    "id": "obj-329",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 3,
                    "outlettype": [ "", "int", "int" ],
                    "patching_rect": [ 1102.833333333333, 1592.0, 48.0, 22.0 ],
                    "text": "change"
                }
            },
            {
                "box": {
                    "id": "obj-327",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 584.9166666666666, 722.3880597014924, 29.5, 22.0 ],
                    "text": "0.4"
                }
            },
            {
                "box": {
                    "id": "obj-317",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 524.4166666666667, 716.0, 29.5, 22.0 ],
                    "text": "0.2"
                }
            },
            {
                "box": {
                    "id": "obj-316",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 468.65671641791045, 707.9999999999999, 29.5, 22.0 ],
                    "text": "0"
                }
            },
            {
                "box": {
                    "format": 6,
                    "id": "obj-314",
                    "maxclass": "flonum",
                    "numinlets": 1,
                    "numoutlets": 2,
                    "outlettype": [ "", "bang" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 357.0, 722.3880597014925, 50.0, 22.0 ]
                }
            },
            {
                "box": {
                    "id": "obj-261",
                    "maxclass": "number",
                    "numinlets": 1,
                    "numoutlets": 2,
                    "outlettype": [ "", "bang" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 220.89552238805967, 728.3582089552239, 50.0, 22.0 ]
                }
            },
            {
                "box": {
                    "id": "obj-237",
                    "maxclass": "toggle",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "int" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 233.89552238805967, 686.5671641791045, 24.0, 24.0 ]
                }
            },
            {
                "box": {
                    "format": 6,
                    "id": "obj-223",
                    "maxclass": "flonum",
                    "numinlets": 1,
                    "numoutlets": 2,
                    "outlettype": [ "", "bang" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 574.6666666666666, 1090.6666666666667, 50.0, 22.0 ]
                }
            },
            {
                "box": {
                    "annotation": "## Kaleidoscope-like video image folding ##",
                    "bgmode": 1,
                    "border": 0,
                    "clickthrough": 0,
                    "enablehscroll": 0,
                    "enablevscroll": 0,
                    "id": "obj-218",
                    "lockeddragscroll": 0,
                    "lockedsize": 0,
                    "maxclass": "bpatcher",
                    "name": "vz.kaleidr.maxpat",
                    "numinlets": 5,
                    "numoutlets": 1,
                    "offset": [ 0.0, 0.0 ],
                    "outlettype": [ "jit_gl_texture" ],
                    "patching_rect": [ 188.0, 764.6666666666665, 188.0, 130.0 ],
                    "prototypename": "pixl",
                    "varname": "kaleidr",
                    "viewvisibility": 1
                }
            },
            {
                "box": {
                    "id": "obj-166",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 1081.3333333333333, 776.0, 29.5, 22.0 ],
                    "text": "7"
                }
            },
            {
                "box": {
                    "id": "obj-167",
                    "maxclass": "newobj",
                    "numinlets": 2,
                    "numoutlets": 2,
                    "outlettype": [ "bang", "" ],
                    "patching_rect": [ 1081.3333333333333, 744.0, 34.0, 22.0 ],
                    "text": "sel 1"
                }
            },
            {
                "box": {
                    "id": "obj-168",
                    "maxclass": "newobj",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 1081.3333333333333, 716.0, 42.0, 22.0 ],
                    "text": "r Tog7"
                }
            },
            {
                "box": {
                    "id": "obj-124",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 1028.0, 776.0, 29.5, 22.0 ],
                    "text": "6"
                }
            },
            {
                "box": {
                    "id": "obj-128",
                    "maxclass": "newobj",
                    "numinlets": 2,
                    "numoutlets": 2,
                    "outlettype": [ "bang", "" ],
                    "patching_rect": [ 1028.0, 744.0, 34.0, 22.0 ],
                    "text": "sel 1"
                }
            },
            {
                "box": {
                    "id": "obj-130",
                    "maxclass": "newobj",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 1028.0, 716.0, 42.0, 22.0 ],
                    "text": "r Tog6"
                }
            },
            {
                "box": {
                    "id": "obj-109",
                    "maxclass": "number",
                    "numinlets": 1,
                    "numoutlets": 2,
                    "outlettype": [ "", "bang" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 381.3333333333333, 938.6666666666666, 50.0, 22.0 ]
                }
            },
            {
                "box": {
                    "id": "obj-108",
                    "maxclass": "number",
                    "numinlets": 1,
                    "numoutlets": 2,
                    "outlettype": [ "", "bang" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 502.6666666666667, 908.0, 50.0, 22.0 ]
                }
            },
            {
                "box": {
                    "format": 6,
                    "id": "obj-42",
                    "maxclass": "flonum",
                    "numinlets": 1,
                    "numoutlets": 2,
                    "outlettype": [ "", "bang" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 270.6666666666667, 1073.3333333333333, 50.0, 22.0 ]
                }
            },
            {
                "box": {
                    "id": "obj-377",
                    "maxclass": "number",
                    "numinlets": 1,
                    "numoutlets": 2,
                    "outlettype": [ "", "bang" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 1998.833333333333, 1968.0, 50.0, 22.0 ]
                }
            },
            {
                "box": {
                    "id": "obj-369",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 976.0, 777.3333333333334, 29.5, 22.0 ],
                    "text": "5"
                }
            },
            {
                "box": {
                    "id": "obj-367",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 926.6666666666666, 768.0, 29.5, 22.0 ],
                    "text": "4"
                }
            },
            {
                "box": {
                    "id": "obj-368",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 876.0, 768.0, 29.5, 22.0 ],
                    "text": "3"
                }
            },
            {
                "box": {
                    "id": "obj-366",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 826.6666666666666, 768.0, 29.5, 22.0 ],
                    "text": "2"
                }
            },
            {
                "box": {
                    "id": "obj-365",
                    "maxclass": "number",
                    "numinlets": 1,
                    "numoutlets": 2,
                    "outlettype": [ "", "bang" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 822.6666666666666, 818.6666666666666, 50.0, 22.0 ]
                }
            },
            {
                "box": {
                    "id": "obj-363",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 778.6666666666666, 768.0, 29.5, 22.0 ],
                    "text": "1"
                }
            },
            {
                "box": {
                    "id": "obj-361",
                    "maxclass": "newobj",
                    "numinlets": 2,
                    "numoutlets": 2,
                    "outlettype": [ "bang", "" ],
                    "patching_rect": [ 976.0, 744.0, 34.0, 22.0 ],
                    "text": "sel 1"
                }
            },
            {
                "box": {
                    "id": "obj-356",
                    "maxclass": "newobj",
                    "numinlets": 2,
                    "numoutlets": 2,
                    "outlettype": [ "bang", "" ],
                    "patching_rect": [ 826.6666666666666, 736.0, 34.0, 22.0 ],
                    "text": "sel 1"
                }
            },
            {
                "box": {
                    "id": "obj-358",
                    "maxclass": "newobj",
                    "numinlets": 2,
                    "numoutlets": 2,
                    "outlettype": [ "bang", "" ],
                    "patching_rect": [ 778.6666666666666, 736.0, 34.0, 22.0 ],
                    "text": "sel 1"
                }
            },
            {
                "box": {
                    "id": "obj-354",
                    "maxclass": "newobj",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 976.0, 716.0, 42.0, 22.0 ],
                    "text": "r Tog5"
                }
            },
            {
                "box": {
                    "id": "obj-336",
                    "maxclass": "newobj",
                    "numinlets": 2,
                    "numoutlets": 2,
                    "outlettype": [ "bang", "" ],
                    "patching_rect": [ 926.6666666666666, 736.0, 34.0, 22.0 ],
                    "text": "sel 1"
                }
            },
            {
                "box": {
                    "id": "obj-338",
                    "maxclass": "newobj",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 926.6666666666666, 708.0, 42.0, 22.0 ],
                    "text": "r Tog4"
                }
            },
            {
                "box": {
                    "id": "obj-339",
                    "maxclass": "newobj",
                    "numinlets": 2,
                    "numoutlets": 2,
                    "outlettype": [ "bang", "" ],
                    "patching_rect": [ 876.0, 736.0, 34.0, 22.0 ],
                    "text": "sel 1"
                }
            },
            {
                "box": {
                    "id": "obj-340",
                    "maxclass": "newobj",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 876.0, 708.0, 42.0, 22.0 ],
                    "text": "r Tog3"
                }
            },
            {
                "box": {
                    "id": "obj-341",
                    "maxclass": "newobj",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 826.6666666666666, 708.0, 42.0, 22.0 ],
                    "text": "r Tog2"
                }
            },
            {
                "box": {
                    "id": "obj-344",
                    "maxclass": "newobj",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 778.6666666666666, 708.0, 42.0, 22.0 ],
                    "text": "r Tog1"
                }
            },
            {
                "box": {
                    "attr": "active",
                    "id": "obj-326",
                    "maxclass": "attrui",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 782.833333333333, 2532.0, 150.0, 22.0 ]
                }
            },
            {
                "box": {
                    "attr": "active",
                    "id": "obj-325",
                    "maxclass": "attrui",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 1170.833333333333, 3024.0, 150.0, 22.0 ]
                }
            },
            {
                "box": {
                    "id": "obj-318",
                    "maxclass": "preset",
                    "numinlets": 1,
                    "numoutlets": 5,
                    "outlettype": [ "preset", "int", "preset", "int", "" ],
                    "patching_rect": [ 822.6666666666666, 860.0, 111.0, 17.0 ],
                    "preset_data": [
                        {
                            "number": 1,
                            "data": [ 5, "obj-343", "attrui", "attr", "active", 5, "obj-343", "attrui", "int", 0, 5, "obj-377", "number", "int", 1, 5, "obj-164", "attrui", "attr", "active", 5, "obj-164", "attrui", "int", 0, 5, "obj-325", "attrui", "attr", "active", 5, "obj-325", "attrui", "int", 1, 5, "obj-331", "number", "int", 1, 5, "obj-58", "number", "int", 75, 5, "obj-165", "toggle", "int", 1, 5, "obj-326", "attrui", "attr", "active", 5, "obj-326", "attrui", "int", 1, 5, "obj-223", "number", "float", 0.014999999664723873, 5, "obj-108", "number", "int", 0, 5, "obj-109", "number", "int", 0, 5, "obj-314", "number", "float", 0.4000000059604645, 5, "obj-42", "number", "float", 0.0, 5, "obj-261", "number", "int", 1 ]
                        },
                        {
                            "number": 2,
                            "data": [ 5, "obj-343", "attrui", "attr", "active", 5, "obj-343", "attrui", "int", 0, 5, "obj-377", "number", "int", 1, 5, "obj-164", "attrui", "attr", "active", 5, "obj-164", "attrui", "int", 0, 5, "obj-325", "attrui", "attr", "active", 5, "obj-325", "attrui", "int", 0, 5, "obj-331", "number", "int", 1, 5, "obj-58", "number", "int", 75, 5, "obj-165", "toggle", "int", 0, 5, "obj-326", "attrui", "attr", "active", 5, "obj-326", "attrui", "int", 1, 5, "obj-223", "number", "float", 0.014999999664723873, 5, "obj-108", "number", "int", 0, 5, "obj-109", "number", "int", 0, 5, "obj-314", "number", "float", 0.0, 5, "obj-42", "number", "float", 0.25, 5, "obj-261", "number", "int", 0 ]
                        },
                        {
                            "number": 3,
                            "data": [ 5, "obj-343", "attrui", "attr", "active", 5, "obj-343", "attrui", "int", 0, 5, "obj-377", "number", "int", 1, 5, "obj-164", "attrui", "attr", "active", 5, "obj-164", "attrui", "int", 1, 5, "obj-325", "attrui", "attr", "active", 5, "obj-325", "attrui", "int", 0, 5, "obj-331", "number", "int", 1, 5, "obj-58", "number", "int", 0, 5, "obj-165", "toggle", "int", 1, 5, "obj-326", "attrui", "attr", "active", 5, "obj-326", "attrui", "int", 1, 5, "obj-223", "number", "float", 0.14000000059604645, 5, "obj-108", "number", "int", 1, 5, "obj-109", "number", "int", 1, 5, "obj-314", "number", "float", 0.4000000059604645, 5, "obj-42", "number", "float", 0.25, 5, "obj-261", "number", "int", 1 ]
                        },
                        {
                            "number": 4,
                            "data": [ 5, "obj-343", "attrui", "attr", "active", 5, "obj-343", "attrui", "int", 1, 5, "obj-377", "number", "int", 2, 5, "obj-164", "attrui", "attr", "active", 5, "obj-164", "attrui", "int", 1, 5, "obj-325", "attrui", "attr", "active", 5, "obj-325", "attrui", "int", 0, 5, "obj-331", "number", "int", 1, 5, "obj-58", "number", "int", 0, 5, "obj-165", "toggle", "int", 1, 5, "obj-326", "attrui", "attr", "active", 5, "obj-326", "attrui", "int", 1, 5, "obj-223", "number", "float", 0.0, 5, "obj-108", "number", "int", 1, 5, "obj-109", "number", "int", 1, 5, "obj-314", "number", "float", 0.20000000298023224, 5, "obj-42", "number", "float", 0.05299999937415123, 5, "obj-261", "number", "int", 1 ]
                        },
                        {
                            "number": 5,
                            "data": [ 5, "obj-343", "attrui", "attr", "active", 5, "obj-343", "attrui", "int", 0, 5, "obj-377", "number", "int", 1, 5, "obj-164", "attrui", "attr", "active", 5, "obj-164", "attrui", "int", 0, 5, "obj-325", "attrui", "attr", "active", 5, "obj-325", "attrui", "int", 1, 5, "obj-331", "number", "int", 2, 5, "obj-58", "number", "int", 75, 5, "obj-165", "toggle", "int", 1, 5, "obj-326", "attrui", "attr", "active", 5, "obj-326", "attrui", "int", 0, 5, "obj-223", "number", "float", 0.0430000014603138, 5, "obj-108", "number", "int", 0, 5, "obj-109", "number", "int", 0, 5, "obj-314", "number", "float", 0.4000000059604645, 5, "obj-42", "number", "float", 0.4099999964237213, 5, "obj-261", "number", "int", 1 ]
                        },
                        {
                            "number": 6,
                            "data": [ 5, "obj-343", "attrui", "attr", "active", 5, "obj-343", "attrui", "int", 1, 5, "obj-377", "number", "int", 2, 5, "obj-164", "attrui", "attr", "active", 5, "obj-164", "attrui", "int", 1, 5, "obj-325", "attrui", "attr", "active", 5, "obj-325", "attrui", "int", 1, 5, "obj-331", "number", "int", 2, 5, "obj-58", "number", "int", 75, 5, "obj-165", "toggle", "int", 1, 5, "obj-326", "attrui", "attr", "active", 5, "obj-326", "attrui", "int", 0, 5, "obj-223", "number", "float", 0.014999999664723873, 5, "obj-108", "number", "int", 0, 5, "obj-109", "number", "int", 0, 5, "obj-314", "number", "float", 0.0, 5, "obj-42", "number", "float", 0.4099999964237213, 5, "obj-261", "number", "int", 0 ]
                        },
                        {
                            "number": 7,
                            "data": [ 5, "obj-343", "attrui", "attr", "active", 5, "obj-343", "attrui", "int", 1, 5, "obj-377", "number", "int", 2, 5, "obj-164", "attrui", "attr", "active", 5, "obj-164", "attrui", "int", 0, 5, "obj-325", "attrui", "attr", "active", 5, "obj-325", "attrui", "int", 0, 5, "obj-331", "number", "int", 2, 5, "obj-58", "number", "int", 6, 5, "obj-165", "toggle", "int", 0, 5, "obj-326", "attrui", "attr", "active", 5, "obj-326", "attrui", "int", 0, 5, "obj-223", "number", "float", 0.014999999664723873, 5, "obj-108", "number", "int", 1, 5, "obj-109", "number", "int", 1, 5, "obj-314", "number", "float", 0.4000000059604645, 5, "obj-42", "number", "float", 0.10499999672174454, 5, "obj-261", "number", "int", 1 ]
                        }
                    ]
                }
            },
            {
                "box": {
                    "id": "obj-346",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 2070.833333333333, 2020.0, 29.5, 22.0 ],
                    "text": "0"
                }
            },
            {
                "box": {
                    "id": "obj-345",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 2110.833333333333, 2020.0, 29.5, 22.0 ],
                    "text": "1"
                }
            },
            {
                "box": {
                    "attr": "active",
                    "id": "obj-343",
                    "maxclass": "attrui",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 2070.833333333333, 2064.0, 150.0, 22.0 ]
                }
            },
            {
                "box": {
                    "autosave": 1,
                    "bgmode": 1,
                    "border": 0,
                    "clickthrough": 0,
                    "enablehscroll": 0,
                    "enablevscroll": 0,
                    "id": "obj-337",
                    "lockeddragscroll": 0,
                    "lockedsize": 0,
                    "maxclass": "newobj",
                    "numinlets": 3,
                    "numoutlets": 4,
                    "offset": [ 0.0, 0.0 ],
                    "outlettype": [ "signal", "signal", "", "" ],
                    "patching_rect": [ 1762.833333333333, 2128.0, 555.0, 196.0 ],
                    "saved_attribute_attributes": {
                        "valueof": {
                            "parameter_invisible": 1,
                            "parameter_longname": "amxd~[7]",
                            "parameter_modmode": 0,
                            "parameter_shortname": "amxd~[3]",
                            "parameter_type": 3
                        }
                    },
                    "saved_object_attributes": {
                        "active": 0,
                        "parameter_enable": 1,
                        "patchername": "Max Compressor.amxd",
                        "patchername_fallback": "Package:/Max for Live/patchers/Max Audio Effect/Max Compressor/Max Compressor.amxd"
                    },
                    "snapshot": {
                        "filetype": "C74Snapshot",
                        "version": 2,
                        "minorversion": 0,
                        "name": "snapshotlist",
                        "origin": "max~",
                        "type": "list",
                        "subtype": "Undefined",
                        "embed": 1,
                        "snapshot": {
                            "name": "Max Compressor.amxd",
                            "origname": "Package:/Max for Live/patchers/Max Audio Effect/Max Compressor/Max Compressor.amxd",
                            "valuedictionary": {
                                "parameter_values": {
                                    "AGC": 1.0,
                                    "Attack": 133.0,
                                    "Bypass": 0.0,
                                    "ChannelCoupling": 0.0,
                                    "Delay": 23.0,
                                    "DownExpandEnable": 1.0,
                                    "DownExpandThresh": -45.0,
                                    "DualBand": 0.0,
                                    "Gain": 0.0,
                                    "LevelDetectFreeze": -54.0,
                                    "LevelDetectGating": -36.0,
                                    "Limiter": 1.0,
                                    "Meters": 0.0,
                                    "MetersRate": 25.0,
                                    "Mode": 0.0,
                                    "ProgressiveRelease": 50.0,
                                    "Range": 20.0,
                                    "Ratio": 100.0,
                                    "Release": 111.0,
                                    "SideChainFilter": 0.0,
                                    "SmoothGain": 65.0,
                                    "Thresh": -10.0
                                }
                            },
                            "active": 0
                        },
                        "snapshotlist": {
                            "current_snapshot": 0,
                            "entries": [
                                {
                                    "filetype": "C74Snapshot",
                                    "version": 2,
                                    "minorversion": 0,
                                    "name": "Max Compressor.amxd",
                                    "origin": "Max Compressor.amxd",
                                    "type": "amxd",
                                    "subtype": "Undefined",
                                    "embed": 0,
                                    "snapshot": {
                                        "name": "Max Compressor.amxd",
                                        "origname": "Package:/Max for Live/patchers/Max Audio Effect/Max Compressor/Max Compressor.amxd",
                                        "valuedictionary": {
                                            "parameter_values": {
                                                "AGC": 1.0,
                                                "Attack": 133.0,
                                                "Bypass": 0.0,
                                                "ChannelCoupling": 0.0,
                                                "Delay": 23.0,
                                                "DownExpandEnable": 1.0,
                                                "DownExpandThresh": -45.0,
                                                "DualBand": 0.0,
                                                "Gain": 0.0,
                                                "LevelDetectFreeze": -54.0,
                                                "LevelDetectGating": -36.0,
                                                "Limiter": 1.0,
                                                "Meters": 0.0,
                                                "MetersRate": 25.0,
                                                "Mode": 0.0,
                                                "ProgressiveRelease": 50.0,
                                                "Range": 20.0,
                                                "Ratio": 100.0,
                                                "Release": 111.0,
                                                "SideChainFilter": 0.0,
                                                "SmoothGain": 65.0,
                                                "Thresh": -10.0
                                            }
                                        },
                                        "active": 0
                                    },
                                    "fileref": {
                                        "name": "Max Compressor.amxd",
                                        "filename": "Max Compressor.amxd.maxsnap",
                                        "filepath": "~/Documents/Max 9/Snapshots",
                                        "filepos": -1,
                                        "snapshotfileid": "99b50c3746882144f5ffbc720f5c3d03"
                                    }
                                }
                            ]
                        }
                    },
                    "text": "amxd~ \"Package:/Max for Live/patchers/Max Audio Effect/Max Compressor/Max Compressor.amxd\"",
                    "varname": "amxd~[7]",
                    "viewvisibility": 1
                }
            },
            {
                "box": {
                    "clipheight": 33.0,
                    "data": {
                        "clips": [
                            {
                                "absolutepath": "Planet Cave Ambience 01.wav",
                                "filename": "Planet Cave Ambience 01.wav",
                                "filekind": "audiofile",
                                "id": "u447010972",
                                "loop": 1,
                                "content_state": {
                                    "loop": 1,
                                    "speed": 0.9394866191948785
                                }
                            },
                            {
                                "absolutepath": "Silicium.wav",
                                "filename": "Silicium.wav",
                                "filekind": "audiofile",
                                "id": "u925009065",
                                "loop": 1,
                                "content_state": {
                                    "speed": 0.9394866191948785,
                                    "loop": 1
                                }
                            }
                        ]
                    },
                    "id": "obj-324",
                    "maxclass": "playlist~",
                    "mode": "basic",
                    "numinlets": 1,
                    "numoutlets": 5,
                    "outlettype": [ "signal", "signal", "signal", "", "dictionary" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 1754.833333333333, 2020.0, 264.0, 68.0 ],
                    "quality": "basic",
                    "saved_attribute_attributes": {
                        "candicane2": {
                            "expression": ""
                        },
                        "candicane3": {
                            "expression": ""
                        },
                        "candicane4": {
                            "expression": ""
                        },
                        "candicane5": {
                            "expression": ""
                        },
                        "candicane6": {
                            "expression": ""
                        },
                        "candicane7": {
                            "expression": ""
                        },
                        "candicane8": {
                            "expression": ""
                        }
                    }
                }
            },
            {
                "box": {
                    "id": "obj-129",
                    "maxclass": "gswitch",
                    "numinlets": 3,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 440.0, 933.3333333333334, 41.0, 32.0 ]
                }
            },
            {
                "box": {
                    "id": "obj-127",
                    "maxclass": "gswitch",
                    "numinlets": 3,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 518.6666666666666, 938.6666666666666, 41.0, 32.0 ]
                }
            },
            {
                "box": {
                    "id": "obj-126",
                    "maxclass": "newobj",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "float" ],
                    "patching_rect": [ 618.6666666666666, 893.3333333333334, 29.5, 22.0 ],
                    "text": "* 3."
                }
            },
            {
                "box": {
                    "id": "obj-115",
                    "maxclass": "newobj",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 618.6666666666666, 857.3333333333334, 49.0, 22.0 ],
                    "text": "r AmpR"
                }
            },
            {
                "box": {
                    "id": "obj-125",
                    "maxclass": "newobj",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 465.3333333333333, 857.3333333333334, 47.0, 22.0 ],
                    "text": "r AmpL"
                }
            },
            {
                "box": {
                    "id": "obj-60",
                    "maxclass": "newobj",
                    "numinlets": 3,
                    "numoutlets": 1,
                    "outlettype": [ "float" ],
                    "patching_rect": [ 1030.833333333333, 3956.0, 60.0, 22.0 ],
                    "text": "slide 3 20"
                }
            },
            {
                "box": {
                    "fontname": "Arial",
                    "fontsize": 13.0,
                    "format": 6,
                    "id": "obj-89",
                    "maxclass": "flonum",
                    "numinlets": 1,
                    "numoutlets": 2,
                    "outlettype": [ "", "bang" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 1030.833333333333, 3924.0, 54.0, 23.0 ]
                }
            },
            {
                "box": {
                    "fontname": "Arial",
                    "fontsize": 13.0,
                    "id": "obj-105",
                    "maxclass": "newobj",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "float" ],
                    "patching_rect": [ 1030.833333333333, 3888.0, 88.0, 23.0 ],
                    "text": "peakamp~ 33"
                }
            },
            {
                "box": {
                    "id": "obj-29",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 916.833333333333, 3198.0, 51.0, 22.0 ],
                    "text": "s AmpR"
                }
            },
            {
                "box": {
                    "id": "obj-26",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 838.833333333333, 3938.0, 49.0, 22.0 ],
                    "text": "s AmpL"
                }
            },
            {
                "box": {
                    "id": "obj-20",
                    "maxclass": "newobj",
                    "numinlets": 3,
                    "numoutlets": 1,
                    "outlettype": [ "float" ],
                    "patching_rect": [ 838.833333333333, 3908.0, 60.0, 22.0 ],
                    "text": "slide 3 20"
                }
            },
            {
                "box": {
                    "fontname": "Arial",
                    "fontsize": 13.0,
                    "format": 6,
                    "id": "obj-21",
                    "maxclass": "flonum",
                    "numinlets": 1,
                    "numoutlets": 2,
                    "outlettype": [ "", "bang" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 838.833333333333, 3876.0, 54.0, 23.0 ]
                }
            },
            {
                "box": {
                    "fontname": "Arial",
                    "fontsize": 13.0,
                    "id": "obj-23",
                    "maxclass": "newobj",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "float" ],
                    "patching_rect": [ 838.833333333333, 3844.0, 88.0, 23.0 ],
                    "text": "peakamp~ 33"
                }
            },
            {
                "box": {
                    "id": "obj-263",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 1938.833333333333, 1924.0, 29.5, 22.0 ],
                    "text": "0"
                }
            },
            {
                "box": {
                    "id": "obj-258",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 1378.833333333333, 1904.0, 29.5, 22.0 ],
                    "text": "1"
                }
            },
            {
                "box": {
                    "id": "obj-260",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 1410.833333333333, 1904.0, 29.5, 22.0 ],
                    "text": "0"
                }
            },
            {
                "box": {
                    "id": "obj-257",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 902.833333333333, 1912.0, 29.5, 22.0 ],
                    "text": "1"
                }
            },
            {
                "box": {
                    "id": "obj-256",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 934.833333333333, 1912.0, 29.5, 22.0 ],
                    "text": "0"
                }
            },
            {
                "box": {
                    "id": "obj-255",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 458.83333333333303, 1912.0, 29.5, 22.0 ],
                    "text": "0"
                }
            },
            {
                "box": {
                    "id": "obj-235",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 426.83333333333303, 1912.0, 29.5, 22.0 ],
                    "text": "1"
                }
            },
            {
                "box": {
                    "id": "obj-227",
                    "maxclass": "newobj",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "bang" ],
                    "patching_rect": [ 610.833333333333, 1848.0, 67.0, 22.0 ],
                    "text": "delay 2800"
                }
            },
            {
                "box": {
                    "id": "obj-225",
                    "maxclass": "newobj",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "bang" ],
                    "patching_rect": [ 526.833333333333, 1848.0, 67.0, 22.0 ],
                    "text": "delay 2300"
                }
            },
            {
                "box": {
                    "id": "obj-221",
                    "maxclass": "newobj",
                    "numinlets": 2,
                    "numoutlets": 2,
                    "outlettype": [ "bang", "" ],
                    "patching_rect": [ 458.83333333333303, 1816.0, 34.0, 22.0 ],
                    "text": "sel 1"
                }
            },
            {
                "box": {
                    "fontsize": 30.0,
                    "id": "obj-208",
                    "maxclass": "comment",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 458.83333333333303, 1760.0, 242.85714285714283, 40.0 ],
                    "text": "Play samples",
                    "textjustification": 1
                }
            },
            {
                "box": {
                    "id": "obj-209",
                    "maxclass": "live.toggle",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "parameter_enable": 1,
                    "patching_rect": [ 458.83333333333303, 1752.0, 257.118918918919, 51.78571428571428 ],
                    "saved_attribute_attributes": {
                        "valueof": {
                            "parameter_enum": [ "off", "on" ],
                            "parameter_longname": "live.toggle[12]",
                            "parameter_mmax": 1,
                            "parameter_modmode": 0,
                            "parameter_shortname": "live.toggle",
                            "parameter_type": 2
                        }
                    },
                    "varname": "live.toggle[9]"
                }
            },
            {
                "box": {
                    "attr": "active",
                    "id": "obj-164",
                    "maxclass": "attrui",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 1242.833333333333, 3236.0, 150.0, 22.0 ]
                }
            },
            {
                "box": {
                    "autosave": 1,
                    "bgmode": 1,
                    "border": 0,
                    "clickthrough": 0,
                    "enablehscroll": 0,
                    "enablevscroll": 0,
                    "id": "obj-132",
                    "lockeddragscroll": 0,
                    "lockedsize": 0,
                    "maxclass": "newobj",
                    "numinlets": 3,
                    "numoutlets": 4,
                    "offset": [ 0.0, 0.0 ],
                    "outlettype": [ "signal", "signal", "", "" ],
                    "patching_rect": [ 826.833333333333, 3316.0, 599.0, 196.0 ],
                    "saved_attribute_attributes": {
                        "valueof": {
                            "parameter_invisible": 1,
                            "parameter_longname": "amxd~[5]",
                            "parameter_modmode": 0,
                            "parameter_shortname": "amxd~[5]",
                            "parameter_type": 3
                        }
                    },
                    "saved_object_attributes": {
                        "active": 0,
                        "parameter_enable": 1,
                        "patchername": "Max DelayTaps.amxd",
                        "patchername_fallback": "Package:/Max for Live/patchers/Max Audio Effect/Max DelayTaps/Max DelayTaps.amxd"
                    },
                    "snapshot": {
                        "filetype": "C74Snapshot",
                        "version": 2,
                        "minorversion": 0,
                        "name": "snapshotlist",
                        "origin": "max~",
                        "type": "list",
                        "subtype": "Undefined",
                        "embed": 1,
                        "snapshot": {
                            "name": "Max DelayTaps.amxd",
                            "origname": "Package:/Max for Live/patchers/Max Audio Effect/Max DelayTaps/Max DelayTaps.amxd",
                            "valuedictionary": {
                                "parameter_values": {
                                    "DelaysMax": 1578.0215743127414,
                                    "DelaysMin": 0.0,
                                    "Dry/Wet": 67.32283464566927,
                                    "Feedback": 39.86614173228347,
                                    "LevelsMax": 100.0,
                                    "LevelsMin": 6.299212598425194,
                                    "MasterGain": 3.5,
                                    "PansMax": 50.0,
                                    "PansMin": -50.0,
                                    "blob": {
                                        "Taps": [ 13 ],
                                        "Delays": [ -1.0, -0.8333333333333334, -0.6666666666666667, -0.5, -0.33333333333333337, -0.16666666666666674, 0.0, 0.16666666666666652, 0.33333333333333326, 0.5, 0.6666666666666665, 0.8333333333333333, 1.0 ],
                                        "Levels": [ 1.0, 0.8333333333333334, 0.6666666666666667, 0.5, 0.33333333333333337, 0.16666666666666674, 0.0, -0.16666666666666652, -0.33333333333333326, -0.5, -0.6666666666666665, -0.8333333333333333, -1.0 ],
                                        "Pans": [ 1.0, 0.84375, 0.15625, -0.296875, -0.5625, -0.6875, 0.015625, 0.734375, 0.734375, -0.5625, -0.515625, 0.859375, 0.390625 ]
                                    }
                                }
                            },
                            "active": 0
                        },
                        "snapshotlist": {
                            "current_snapshot": 0,
                            "entries": [
                                {
                                    "filetype": "C74Snapshot",
                                    "version": 2,
                                    "minorversion": 0,
                                    "name": "Max DelayTaps.amxd",
                                    "origin": "Max DelayTaps.amxd",
                                    "type": "amxd",
                                    "subtype": "Undefined",
                                    "embed": 0,
                                    "snapshot": {
                                        "name": "Max DelayTaps.amxd",
                                        "origname": "Package:/Max for Live/patchers/Max Audio Effect/Max DelayTaps/Max DelayTaps.amxd",
                                        "valuedictionary": {
                                            "parameter_values": {
                                                "DelaysMax": 1578.0215743127414,
                                                "DelaysMin": 0.0,
                                                "Dry/Wet": 67.32283464566927,
                                                "Feedback": 39.86614173228347,
                                                "LevelsMax": 100.0,
                                                "LevelsMin": 6.299212598425194,
                                                "MasterGain": 3.5,
                                                "PansMax": 50.0,
                                                "PansMin": -50.0,
                                                "blob": {
                                                    "Taps": [ 13 ],
                                                    "Delays": [ -1.0, -0.8333333333333334, -0.6666666666666667, -0.5, -0.33333333333333337, -0.16666666666666674, 0.0, 0.16666666666666652, 0.33333333333333326, 0.5, 0.6666666666666665, 0.8333333333333333, 1.0 ],
                                                    "Levels": [ 1.0, 0.8333333333333334, 0.6666666666666667, 0.5, 0.33333333333333337, 0.16666666666666674, 0.0, -0.16666666666666652, -0.33333333333333326, -0.5, -0.6666666666666665, -0.8333333333333333, -1.0 ],
                                                    "Pans": [ 1.0, 0.84375, 0.15625, -0.296875, -0.5625, -0.6875, 0.015625, 0.734375, 0.734375, -0.5625, -0.515625, 0.859375, 0.390625 ]
                                                }
                                            }
                                        },
                                        "active": 0
                                    },
                                    "fileref": {
                                        "name": "Max DelayTaps.amxd",
                                        "filename": "Max DelayTaps.amxd_20261023.maxsnap",
                                        "filepath": "~/Documents/Max 9/Snapshots",
                                        "filepos": -1,
                                        "snapshotfileid": "27dd7943680190f18825b809c69aa9a7"
                                    }
                                }
                            ]
                        }
                    },
                    "text": "amxd~ \"Package:/Max for Live/patchers/Max Audio Effect/Max DelayTaps/Max DelayTaps.amxd\"",
                    "varname": "amxd~[5]",
                    "viewvisibility": 1
                }
            },
            {
                "box": {
                    "fontface": 1,
                    "fontsize": 30.0,
                    "id": "obj-106",
                    "maxclass": "comment",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 634.833333333333, 3764.0, 140.0, 40.0 ],
                    "presentation": 1,
                    "presentation_rect": [ 147.0, 19.0, 124.0, 40.0 ],
                    "text": "Audio",
                    "textjustification": 1
                }
            },
            {
                "box": {
                    "fontface": 1,
                    "fontsize": 30.0,
                    "id": "obj-104",
                    "maxclass": "comment",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 188.0, 237.33333333333334, 140.0, 40.0 ],
                    "presentation": 1,
                    "presentation_rect": [ 19.0, 19.0, 124.0, 40.0 ],
                    "text": "Render",
                    "textjustification": 1
                }
            },
            {
                "box": {
                    "fontface": 1,
                    "fontsize": 30.0,
                    "id": "obj-103",
                    "maxclass": "comment",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 1467.123287671233, 312.0, 290.6666666666667, 40.0 ],
                    "presentation": 1,
                    "presentation_rect": [ 433.0, 19.0, 145.0, 40.0 ],
                    "text": "Presets",
                    "textjustification": 1
                }
            },
            {
                "box": {
                    "id": "obj-97",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 2516.0, 525.3333333333334, 44.0, 22.0 ],
                    "text": "s Tog9"
                }
            },
            {
                "box": {
                    "id": "obj-99",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 2373.3333333333335, 525.3333333333334, 44.0, 22.0 ],
                    "text": "s Tog8"
                }
            },
            {
                "box": {
                    "id": "obj-94",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 2233.3333333333335, 525.3333333333334, 44.0, 22.0 ],
                    "text": "s Tog7"
                }
            },
            {
                "box": {
                    "id": "obj-95",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 2089.3333333333335, 525.3333333333334, 44.0, 22.0 ],
                    "text": "s Tog6"
                }
            },
            {
                "box": {
                    "id": "obj-96",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 1942.6666666666667, 525.3333333333334, 44.0, 22.0 ],
                    "text": "s Tog5"
                }
            },
            {
                "box": {
                    "id": "obj-92",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 1798.6666666666667, 525.3333333333334, 44.0, 22.0 ],
                    "text": "s Tog4"
                }
            },
            {
                "box": {
                    "id": "obj-93",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 1660.0, 525.3333333333334, 44.0, 22.0 ],
                    "text": "s Tog3"
                }
            },
            {
                "box": {
                    "id": "obj-91",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 1516.0, 525.3333333333334, 44.0, 22.0 ],
                    "text": "s Tog2"
                }
            },
            {
                "box": {
                    "id": "obj-90",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 1374.6666666666667, 525.3333333333334, 44.0, 22.0 ],
                    "text": "s Tog1"
                }
            },
            {
                "box": {
                    "id": "obj-57",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 2550.6666666666665, 421.3333333333333, 29.5, 22.0 ],
                    "text": "0"
                }
            },
            {
                "box": {
                    "id": "obj-61",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 2516.0, 421.3333333333333, 29.5, 22.0 ],
                    "text": "1"
                }
            },
            {
                "box": {
                    "fontsize": 30.0,
                    "id": "obj-63",
                    "maxclass": "comment",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 2521.3333333333335, 468.0, 116.0, 40.0 ],
                    "text": "9",
                    "textjustification": 1
                }
            },
            {
                "box": {
                    "id": "obj-64",
                    "maxclass": "live.toggle",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "parameter_enable": 1,
                    "patching_rect": [ 2516.0, 462.6666666666667, 131.0, 52.0 ],
                    "saved_attribute_attributes": {
                        "valueof": {
                            "parameter_enum": [ "off", "on" ],
                            "parameter_longname": "live.toggle[8]",
                            "parameter_mmax": 1,
                            "parameter_modmode": 0,
                            "parameter_shortname": "live.toggle",
                            "parameter_type": 2
                        }
                    },
                    "varname": "live.toggle[5]"
                }
            },
            {
                "box": {
                    "id": "obj-65",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 2405.3333333333335, 421.3333333333333, 29.5, 22.0 ],
                    "text": "0"
                }
            },
            {
                "box": {
                    "id": "obj-68",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 2370.6666666666665, 421.3333333333333, 29.5, 22.0 ],
                    "text": "1"
                }
            },
            {
                "box": {
                    "fontsize": 30.0,
                    "id": "obj-69",
                    "maxclass": "comment",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 2377.3333333333335, 468.0, 116.0, 40.0 ],
                    "text": "8",
                    "textjustification": 1
                }
            },
            {
                "box": {
                    "id": "obj-70",
                    "maxclass": "live.toggle",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "parameter_enable": 1,
                    "patching_rect": [ 2373.3333333333335, 462.6666666666667, 131.0, 52.0 ],
                    "saved_attribute_attributes": {
                        "valueof": {
                            "parameter_enum": [ "off", "on" ],
                            "parameter_longname": "live.toggle[9]",
                            "parameter_mmax": 1,
                            "parameter_modmode": 0,
                            "parameter_shortname": "live.toggle",
                            "parameter_type": 2
                        }
                    },
                    "varname": "live.toggle[6]"
                }
            },
            {
                "box": {
                    "id": "obj-71",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 2268.0, 418.6666666666667, 29.5, 22.0 ],
                    "text": "0"
                }
            },
            {
                "box": {
                    "id": "obj-77",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 2233.3333333333335, 418.6666666666667, 29.5, 22.0 ],
                    "text": "1"
                }
            },
            {
                "box": {
                    "fontsize": 30.0,
                    "id": "obj-81",
                    "maxclass": "comment",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 2240.0, 466.6666666666667, 116.0, 40.0 ],
                    "text": "7",
                    "textjustification": 1
                }
            },
            {
                "box": {
                    "id": "obj-83",
                    "maxclass": "live.toggle",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "parameter_enable": 1,
                    "patching_rect": [ 2233.3333333333335, 462.6666666666667, 131.0, 52.0 ],
                    "saved_attribute_attributes": {
                        "valueof": {
                            "parameter_enum": [ "off", "on" ],
                            "parameter_longname": "live.toggle[10]",
                            "parameter_mmax": 1,
                            "parameter_modmode": 0,
                            "parameter_shortname": "live.toggle",
                            "parameter_type": 2
                        }
                    },
                    "varname": "live.toggle[7]"
                }
            },
            {
                "box": {
                    "id": "obj-85",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 2124.0, 418.6666666666667, 29.5, 22.0 ],
                    "text": "0"
                }
            },
            {
                "box": {
                    "id": "obj-86",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 2089.3333333333335, 418.6666666666667, 29.5, 22.0 ],
                    "text": "1"
                }
            },
            {
                "box": {
                    "fontsize": 30.0,
                    "id": "obj-87",
                    "maxclass": "comment",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 2094.6666666666665, 466.6666666666667, 116.0, 40.0 ],
                    "text": "6",
                    "textjustification": 1
                }
            },
            {
                "box": {
                    "id": "obj-88",
                    "maxclass": "live.toggle",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "parameter_enable": 1,
                    "patching_rect": [ 2089.3333333333335, 462.6666666666667, 131.0, 52.0 ],
                    "saved_attribute_attributes": {
                        "valueof": {
                            "parameter_enum": [ "off", "on" ],
                            "parameter_longname": "live.toggle[11]",
                            "parameter_mmax": 1,
                            "parameter_modmode": 0,
                            "parameter_shortname": "live.toggle",
                            "parameter_type": 2
                        }
                    },
                    "varname": "live.toggle[8]"
                }
            },
            {
                "box": {
                    "id": "obj-45",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 1977.3333333333333, 417.3333333333333, 29.5, 22.0 ],
                    "text": "0"
                }
            },
            {
                "box": {
                    "id": "obj-46",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 1942.6666666666667, 417.3333333333333, 29.5, 22.0 ],
                    "text": "1"
                }
            },
            {
                "box": {
                    "fontsize": 30.0,
                    "id": "obj-47",
                    "maxclass": "comment",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 1948.0, 466.6666666666667, 116.0, 40.0 ],
                    "text": "5",
                    "textjustification": 1
                }
            },
            {
                "box": {
                    "id": "obj-48",
                    "maxclass": "live.toggle",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "parameter_enable": 1,
                    "patching_rect": [ 1942.6666666666667, 460.0, 131.0, 52.0 ],
                    "saved_attribute_attributes": {
                        "valueof": {
                            "parameter_enum": [ "off", "on" ],
                            "parameter_longname": "live.toggle[6]",
                            "parameter_mmax": 1,
                            "parameter_modmode": 0,
                            "parameter_shortname": "live.toggle",
                            "parameter_type": 2
                        }
                    },
                    "varname": "live.toggle[3]"
                }
            },
            {
                "box": {
                    "id": "obj-49",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 1833.3333333333333, 417.3333333333333, 29.5, 22.0 ],
                    "text": "0"
                }
            },
            {
                "box": {
                    "id": "obj-50",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 1798.6666666666667, 417.3333333333333, 29.5, 22.0 ],
                    "text": "1"
                }
            },
            {
                "box": {
                    "fontsize": 30.0,
                    "id": "obj-51",
                    "maxclass": "comment",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 1805.3333333333333, 466.6666666666667, 116.0, 40.0 ],
                    "text": "4",
                    "textjustification": 1
                }
            },
            {
                "box": {
                    "id": "obj-52",
                    "maxclass": "live.toggle",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "parameter_enable": 1,
                    "patching_rect": [ 1798.6666666666667, 460.0, 131.0, 52.0 ],
                    "saved_attribute_attributes": {
                        "valueof": {
                            "parameter_enum": [ "off", "on" ],
                            "parameter_longname": "live.toggle[7]",
                            "parameter_mmax": 1,
                            "parameter_modmode": 0,
                            "parameter_shortname": "live.toggle",
                            "parameter_type": 2
                        }
                    },
                    "varname": "live.toggle[4]"
                }
            },
            {
                "box": {
                    "id": "obj-37",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 1694.6666666666667, 417.3333333333333, 29.5, 22.0 ],
                    "text": "0"
                }
            },
            {
                "box": {
                    "id": "obj-39",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 1660.0, 417.3333333333333, 29.5, 22.0 ],
                    "text": "1"
                }
            },
            {
                "box": {
                    "fontsize": 30.0,
                    "id": "obj-40",
                    "maxclass": "comment",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 1666.6666666666667, 464.0, 116.0, 40.0 ],
                    "text": "3",
                    "textjustification": 1
                }
            },
            {
                "box": {
                    "id": "obj-44",
                    "maxclass": "live.toggle",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "parameter_enable": 1,
                    "patching_rect": [ 1660.0, 460.0, 131.0, 52.0 ],
                    "saved_attribute_attributes": {
                        "valueof": {
                            "parameter_enum": [ "off", "on" ],
                            "parameter_longname": "live.toggle[5]",
                            "parameter_mmax": 1,
                            "parameter_modmode": 0,
                            "parameter_shortname": "live.toggle",
                            "parameter_type": 2
                        }
                    },
                    "varname": "live.toggle[2]"
                }
            },
            {
                "box": {
                    "id": "obj-34",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 1550.6666666666667, 417.3333333333333, 29.5, 22.0 ],
                    "text": "0"
                }
            },
            {
                "box": {
                    "id": "obj-35",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 1516.0, 417.3333333333333, 29.5, 22.0 ],
                    "text": "1"
                }
            },
            {
                "box": {
                    "fontsize": 30.0,
                    "id": "obj-32",
                    "maxclass": "comment",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 1521.3333333333333, 464.0, 116.0, 40.0 ],
                    "text": "2",
                    "textjustification": 1
                }
            },
            {
                "box": {
                    "id": "obj-33",
                    "maxclass": "live.toggle",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "parameter_enable": 1,
                    "patching_rect": [ 1516.0, 460.0, 131.0, 52.0 ],
                    "saved_attribute_attributes": {
                        "valueof": {
                            "parameter_enum": [ "off", "on" ],
                            "parameter_longname": "live.toggle[4]",
                            "parameter_mmax": 1,
                            "parameter_modmode": 0,
                            "parameter_shortname": "live.toggle",
                            "parameter_type": 2
                        }
                    },
                    "varname": "live.toggle[1]"
                }
            },
            {
                "box": {
                    "id": "obj-30",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 1407.6333333333343, 417.33333333333337, 29.5, 22.0 ],
                    "text": "0"
                }
            },
            {
                "box": {
                    "id": "obj-28",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 1374.6666666666667, 417.3333333333333, 29.5, 22.0 ],
                    "text": "1"
                }
            },
            {
                "box": {
                    "id": "obj-25",
                    "maxclass": "newobj",
                    "numinlets": 10,
                    "numoutlets": 10,
                    "outlettype": [ "bang", "bang", "bang", "bang", "bang", "bang", "bang", "bang", "bang", "" ],
                    "patching_rect": [ 1375.9666666666676, 359.0, 114.0, 22.0 ],
                    "text": "sel 1 2 3 4 5 6 7 8 9"
                }
            },
            {
                "box": {
                    "fontsize": 30.0,
                    "id": "obj-12",
                    "maxclass": "comment",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 1381.3333333333333, 464.0, 116.0, 40.0 ],
                    "text": "1",
                    "textjustification": 1
                }
            },
            {
                "box": {
                    "id": "obj-6",
                    "maxclass": "live.toggle",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "parameter_enable": 1,
                    "patching_rect": [ 1374.6666666666667, 460.0, 131.0, 52.0 ],
                    "saved_attribute_attributes": {
                        "valueof": {
                            "parameter_enum": [ "off", "on" ],
                            "parameter_longname": "live.toggle",
                            "parameter_mmax": 1,
                            "parameter_modmode": 0,
                            "parameter_shortname": "live.toggle",
                            "parameter_type": 2
                        }
                    },
                    "varname": "live.toggle"
                }
            },
            {
                "box": {
                    "id": "obj-13",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 574.6666666666666, 1060.0, 93.0, 22.0 ],
                    "text": "loadmess 0.015"
                }
            },
            {
                "box": {
                    "id": "obj-41",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 710.6666666666666, 913.3333333333334, 70.0, 22.0 ],
                    "text": "loadmess 1"
                }
            },
            {
                "box": {
                    "id": "obj-36",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 818.6666666666666, 908.0, 80.0, 22.0 ],
                    "text": "loadmess 0.7"
                }
            },
            {
                "box": {
                    "id": "obj-31",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 270.6666666666667, 1037.3333333333333, 87.0, 22.0 ],
                    "text": "loadmess 0.25"
                }
            },
            {
                "box": {
                    "autosave": 1,
                    "bgmode": 1,
                    "border": 0,
                    "clickthrough": 0,
                    "enablehscroll": 0,
                    "enablevscroll": 0,
                    "id": "obj-3",
                    "lockeddragscroll": 0,
                    "lockedsize": 0,
                    "maxclass": "newobj",
                    "numinlets": 3,
                    "numoutlets": 4,
                    "offset": [ 0.0, 0.0 ],
                    "outlettype": [ "signal", "signal", "", "" ],
                    "patching_rect": [ 598.833333333333, 3060.0, 555.0, 196.0 ],
                    "saved_attribute_attributes": {
                        "valueof": {
                            "parameter_invisible": 1,
                            "parameter_longname": "amxd~[4]",
                            "parameter_modmode": 0,
                            "parameter_shortname": "amxd~[3]",
                            "parameter_type": 3
                        }
                    },
                    "saved_object_attributes": {
                        "active": 0,
                        "parameter_enable": 1,
                        "patchername": "Max Compressor.amxd",
                        "patchername_fallback": "Package:/Max for Live/patchers/Max Audio Effect/Max Compressor/Max Compressor.amxd"
                    },
                    "snapshot": {
                        "filetype": "C74Snapshot",
                        "version": 2,
                        "minorversion": 0,
                        "name": "snapshotlist",
                        "origin": "max~",
                        "type": "list",
                        "subtype": "Undefined",
                        "embed": 1,
                        "snapshot": {
                            "name": "Max Compressor.amxd",
                            "origname": "Package:/Max for Live/patchers/Max Audio Effect/Max Compressor/Max Compressor.amxd",
                            "valuedictionary": {
                                "parameter_values": {
                                    "AGC": 1.0,
                                    "Attack": 133.0,
                                    "Bypass": 0.0,
                                    "ChannelCoupling": 0.0,
                                    "Delay": 23.0,
                                    "DownExpandEnable": 1.0,
                                    "DownExpandThresh": -45.0,
                                    "DualBand": 0.0,
                                    "Gain": -5.511811023622042,
                                    "LevelDetectFreeze": -54.0,
                                    "LevelDetectGating": -36.0,
                                    "Limiter": 1.0,
                                    "Meters": 0.0,
                                    "MetersRate": 25.0,
                                    "Mode": 0.0,
                                    "ProgressiveRelease": 50.0,
                                    "Range": 20.0,
                                    "Ratio": 100.0,
                                    "Release": 111.0,
                                    "SideChainFilter": 0.0,
                                    "SmoothGain": 65.0,
                                    "Thresh": -10.0
                                }
                            },
                            "active": 0
                        },
                        "snapshotlist": {
                            "current_snapshot": 0,
                            "entries": [
                                {
                                    "filetype": "C74Snapshot",
                                    "version": 2,
                                    "minorversion": 0,
                                    "name": "Max Compressor.amxd",
                                    "origin": "Max Compressor.amxd",
                                    "type": "amxd",
                                    "subtype": "Undefined",
                                    "embed": 0,
                                    "snapshot": {
                                        "name": "Max Compressor.amxd",
                                        "origname": "Package:/Max for Live/patchers/Max Audio Effect/Max Compressor/Max Compressor.amxd",
                                        "valuedictionary": {
                                            "parameter_values": {
                                                "AGC": 1.0,
                                                "Attack": 133.0,
                                                "Bypass": 0.0,
                                                "ChannelCoupling": 0.0,
                                                "Delay": 23.0,
                                                "DownExpandEnable": 1.0,
                                                "DownExpandThresh": -45.0,
                                                "DualBand": 0.0,
                                                "Gain": -5.511811023622042,
                                                "LevelDetectFreeze": -54.0,
                                                "LevelDetectGating": -36.0,
                                                "Limiter": 1.0,
                                                "Meters": 0.0,
                                                "MetersRate": 25.0,
                                                "Mode": 0.0,
                                                "ProgressiveRelease": 50.0,
                                                "Range": 20.0,
                                                "Ratio": 100.0,
                                                "Release": 111.0,
                                                "SideChainFilter": 0.0,
                                                "SmoothGain": 65.0,
                                                "Thresh": -10.0
                                            }
                                        },
                                        "active": 0
                                    },
                                    "fileref": {
                                        "name": "Max Compressor.amxd",
                                        "filename": "Max Compressor.amxd.maxsnap",
                                        "filepath": "~/Documents/Max 9/Snapshots",
                                        "filepos": -1,
                                        "snapshotfileid": "99b50c3746882144f5ffbc720f5c3d03"
                                    }
                                }
                            ]
                        }
                    },
                    "text": "amxd~ \"Package:/Max for Live/patchers/Max Audio Effect/Max Compressor/Max Compressor.amxd\"",
                    "varname": "amxd~[4]",
                    "viewvisibility": 1
                }
            },
            {
                "box": {
                    "id": "obj-2",
                    "maxclass": "newobj",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 874.1666666666665, 448.0, 67.0, 22.0 ],
                    "text": "jit.net.send"
                }
            },
            {
                "box": {
                    "id": "obj-262",
                    "maxclass": "newobj",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "float" ],
                    "patching_rect": [ 440.0, 982.6666666666666, 29.5, 22.0 ],
                    "text": "* 1."
                }
            },
            {
                "box": {
                    "id": "obj-259",
                    "maxclass": "newobj",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "float" ],
                    "patching_rect": [ 518.6666666666666, 982.6666666666666, 29.5, 22.0 ],
                    "text": "* 1."
                }
            },
            {
                "box": {
                    "id": "obj-254",
                    "maxclass": "newobj",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 532.0, 865.3333333333334, 75.0, 22.0 ],
                    "text": "r NoiseAmtL"
                }
            },
            {
                "box": {
                    "id": "obj-253",
                    "maxclass": "newobj",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 416.0, 885.3333333333334, 77.0, 22.0 ],
                    "text": "r NoiseAmtR"
                }
            },
            {
                "box": {
                    "fontface": 0,
                    "fontname": "Arial",
                    "fontsize": 12.0,
                    "id": "obj-251",
                    "maxclass": "number~",
                    "mode": 2,
                    "numinlets": 2,
                    "numoutlets": 2,
                    "outlettype": [ "signal", "float" ],
                    "patching_rect": [ 1730.833333333333, 3796.0, 56.0, 22.0 ],
                    "sig": 0.0
                }
            },
            {
                "box": {
                    "id": "obj-252",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 1782.833333333333, 3844.0, 79.0, 22.0 ],
                    "text": "s NoiseAmtR"
                }
            },
            {
                "box": {
                    "fontface": 0,
                    "fontname": "Arial",
                    "fontsize": 12.0,
                    "id": "obj-250",
                    "maxclass": "number~",
                    "mode": 2,
                    "numinlets": 2,
                    "numoutlets": 2,
                    "outlettype": [ "signal", "float" ],
                    "patching_rect": [ 1222.833333333333, 3792.0, 56.0, 22.0 ],
                    "sig": 0.0
                }
            },
            {
                "box": {
                    "id": "obj-249",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 1258.833333333333, 3836.0, 77.0, 22.0 ],
                    "text": "s NoiseAmtL"
                }
            },
            {
                "box": {
                    "fontface": 1,
                    "fontsize": 24.0,
                    "id": "obj-239",
                    "maxclass": "comment",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 918.833333333333, 3588.0, 303.0, 33.0 ],
                    "text": "Noisiness Amount"
                }
            },
            {
                "box": {
                    "id": "obj-240",
                    "maxclass": "live.dial",
                    "numinlets": 1,
                    "numoutlets": 2,
                    "outlettype": [ "", "float" ],
                    "parameter_enable": 1,
                    "patching_rect": [ 1026.833333333333, 3684.0, 53.0, 48.0 ],
                    "saved_attribute_attributes": {
                        "valueof": {
                            "parameter_initial": [ 100 ],
                            "parameter_initial_enable": 1,
                            "parameter_longname": "live.dial[12]",
                            "parameter_mmax": 500.0,
                            "parameter_mmin": 1.0,
                            "parameter_modmode": 0,
                            "parameter_shortname": "release",
                            "parameter_type": 0,
                            "parameter_unitstyle": 2
                        }
                    },
                    "varname": "live.dial[1]"
                }
            },
            {
                "box": {
                    "format": 6,
                    "id": "obj-241",
                    "maxclass": "flonum",
                    "numinlets": 1,
                    "numoutlets": 2,
                    "outlettype": [ "", "bang" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 926.833333333333, 3796.0, 50.0, 22.0 ]
                }
            },
            {
                "box": {
                    "id": "obj-242",
                    "maxclass": "live.scope~",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "bang" ],
                    "patching_rect": [ 1026.833333333333, 3792.0, 184.0, 68.0 ],
                    "range": [ -0.1, 1.0 ]
                }
            },
            {
                "box": {
                    "fontface": 1,
                    "id": "obj-243",
                    "linecount": 3,
                    "maxclass": "comment",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 1046.833333333333, 3744.0, 79.0, 47.0 ],
                    "text": "Arguments:\nattack (ms)\nrelease (ms)"
                }
            },
            {
                "box": {
                    "id": "obj-244",
                    "linecount": 3,
                    "maxclass": "comment",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 1078.833333333333, 3684.0, 85.0, 47.0 ],
                    "text": "set the smoothing for the analysis"
                }
            },
            {
                "box": {
                    "id": "obj-246",
                    "maxclass": "live.dial",
                    "numinlets": 1,
                    "numoutlets": 2,
                    "outlettype": [ "", "float" ],
                    "parameter_enable": 1,
                    "patching_rect": [ 974.833333333333, 3684.0, 53.0, 48.0 ],
                    "saved_attribute_attributes": {
                        "valueof": {
                            "parameter_initial": [ 10 ],
                            "parameter_initial_enable": 1,
                            "parameter_longname": "live.dial[13]",
                            "parameter_mmax": 100.0,
                            "parameter_mmin": 1.0,
                            "parameter_modmode": 0,
                            "parameter_shortname": "attack",
                            "parameter_type": 0,
                            "parameter_unitstyle": 2
                        }
                    },
                    "varname": "live.dial[3]"
                }
            },
            {
                "box": {
                    "id": "obj-247",
                    "maxclass": "comment",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 998.833333333333, 3636.0, 192.0, 20.0 ],
                    "text": "use render bang to get float output"
                }
            },
            {
                "box": {
                    "id": "obj-248",
                    "maxclass": "newobj",
                    "numinlets": 3,
                    "numoutlets": 2,
                    "outlettype": [ "float", "signal" ],
                    "patching_rect": [ 926.833333333333, 3744.0, 121.0, 22.0 ],
                    "text": "av.noisiness~ 10 100"
                }
            },
            {
                "box": {
                    "id": "obj-236",
                    "maxclass": "newobj",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "float" ],
                    "patching_rect": [ 297.3333333333333, 993.3333333333334, 29.5, 22.0 ],
                    "text": "* 1."
                }
            },
            {
                "box": {
                    "id": "obj-232",
                    "maxclass": "newobj",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 297.3333333333333, 950.6666666666666, 63.0, 22.0 ],
                    "text": "r ampgate"
                }
            },
            {
                "box": {
                    "id": "obj-230",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 1526.833333333333, 2952.0, 65.0, 22.0 ],
                    "text": "s ampgate"
                }
            },
            {
                "box": {
                    "fontface": 0,
                    "fontname": "Arial",
                    "fontsize": 12.0,
                    "id": "obj-229",
                    "maxclass": "number~",
                    "mode": 2,
                    "numinlets": 2,
                    "numoutlets": 2,
                    "outlettype": [ "signal", "float" ],
                    "patching_rect": [ 1534.833333333333, 2904.0, 56.0, 22.0 ],
                    "sig": 0.0
                }
            },
            {
                "box": {
                    "annotation": "## Change a video's hue/saturation/lightness ##",
                    "bgmode": 1,
                    "border": 0,
                    "clickthrough": 0,
                    "enablehscroll": 0,
                    "enablevscroll": 0,
                    "id": "obj-226",
                    "lockeddragscroll": 0,
                    "lockedsize": 0,
                    "maxclass": "bpatcher",
                    "name": "vz.husalir.maxpat",
                    "numinlets": 4,
                    "numoutlets": 1,
                    "offset": [ 0.0, 0.0 ],
                    "outlettype": [ "jit_gl_texture" ],
                    "patching_rect": [ 349.3333333333333, 1054.6666666666667, 188.0, 130.0 ],
                    "prototypename": "pixl",
                    "varname": "husalir",
                    "viewvisibility": 1
                }
            },
            {
                "box": {
                    "fontface": 1,
                    "fontsize": 24.0,
                    "id": "obj-163",
                    "maxclass": "comment",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 1426.833333333333, 3584.0, 303.0, 33.0 ],
                    "text": "Noisiness Amount"
                }
            },
            {
                "box": {
                    "id": "obj-206",
                    "maxclass": "live.dial",
                    "numinlets": 1,
                    "numoutlets": 2,
                    "outlettype": [ "", "float" ],
                    "parameter_enable": 1,
                    "patching_rect": [ 1534.833333333333, 3680.0, 53.0, 48.0 ],
                    "saved_attribute_attributes": {
                        "valueof": {
                            "parameter_initial": [ 100 ],
                            "parameter_initial_enable": 1,
                            "parameter_longname": "live.dial[6]",
                            "parameter_mmax": 500.0,
                            "parameter_mmin": 1.0,
                            "parameter_modmode": 0,
                            "parameter_shortname": "release",
                            "parameter_type": 0,
                            "parameter_unitstyle": 2
                        }
                    },
                    "varname": "live.dial[12]"
                }
            },
            {
                "box": {
                    "format": 6,
                    "id": "obj-211",
                    "maxclass": "flonum",
                    "numinlets": 1,
                    "numoutlets": 2,
                    "outlettype": [ "", "bang" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 1434.833333333333, 3796.0, 50.0, 22.0 ]
                }
            },
            {
                "box": {
                    "id": "obj-212",
                    "maxclass": "live.scope~",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "bang" ],
                    "patching_rect": [ 1534.833333333333, 3788.0, 184.0, 68.0 ],
                    "range": [ -0.1, 1.0 ]
                }
            },
            {
                "box": {
                    "fontface": 1,
                    "id": "obj-213",
                    "linecount": 3,
                    "maxclass": "comment",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 1554.833333333333, 3740.0, 79.0, 47.0 ],
                    "text": "Arguments:\nattack (ms)\nrelease (ms)"
                }
            },
            {
                "box": {
                    "id": "obj-215",
                    "linecount": 3,
                    "maxclass": "comment",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 1586.833333333333, 3680.0, 85.0, 47.0 ],
                    "text": "set the smoothing for the analysis"
                }
            },
            {
                "box": {
                    "id": "obj-216",
                    "maxclass": "live.dial",
                    "numinlets": 1,
                    "numoutlets": 2,
                    "outlettype": [ "", "float" ],
                    "parameter_enable": 1,
                    "patching_rect": [ 1482.833333333333, 3680.0, 53.0, 48.0 ],
                    "saved_attribute_attributes": {
                        "valueof": {
                            "parameter_initial": [ 10 ],
                            "parameter_initial_enable": 1,
                            "parameter_longname": "live.dial[7]",
                            "parameter_mmax": 100.0,
                            "parameter_mmin": 1.0,
                            "parameter_modmode": 0,
                            "parameter_shortname": "attack",
                            "parameter_type": 0,
                            "parameter_unitstyle": 2
                        }
                    },
                    "varname": "live.dial[13]"
                }
            },
            {
                "box": {
                    "id": "obj-217",
                    "maxclass": "comment",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 1506.833333333333, 3632.0, 192.0, 20.0 ],
                    "text": "use render bang to get float output"
                }
            },
            {
                "box": {
                    "id": "obj-219",
                    "maxclass": "newobj",
                    "numinlets": 3,
                    "numoutlets": 2,
                    "outlettype": [ "float", "signal" ],
                    "patching_rect": [ 1434.833333333333, 3740.0, 121.0, 22.0 ],
                    "text": "av.noisiness~ 10 100"
                }
            },
            {
                "box": {
                    "fontface": 1,
                    "fontsize": 24.0,
                    "id": "obj-189",
                    "maxclass": "comment",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 1490.833333333333, 2664.0, 303.0, 33.0 ],
                    "text": "Amplitude Gate"
                }
            },
            {
                "box": {
                    "id": "obj-195",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "signal" ],
                    "patching_rect": [ 1606.833333333333, 2856.0, 29.0, 22.0 ],
                    "text": "thru"
                }
            },
            {
                "box": {
                    "id": "obj-196",
                    "maxclass": "live.dial",
                    "numinlets": 1,
                    "numoutlets": 2,
                    "outlettype": [ "", "float" ],
                    "parameter_enable": 1,
                    "patching_rect": [ 1638.833333333333, 2712.0, 41.0, 48.0 ],
                    "saved_attribute_attributes": {
                        "valueof": {
                            "parameter_exponent": 3.0,
                            "parameter_initial": [ 488.9864053743881 ],
                            "parameter_initial_enable": 1,
                            "parameter_longname": "live.dial[3]",
                            "parameter_mmax": 2000.0,
                            "parameter_mmin": 10.0,
                            "parameter_modmode": 0,
                            "parameter_shortname": "release",
                            "parameter_type": 0,
                            "parameter_unitstyle": 2
                        }
                    },
                    "varname": "live.dial[2]"
                }
            },
            {
                "box": {
                    "id": "obj-197",
                    "maxclass": "live.dial",
                    "numinlets": 1,
                    "numoutlets": 2,
                    "outlettype": [ "", "float" ],
                    "parameter_enable": 1,
                    "patching_rect": [ 1594.833333333333, 2712.0, 41.0, 48.0 ],
                    "saved_attribute_attributes": {
                        "valueof": {
                            "parameter_exponent": 3.0,
                            "parameter_initial": [ 0.6255130998451012 ],
                            "parameter_initial_enable": 1,
                            "parameter_longname": "live.dial[8]",
                            "parameter_mmax": 100.0,
                            "parameter_modmode": 0,
                            "parameter_shortname": "attack",
                            "parameter_type": 0,
                            "parameter_unitstyle": 2
                        }
                    },
                    "varname": "live.dial[4]"
                }
            },
            {
                "box": {
                    "id": "obj-198",
                    "linecount": 4,
                    "maxclass": "comment",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 1678.833333333333, 2712.0, 112.0, 60.0 ],
                    "text": "adjust the attack and release for the gate to smooth the output"
                }
            },
            {
                "box": {
                    "id": "obj-199",
                    "maxclass": "live.dial",
                    "numinlets": 1,
                    "numoutlets": 2,
                    "outlettype": [ "", "float" ],
                    "parameter_enable": 1,
                    "patching_rect": [ 1550.833333333333, 2712.0, 41.0, 48.0 ],
                    "saved_attribute_attributes": {
                        "valueof": {
                            "parameter_initial": [ 318.89763779527595 ],
                            "parameter_initial_enable": 1,
                            "parameter_longname": "live.dial[10]",
                            "parameter_mmax": 500.0,
                            "parameter_modmode": 0,
                            "parameter_shortname": "hold",
                            "parameter_type": 0,
                            "parameter_unitstyle": 2
                        }
                    },
                    "varname": "live.dial[5]"
                }
            },
            {
                "box": {
                    "id": "obj-200",
                    "maxclass": "live.dial",
                    "numinlets": 1,
                    "numoutlets": 2,
                    "outlettype": [ "", "float" ],
                    "parameter_enable": 1,
                    "patching_rect": [ 1502.833333333333, 2712.0, 41.0, 48.0 ],
                    "saved_attribute_attributes": {
                        "valueof": {
                            "parameter_initial": [ -11.968503937007862 ],
                            "parameter_initial_enable": 1,
                            "parameter_longname": "live.dial[11]",
                            "parameter_mmax": 0.0,
                            "parameter_mmin": -40.0,
                            "parameter_modmode": 0,
                            "parameter_shortname": "threshold",
                            "parameter_type": 0,
                            "parameter_unitstyle": 4
                        }
                    },
                    "varname": "live.dial[6]"
                }
            },
            {
                "box": {
                    "id": "obj-201",
                    "maxclass": "live.scope~",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "bang" ],
                    "patching_rect": [ 1606.833333333333, 2896.0, 102.0, 52.0 ]
                }
            },
            {
                "box": {
                    "id": "obj-202",
                    "maxclass": "newobj",
                    "numinlets": 5,
                    "numoutlets": 2,
                    "outlettype": [ "float", "signal" ],
                    "patching_rect": [ 1490.833333333333, 2820.0, 77.0, 22.0 ],
                    "text": "av.ampgate~"
                }
            },
            {
                "box": {
                    "id": "obj-186",
                    "maxclass": "newobj",
                    "numinlets": 6,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 1218.833333333333, 1852.0, 134.0, 22.0 ],
                    "text": "scale -50. 50. 0.77 1.37"
                }
            },
            {
                "box": {
                    "id": "obj-187",
                    "maxclass": "newobj",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 1210.833333333333, 1806.0, 128.0, 22.0 ],
                    "text": "r MotionMeanAVGRes"
                }
            },
            {
                "box": {
                    "attr": "speed",
                    "id": "obj-188",
                    "maxclass": "attrui",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 1218.833333333333, 1904.0, 150.0, 22.0 ]
                }
            },
            {
                "box": {
                    "id": "obj-179",
                    "maxclass": "newobj",
                    "numinlets": 6,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 274.83333333333303, 1860.0, 121.0, 22.0 ],
                    "text": "scale -50. 50. 0.6 1.4"
                }
            },
            {
                "box": {
                    "id": "obj-181",
                    "maxclass": "newobj",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 274.83333333333303, 1828.0, 128.0, 22.0 ],
                    "text": "r MotionMeanAVGRes"
                }
            },
            {
                "box": {
                    "attr": "speed",
                    "id": "obj-185",
                    "maxclass": "attrui",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 274.83333333333303, 1912.0, 150.0, 22.0 ]
                }
            },
            {
                "box": {
                    "id": "obj-174",
                    "maxclass": "newobj",
                    "numinlets": 6,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 746.833333333333, 1852.0, 122.0, 22.0 ],
                    "text": "scale -50. 50. 0.7 1.3"
                }
            },
            {
                "box": {
                    "id": "obj-176",
                    "maxclass": "newobj",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 746.833333333333, 1820.0, 128.0, 22.0 ],
                    "text": "r MotionMeanAVGRes"
                }
            },
            {
                "box": {
                    "attr": "speed",
                    "id": "obj-178",
                    "maxclass": "attrui",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 746.833333333333, 1912.0, 150.0, 22.0 ]
                }
            },
            {
                "box": {
                    "id": "obj-165",
                    "maxclass": "toggle",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "int" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 810.833333333333, 2860.0, 24.0, 24.0 ]
                }
            },
            {
                "box": {
                    "id": "obj-158",
                    "maxclass": "newobj",
                    "numinlets": 6,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 1742.833333333333, 1872.0, 121.0, 22.0 ],
                    "text": "scale -50. 50. 0.7 1.3"
                }
            },
            {
                "box": {
                    "id": "obj-160",
                    "maxclass": "newobj",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 1742.833333333333, 1840.0, 128.0, 22.0 ],
                    "text": "r MotionMeanAVGRes"
                }
            },
            {
                "box": {
                    "attr": "speed",
                    "id": "obj-162",
                    "maxclass": "attrui",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 1742.833333333333, 1924.0, 150.0, 22.0 ]
                }
            },
            {
                "box": {
                    "id": "obj-152",
                    "maxclass": "newobj",
                    "numinlets": 3,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 1634.833333333333, 2396.0, 53.0, 22.0 ],
                    "text": "clip 0. 1."
                }
            },
            {
                "box": {
                    "id": "obj-153",
                    "maxclass": "newobj",
                    "numinlets": 6,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 1634.833333333333, 2372.0, 117.0, 22.0 ],
                    "text": "scale 10. 100. 0.2 1."
                }
            },
            {
                "box": {
                    "id": "obj-154",
                    "maxclass": "newobj",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 1634.833333333333, 2352.0, 82.0, 22.0 ],
                    "text": "r MotionMean"
                }
            },
            {
                "box": {
                    "id": "obj-155",
                    "maxclass": "newobj",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "signal" ],
                    "patching_rect": [ 1902.833333333333, 2452.0, 34.0, 22.0 ],
                    "text": "*~ 1."
                }
            },
            {
                "box": {
                    "id": "obj-157",
                    "maxclass": "newobj",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "signal" ],
                    "patching_rect": [ 1858.833333333333, 2452.0, 34.0, 22.0 ],
                    "text": "*~ 1."
                }
            },
            {
                "box": {
                    "autosave": 1,
                    "bgmode": 1,
                    "border": 0,
                    "clickthrough": 0,
                    "enablehscroll": 0,
                    "enablevscroll": 0,
                    "id": "obj-151",
                    "lockeddragscroll": 0,
                    "lockedsize": 0,
                    "maxclass": "newobj",
                    "numinlets": 3,
                    "numoutlets": 4,
                    "offset": [ 0.0, 0.0 ],
                    "outlettype": [ "signal", "signal", "", "" ],
                    "patching_rect": [ 282.83333333333303, 2576.0, 555.0, 196.0 ],
                    "saved_attribute_attributes": {
                        "valueof": {
                            "parameter_invisible": 1,
                            "parameter_longname": "amxd~[3]",
                            "parameter_modmode": 0,
                            "parameter_shortname": "amxd~[3]",
                            "parameter_type": 3
                        }
                    },
                    "saved_object_attributes": {
                        "parameter_enable": 1,
                        "patchername": "Max Compressor.amxd",
                        "patchername_fallback": "Package:/Max for Live/patchers/Max Audio Effect/Max Compressor/Max Compressor.amxd"
                    },
                    "snapshot": {
                        "filetype": "C74Snapshot",
                        "version": 2,
                        "minorversion": 0,
                        "name": "snapshotlist",
                        "origin": "max~",
                        "type": "list",
                        "subtype": "Undefined",
                        "embed": 1,
                        "snapshot": {
                            "name": "Max Compressor.amxd",
                            "origname": "Package:/Max for Live/patchers/Max Audio Effect/Max Compressor/Max Compressor.amxd",
                            "valuedictionary": {
                                "parameter_values": {
                                    "AGC": 1.0,
                                    "Attack": 133.0,
                                    "Bypass": 0.0,
                                    "ChannelCoupling": 0.0,
                                    "Delay": 23.0,
                                    "DownExpandEnable": 1.0,
                                    "DownExpandThresh": -45.0,
                                    "DualBand": 0.0,
                                    "Gain": 0.0,
                                    "LevelDetectFreeze": -54.0,
                                    "LevelDetectGating": -36.0,
                                    "Limiter": 1.0,
                                    "Meters": 0.0,
                                    "MetersRate": 25.0,
                                    "Mode": 0.0,
                                    "ProgressiveRelease": 50.0,
                                    "Range": 20.0,
                                    "Ratio": 100.0,
                                    "Release": 111.0,
                                    "SideChainFilter": 0.0,
                                    "SmoothGain": 65.0,
                                    "Thresh": -10.0
                                }
                            },
                            "active": 1
                        },
                        "snapshotlist": {
                            "current_snapshot": 0,
                            "entries": [
                                {
                                    "filetype": "C74Snapshot",
                                    "version": 2,
                                    "minorversion": 0,
                                    "name": "Max Compressor.amxd",
                                    "origin": "Max Compressor.amxd",
                                    "type": "amxd",
                                    "subtype": "Undefined",
                                    "embed": 0,
                                    "snapshot": {
                                        "name": "Max Compressor.amxd",
                                        "origname": "Package:/Max for Live/patchers/Max Audio Effect/Max Compressor/Max Compressor.amxd",
                                        "valuedictionary": {
                                            "parameter_values": {
                                                "AGC": 1.0,
                                                "Attack": 133.0,
                                                "Bypass": 0.0,
                                                "ChannelCoupling": 0.0,
                                                "Delay": 23.0,
                                                "DownExpandEnable": 1.0,
                                                "DownExpandThresh": -45.0,
                                                "DualBand": 0.0,
                                                "Gain": 0.0,
                                                "LevelDetectFreeze": -54.0,
                                                "LevelDetectGating": -36.0,
                                                "Limiter": 1.0,
                                                "Meters": 0.0,
                                                "MetersRate": 25.0,
                                                "Mode": 0.0,
                                                "ProgressiveRelease": 50.0,
                                                "Range": 20.0,
                                                "Ratio": 100.0,
                                                "Release": 111.0,
                                                "SideChainFilter": 0.0,
                                                "SmoothGain": 65.0,
                                                "Thresh": -10.0
                                            }
                                        },
                                        "active": 1
                                    },
                                    "fileref": {
                                        "name": "Max Compressor.amxd",
                                        "filename": "Max Compressor.amxd.maxsnap",
                                        "filepath": "~/Documents/Max 9/Snapshots",
                                        "filepos": -1,
                                        "snapshotfileid": "99b50c3746882144f5ffbc720f5c3d03"
                                    }
                                }
                            ]
                        }
                    },
                    "text": "amxd~ \"Package:/Max for Live/patchers/Max Audio Effect/Max Compressor/Max Compressor.amxd\"",
                    "varname": "amxd~[3]",
                    "viewvisibility": 1
                }
            },
            {
                "box": {
                    "id": "obj-142",
                    "maxclass": "newobj",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "signal" ],
                    "patching_rect": [ 1286.833333333333, 2440.0, 34.0, 22.0 ],
                    "text": "*~ 1."
                }
            },
            {
                "box": {
                    "id": "obj-143",
                    "maxclass": "newobj",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "signal" ],
                    "patching_rect": [ 1242.833333333333, 2440.0, 34.0, 22.0 ],
                    "text": "*~ 1."
                }
            },
            {
                "box": {
                    "id": "obj-144",
                    "maxclass": "newobj",
                    "numinlets": 3,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 1370.833333333333, 2360.0, 53.0, 22.0 ],
                    "text": "clip 0. 1."
                }
            },
            {
                "box": {
                    "id": "obj-145",
                    "maxclass": "newobj",
                    "numinlets": 6,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 1370.833333333333, 2332.0, 110.0, 22.0 ],
                    "text": "scale 10. 100. 0. 1."
                }
            },
            {
                "box": {
                    "id": "obj-146",
                    "maxclass": "newobj",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 1370.833333333333, 2304.0, 82.0, 22.0 ],
                    "text": "r MotionMean"
                }
            },
            {
                "box": {
                    "id": "obj-147",
                    "maxclass": "newobj",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "signal" ],
                    "patching_rect": [ 1286.833333333333, 2404.0, 34.0, 22.0 ],
                    "text": "*~ 1."
                }
            },
            {
                "box": {
                    "id": "obj-150",
                    "maxclass": "newobj",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "signal" ],
                    "patching_rect": [ 1242.833333333333, 2404.0, 34.0, 22.0 ],
                    "text": "*~ 1."
                }
            },
            {
                "box": {
                    "id": "obj-135",
                    "maxclass": "newobj",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "signal" ],
                    "patching_rect": [ 810.833333333333, 2444.0, 34.0, 22.0 ],
                    "text": "*~ 1."
                }
            },
            {
                "box": {
                    "id": "obj-136",
                    "maxclass": "newobj",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "signal" ],
                    "patching_rect": [ 766.833333333333, 2444.0, 34.0, 22.0 ],
                    "text": "*~ 1."
                }
            },
            {
                "box": {
                    "id": "obj-137",
                    "maxclass": "newobj",
                    "numinlets": 3,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 890.833333333333, 2364.0, 53.0, 22.0 ],
                    "text": "clip 0. 1."
                }
            },
            {
                "box": {
                    "id": "obj-138",
                    "maxclass": "newobj",
                    "numinlets": 6,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 890.833333333333, 2336.0, 110.0, 22.0 ],
                    "text": "scale 10. 100. 0. 1."
                }
            },
            {
                "box": {
                    "id": "obj-139",
                    "maxclass": "newobj",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 890.833333333333, 2308.0, 82.0, 22.0 ],
                    "text": "r MotionMean"
                }
            },
            {
                "box": {
                    "id": "obj-140",
                    "maxclass": "newobj",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "signal" ],
                    "patching_rect": [ 810.833333333333, 2408.0, 34.0, 22.0 ],
                    "text": "*~ 1."
                }
            },
            {
                "box": {
                    "id": "obj-141",
                    "maxclass": "newobj",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "signal" ],
                    "patching_rect": [ 766.833333333333, 2408.0, 34.0, 22.0 ],
                    "text": "*~ 1."
                }
            },
            {
                "box": {
                    "autosave": 1,
                    "bgmode": 1,
                    "border": 0,
                    "clickthrough": 0,
                    "enablehscroll": 0,
                    "enablevscroll": 0,
                    "id": "obj-134",
                    "linecount": 2,
                    "lockeddragscroll": 0,
                    "lockedsize": 0,
                    "maxclass": "newobj",
                    "numinlets": 3,
                    "numoutlets": 4,
                    "offset": [ 0.0, 0.0 ],
                    "outlettype": [ "signal", "signal", "", "" ],
                    "patching_rect": [ 1218.833333333333, 2072.0, 446.0, 196.0 ],
                    "presentation_linecount": 2,
                    "saved_attribute_attributes": {
                        "valueof": {
                            "parameter_invisible": 1,
                            "parameter_longname": "amxd~[2]",
                            "parameter_modmode": 0,
                            "parameter_shortname": "amxd~",
                            "parameter_type": 3
                        }
                    },
                    "saved_object_attributes": {
                        "parameter_enable": 1,
                        "patchername": "Granular-to-go.amxd",
                        "patchername_fallback": "Package:/Max for Live/patchers/Max Audio Effect/Granular-to-go/Granular-to-go.amxd"
                    },
                    "snapshot": {
                        "filetype": "C74Snapshot",
                        "version": 2,
                        "minorversion": 0,
                        "name": "snapshotlist",
                        "origin": "max~",
                        "type": "list",
                        "subtype": "Undefined",
                        "embed": 1,
                        "snapshot": {
                            "name": "Granular-to-go.amxd",
                            "origname": "Package:/Max for Live/patchers/Max Audio Effect/Granular-to-go/Granular-to-go.amxd",
                            "valuedictionary": {
                                "parameter_values": {
                                    "active_left": 1.0,
                                    "active_right": 1.0,
                                    "density": 90.0,
                                    "grain_range": 782.9999999999994,
                                    "grain_size": 3631.0,
                                    "min_amp": 67.0,
                                    "playback_speed": 1.852666666666667,
                                    "playback_speed_range": 3.283283283283283,
                                    "pulse_offset": 33.60629921259869,
                                    "pulse_range": 93.11811023622046,
                                    "randomize": 0.0,
                                    "range": 85.0,
                                    "wet_dry": 75.0
                                }
                            },
                            "active": 1
                        },
                        "snapshotlist": {
                            "current_snapshot": 0,
                            "entries": [
                                {
                                    "filetype": "C74Snapshot",
                                    "version": 2,
                                    "minorversion": 0,
                                    "name": "Granular-to-go.amxd",
                                    "origin": "Granular-to-go.amxd",
                                    "type": "amxd",
                                    "subtype": "Undefined",
                                    "embed": 0,
                                    "snapshot": {
                                        "name": "Granular-to-go.amxd",
                                        "origname": "Package:/Max for Live/patchers/Max Audio Effect/Granular-to-go/Granular-to-go.amxd",
                                        "valuedictionary": {
                                            "parameter_values": {
                                                "active_left": 1.0,
                                                "active_right": 1.0,
                                                "density": 90.0,
                                                "grain_range": 782.9999999999994,
                                                "grain_size": 3631.0,
                                                "min_amp": 67.0,
                                                "playback_speed": 1.852666666666667,
                                                "playback_speed_range": 3.283283283283283,
                                                "pulse_offset": 33.60629921259869,
                                                "pulse_range": 93.11811023622046,
                                                "randomize": 0.0,
                                                "range": 85.0,
                                                "wet_dry": 75.0
                                            }
                                        },
                                        "active": 1
                                    },
                                    "fileref": {
                                        "name": "Granular-to-go.amxd",
                                        "filename": "Granular-to-go.amxd.maxsnap",
                                        "filepath": "~/Documents/Max 9/Snapshots",
                                        "filepos": -1,
                                        "snapshotfileid": "99af8e97e9b873c74e5565ec94f4efad"
                                    }
                                }
                            ]
                        }
                    },
                    "text": "amxd~ \"Package:/Max for Live/patchers/Max Audio Effect/Granular-to-go/Granular-to-go.amxd\"",
                    "varname": "amxd~[2]",
                    "viewvisibility": 1
                }
            },
            {
                "box": {
                    "autosave": 1,
                    "bgmode": 1,
                    "border": 0,
                    "clickthrough": 0,
                    "enablehscroll": 0,
                    "enablevscroll": 0,
                    "id": "obj-133",
                    "linecount": 2,
                    "lockeddragscroll": 0,
                    "lockedsize": 0,
                    "maxclass": "newobj",
                    "numinlets": 3,
                    "numoutlets": 4,
                    "offset": [ 0.0, 0.0 ],
                    "outlettype": [ "signal", "signal", "", "" ],
                    "patching_rect": [ 746.833333333333, 2072.0, 446.0, 196.0 ],
                    "presentation_linecount": 2,
                    "saved_attribute_attributes": {
                        "valueof": {
                            "parameter_invisible": 1,
                            "parameter_longname": "amxd~[1]",
                            "parameter_modmode": 0,
                            "parameter_shortname": "amxd~",
                            "parameter_type": 3
                        }
                    },
                    "saved_object_attributes": {
                        "parameter_enable": 1,
                        "patchername": "Granular-to-go.amxd",
                        "patchername_fallback": "Package:/Max for Live/patchers/Max Audio Effect/Granular-to-go/Granular-to-go.amxd"
                    },
                    "snapshot": {
                        "filetype": "C74Snapshot",
                        "version": 2,
                        "minorversion": 0,
                        "name": "snapshotlist",
                        "origin": "max~",
                        "type": "list",
                        "subtype": "Undefined",
                        "embed": 1,
                        "snapshot": {
                            "name": "Granular-to-go.amxd",
                            "origname": "Package:/Max for Live/patchers/Max Audio Effect/Granular-to-go/Granular-to-go.amxd",
                            "valuedictionary": {
                                "parameter_values": {
                                    "active_left": 1.0,
                                    "active_right": 1.0,
                                    "density": 32.0,
                                    "grain_range": 4514.0,
                                    "grain_size": 7802.0,
                                    "min_amp": 22.0,
                                    "playback_speed": 8.858972972972973,
                                    "playback_speed_range": 2.0820820820820822,
                                    "pulse_offset": 31.307086614173254,
                                    "pulse_range": 415.14173228346476,
                                    "randomize": 0.0,
                                    "range": 4.0,
                                    "wet_dry": 75.0
                                }
                            },
                            "active": 1
                        },
                        "snapshotlist": {
                            "current_snapshot": 0,
                            "entries": [
                                {
                                    "filetype": "C74Snapshot",
                                    "version": 2,
                                    "minorversion": 0,
                                    "name": "Granular-to-go.amxd",
                                    "origin": "Granular-to-go.amxd",
                                    "type": "amxd",
                                    "subtype": "Undefined",
                                    "embed": 0,
                                    "snapshot": {
                                        "name": "Granular-to-go.amxd",
                                        "origname": "Package:/Max for Live/patchers/Max Audio Effect/Granular-to-go/Granular-to-go.amxd",
                                        "valuedictionary": {
                                            "parameter_values": {
                                                "active_left": 1.0,
                                                "active_right": 1.0,
                                                "density": 32.0,
                                                "grain_range": 4514.0,
                                                "grain_size": 7802.0,
                                                "min_amp": 22.0,
                                                "playback_speed": 8.858972972972973,
                                                "playback_speed_range": 2.0820820820820822,
                                                "pulse_offset": 31.307086614173254,
                                                "pulse_range": 415.14173228346476,
                                                "randomize": 0.0,
                                                "range": 4.0,
                                                "wet_dry": 75.0
                                            }
                                        },
                                        "active": 1
                                    },
                                    "fileref": {
                                        "name": "Granular-to-go.amxd",
                                        "filename": "Granular-to-go.amxd.maxsnap",
                                        "filepath": "~/Documents/Max 9/Snapshots",
                                        "filepos": -1,
                                        "snapshotfileid": "99af8e97e9b873c74e5565ec94f4efad"
                                    }
                                }
                            ]
                        }
                    },
                    "text": "amxd~ \"Package:/Max for Live/patchers/Max Audio Effect/Granular-to-go/Granular-to-go.amxd\"",
                    "varname": "amxd~[1]",
                    "viewvisibility": 1
                }
            },
            {
                "box": {
                    "clipheight": 39.0,
                    "data": {
                        "clips": [
                            {
                                "absolutepath": "RythmTest.wav",
                                "filename": "RythmTest.wav",
                                "filekind": "audiofile",
                                "id": "u828011387",
                                "selection": [ 0.9565217391304348, 0.0 ],
                                "loop": 1,
                                "content_state": {
                                    "loop": 1,
                                    "speed": 1.0094866191948786
                                }
                            },
                            {
                                "absolutepath": "Reso Metallic Perc 1.wav",
                                "filename": "Reso Metallic Perc 1.wav",
                                "filekind": "audiofile",
                                "id": "u343004100",
                                "loop": 1,
                                "content_state": {
                                    "speed": 1.0094866191948786,
                                    "loop": 1
                                }
                            }
                        ]
                    },
                    "id": "obj-131",
                    "maxclass": "playlist~",
                    "mode": "basic",
                    "numinlets": 1,
                    "numoutlets": 5,
                    "outlettype": [ "signal", "signal", "signal", "", "dictionary" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 1218.833333333333, 1960.0, 446.0, 80.0 ],
                    "quality": "basic",
                    "saved_attribute_attributes": {
                        "candicane2": {
                            "expression": ""
                        },
                        "candicane3": {
                            "expression": ""
                        },
                        "candicane4": {
                            "expression": ""
                        },
                        "candicane5": {
                            "expression": ""
                        },
                        "candicane6": {
                            "expression": ""
                        },
                        "candicane7": {
                            "expression": ""
                        },
                        "candicane8": {
                            "expression": ""
                        }
                    }
                }
            },
            {
                "box": {
                    "clipheight": 39.0,
                    "data": {
                        "clips": [
                            {
                                "absolutepath": "RythmTest.wav",
                                "filename": "RythmTest.wav",
                                "filekind": "audiofile",
                                "id": "u828011387",
                                "selection": [ 0.0, 0.959079283887468 ],
                                "loop": 1,
                                "content_state": {
                                    "loop": 1,
                                    "speed": 0.9193154922598381
                                }
                            },
                            {
                                "absolutepath": "Reso Metallic Perc 1.wav",
                                "filename": "Reso Metallic Perc 1.wav",
                                "filekind": "audiofile",
                                "id": "u958004078",
                                "loop": 1,
                                "content_state": {
                                    "speed": 0.9193154922598381,
                                    "loop": 1
                                }
                            }
                        ]
                    },
                    "id": "obj-121",
                    "maxclass": "playlist~",
                    "mode": "basic",
                    "numinlets": 1,
                    "numoutlets": 5,
                    "outlettype": [ "signal", "signal", "signal", "", "dictionary" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 274.83333333333303, 1960.0, 446.0, 80.0 ],
                    "quality": "basic",
                    "saved_attribute_attributes": {
                        "candicane2": {
                            "expression": ""
                        },
                        "candicane3": {
                            "expression": ""
                        },
                        "candicane4": {
                            "expression": ""
                        },
                        "candicane5": {
                            "expression": ""
                        },
                        "candicane6": {
                            "expression": ""
                        },
                        "candicane7": {
                            "expression": ""
                        },
                        "candicane8": {
                            "expression": ""
                        }
                    }
                }
            },
            {
                "box": {
                    "id": "obj-118",
                    "maxclass": "newobj",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "signal" ],
                    "patching_rect": [ 334.83333333333303, 2440.0, 34.0, 22.0 ],
                    "text": "*~ 1."
                }
            },
            {
                "box": {
                    "id": "obj-119",
                    "maxclass": "newobj",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "signal" ],
                    "patching_rect": [ 290.83333333333303, 2440.0, 34.0, 22.0 ],
                    "text": "*~ 1."
                }
            },
            {
                "box": {
                    "id": "obj-117",
                    "maxclass": "newobj",
                    "numinlets": 3,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 418.83333333333303, 2360.0, 53.0, 22.0 ],
                    "text": "clip 0. 1."
                }
            },
            {
                "box": {
                    "id": "obj-112",
                    "maxclass": "newobj",
                    "numinlets": 6,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 418.83333333333303, 2332.0, 110.0, 22.0 ],
                    "text": "scale 10. 100. 0. 1."
                }
            },
            {
                "box": {
                    "id": "obj-113",
                    "maxclass": "newobj",
                    "numinlets": 0,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 418.83333333333303, 2304.0, 82.0, 22.0 ],
                    "text": "r MotionMean"
                }
            },
            {
                "box": {
                    "id": "obj-107",
                    "maxclass": "newobj",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "signal" ],
                    "patching_rect": [ 334.83333333333303, 2404.0, 34.0, 22.0 ],
                    "text": "*~ 1."
                }
            },
            {
                "box": {
                    "id": "obj-110",
                    "maxclass": "newobj",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "signal" ],
                    "patching_rect": [ 290.83333333333303, 2404.0, 34.0, 22.0 ],
                    "text": "*~ 1."
                }
            },
            {
                "box": {
                    "id": "obj-102",
                    "maxclass": "ezdac~",
                    "numinlets": 2,
                    "numoutlets": 0,
                    "patching_rect": [ 582.833333333333, 3760.0, 45.0, 45.0 ],
                    "presentation": 1,
                    "presentation_rect": [ 174.0, 66.0, 69.33333539962769, 69.33333539962769 ]
                }
            },
            {
                "box": {
                    "id": "obj-101",
                    "lastchannelcount": 0,
                    "maxclass": "live.gain~",
                    "numinlets": 2,
                    "numoutlets": 5,
                    "outlettype": [ "signal", "signal", "", "float", "list" ],
                    "parameter_enable": 1,
                    "patching_rect": [ 582.833333333333, 3616.0, 80.0, 106.0 ],
                    "presentation": 1,
                    "presentation_rect": [ 280.0, 19.0, 63.0, 120.0 ],
                    "saved_attribute_attributes": {
                        "valueof": {
                            "parameter_longname": "live.gain~[1]",
                            "parameter_mmax": 6.0,
                            "parameter_mmin": -70.0,
                            "parameter_modmode": 3,
                            "parameter_shortname": "live.gain~",
                            "parameter_type": 0,
                            "parameter_unitstyle": 4
                        }
                    },
                    "varname": "live.gain~[1]"
                }
            },
            {
                "box": {
                    "autosave": 1,
                    "bgmode": 1,
                    "border": 0,
                    "clickthrough": 0,
                    "enablehscroll": 0,
                    "enablevscroll": 0,
                    "id": "obj-100",
                    "linecount": 2,
                    "lockeddragscroll": 0,
                    "lockedsize": 0,
                    "maxclass": "newobj",
                    "numinlets": 3,
                    "numoutlets": 4,
                    "offset": [ 0.0, 0.0 ],
                    "outlettype": [ "signal", "signal", "", "" ],
                    "patching_rect": [ 274.83333333333303, 2072.0, 446.0, 196.0 ],
                    "presentation_linecount": 2,
                    "saved_attribute_attributes": {
                        "valueof": {
                            "parameter_invisible": 1,
                            "parameter_longname": "amxd~",
                            "parameter_modmode": 0,
                            "parameter_shortname": "amxd~",
                            "parameter_type": 3
                        }
                    },
                    "saved_object_attributes": {
                        "parameter_enable": 1,
                        "patchername": "Granular-to-go.amxd",
                        "patchername_fallback": "Package:/Max for Live/patchers/Max Audio Effect/Granular-to-go/Granular-to-go.amxd"
                    },
                    "snapshot": {
                        "filetype": "C74Snapshot",
                        "version": 2,
                        "minorversion": 0,
                        "name": "snapshotlist",
                        "origin": "max~",
                        "type": "list",
                        "subtype": "Undefined",
                        "embed": 1,
                        "snapshot": {
                            "name": "Granular-to-go.amxd",
                            "origname": "Package:/Max for Live/patchers/Max Audio Effect/Granular-to-go/Granular-to-go.amxd",
                            "valuedictionary": {
                                "parameter_values": {
                                    "active_left": 1.0,
                                    "active_right": 1.0,
                                    "density": 97.0,
                                    "grain_range": 8685.0,
                                    "grain_size": 8575.0,
                                    "min_amp": 41.0,
                                    "playback_speed": 6.416774774774775,
                                    "playback_speed_range": 8.75875875875876,
                                    "pulse_offset": 68.49606299212599,
                                    "pulse_range": 304.5275590551184,
                                    "randomize": 0.0,
                                    "range": 65.0,
                                    "wet_dry": 75.0
                                }
                            },
                            "active": 1
                        },
                        "snapshotlist": {
                            "current_snapshot": 0,
                            "entries": [
                                {
                                    "filetype": "C74Snapshot",
                                    "version": 2,
                                    "minorversion": 0,
                                    "name": "Granular-to-go.amxd",
                                    "origin": "Granular-to-go.amxd",
                                    "type": "amxd",
                                    "subtype": "Undefined",
                                    "embed": 0,
                                    "snapshot": {
                                        "name": "Granular-to-go.amxd",
                                        "origname": "Package:/Max for Live/patchers/Max Audio Effect/Granular-to-go/Granular-to-go.amxd",
                                        "valuedictionary": {
                                            "parameter_values": {
                                                "active_left": 1.0,
                                                "active_right": 1.0,
                                                "density": 97.0,
                                                "grain_range": 8685.0,
                                                "grain_size": 8575.0,
                                                "min_amp": 41.0,
                                                "playback_speed": 6.416774774774775,
                                                "playback_speed_range": 8.75875875875876,
                                                "pulse_offset": 68.49606299212599,
                                                "pulse_range": 304.5275590551184,
                                                "randomize": 0.0,
                                                "range": 65.0,
                                                "wet_dry": 75.0
                                            }
                                        },
                                        "active": 1
                                    },
                                    "fileref": {
                                        "name": "Granular-to-go.amxd",
                                        "filename": "Granular-to-go.amxd.maxsnap",
                                        "filepath": "~/Documents/Max 9/Snapshots",
                                        "filepos": -1,
                                        "snapshotfileid": "99af8e97e9b873c74e5565ec94f4efad"
                                    }
                                }
                            ]
                        }
                    },
                    "text": "amxd~ \"Package:/Max for Live/patchers/Max Audio Effect/Granular-to-go/Granular-to-go.amxd\"",
                    "varname": "amxd~",
                    "viewvisibility": 1
                }
            },
            {
                "box": {
                    "clipheight": 39.0,
                    "data": {
                        "clips": [
                            {
                                "absolutepath": "RythmTest.wav",
                                "filename": "RythmTest.wav",
                                "filekind": "audiofile",
                                "id": "u828011387",
                                "selection": [ 0.959079283887468, 0.0 ],
                                "loop": 1,
                                "content_state": {
                                    "loop": 1,
                                    "speed": 0.9394866191948785
                                }
                            },
                            {
                                "absolutepath": "Reso Metallic Perc 1.wav",
                                "filename": "Reso Metallic Perc 1.wav",
                                "filekind": "audiofile",
                                "id": "u769004091",
                                "loop": 1,
                                "content_state": {
                                    "speed": 0.9394866191948785,
                                    "loop": 1
                                }
                            }
                        ]
                    },
                    "id": "obj-98",
                    "maxclass": "playlist~",
                    "mode": "basic",
                    "numinlets": 1,
                    "numoutlets": 5,
                    "outlettype": [ "signal", "signal", "signal", "", "dictionary" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 746.833333333333, 1960.0, 446.0, 80.0 ],
                    "quality": "basic",
                    "saved_attribute_attributes": {
                        "candicane2": {
                            "expression": ""
                        },
                        "candicane3": {
                            "expression": ""
                        },
                        "candicane4": {
                            "expression": ""
                        },
                        "candicane5": {
                            "expression": ""
                        },
                        "candicane6": {
                            "expression": ""
                        },
                        "candicane7": {
                            "expression": ""
                        },
                        "candicane8": {
                            "expression": ""
                        }
                    }
                }
            },
            {
                "box": {
                    "id": "obj-62",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 1517.3333333333333, 1250.6666666666667, 130.0, 22.0 ],
                    "text": "s MotionMeanAVGRes"
                }
            },
            {
                "box": {
                    "id": "obj-58",
                    "maxclass": "number",
                    "numinlets": 1,
                    "numoutlets": 2,
                    "outlettype": [ "", "bang" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 1086.833333333333, 2916.0, 50.0, 22.0 ]
                }
            },
            {
                "box": {
                    "id": "obj-53",
                    "maxclass": "toggle",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "int" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 882.833333333333, 2904.0, 24.0, 24.0 ]
                }
            },
            {
                "box": {
                    "fontname": "Arial",
                    "fontsize": 13.0,
                    "id": "obj-24",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 882.833333333333, 2932.0, 61.0, 23.0 ],
                    "text": "invert $1"
                }
            },
            {
                "box": {
                    "id": "obj-54",
                    "maxclass": "toggle",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "int" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 586.833333333333, 2924.0, 24.0, 24.0 ]
                }
            },
            {
                "box": {
                    "fontname": "Arial",
                    "fontsize": 13.0,
                    "id": "obj-22",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 586.833333333333, 2956.0, 61.0, 23.0 ],
                    "text": "invert $1"
                }
            },
            {
                "box": {
                    "format": 6,
                    "id": "obj-55",
                    "maxclass": "flonum",
                    "minimum": 0.0,
                    "numinlets": 1,
                    "numoutlets": 2,
                    "outlettype": [ "", "bang" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 1086.833333333333, 2956.0, 50.0, 22.0 ]
                }
            },
            {
                "box": {
                    "color": [ 0.125490196078431, 0.325490196078431, 1.0, 1.0 ],
                    "fontname": "Arial",
                    "fontsize": 13.0,
                    "id": "obj-19",
                    "maxclass": "newobj",
                    "numinlets": 3,
                    "numoutlets": 1,
                    "outlettype": [ "signal" ],
                    "patching_rect": [ 882.833333333333, 3000.0, 222.0, 23.0 ],
                    "text": "fftz.ether~ @fftsize 1024 @overlap 8"
                }
            },
            {
                "box": {
                    "format": 6,
                    "id": "obj-56",
                    "maxclass": "flonum",
                    "minimum": 0.0,
                    "numinlets": 1,
                    "numoutlets": 2,
                    "outlettype": [ "", "bang" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 790.833333333333, 2956.0, 50.0, 22.0 ]
                }
            },
            {
                "box": {
                    "color": [ 0.125490196078431, 0.325490196078431, 1.0, 1.0 ],
                    "fontname": "Arial",
                    "fontsize": 13.0,
                    "id": "obj-10",
                    "maxclass": "newobj",
                    "numinlets": 3,
                    "numoutlets": 1,
                    "outlettype": [ "signal" ],
                    "patching_rect": [ 586.833333333333, 3000.0, 222.0, 23.0 ],
                    "text": "fftz.ether~ @fftsize 1024 @overlap 8"
                }
            },
            {
                "box": {
                    "fontname": "Arial",
                    "fontsize": 13.0,
                    "id": "obj-17",
                    "maxclass": "comment",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 850.833333333333, 2960.0, 114.0, 21.0 ],
                    "text": "composite index"
                }
            },
            {
                "box": {
                    "id": "obj-38",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 1349.3333333333333, 1246.6666666666667, 108.0, 22.0 ],
                    "text": "s MotionMeanAVG"
                }
            },
            {
                "box": {
                    "id": "obj-27",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 1152.0, 1246.6666666666667, 84.0, 22.0 ],
                    "text": "s MotionMean"
                }
            },
            {
                "box": {
                    "id": "obj-8",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 2,
                    "outlettype": [ "jit_matrix", "" ],
                    "patching_rect": [ 1141.3333333333333, 894.6666666666666, 208.0, 22.0 ],
                    "text": "jit.slide @slide_up 4. @slide_down 4."
                }
            },
            {
                "box": {
                    "id": "obj-222",
                    "linecount": 2,
                    "maxclass": "comment",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 957.3333333333334, 1181.3333333333333, 194.66667246818542, 33.0 ],
                    "text": "Connect to any Mask (av.pix.mask funciona bastante bien)"
                }
            },
            {
                "box": {
                    "annotation": "## Convert Jitter matrix input to texture output ##",
                    "bgmode": 1,
                    "border": 0,
                    "clickthrough": 0,
                    "enablehscroll": 0,
                    "enablevscroll": 0,
                    "id": "obj-204",
                    "lockeddragscroll": 0,
                    "lockedsize": 0,
                    "maxclass": "bpatcher",
                    "name": "vz.matrix2texture.maxpat",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "offset": [ 0.0, 0.0 ],
                    "outlettype": [ "" ],
                    "patching_rect": [ 957.3333333333334, 1060.0, 182.0, 120.0 ],
                    "prototypename": "pixl",
                    "varname": "matrix2texture",
                    "viewvisibility": 1
                }
            },
            {
                "box": {
                    "id": "obj-7",
                    "maxclass": "newobj",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "float" ],
                    "patching_rect": [ 1149.3333333333333, 953.3333333333334, 32.0, 22.0 ],
                    "text": "/ 60."
                }
            },
            {
                "box": {
                    "id": "obj-5",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 4,
                    "outlettype": [ "", "", "", "" ],
                    "patching_rect": [ 1138.6666666666667, 926.6666666666666, 50.5, 22.0 ],
                    "text": "jit.3m"
                }
            },
            {
                "box": {
                    "id": "obj-245",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 2,
                    "outlettype": [ "jit_matrix", "" ],
                    "patching_rect": [ 1138.6666666666667, 865.3333333333334, 283.0, 22.0 ],
                    "text": "cv.jit.threshold @threshold 6. @radius 10 @mode 0"
                }
            },
            {
                "box": {
                    "id": "obj-233",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 2,
                    "outlettype": [ "jit_matrix", "" ],
                    "patching_rect": [ 1138.6666666666667, 802.6666666666666, 283.0, 22.0 ],
                    "text": "cv.jit.threshold @threshold 3. @radius 10 @mode 0"
                }
            },
            {
                "box": {
                    "id": "obj-234",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 2,
                    "outlettype": [ "jit_matrix", "" ],
                    "patching_rect": [ 1138.6666666666667, 834.6666666666666, 221.0, 22.0 ],
                    "text": "jit.slide @slide_up 10. @slide_down 10."
                }
            },
            {
                "box": {
                    "id": "obj-231",
                    "maxclass": "newobj",
                    "numinlets": 3,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 1149.3333333333333, 982.6666666666666, 53.0, 22.0 ],
                    "text": "clip 0. 1."
                }
            },
            {
                "box": {
                    "id": "obj-214",
                    "maxclass": "newobj",
                    "numinlets": 6,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 1149.3333333333333, 1018.6666666666666, 100.0, 22.0 ],
                    "text": "scale 0. 1. 0. 100"
                }
            },
            {
                "box": {
                    "fontname": "Arial",
                    "fontsize": 12.0,
                    "id": "obj-149",
                    "maxclass": "comment",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 1345.3333333333333, 1214.6666666666667, 150.0, 20.0 ],
                    "text": "Windowed average",
                    "textcolor": [ 1.0, 1.0, 1.0, 1.0 ],
                    "textjustification": 1
                }
            },
            {
                "box": {
                    "fontface": 0,
                    "fontname": "Arial",
                    "fontsize": 12.0,
                    "id": "obj-156",
                    "maxclass": "comment",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 1517.3333333333333, 1218.6666666666667, 150.0, 20.0 ],
                    "text": "Residual (high-pass)",
                    "textcolor": [ 1.0, 1.0, 1.0, 1.0 ],
                    "textjustification": 1
                }
            },
            {
                "box": {
                    "args": [ "@range", -100, 100 ],
                    "bgmode": 0,
                    "border": 0,
                    "clickthrough": 0,
                    "enablehscroll": 0,
                    "enablevscroll": 0,
                    "id": "obj-171",
                    "lockeddragscroll": 0,
                    "lockedsize": 0,
                    "maxclass": "bpatcher",
                    "name": "dot.stream.vis.maxpat",
                    "numinlets": 3,
                    "numoutlets": 1,
                    "offset": [ 0.0, 0.0 ],
                    "outlettype": [ "float" ],
                    "patching_rect": [ 1517.3333333333333, 1062.6666666666667, 150.0, 150.0 ],
                    "viewvisibility": 1
                }
            },
            {
                "box": {
                    "args": [ "@range", 0, 100 ],
                    "bgmode": 0,
                    "border": 0,
                    "clickthrough": 0,
                    "enablehscroll": 0,
                    "enablevscroll": 0,
                    "id": "obj-172",
                    "lockeddragscroll": 0,
                    "lockedsize": 0,
                    "maxclass": "bpatcher",
                    "name": "dot.stream.vis.maxpat",
                    "numinlets": 3,
                    "numoutlets": 1,
                    "offset": [ 0.0, 0.0 ],
                    "outlettype": [ "float" ],
                    "patching_rect": [ 1185.3333333333333, 1062.6666666666667, 150.0, 150.0 ],
                    "presentation": 1,
                    "presentation_rect": [ 428.0, 154.0, 150.0, 150.0 ],
                    "viewvisibility": 1
                }
            },
            {
                "box": {
                    "args": [ "@range", 0, 100 ],
                    "bgmode": 0,
                    "border": 0,
                    "clickthrough": 0,
                    "enablehscroll": 0,
                    "enablevscroll": 0,
                    "id": "obj-177",
                    "lockeddragscroll": 0,
                    "lockedsize": 0,
                    "maxclass": "bpatcher",
                    "name": "dot.stream.vis.maxpat",
                    "numinlets": 3,
                    "numoutlets": 1,
                    "offset": [ 0.0, 0.0 ],
                    "outlettype": [ "float" ],
                    "patching_rect": [ 1349.3333333333333, 1062.6666666666667, 150.0, 150.0 ],
                    "viewvisibility": 1
                }
            },
            {
                "box": {
                    "color": [ 0.745098, 0.0, 0.0, 1.0 ],
                    "fontname": "Arial",
                    "fontsize": 12.0,
                    "id": "obj-191",
                    "maxclass": "newobj",
                    "numinlets": 2,
                    "numoutlets": 2,
                    "outlettype": [ "float", "float" ],
                    "patching_rect": [ 1349.3333333333333, 1018.6666666666666, 113.0, 22.0 ],
                    "text": "dot.mean.sliding 40"
                }
            },
            {
                "box": {
                    "id": "obj-148",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "jit_matrix" ],
                    "patching_rect": [ 1141.3333333333333, 774.6666666666666, 85.0, 22.0 ],
                    "text": "cv.jit.framesub"
                }
            },
            {
                "box": {
                    "id": "obj-159",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 2,
                    "outlettype": [ "jit_matrix", "" ],
                    "patching_rect": [ 1141.3333333333333, 741.3333333333334, 71.0, 22.0 ],
                    "text": "jit.rgb2luma"
                }
            },
            {
                "box": {
                    "id": "obj-161",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 2,
                    "outlettype": [ "jit_matrix", "" ],
                    "patching_rect": [ 1141.3333333333333, 710.6666666666666, 109.0, 22.0 ],
                    "text": "jit.matrix @adapt 1"
                }
            },
            {
                "box": {
                    "annotation": "## Smear a video ##",
                    "bgmode": 1,
                    "border": 0,
                    "clickthrough": 0,
                    "enablehscroll": 0,
                    "enablevscroll": 0,
                    "id": "obj-82",
                    "lockeddragscroll": 0,
                    "lockedsize": 0,
                    "maxclass": "bpatcher",
                    "name": "vz.slidr.maxpat",
                    "numinlets": 3,
                    "numoutlets": 1,
                    "offset": [ 0.0, 0.0 ],
                    "outlettype": [ "jit_gl_texture" ],
                    "patching_rect": [ 710.6666666666666, 1121.3333333333333, 138.0, 130.0 ],
                    "prototypename": "pixl",
                    "varname": "slidr",
                    "viewvisibility": 1
                }
            },
            {
                "box": {
                    "id": "obj-73",
                    "linecount": 2,
                    "maxclass": "comment",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 918.6666666666666, 908.0, 90.0, 33.0 ],
                    "text": "0: brightness\n1: hue"
                }
            },
            {
                "box": {
                    "id": "obj-74",
                    "maxclass": "number",
                    "numinlets": 1,
                    "numoutlets": 2,
                    "outlettype": [ "", "bang" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 878.6666666666666, 1005.3333333333334, 50.0, 22.0 ]
                }
            },
            {
                "box": {
                    "id": "obj-75",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 878.6666666666666, 1036.0, 55.0, 22.0 ],
                    "text": "mode $1"
                }
            },
            {
                "box": {
                    "id": "obj-84",
                    "maxclass": "comment",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 698.6666666666666, 941.3333333333334, 45.0, 20.0 ],
                    "text": "enable"
                }
            },
            {
                "box": {
                    "id": "obj-76",
                    "maxclass": "comment",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 878.6666666666666, 941.3333333333334, 58.0, 20.0 ],
                    "text": "tolerance"
                }
            },
            {
                "box": {
                    "id": "obj-78",
                    "maxclass": "comment",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 818.6666666666666, 941.3333333333334, 39.0, 20.0 ],
                    "text": "upper"
                }
            },
            {
                "box": {
                    "id": "obj-79",
                    "maxclass": "comment",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 758.6666666666666, 941.3333333333334, 37.0, 20.0 ],
                    "text": "lower"
                }
            },
            {
                "box": {
                    "id": "obj-80",
                    "maxclass": "toggle",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "int" ],
                    "parameter_enable": 1,
                    "patching_rect": [ 710.6666666666666, 961.3333333333334, 24.0, 24.0 ],
                    "saved_attribute_attributes": {
                        "valueof": {
                            "parameter_enum": [ "off", "on" ],
                            "parameter_initial": [ 1.0 ],
                            "parameter_initial_enable": 1,
                            "parameter_longname": "toggle",
                            "parameter_mmax": 1,
                            "parameter_modmode": 0,
                            "parameter_shortname": "toggle",
                            "parameter_type": 2
                        }
                    },
                    "varname": "toggle"
                }
            },
            {
                "box": {
                    "format": 6,
                    "id": "obj-175",
                    "maxclass": "flonum",
                    "numinlets": 1,
                    "numoutlets": 2,
                    "outlettype": [ "", "bang" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 878.6666666666666, 964.0, 50.0, 22.0 ]
                }
            },
            {
                "box": {
                    "format": 6,
                    "id": "obj-192",
                    "maxclass": "flonum",
                    "numinlets": 1,
                    "numoutlets": 2,
                    "outlettype": [ "", "bang" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 818.6666666666666, 964.0, 50.0, 22.0 ]
                }
            },
            {
                "box": {
                    "format": 6,
                    "id": "obj-193",
                    "maxclass": "flonum",
                    "numinlets": 1,
                    "numoutlets": 2,
                    "outlettype": [ "", "bang" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 758.6666666666666, 964.0, 50.0, 22.0 ]
                }
            },
            {
                "box": {
                    "id": "obj-194",
                    "maxclass": "newobj",
                    "numinlets": 4,
                    "numoutlets": 1,
                    "outlettype": [ "jit_gl_texture" ],
                    "patching_rect": [ 710.6666666666666, 1037.3333333333333, 71.0, 22.0 ],
                    "text": "av.pix.mask"
                }
            },
            {
                "box": {
                    "id": "obj-180",
                    "maxclass": "comment",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 305.3333333333333, 1253.3333333333333, 46.99999928474426, 20.0 ],
                    "text": "Video"
                }
            },
            {
                "box": {
                    "id": "obj-182",
                    "linecount": 2,
                    "maxclass": "comment",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 405.3333333333333, 1302.6666666666667, 45.33333468437195, 33.0 ],
                    "text": "Mask Alpha"
                }
            },
            {
                "box": {
                    "id": "obj-183",
                    "linecount": 2,
                    "maxclass": "comment",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 512.0, 1317.3333333333333, 90.6666693687439, 33.0 ],
                    "text": "Video+Mask Compositing"
                }
            },
            {
                "box": {
                    "id": "obj-184",
                    "maxclass": "newobj",
                    "numinlets": 2,
                    "numoutlets": 2,
                    "outlettype": [ "jit_gl_texture", "" ],
                    "patcher": {
                        "fileversion": 1,
                        "appversion": {
                            "major": 9,
                            "minor": 2,
                            "revision": 0,
                            "architecture": "x64",
                            "modernui": 1
                        },
                        "classnamespace": "jit.gen",
                        "rect": [ 1852.0, 335.0, 281.0, 172.0 ],
                        "boxes": [
                            {
                                "box": {
                                    "id": "obj-9",
                                    "maxclass": "newobj",
                                    "numinlets": 1,
                                    "numoutlets": 1,
                                    "outlettype": [ "" ],
                                    "patching_rect": [ 143.0, 63.0, 42.0, 22.0 ],
                                    "text": "swiz b"
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-8",
                                    "maxclass": "newobj",
                                    "numinlets": 1,
                                    "numoutlets": 1,
                                    "outlettype": [ "" ],
                                    "patching_rect": [ 90.0, 63.0, 42.0, 22.0 ],
                                    "text": "swiz g"
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-7",
                                    "maxclass": "newobj",
                                    "numinlets": 1,
                                    "numoutlets": 1,
                                    "outlettype": [ "" ],
                                    "patching_rect": [ 35.0, 63.0, 39.0, 22.0 ],
                                    "text": "swiz r"
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-6",
                                    "maxclass": "newobj",
                                    "numinlets": 4,
                                    "numoutlets": 1,
                                    "outlettype": [ "" ],
                                    "patching_rect": [ 35.0, 102.0, 67.0, 22.0 ],
                                    "text": "vec 0 0 0 0"
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-5",
                                    "maxclass": "newobj",
                                    "numinlets": 1,
                                    "numoutlets": 1,
                                    "outlettype": [ "" ],
                                    "patching_rect": [ 210.0, 63.0, 42.0, 22.0 ],
                                    "text": "swiz a"
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-1",
                                    "maxclass": "newobj",
                                    "numinlets": 0,
                                    "numoutlets": 1,
                                    "outlettype": [ "" ],
                                    "patching_rect": [ 35.0, 20.0, 28.0, 22.0 ],
                                    "text": "in 1"
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-2",
                                    "maxclass": "newobj",
                                    "numinlets": 0,
                                    "numoutlets": 1,
                                    "outlettype": [ "" ],
                                    "patching_rect": [ 210.0, 20.0, 28.0, 22.0 ],
                                    "text": "in 2"
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-4",
                                    "maxclass": "newobj",
                                    "numinlets": 1,
                                    "numoutlets": 0,
                                    "patching_rect": [ 35.0, 139.0, 35.0, 22.0 ],
                                    "text": "out 1"
                                }
                            }
                        ],
                        "lines": [
                            {
                                "patchline": {
                                    "destination": [ "obj-7", 0 ],
                                    "order": 2,
                                    "source": [ "obj-1", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-8", 0 ],
                                    "order": 1,
                                    "source": [ "obj-1", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-9", 0 ],
                                    "order": 0,
                                    "source": [ "obj-1", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-5", 0 ],
                                    "source": [ "obj-2", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-6", 3 ],
                                    "source": [ "obj-5", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-4", 0 ],
                                    "source": [ "obj-6", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-6", 0 ],
                                    "source": [ "obj-7", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-6", 1 ],
                                    "source": [ "obj-8", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-6", 2 ],
                                    "source": [ "obj-9", 0 ]
                                }
                            }
                        ]
                    },
                    "patching_rect": [ 452.0, 1317.3333333333333, 49.0, 22.0 ],
                    "text": "jit.gl.pix",
                    "varname": "jit.gl.pix_AF"
                }
            },
            {
                "box": {
                    "id": "obj-272",
                    "maxclass": "comment",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 460.0, 1349.3333333333333, 108.00000321865082, 20.0 ],
                    "text": "Video Layer"
                }
            },
            {
                "box": {
                    "id": "obj-273",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 2,
                    "outlettype": [ "", "" ],
                    "patching_rect": [ 440.0, 1405.3333333333333, 334.0, 22.0 ],
                    "text": "jit.gl.layer mymovie @transform_reset 2 @preserve_aspect 1"
                }
            },
            {
                "box": {
                    "attr": "layer",
                    "id": "obj-274",
                    "maxclass": "attrui",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 440.0, 1373.3333333333333, 150.0, 22.0 ]
                }
            },
            {
                "box": {
                    "fontface": 1,
                    "fontsize": 30.0,
                    "id": "obj-210",
                    "maxclass": "comment",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 1212.0, 950.6666666666666, 290.6666666666667, 40.0 ],
                    "presentation": 1,
                    "presentation_linecount": 2,
                    "presentation_rect": [ 428.0, 314.0, 150.0, 74.0 ],
                    "text": "Motion Amount",
                    "textjustification": 1
                }
            },
            {
                "box": {
                    "annotation": "## Grab webcam video for VIZZIE input ##",
                    "bgmode": 1,
                    "border": 0,
                    "clickthrough": 0,
                    "enablehscroll": 0,
                    "enablevscroll": 0,
                    "id": "obj-59",
                    "lockeddragscroll": 0,
                    "lockedsize": 0,
                    "maxclass": "bpatcher",
                    "name": "vz.grabbr.maxpat",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "offset": [ 0.0, 0.0 ],
                    "outlettype": [ "jit_gl_texture" ],
                    "patching_rect": [ 180.0, 498.6666666666667, 346.0, 158.0 ],
                    "presentation": 1,
                    "presentation_rect": [ 19.0, 150.0, 393.66666666666674, 158.0 ],
                    "prototypename": "pixl",
                    "varname": "grabbr",
                    "viewvisibility": 1
                }
            },
            {
                "box": {
                    "id": "obj-66",
                    "maxclass": "toggle",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "int" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 188.0, 284.0, 69.33333539962769, 69.33333539962769 ],
                    "presentation": 1,
                    "presentation_rect": [ 43.0, 66.0, 69.33333539962769, 69.33333539962769 ]
                }
            },
            {
                "box": {
                    "id": "obj-67",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 3,
                    "outlettype": [ "jit_matrix", "bang", "" ],
                    "patching_rect": [ 180.0, 384.0, 645.0, 22.0 ],
                    "text": "jit.world mymovie @size 640 360 @floating 1 @fsaa 1 @preserve_aspect 1 @erase_color 0. 0. 0. 0. @output_texture 0"
                }
            },
            {
                "box": {
                    "attr": "erase_color",
                    "id": "obj-72",
                    "maxclass": "attrui",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 260.0, 352.0, 150.0, 22.0 ]
                }
            },
            {
                "box": {
                    "angle": 270.0,
                    "background": 1,
                    "bgcolor": [ 0.7019607843137254, 0.12549019607843137, 0.12549019607843137, 0.71 ],
                    "id": "obj-205",
                    "maxclass": "panel",
                    "mode": 0,
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 176.0, 456.0, 566.6666835546494, 37.33333444595337 ],
                    "proportion": 0.39
                }
            },
            {
                "box": {
                    "attr": "fullscreen",
                    "id": "obj-9",
                    "maxclass": "attrui",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 413.3333333333333, 353.3333333333333, 150.0, 22.0 ]
                }
            },
            {
                "box": {
                    "attr": "ip",
                    "id": "obj-264",
                    "maxclass": "attrui",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 834.6666666666666, 384.0, 150.0, 22.0 ]
                }
            },
            {
                "box": {
                    "attr": "port",
                    "id": "obj-265",
                    "maxclass": "attrui",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 988.0, 384.0, 150.0, 22.0 ]
                }
            }
        ],
        "lines": [
            {
                "patchline": {
                    "destination": [ "obj-11", 1 ],
                    "order": 2,
                    "source": [ "obj-1", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-15", 0 ],
                    "order": 1,
                    "source": [ "obj-1", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-301", 0 ],
                    "order": 0,
                    "source": [ "obj-1", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-3", 0 ],
                    "source": [ "obj-10", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-107", 0 ],
                    "source": [ "obj-100", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-110", 0 ],
                    "source": [ "obj-100", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-102", 1 ],
                    "source": [ "obj-101", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-102", 0 ],
                    "source": [ "obj-101", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-89", 0 ],
                    "source": [ "obj-105", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-118", 0 ],
                    "source": [ "obj-107", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-127", 0 ],
                    "source": [ "obj-108", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-129", 0 ],
                    "source": [ "obj-109", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-119", 0 ],
                    "source": [ "obj-110", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-117", 0 ],
                    "source": [ "obj-112", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-112", 0 ],
                    "source": [ "obj-113", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-116", 0 ],
                    "source": [ "obj-114", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-126", 0 ],
                    "source": [ "obj-115", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-173", 1 ],
                    "order": 0,
                    "source": [ "obj-116", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-173", 0 ],
                    "order": 1,
                    "source": [ "obj-116", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-107", 1 ],
                    "order": 0,
                    "source": [ "obj-117", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-110", 1 ],
                    "order": 1,
                    "source": [ "obj-117", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-151", 1 ],
                    "source": [ "obj-118", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-151", 0 ],
                    "source": [ "obj-119", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-116", 0 ],
                    "source": [ "obj-120", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-100", 1 ],
                    "source": [ "obj-121", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-100", 0 ],
                    "source": [ "obj-121", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-116", 0 ],
                    "source": [ "obj-122", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-116", 0 ],
                    "source": [ "obj-123", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-365", 0 ],
                    "source": [ "obj-124", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-129", 2 ],
                    "source": [ "obj-125", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-127", 2 ],
                    "source": [ "obj-126", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-259", 0 ],
                    "source": [ "obj-127", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-124", 0 ],
                    "source": [ "obj-128", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-262", 0 ],
                    "source": [ "obj-129", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-223", 0 ],
                    "source": [ "obj-13", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-128", 0 ],
                    "source": [ "obj-130", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-134", 1 ],
                    "source": [ "obj-131", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-134", 0 ],
                    "source": [ "obj-131", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-101", 1 ],
                    "order": 2,
                    "source": [ "obj-132", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-101", 0 ],
                    "order": 3,
                    "source": [ "obj-132", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-105", 0 ],
                    "order": 1,
                    "source": [ "obj-132", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-202", 0 ],
                    "order": 0,
                    "source": [ "obj-132", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-219", 0 ],
                    "order": 0,
                    "source": [ "obj-132", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-23", 0 ],
                    "order": 2,
                    "source": [ "obj-132", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-248", 0 ],
                    "order": 1,
                    "source": [ "obj-132", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-140", 0 ],
                    "source": [ "obj-133", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-141", 0 ],
                    "source": [ "obj-133", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-147", 0 ],
                    "source": [ "obj-134", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-150", 0 ],
                    "source": [ "obj-134", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-151", 1 ],
                    "source": [ "obj-135", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-151", 0 ],
                    "source": [ "obj-136", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-140", 1 ],
                    "order": 0,
                    "source": [ "obj-137", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-141", 1 ],
                    "order": 1,
                    "source": [ "obj-137", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-137", 0 ],
                    "source": [ "obj-138", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-138", 0 ],
                    "source": [ "obj-139", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-135", 0 ],
                    "source": [ "obj-140", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-136", 0 ],
                    "source": [ "obj-141", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-151", 1 ],
                    "source": [ "obj-142", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-151", 0 ],
                    "source": [ "obj-143", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-147", 1 ],
                    "order": 0,
                    "source": [ "obj-144", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-150", 1 ],
                    "order": 1,
                    "source": [ "obj-144", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-144", 0 ],
                    "source": [ "obj-145", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-145", 0 ],
                    "source": [ "obj-146", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-142", 0 ],
                    "source": [ "obj-147", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-233", 0 ],
                    "source": [ "obj-148", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-169", 0 ],
                    "source": [ "obj-15", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-238", 0 ],
                    "source": [ "obj-15", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-266", 0 ],
                    "source": [ "obj-15", 2 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-267", 0 ],
                    "source": [ "obj-15", 3 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-268", 0 ],
                    "source": [ "obj-15", 6 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-269", 0 ],
                    "source": [ "obj-15", 7 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-270", 0 ],
                    "source": [ "obj-15", 4 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-271", 0 ],
                    "source": [ "obj-15", 5 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-275", 0 ],
                    "source": [ "obj-15", 8 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-276", 0 ],
                    "source": [ "obj-15", 9 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-143", 0 ],
                    "source": [ "obj-150", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-10", 0 ],
                    "source": [ "obj-151", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-19", 0 ],
                    "source": [ "obj-151", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-155", 1 ],
                    "order": 0,
                    "source": [ "obj-152", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-157", 1 ],
                    "order": 1,
                    "source": [ "obj-152", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-152", 0 ],
                    "source": [ "obj-153", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-153", 0 ],
                    "source": [ "obj-154", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-19", 1 ],
                    "source": [ "obj-155", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-10", 1 ],
                    "source": [ "obj-157", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-162", 0 ],
                    "source": [ "obj-158", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-148", 0 ],
                    "source": [ "obj-159", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-158", 0 ],
                    "source": [ "obj-160", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-159", 0 ],
                    "source": [ "obj-161", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-324", 0 ],
                    "source": [ "obj-162", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-132", 0 ],
                    "source": [ "obj-164", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-53", 0 ],
                    "order": 0,
                    "source": [ "obj-165", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-54", 0 ],
                    "order": 1,
                    "source": [ "obj-165", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-365", 0 ],
                    "source": [ "obj-166", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-166", 0 ],
                    "source": [ "obj-167", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-167", 0 ],
                    "source": [ "obj-168", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "panel", 0 ],
                    "source": [ "obj-169", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-116", 0 ],
                    "source": [ "obj-170", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-62", 0 ],
                    "source": [ "obj-171", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-191", 0 ],
                    "midpoints": [ 1194.8333333333333, 1227.4164903561282, 1344.9999878803885, 1227.4164903561282, 1344.9999878803885, 1011.416490356127, 1358.8333333333333, 1011.416490356127 ],
                    "source": [ "obj-172", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-14", 1 ],
                    "source": [ "obj-173", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-14", 0 ],
                    "source": [ "obj-173", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-178", 0 ],
                    "source": [ "obj-174", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-194", 3 ],
                    "source": [ "obj-175", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-174", 0 ],
                    "source": [ "obj-176", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-38", 0 ],
                    "source": [ "obj-177", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-98", 0 ],
                    "source": [ "obj-178", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-185", 0 ],
                    "source": [ "obj-179", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-179", 0 ],
                    "source": [ "obj-181", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-273", 0 ],
                    "source": [ "obj-184", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-121", 0 ],
                    "source": [ "obj-185", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-188", 0 ],
                    "source": [ "obj-186", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-186", 0 ],
                    "source": [ "obj-187", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-131", 0 ],
                    "source": [ "obj-188", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-3", 1 ],
                    "source": [ "obj-19", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-228", 0 ],
                    "source": [ "obj-190", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-171", 0 ],
                    "source": [ "obj-191", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-177", 0 ],
                    "source": [ "obj-191", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-194", 2 ],
                    "source": [ "obj-192", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-194", 1 ],
                    "source": [ "obj-193", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-82", 0 ],
                    "source": [ "obj-194", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-201", 0 ],
                    "order": 0,
                    "source": [ "obj-195", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-229", 0 ],
                    "order": 1,
                    "source": [ "obj-195", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-202", 4 ],
                    "midpoints": [ 1648.333333333333, 2786.000007549922, 1558.333333333333, 2786.000007549922 ],
                    "source": [ "obj-196", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-202", 3 ],
                    "midpoints": [ 1604.333333333333, 2786.000007549922, 1543.833333333333, 2786.000007549922 ],
                    "source": [ "obj-197", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-202", 2 ],
                    "source": [ "obj-199", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-26", 0 ],
                    "source": [ "obj-20", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-202", 1 ],
                    "source": [ "obj-200", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-195", 0 ],
                    "source": [ "obj-202", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-228", 0 ],
                    "source": [ "obj-203", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-194", 0 ],
                    "source": [ "obj-204", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-219", 2 ],
                    "source": [ "obj-206", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-228", 0 ],
                    "source": [ "obj-207", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-221", 0 ],
                    "source": [ "obj-209", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-20", 0 ],
                    "source": [ "obj-21", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-172", 0 ],
                    "order": 1,
                    "source": [ "obj-214", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-27", 0 ],
                    "order": 0,
                    "source": [ "obj-214", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-219", 1 ],
                    "source": [ "obj-216", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-226", 0 ],
                    "source": [ "obj-218", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-211", 0 ],
                    "source": [ "obj-219", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-212", 0 ],
                    "order": 1,
                    "source": [ "obj-219", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-251", 0 ],
                    "order": 0,
                    "source": [ "obj-219", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-10", 0 ],
                    "source": [ "obj-22", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-228", 0 ],
                    "source": [ "obj-220", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-225", 0 ],
                    "order": 0,
                    "source": [ "obj-221", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-235", 0 ],
                    "order": 1,
                    "source": [ "obj-221", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-255", 0 ],
                    "midpoints": [ 483.33333333333303, 1873.795454545455, 468.33333333333303, 1873.795454545455 ],
                    "order": 3,
                    "source": [ "obj-221", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-256", 0 ],
                    "order": 2,
                    "source": [ "obj-221", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-260", 0 ],
                    "order": 1,
                    "source": [ "obj-221", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-263", 0 ],
                    "order": 0,
                    "source": [ "obj-221", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-82", 2 ],
                    "source": [ "obj-223", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-228", 0 ],
                    "source": [ "obj-224", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-227", 0 ],
                    "order": 1,
                    "source": [ "obj-225", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-257", 0 ],
                    "order": 0,
                    "source": [ "obj-225", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-184", 0 ],
                    "source": [ "obj-226", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-258", 0 ],
                    "source": [ "obj-227", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-173", 1 ],
                    "order": 0,
                    "source": [ "obj-228", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-173", 0 ],
                    "order": 1,
                    "source": [ "obj-228", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-230", 0 ],
                    "source": [ "obj-229", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-21", 0 ],
                    "source": [ "obj-23", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-214", 0 ],
                    "source": [ "obj-231", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-236", 0 ],
                    "source": [ "obj-232", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-234", 0 ],
                    "source": [ "obj-233", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-245", 0 ],
                    "source": [ "obj-234", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-121", 0 ],
                    "source": [ "obj-235", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-261", 0 ],
                    "source": [ "obj-237", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "panel", 0 ],
                    "source": [ "obj-238", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-19", 0 ],
                    "source": [ "obj-24", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-248", 2 ],
                    "source": [ "obj-240", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-8", 0 ],
                    "source": [ "obj-245", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-248", 1 ],
                    "source": [ "obj-246", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-241", 0 ],
                    "source": [ "obj-248", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-242", 0 ],
                    "order": 1,
                    "source": [ "obj-248", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-250", 0 ],
                    "order": 0,
                    "source": [ "obj-248", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-28", 0 ],
                    "order": 8,
                    "source": [ "obj-25", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-30", 0 ],
                    "order": 8,
                    "source": [ "obj-25", 8 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-30", 0 ],
                    "order": 8,
                    "source": [ "obj-25", 7 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-30", 0 ],
                    "order": 8,
                    "source": [ "obj-25", 6 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-30", 0 ],
                    "order": 8,
                    "source": [ "obj-25", 5 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-30", 0 ],
                    "order": 8,
                    "source": [ "obj-25", 4 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-30", 0 ],
                    "order": 8,
                    "source": [ "obj-25", 3 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-30", 0 ],
                    "order": 8,
                    "source": [ "obj-25", 2 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-30", 0 ],
                    "order": 8,
                    "source": [ "obj-25", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-34", 0 ],
                    "order": 7,
                    "source": [ "obj-25", 8 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-34", 0 ],
                    "order": 7,
                    "source": [ "obj-25", 7 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-34", 0 ],
                    "order": 7,
                    "source": [ "obj-25", 6 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-34", 0 ],
                    "order": 7,
                    "source": [ "obj-25", 5 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-34", 0 ],
                    "order": 7,
                    "source": [ "obj-25", 4 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-34", 0 ],
                    "order": 7,
                    "source": [ "obj-25", 3 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-34", 0 ],
                    "order": 7,
                    "source": [ "obj-25", 2 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-34", 0 ],
                    "order": 7,
                    "source": [ "obj-25", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-35", 0 ],
                    "order": 7,
                    "source": [ "obj-25", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-37", 0 ],
                    "order": 6,
                    "source": [ "obj-25", 8 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-37", 0 ],
                    "order": 6,
                    "source": [ "obj-25", 7 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-37", 0 ],
                    "order": 6,
                    "source": [ "obj-25", 6 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-37", 0 ],
                    "order": 6,
                    "source": [ "obj-25", 5 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-37", 0 ],
                    "order": 6,
                    "source": [ "obj-25", 4 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-37", 0 ],
                    "order": 6,
                    "source": [ "obj-25", 3 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-37", 0 ],
                    "order": 6,
                    "source": [ "obj-25", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-37", 0 ],
                    "order": 6,
                    "source": [ "obj-25", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-39", 0 ],
                    "order": 6,
                    "source": [ "obj-25", 2 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-45", 0 ],
                    "order": 4,
                    "source": [ "obj-25", 8 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-45", 0 ],
                    "order": 4,
                    "source": [ "obj-25", 7 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-45", 0 ],
                    "order": 4,
                    "source": [ "obj-25", 6 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-45", 0 ],
                    "order": 4,
                    "source": [ "obj-25", 5 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-45", 0 ],
                    "order": 4,
                    "source": [ "obj-25", 3 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-45", 0 ],
                    "order": 4,
                    "source": [ "obj-25", 2 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-45", 0 ],
                    "order": 4,
                    "source": [ "obj-25", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-45", 0 ],
                    "order": 4,
                    "source": [ "obj-25", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-46", 0 ],
                    "order": 4,
                    "source": [ "obj-25", 4 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-49", 0 ],
                    "order": 5,
                    "source": [ "obj-25", 8 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-49", 0 ],
                    "order": 5,
                    "source": [ "obj-25", 7 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-49", 0 ],
                    "order": 5,
                    "source": [ "obj-25", 6 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-49", 0 ],
                    "order": 5,
                    "source": [ "obj-25", 5 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-49", 0 ],
                    "order": 5,
                    "source": [ "obj-25", 4 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-49", 0 ],
                    "order": 5,
                    "source": [ "obj-25", 2 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-49", 0 ],
                    "order": 5,
                    "source": [ "obj-25", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-49", 0 ],
                    "order": 5,
                    "source": [ "obj-25", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-50", 0 ],
                    "order": 5,
                    "source": [ "obj-25", 3 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-57", 0 ],
                    "order": 0,
                    "source": [ "obj-25", 7 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-57", 0 ],
                    "order": 0,
                    "source": [ "obj-25", 6 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-57", 0 ],
                    "order": 0,
                    "source": [ "obj-25", 5 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-57", 0 ],
                    "order": 0,
                    "source": [ "obj-25", 4 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-57", 0 ],
                    "order": 0,
                    "source": [ "obj-25", 3 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-57", 0 ],
                    "order": 0,
                    "source": [ "obj-25", 2 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-57", 0 ],
                    "order": 0,
                    "source": [ "obj-25", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-57", 0 ],
                    "order": 0,
                    "source": [ "obj-25", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-61", 0 ],
                    "order": 0,
                    "source": [ "obj-25", 8 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-65", 0 ],
                    "order": 1,
                    "source": [ "obj-25", 8 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-65", 0 ],
                    "order": 1,
                    "source": [ "obj-25", 6 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-65", 0 ],
                    "order": 1,
                    "source": [ "obj-25", 5 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-65", 0 ],
                    "order": 1,
                    "source": [ "obj-25", 4 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-65", 0 ],
                    "order": 1,
                    "source": [ "obj-25", 3 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-65", 0 ],
                    "order": 1,
                    "source": [ "obj-25", 2 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-65", 0 ],
                    "order": 1,
                    "source": [ "obj-25", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-65", 0 ],
                    "order": 1,
                    "source": [ "obj-25", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-68", 0 ],
                    "order": 1,
                    "source": [ "obj-25", 7 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-71", 0 ],
                    "order": 2,
                    "source": [ "obj-25", 8 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-71", 0 ],
                    "order": 2,
                    "source": [ "obj-25", 7 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-71", 0 ],
                    "order": 2,
                    "source": [ "obj-25", 5 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-71", 0 ],
                    "order": 2,
                    "source": [ "obj-25", 4 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-71", 0 ],
                    "order": 2,
                    "source": [ "obj-25", 3 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-71", 0 ],
                    "order": 2,
                    "source": [ "obj-25", 2 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-71", 0 ],
                    "order": 2,
                    "source": [ "obj-25", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-71", 0 ],
                    "order": 2,
                    "source": [ "obj-25", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-77", 0 ],
                    "order": 2,
                    "source": [ "obj-25", 6 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-85", 0 ],
                    "order": 3,
                    "source": [ "obj-25", 8 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-85", 0 ],
                    "order": 3,
                    "source": [ "obj-25", 7 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-85", 0 ],
                    "order": 3,
                    "source": [ "obj-25", 6 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-85", 0 ],
                    "order": 3,
                    "source": [ "obj-25", 4 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-85", 0 ],
                    "order": 3,
                    "source": [ "obj-25", 3 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-85", 0 ],
                    "order": 3,
                    "source": [ "obj-25", 2 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-85", 0 ],
                    "order": 3,
                    "source": [ "obj-25", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-85", 0 ],
                    "order": 3,
                    "source": [ "obj-25", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-86", 0 ],
                    "order": 3,
                    "source": [ "obj-25", 5 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-249", 0 ],
                    "source": [ "obj-250", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-252", 0 ],
                    "source": [ "obj-251", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-129", 1 ],
                    "source": [ "obj-253", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-127", 1 ],
                    "source": [ "obj-254", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-121", 0 ],
                    "source": [ "obj-255", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-98", 0 ],
                    "source": [ "obj-256", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-98", 0 ],
                    "source": [ "obj-257", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-131", 0 ],
                    "source": [ "obj-258", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-226", 3 ],
                    "source": [ "obj-259", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-131", 0 ],
                    "source": [ "obj-260", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-218", 0 ],
                    "source": [ "obj-261", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-226", 1 ],
                    "source": [ "obj-262", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-324", 0 ],
                    "source": [ "obj-263", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-2", 0 ],
                    "source": [ "obj-264", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-2", 0 ],
                    "source": [ "obj-265", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "panel", 0 ],
                    "source": [ "obj-266", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "panel", 0 ],
                    "source": [ "obj-267", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "panel", 0 ],
                    "source": [ "obj-268", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "panel", 0 ],
                    "source": [ "obj-269", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "panel", 0 ],
                    "source": [ "obj-270", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "panel", 0 ],
                    "source": [ "obj-271", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-273", 0 ],
                    "source": [ "obj-274", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "panel", 0 ],
                    "source": [ "obj-275", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "panel", 0 ],
                    "source": [ "obj-276", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-283", 0 ],
                    "source": [ "obj-277", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-283", 0 ],
                    "source": [ "obj-278", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-283", 0 ],
                    "source": [ "obj-279", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-6", 0 ],
                    "source": [ "obj-28", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-283", 0 ],
                    "source": [ "obj-281", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-283", 0 ],
                    "source": [ "obj-282", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-173", 1 ],
                    "order": 0,
                    "source": [ "obj-283", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-173", 0 ],
                    "order": 1,
                    "source": [ "obj-283", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-291", 0 ],
                    "source": [ "obj-284", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-291", 0 ],
                    "source": [ "obj-285", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-291", 0 ],
                    "source": [ "obj-286", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-289", 0 ],
                    "source": [ "obj-287", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-291", 0 ],
                    "order": 1,
                    "source": [ "obj-288", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-310", 0 ],
                    "order": 0,
                    "source": [ "obj-288", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-25", 0 ],
                    "source": [ "obj-289", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-291", 0 ],
                    "source": [ "obj-290", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-173", 1 ],
                    "order": 0,
                    "source": [ "obj-291", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-173", 0 ],
                    "order": 1,
                    "source": [ "obj-291", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-312", 0 ],
                    "source": [ "obj-293", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-291", 0 ],
                    "source": [ "obj-294", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-291", 0 ],
                    "source": [ "obj-295", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-300", 0 ],
                    "source": [ "obj-297", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-299", 0 ],
                    "source": [ "obj-298", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-170", 0 ],
                    "source": [ "obj-299", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-220", 0 ],
                    "source": [ "obj-299", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-281", 0 ],
                    "source": [ "obj-299", 2 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-288", 0 ],
                    "source": [ "obj-299", 3 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-132", 1 ],
                    "source": [ "obj-3", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-132", 0 ],
                    "source": [ "obj-3", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-6", 0 ],
                    "source": [ "obj-30", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-116", 0 ],
                    "order": 4,
                    "source": [ "obj-300", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-228", 0 ],
                    "order": 3,
                    "source": [ "obj-300", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-283", 0 ],
                    "order": 2,
                    "source": [ "obj-300", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-291", 0 ],
                    "order": 1,
                    "source": [ "obj-300", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-310", 0 ],
                    "order": 0,
                    "source": [ "obj-300", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-303", 0 ],
                    "source": [ "obj-302", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-114", 0 ],
                    "order": 4,
                    "source": [ "obj-303", 9 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-114", 0 ],
                    "order": 4,
                    "source": [ "obj-303", 7 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-114", 0 ],
                    "order": 4,
                    "source": [ "obj-303", 5 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-120", 0 ],
                    "order": 3,
                    "source": [ "obj-303", 2 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-120", 0 ],
                    "order": 3,
                    "source": [ "obj-303", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-122", 0 ],
                    "order": 4,
                    "source": [ "obj-303", 8 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-122", 0 ],
                    "order": 4,
                    "source": [ "obj-303", 6 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-122", 0 ],
                    "order": 4,
                    "source": [ "obj-303", 4 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-123", 0 ],
                    "order": 3,
                    "source": [ "obj-303", 3 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-123", 0 ],
                    "order": 3,
                    "source": [ "obj-303", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-190", 0 ],
                    "order": 2,
                    "source": [ "obj-303", 3 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-190", 0 ],
                    "order": 2,
                    "source": [ "obj-303", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-203", 0 ],
                    "order": 2,
                    "source": [ "obj-303", 2 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-203", 0 ],
                    "order": 2,
                    "source": [ "obj-303", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-207", 0 ],
                    "order": 3,
                    "source": [ "obj-303", 9 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-207", 0 ],
                    "order": 3,
                    "source": [ "obj-303", 7 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-207", 0 ],
                    "order": 3,
                    "source": [ "obj-303", 5 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-224", 0 ],
                    "order": 3,
                    "source": [ "obj-303", 8 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-224", 0 ],
                    "order": 3,
                    "source": [ "obj-303", 6 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-224", 0 ],
                    "order": 3,
                    "source": [ "obj-303", 4 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-277", 0 ],
                    "order": 1,
                    "source": [ "obj-303", 3 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-277", 0 ],
                    "order": 1,
                    "source": [ "obj-303", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-278", 0 ],
                    "order": 1,
                    "source": [ "obj-303", 2 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-278", 0 ],
                    "order": 1,
                    "source": [ "obj-303", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-279", 0 ],
                    "order": 2,
                    "source": [ "obj-303", 9 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-279", 0 ],
                    "order": 2,
                    "source": [ "obj-303", 7 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-279", 0 ],
                    "order": 2,
                    "source": [ "obj-303", 5 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-282", 0 ],
                    "order": 2,
                    "source": [ "obj-303", 8 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-282", 0 ],
                    "order": 2,
                    "source": [ "obj-303", 6 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-282", 0 ],
                    "order": 2,
                    "source": [ "obj-303", 4 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-284", 0 ],
                    "order": 0,
                    "source": [ "obj-303", 3 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-285", 0 ],
                    "order": 0,
                    "source": [ "obj-303", 2 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-286", 0 ],
                    "order": 1,
                    "source": [ "obj-303", 9 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-286", 0 ],
                    "order": 1,
                    "source": [ "obj-303", 7 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-286", 0 ],
                    "order": 1,
                    "source": [ "obj-303", 5 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-290", 0 ],
                    "order": 1,
                    "source": [ "obj-303", 8 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-290", 0 ],
                    "order": 1,
                    "source": [ "obj-303", 6 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-290", 0 ],
                    "order": 1,
                    "source": [ "obj-303", 4 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-294", 0 ],
                    "order": 0,
                    "source": [ "obj-303", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-295", 0 ],
                    "order": 0,
                    "source": [ "obj-303", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-307", 0 ],
                    "order": 0,
                    "source": [ "obj-303", 9 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-307", 0 ],
                    "order": 0,
                    "source": [ "obj-303", 7 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-307", 0 ],
                    "order": 0,
                    "source": [ "obj-303", 5 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-308", 0 ],
                    "order": 0,
                    "source": [ "obj-303", 8 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-308", 0 ],
                    "order": 0,
                    "source": [ "obj-303", 6 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-308", 0 ],
                    "order": 0,
                    "source": [ "obj-303", 4 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-322", 0 ],
                    "source": [ "obj-304", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-310", 0 ],
                    "source": [ "obj-307", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-310", 0 ],
                    "source": [ "obj-308", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-42", 0 ],
                    "source": [ "obj-31", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-173", 1 ],
                    "order": 0,
                    "source": [ "obj-310", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-173", 0 ],
                    "order": 1,
                    "source": [ "obj-310", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-209", 0 ],
                    "source": [ "obj-311", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-101", 0 ],
                    "source": [ "obj-312", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-66", 0 ],
                    "source": [ "obj-313", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-218", 4 ],
                    "source": [ "obj-314", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-314", 0 ],
                    "source": [ "obj-316", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-314", 0 ],
                    "source": [ "obj-317", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-108", 0 ],
                    "order": 9,
                    "source": [ "obj-318", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-109", 0 ],
                    "order": 10,
                    "source": [ "obj-318", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-164", 0 ],
                    "order": 2,
                    "source": [ "obj-318", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-165", 0 ],
                    "order": 6,
                    "source": [ "obj-318", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-223", 0 ],
                    "order": 8,
                    "source": [ "obj-318", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-261", 0 ],
                    "order": 13,
                    "source": [ "obj-318", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-314", 0 ],
                    "order": 11,
                    "source": [ "obj-318", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-325", 0 ],
                    "order": 3,
                    "source": [ "obj-318", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-326", 0 ],
                    "order": 7,
                    "source": [ "obj-318", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-331", 0 ],
                    "order": 4,
                    "source": [ "obj-318", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-343", 0 ],
                    "order": 0,
                    "source": [ "obj-318", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-377", 0 ],
                    "order": 1,
                    "source": [ "obj-318", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-42", 0 ],
                    "order": 12,
                    "source": [ "obj-318", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-58", 0 ],
                    "order": 5,
                    "source": [ "obj-318", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-102", 0 ],
                    "source": [ "obj-320", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-332", 0 ],
                    "source": [ "obj-322", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-101", 0 ],
                    "source": [ "obj-323", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-337", 1 ],
                    "source": [ "obj-324", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-337", 0 ],
                    "source": [ "obj-324", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-3", 0 ],
                    "source": [ "obj-325", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-151", 0 ],
                    "source": [ "obj-326", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-314", 0 ],
                    "source": [ "obj-327", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-342", 0 ],
                    "source": [ "obj-329", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-91", 0 ],
                    "source": [ "obj-33", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-329", 0 ],
                    "source": [ "obj-331", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-323", 0 ],
                    "source": [ "obj-332", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-323", 0 ],
                    "source": [ "obj-333", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-333", 0 ],
                    "source": [ "obj-334", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-347", 0 ],
                    "order": 1,
                    "source": [ "obj-335", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-348", 0 ],
                    "order": 0,
                    "source": [ "obj-335", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-367", 0 ],
                    "source": [ "obj-336", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-155", 0 ],
                    "source": [ "obj-337", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-157", 0 ],
                    "source": [ "obj-337", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-336", 0 ],
                    "source": [ "obj-338", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-368", 0 ],
                    "source": [ "obj-339", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-33", 0 ],
                    "source": [ "obj-34", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-339", 0 ],
                    "source": [ "obj-340", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-356", 0 ],
                    "source": [ "obj-341", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-355", 0 ],
                    "source": [ "obj-342", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-357", 0 ],
                    "order": 0,
                    "source": [ "obj-342", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-359", 0 ],
                    "order": 1,
                    "source": [ "obj-342", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-362", 0 ],
                    "order": 2,
                    "source": [ "obj-342", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-337", 0 ],
                    "source": [ "obj-343", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-358", 0 ],
                    "source": [ "obj-344", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-343", 0 ],
                    "source": [ "obj-345", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-343", 0 ],
                    "source": [ "obj-346", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-334", 0 ],
                    "source": [ "obj-347", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-349", 0 ],
                    "order": 1,
                    "source": [ "obj-348", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-350", 0 ],
                    "order": 0,
                    "source": [ "obj-348", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-323", 0 ],
                    "source": [ "obj-349", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-33", 0 ],
                    "source": [ "obj-35", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-351", 0 ],
                    "source": [ "obj-350", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-323", 0 ],
                    "source": [ "obj-351", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-361", 0 ],
                    "source": [ "obj-354", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-209", 0 ],
                    "source": [ "obj-355", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-366", 0 ],
                    "source": [ "obj-356", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-131", 0 ],
                    "source": [ "obj-357", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-363", 0 ],
                    "source": [ "obj-358", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-360", 0 ],
                    "source": [ "obj-359", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-192", 0 ],
                    "source": [ "obj-36", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-98", 0 ],
                    "source": [ "obj-360", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-369", 0 ],
                    "source": [ "obj-361", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-364", 0 ],
                    "source": [ "obj-362", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-365", 0 ],
                    "source": [ "obj-363", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-121", 0 ],
                    "source": [ "obj-364", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-318", 0 ],
                    "source": [ "obj-365", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-365", 0 ],
                    "source": [ "obj-366", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-365", 0 ],
                    "source": [ "obj-367", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-365", 0 ],
                    "source": [ "obj-368", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-365", 0 ],
                    "source": [ "obj-369", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-44", 0 ],
                    "source": [ "obj-37", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-324", 0 ],
                    "source": [ "obj-377", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-44", 0 ],
                    "source": [ "obj-39", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-80", 0 ],
                    "source": [ "obj-41", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-226", 2 ],
                    "source": [ "obj-42", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-93", 0 ],
                    "source": [ "obj-44", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-48", 0 ],
                    "source": [ "obj-45", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-48", 0 ],
                    "source": [ "obj-46", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-96", 0 ],
                    "source": [ "obj-48", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-52", 0 ],
                    "source": [ "obj-49", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-7", 0 ],
                    "source": [ "obj-5", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-52", 0 ],
                    "source": [ "obj-50", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-92", 0 ],
                    "source": [ "obj-52", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-24", 0 ],
                    "source": [ "obj-53", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-22", 0 ],
                    "source": [ "obj-54", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-19", 2 ],
                    "source": [ "obj-55", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-10", 2 ],
                    "source": [ "obj-56", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-64", 0 ],
                    "source": [ "obj-57", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-55", 0 ],
                    "order": 0,
                    "source": [ "obj-58", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-56", 0 ],
                    "order": 1,
                    "source": [ "obj-58", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-161", 0 ],
                    "order": 0,
                    "source": [ "obj-59", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-218", 0 ],
                    "order": 1,
                    "source": [ "obj-59", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-90", 0 ],
                    "source": [ "obj-6", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-29", 0 ],
                    "source": [ "obj-60", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-64", 0 ],
                    "source": [ "obj-61", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-97", 0 ],
                    "source": [ "obj-64", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-70", 0 ],
                    "source": [ "obj-65", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-67", 0 ],
                    "midpoints": [ 197.5, 372.815074613672, 189.5, 372.815074613672 ],
                    "source": [ "obj-66", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-309", 0 ],
                    "source": [ "obj-67", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-70", 0 ],
                    "source": [ "obj-68", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-231", 0 ],
                    "source": [ "obj-7", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-99", 0 ],
                    "source": [ "obj-70", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-83", 0 ],
                    "source": [ "obj-71", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-67", 0 ],
                    "source": [ "obj-72", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-75", 0 ],
                    "source": [ "obj-74", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-194", 0 ],
                    "source": [ "obj-75", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-83", 0 ],
                    "source": [ "obj-77", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-204", 0 ],
                    "order": 1,
                    "source": [ "obj-8", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-5", 0 ],
                    "order": 0,
                    "source": [ "obj-8", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-194", 0 ],
                    "source": [ "obj-80", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-184", 1 ],
                    "source": [ "obj-82", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-94", 0 ],
                    "source": [ "obj-83", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-88", 0 ],
                    "source": [ "obj-85", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-88", 0 ],
                    "source": [ "obj-86", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-95", 0 ],
                    "source": [ "obj-88", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-60", 0 ],
                    "source": [ "obj-89", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-67", 0 ],
                    "source": [ "obj-9", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-133", 1 ],
                    "source": [ "obj-98", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-133", 0 ],
                    "source": [ "obj-98", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "monitor", 0 ],
                    "order": 1,
                    "source": [ "panel", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "route", 0 ],
                    "order": 0,
                    "source": [ "panel", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "panel", 0 ],
                    "source": [ "reload", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "panel", 0 ],
                    "source": [ "reset", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-111", 0 ],
                    "order": 0,
                    "source": [ "route", 9 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-16", 0 ],
                    "source": [ "route", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-18", 0 ],
                    "source": [ "route", 5 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-296", 0 ],
                    "source": [ "route", 8 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-4", 1 ],
                    "order": 1,
                    "source": [ "route", 9 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-43", 0 ],
                    "source": [ "route", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "panel", 0 ],
                    "source": [ "start", 0 ]
                }
            }
        ],
        "parameters": {
            "obj-100": [ "amxd~", "amxd~", 0 ],
            "obj-101": [ "live.gain~[1]", "live.gain~", 0 ],
            "obj-132": [ "amxd~[5]", "amxd~[5]", 0 ],
            "obj-133": [ "amxd~[1]", "amxd~", 0 ],
            "obj-134": [ "amxd~[2]", "amxd~", 0 ],
            "obj-151": [ "amxd~[3]", "amxd~[3]", 0 ],
            "obj-173": [ "live.gain~", "live.gain~", 0 ],
            "obj-196": [ "live.dial[3]", "release", 0 ],
            "obj-197": [ "live.dial[8]", "attack", 0 ],
            "obj-199": [ "live.dial[10]", "hold", 0 ],
            "obj-200": [ "live.dial[11]", "threshold", 0 ],
            "obj-204::obj-14": [ "live.toggle[3]", "live.toggle[2]", 0 ],
            "obj-204::obj-19": [ "umenu[11]", "umenu", 0 ],
            "obj-204::obj-22": [ "range[12]", "range", 0 ],
            "obj-204::obj-5::obj-23": [ "gswitch2[3]", "gswitch2", 0 ],
            "obj-206": [ "live.dial[6]", "release", 0 ],
            "obj-209": [ "live.toggle[12]", "live.toggle", 0 ],
            "obj-216": [ "live.dial[7]", "attack", 0 ],
            "obj-218::obj-17": [ "range[1]", "range", 0 ],
            "obj-218::obj-24": [ "Y offset", "Y offset", 0 ],
            "obj-218::obj-41": [ "pictctrl[6]", "pictctrl[1]", 0 ],
            "obj-218::obj-47": [ "pictctrl[7]", "pictctrl[1]", 0 ],
            "obj-218::obj-51": [ "pictctrl[5]", "pictctrl[1]", 0 ],
            "obj-218::obj-53": [ "pictctrl[8]", "pictctrl[1]", 0 ],
            "obj-218::obj-54": [ "Bound mode", "Bound mode", 0 ],
            "obj-218::obj-56::obj-23": [ "gswitch2[5]", "gswitch2", 0 ],
            "obj-218::obj-68": [ "X offset", "X offset", 0 ],
            "obj-218::obj-94": [ "Interp mode", "Interp mode", 0 ],
            "obj-226::obj-104": [ "pictctrl[92]", "pictctrl[1]", 0 ],
            "obj-226::obj-119": [ "Hue", "Hue", 0 ],
            "obj-226::obj-127": [ "Saturation", "Saturation", 0 ],
            "obj-226::obj-142": [ "Luminance", "Luminance", 0 ],
            "obj-226::obj-147": [ "pictctrl[91]", "pictctrl[1]", 0 ],
            "obj-226::obj-148": [ "pictctrl[90]", "pictctrl[1]", 0 ],
            "obj-226::obj-56::obj-23": [ "gswitch2[4]", "gswitch2", 0 ],
            "obj-226::obj-6": [ "range[17]", "range", 0 ],
            "obj-240": [ "live.dial[12]", "release", 0 ],
            "obj-246": [ "live.dial[13]", "attack", 0 ],
            "obj-3": [ "amxd~[4]", "amxd~[3]", 0 ],
            "obj-33": [ "live.toggle[4]", "live.toggle", 0 ],
            "obj-337": [ "amxd~[7]", "amxd~[3]", 0 ],
            "obj-44": [ "live.toggle[5]", "live.toggle", 0 ],
            "obj-48": [ "live.toggle[6]", "live.toggle", 0 ],
            "obj-52": [ "live.toggle[7]", "live.toggle", 0 ],
            "obj-59::obj-38": [ "pictctrl[2]", "pictctrl[1]", 0 ],
            "obj-59::obj-39": [ "pictctrl[1]", "pictctrl[1]", 0 ],
            "obj-59::obj-64::obj-18": [ "vdevnum", "vdevnum", 0 ],
            "obj-59::obj-64::obj-29": [ "formatnum", "formatnum", 10 ],
            "obj-59::obj-64::obj-40": [ "Mirror state", "Mirror state", 0 ],
            "obj-59::obj-64::obj-5": [ "Available devices", "Available devices", 0 ],
            "obj-6": [ "live.toggle", "live.toggle", 0 ],
            "obj-64": [ "live.toggle[8]", "live.toggle", 0 ],
            "obj-70": [ "live.toggle[9]", "live.toggle", 0 ],
            "obj-80": [ "toggle", "toggle", 0 ],
            "obj-82::obj-1": [ "Slide down", "Slide down", 0 ],
            "obj-82::obj-21": [ "pictctrl[4]", "pictctrl[1]", 0 ],
            "obj-82::obj-28": [ "pictctrl[3]", "pictctrl[1]", 0 ],
            "obj-82::obj-50": [ "Slide up", "Slide up", 0 ],
            "obj-82::obj-56::obj-23": [ "gswitch2[2]", "gswitch2", 0 ],
            "obj-82::obj-6": [ "range[4]", "range", 0 ],
            "obj-83": [ "live.toggle[10]", "live.toggle", 0 ],
            "obj-88": [ "live.toggle[11]", "live.toggle", 0 ],
            "parameterbanks": {
                "0": {
                    "index": 0,
                    "name": "",
                    "parameters": [ "-", "-", "-", "-", "-", "-", "-", "-" ],
                    "buttons": [ "-", "-", "-", "-", "-", "-", "-", "-" ]
                }
            },
            "parameter_overrides": {
                "obj-59::obj-64::obj-5": {
                    "parameter_invisible": 0,
                    "parameter_modmode": 0,
                    "parameter_unitstyle": 10
                }
            },
            "inherited_shortname": 1
        },
        "autosave": 0
    }
}