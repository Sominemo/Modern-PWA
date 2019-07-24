import Design from "@Core/Services/design"
import { SVG } from "../basic"

export default class Preloader {
    constructor({
        main, accent, size = 64, style = {},
    } = {}) {
        main = main || Design.getVar("color-main", true)
        accent = accent || Design.getVar("color-accent", true)
        let { svg } = this.constructor
        svg = svg.replace(/\$mainColor\$/g, main).replace(/\$accentColor\$/g, accent)

        return new SVG(svg, { width: (typeof size === "number" ? `${size}px` : size), ...style })
    }

    static _getSVG() { return require("@Resources/images/vector/preloader.svg") }

    static get svg() { return this._getSVG() }

    static set svg(s) { this._getSVG = s }
}
