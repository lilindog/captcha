const { createServer } = require("http");
const captcha = require("../src/index")();

createServer(async (req, res) =>{
    const { code, stream } = await captcha({
        // height,
        // width,
        // background,
        // colors,
        // line: 0,
        bezier: 4,
        // point: 10
    });
    console.log(code);
    stream.pipe(res);
}).listen(80, () => {
    console.log("srv runing ...");
});