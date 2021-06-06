"use strict";

const path = require("path");
const fs = require("fs");

(process.env?.INIT_CWD || "").endsWith(process.env.npm_package_name) && main();

function main () {
    console.log("开始部署githook...");
    console.log(getHookScripts().map(script => {
        writeScript(script);
        return path.basename(script);
    }).join("\n"));
    console.log("githook部署完成！\n");
}

function getHookScripts () {
    return fs.readdirSync(path.resolve(__dirname, "../.git/hooks")).map(name => {
        if (!name.endsWith(".sample")) return;
        const script = path.resolve(__dirname, path.basename(name, ".sample") + ".js");
        if (fs.existsSync(script)) {
            return script;
        }
    })
    .filter(name => name);   
}

function writeScript (scriptPath = "") {
    if (!path.isAbsolute(scriptPath)) throw "scriptPath need a absolute path!";
    scriptPath = path.relative(path.join(__dirname, "../.git/hooks"), scriptPath);
    const targetPath = path.resolve(__dirname, "../.git/hooks", path.basename(scriptPath, ".js"));
    let script = `
        #!/usr/bin/env node
        const { spawn } = require("child_process");
        const path = require("path");
        const p = spawn("node", [path.join(__dirname, "${scriptPath.split(path.sep).join("/")}")], { stdio: "inherit" });
        p.on("exit", code => {
            process.exit(code);
        });
    `;
    script = script.replace(/\s+/g, " ").replace("#!/usr/bin/env node", "#!/usr/bin/env node\n").replace(/(?<=(?:(?:\r\n|\r|\n)|(?:^)))\s+/g, "");
    fs.writeFileSync(targetPath, script);
}