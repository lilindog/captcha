
declare module "captcha" {
    import { Readable } from "stream";
    export default function captcha (options?: CaptchaOptions): CaptchaFunction;
    interface CaptchaOptions {
        colors?:     String, 
        height?:     Number,
        width?:      Number,
        chars?:      Array<String>,
        line?:       Number,
        bezier?:     Number,
        point?:      Number,
        background?: String
    }
    interface CaptchaFunction {
        (options?: CaptchaOptions): CaptchaFunctionResult;
    }
    interface CaptchaFunctionResult {
        stream: Readable,
        code: String
    }
}