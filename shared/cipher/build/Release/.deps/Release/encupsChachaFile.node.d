cmd_Release/encupsChachaFile.node := ln -f "Release/obj.target/encupsChachaFile.node" "Release/encupsChachaFile.node" 2>/dev/null || (rm -rf "Release/encupsChachaFile.node" && cp -af "Release/obj.target/encupsChachaFile.node" "Release/encupsChachaFile.node")
