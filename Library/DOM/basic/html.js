import DOM from "@DOMPath/DOM/Classes/dom"

export default class HTML {
    constructor(html, style = {}) {
        return new DOM({
            html,
            style,
        })
    }
}
