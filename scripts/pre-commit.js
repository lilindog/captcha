"use strict";

const { runCmds } = require("./util");

!async function () {
    if (await runCmds(["npm run lint"])) {
        console.log("eslint 检测通过。\n");
    } else {
        console.error("eslint 检测不通过！");
        process.exit(1);
    }
}();