cmd_Release/encupsChacha.node := ln -f "Release/obj.target/encupsChacha.node" "Release/encupsChacha.node" 2>/dev/null || (rm -rf "Release/encupsChacha.node" && cp -af "Release/obj.target/encupsChacha.node" "Release/encupsChacha.node")
