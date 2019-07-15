import DOM from "@DOMPath/DOM/Classes/dom"

export default class Align {
    constructor(content, type = ["center"], style = {}) {
        return new DOM({
            new: "div",
            content,
            class: ["ready-flex-align", ...type],
            style,
        })
    }
}
