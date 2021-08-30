declare module "captcha" {
    import { Readable } from "stream";

    export default function captcha (options?: CaptchaOptions): CaptchaFunction;

    export interface CaptchaOptions {
        colors?: Array<String>,
        height?: Number,
        width?:  Number,
        chars?:  Array<String>,
        line?:   Number,
        bezier?: Number,
        point?:  Number,
        background?: String
    }

    export interface CaptchaFunction {
        (options?: CaptchaFunction): { stream: Readable, code: String }
    }
}