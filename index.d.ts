declare module "captcha" {
    import { Readable } from "stream";

    /**
     * 默认导出一个偏函数，可选参数为配置信息，返回一个验证码生成函数。
     */
    export default function captcha (options?: CaptchaOptions): CaptchaFunction;

    /**
     * 验证码生成配置信息。
     */
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

    /**
     * 验证码生成函数，返回可读流和验证码。
     */
    export interface CaptchaFunction {
        (options?: CaptchaFunction): { stream: Readable, code: String }
    }
}