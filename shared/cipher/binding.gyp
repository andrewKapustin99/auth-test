{
  "targets": [
    {
      "target_name": "generateKeys",
      "sources": ["generateKeys.c"],
      "include_dirs": [
        "/Users/ashshura/Desktop/liboqs/build/include/oqs"  
      ], 
      "libraries": [
        "-loqs" 
      ]
    },
    {
      "target_name": "getPublickKey",
      "sources": ["getPublickKey.c"],
      "include_dirs": [
        "/Users/ashshura/Desktop/liboqs/build/include/oqs"  
      ],
      "libraries": [
        "-loqs" 
      ]
    },
    {
      "target_name": "decupsSC",
      "sources": ["decupsSC.c"],
      "include_dirs": [
       "/Users/ashshura/Desktop/liboqs/build/include/oqs" ,
      ],
      "libraries": [
        "-loqs" 
      ]
    },
    {
      "target_name": "encupsChacha",
      "sources": ["euncupsChacha.c"],
      "include_dirs": [
           "/Users/ashshura/Desktop/liboqs/build/include/oqs",
        "/opt/homebrew/Cellar/wolfssl/5.6.6/include/wolfssl"
      ],
      "libraries": [
        "-loqs",
        "-lwolfssl",
      ]
    },
    {
      "target_name": "decupsChacha",
      "sources": ["decupsChacha.c"],
      "include_dirs": [
       "/Users/ashshura/Desktop/liboqs/build/include/oqs"  ,
      "/opt/homebrew/Cellar/wolfssl/5.6.6/include/wolfssl"


      ],
      "libraries": [
        "-loqs",
        "-lwolfssl",
      ]
    },
    {
      "target_name": "encupsChachaFile",
      "sources": ["encupsChachaFile.c"],
      "include_dirs": [
       "/Users/ashshura/Desktop/liboqs/build/include/oqs",
      "/opt/homebrew/Cellar/wolfssl/5.6.6/include/wolfssl"
      ],
      "libraries": [
        "-loqs",
        "-lwolfssl",
      ]
    },
    {
      "target_name": "decupsChachaFile",
      "sources": ["decupsChachaFile.c"],
      "include_dirs": [
       "/Users/ashshura/Desktop/liboqs/build/include/oqs",
      "/opt/homebrew/Cellar/wolfssl/5.6.6/include/wolfssl"
      ],
      "libraries": [
        "-loqs",
        "-lwolfssl",
      ]
    },
  ]
}