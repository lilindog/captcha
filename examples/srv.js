const { createServer } = require("http");
const captcha = require("../index")({ line: 10 });

createServer(async (req, res) =>{
    const { code, stream } = await  captcha();
    console.log(code);
    stream.pipe(res);
}).listen(80, () => {
    console.log("srv runing ...");
});