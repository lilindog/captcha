const { createServer } = require("http");
const captcha = require("../index")();

createServer(async (req, res) =>{
    const { code, stream } = await captcha({
        line: 10,
        // point: 0,
        colors: ["black"],
        background: "#fff"
    });
    console.log(code);
    stream.pipe(res);
}).listen(80, () => {
    console.log("srv runing ...");
});