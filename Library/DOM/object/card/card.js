import DOM from "@DOMPath/DOM/Classes/dom"
import CardContent from "./cardContent"

export default class Card {
    constructor(content = [], { style = {}, type = [] } = {}, other = {},
        { noPadding = false } = {}) {
        return new DOM({
            new: "div",
            class: ["card", ...type],
            style,
            content: (typeof content === "string" && !noPadding ? new CardContent(content) : content),
            ...other,
        })
    }
}
