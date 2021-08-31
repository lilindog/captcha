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

        // 验证码字体颜色集合
        // 颜色字符串格式示例： #409efe、blue、rgb(100, 100, 100)
        // 验证码绘制的时候会在你提供的颜色集合随机选择颜色进行绘制
        colors?: Array<String>,

        // 验证码画布高度
        // 建议默认值，不指定此项
        height?: Number,

        // 验证码画布宽度
        // 建议默认值
        width?:  Number,

        // 验证码字符绘制字符集合，建议使用字母和数字
        // 此项默认为26个英文字母和阿拉伯数字集合
        // 示列：["H", "e", "l", "l", "o"]
        // 验证码会在字符集合中选择随机的字符来绘制
        chars?:  Array<String>,

        // 随机线条数量
        // 值越大性能越低
        line?:   Number,

        // 贝塞尔曲线画线数量
        // 值越大性能越低
        bezier?: Number,

        // 验证码中点的数量
        // 值越大性能越低
        // 点的颜色会从颜色集合里边随机选取
        point?:  Number,

        // 验证码背景色
        // 如：red、#333333、rgb(0,0,0)
        background?: String
    }

    /**
     * 验证码生成函数，返回可读流和验证码。
     */
    export interface CaptchaFunction {
        (options?: CaptchaFunction): { stream: Readable, code: String }
    }
}