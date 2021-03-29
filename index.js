"use strict"

const 
{ createReadStream, unlink, existsSync, mkdirSync } = require("fs"),
{ exec } = require("child_process");

main.option = {
    colors: ["red", "blue", "pink", "green", "grey"],
    height: 40,
    width: 100,
    chars: [],
    line: 3,
    point: 50,
    background: "#fff"
}

function noop () {}

function path (file) { 
    return __dirname + "/.temp/" + file; 
}

function err (msg = "") { 
    throw `[ Captcha ] 报错：${msg}` 
}

const getName = (function () {
    let index = 0;
    return suffix => {
        if (index >= Number.MAX_SAFE_INTEGER) index = 0;
        return (index++) + suffix;
    }
})();

function fillOptionChars () {
    for (let i = 0; i < 26; i++) {
        const letter = String.fromCharCode(65 + i);
        main.option.chars.push(letter, letter.toLocaleLowerCase());
    }
    for (let i = 1; i < 10; i++) main.option.chars.push(i);    
}

async function runCmds (cmds = []) {
    const codes = [];
    for (let cmd of cmds) codes.push(await new Promise((resolve, reject) => exec(cmd, err => err ? reject(err) : resolve(0))));
    return codes.every(code => code === 0);
}

function getRange (min, max) {
    return min + (max + 1 - min) * Math.random() | 0;
}

function getRandomColor () {
    return main.option.colors[getRange(0, main.option.colors.length - 1)];
}

function getRandomChar () {
    return main.option.chars[getRange(0, main.option.chars.length - 1)];
}

function getRandomHeight () {
    return getRange(0, main.option.height);
}

function getRandomWidth () {
    return getRange(0, main.option.width);
}

async function buildStaticCaptcha (option = {}, text = "", name = "") {
    let cmd = `magick -size ${option.width}x${option.height} xc:"${option.background}" `;
    for (let i = 0; i < option.point; i++) cmd += ` -fill ${getRandomColor()} -draw "point ${getRandomWidth()},${getRandomHeight()}" `;
    for (let i = 0; i < option.line; i++) cmd += ` -fill ${getRandomColor()} -draw "line ${getRandomWidth()},${getRandomHeight()},${getRandomWidth()},${getRandomHeight()}" `;
    let 
    textWidth = option.width / text.length,
    left = 0;
    for (let i = 0; i < text.length; i++) {
        const 
        size = textWidth, 
        spaceLR = (textWidth - size) / 2;
        left += spaceLR;
        cmd += ` -fill ${getRandomColor()} -pointsize ${size} -draw "skewX ${getRange(-10, 10)} text ${left},${getRange(size, option.height)} '${text[i]}'" `;
        left += spaceLR + size;
    }
    await runCmds([cmd + path(name)]);
}

async function main (option = {}) {
    Object.assign(option, main.option);
    let names = [], text = "";
    for (let i = 0; i < 2; i++) names.push(getName(".jpg"));
    for (let i = 0; i < 5; i++) text += getRandomChar();
    for (let name of names) await buildStaticCaptcha(option, text, name);
    let cmd = `magick -delay 15 -loop 0 `, gifname = getName(".gif");
    names.forEach(name => cmd += ` ${path(name)} `);
    await runCmds([cmd + path(gifname)]);
    const stream = createReadStream(path(gifname));
    stream.on("close", () => {
        unlink(path(gifname), noop);
        names.forEach(name => unlink(path(name), noop));
    });
    return { stream, code: text };
}

module.exports = (option = {}) => {
    if (option !== undefined && Object.prototype.toString.call(option) !== "[object Object]") err("option 必须为对象");
    Object.assign(main.option, option);
    (!main.option.chars || !main.option.chars.length) && fillOptionChars();
    !existsSync(path("")) && mkdirSync(path(""));
    return main;
}