import DOM from "@DOMPath/DOM/Classes/dom"
import WindowManager from "@Core/Services/SimpleWindowManager"
import Nav from "./nav"

export default class Scaffold {
    constructor(settings) {
        settings.navMenu.forEach((e) => {
            Nav.newItem(e)
        })

        return new DOM({
            new: "div",
            id: "scaffold",
            content: [
                new Nav(),
                new DOM({
                    new: "main",
                    content: WindowManager.Scaffold,
                    attributes: [
                        {
                            name: "role",
                            value: "main",
                        },
                    ],
                }),
            ],
        })
    }
}
