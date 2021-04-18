"use strict"

const 
    { createReadStream, unlink, existsSync, mkdirSync } = require("fs"),
    { exec, execSync } = require("child_process");

let EXEC_NAME = "";

const defaultOption = {
    colors: ["red", "blue", "pink", "green", "grey"],
    height: 40,
    width:  100,
    chars:  [],
    line:   3,
    point:  50,
    background: "#fff"
}

function noop () {}

const path = file => __dirname + "/.temp/" + file;

const err = msg => { throw `[ Captcha ] 报错：${msg}`; };

const range = (min, max) => min + (max + 1 - min) * Math.random() | 0;

const random = value => (Object.prototype.toString.call(value) === "[object Array]") ? value[range(0, value.length - 1)] : range(0, value);

const getName = (function () {
    let index = 0;
    return suffix => {
        if (index >= Number.MAX_SAFE_INTEGER) index = 0;
        return (index++) + suffix;
    }
})();

function setExecName () {
    try {
        execSync("magick -version");
        return EXEC_NAME = "magick ";
    } catch(err) {}
    try {
        execSync("convert -version");
        return EXEC_NAME = "convert ";
    } catch(err) {}
    err("请先安装 ImageMagick");
}

function fillOptionChars (option) {
    for (let i = 0; i < 26; i++) {
        const letter = String.fromCharCode(65 + i);
        option.chars.push(letter, letter.toLocaleLowerCase());
    }
    for (let i = 1; i < 10; i++) option.chars.push(i);    
}

async function runCmds (cmds = []) {
    const codes = [];
    for (let cmd of cmds) codes.push(await new Promise((resolve, reject) => exec(cmd, err => err ? reject(err) : resolve(0))));
    return codes.every(code => code === 0);
}

async function captcha (
    { 
        height,
        width,
        background,
        colors,
        line,
        point
    }, 
    text = "", 
    name = ""
) {
    const textWidth = width / text.length;
    let 
        cmd = `${EXEC_NAME} -size ${width}x${height} xc:"${background}" `,
        i = 0,
        left = 0;
    for (; i < point; i++) cmd += ` -fill ${random(colors)} -draw "point ${random(width)},${random(height)}" `;
    for (i = 0; i < line; i++) cmd += ` -fill ${random(colors)} -draw "line ${random(width)},${random(height)},${random(width)},${random(height)}" `;
    for (i = 0; i < text.length; i++) {
        const size = textWidth;
        cmd += ` -fill ${random(colors)} -pointsize ${range(size / 1.5, size)} -draw "skewX ${range(-5, 5)} text ${left},${range(size, height)} '${text[i]}'" `;
        left += size;
    }
    await runCmds([cmd + path(name)]);
}

async function main (initOption, option = {}) {
    option = Object.assign({}, initOption, option);
    const {
        chars
    } = option;
    let 
        names = [], 
        text = "", 
        i = 0,
        name = "",
        gifName = "",
        cmd = "", 
        stream;
    for (; i < 2; i++) names.push(getName(".jpg"));
    for (i = 0; i < 5; i++) text += random(chars);
    for (name of names) await captcha(option, text, name);
    cmd = `${EXEC_NAME} -delay 15 -loop 0 `;
    gifName = getName(".gif");
    names.forEach(name => cmd += ` ${path(name)} `);
    await runCmds([cmd + path(gifName)]);
    stream = createReadStream(path(gifName));
    stream.on("close", () => {
        unlink(path(gifName), noop);
        names.forEach(name => unlink(path(name), noop));
    });
    return { stream, code: text };
}

module.exports = (option = {}) => {
    if (option !== undefined && Object.prototype.toString.call(option) !== "[object Object]") err("option 必须为对象");
    option = Object.assign({}, defaultOption, option);
    (option.chars || option.chars.length) && fillOptionChars(option);
    !existsSync(path("")) && mkdirSync(path(""));
    setExecName();
    return main.bind(null, option);
}