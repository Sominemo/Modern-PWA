import DOM from "@DOMPath/DOM/Classes/dom"
import Design from "@Core/Services/design"

export default class TextWithSubtext {
    constructor(text, subtext) {
        return new DOM({
            new: "div",
            content: [
                new DOM({ new: "div", content: text }),
                new DOM({
                    new: "div",
                    style: {
                        display: "flex",
                        alignItems: "center",
                    },
                    content: new DOM({
                        new: "div",
                        content: subtext,
                        style: {
                            color: Design.getVar("color-generic-light-b"),
                            fontSize: "12px",
                        },
                    }),
                }),
            ],
        })
    }
}
