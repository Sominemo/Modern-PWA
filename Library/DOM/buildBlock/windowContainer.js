import DOM from "@DOMPath/DOM/Classes/dom"

export default class WindowContainer {
    constructor(content = []) {
        return new DOM({
            new: "div",
            class: ["win-ct-wrapper"],
            content,
        })
    }
}
