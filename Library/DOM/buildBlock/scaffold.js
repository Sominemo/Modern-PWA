import DOM from "@DOMPath/DOM/Classes/dom"
import WindowManager from "@Core/Services/SimpleWindowManager"
import SettingsStorage from "@Core/Services/Settings/SettingsStorage"
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
                new DOM({
                    new: "div",
                    id: "accessibility-link-bar",
                    class: ["sr-only"],
                    content: new DOM({
                        new: "a",
                        id: "accessibility-link",
                        class: ["sr-only"],
                        ...(this.constructor.accessibility
                            ? {
                                content: this.constructor.skipNavSign,
                                attributes: [
                                    {
                                        name: "href",
                                        value: "#main",
                                    },
                                ],
                            }
                            : {
                                content: this.constructor.enableAccessibilitySign,
                                attributes: [
                                    {
                                        name: "href",
                                        value: "#",
                                    },
                                ],
                                events: [
                                    {
                                        event: "click",
                                        handler: this.constructor.enableAccessibilityHandler,
                                    },
                                ],
                            }),
                    }),
                }),
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
                    id: "main",
                }),
            ],
        })
    }

    static accessibility = false

    static skipNavSign = "Skip navigation"

    static enableAccessibilitySign = "Enable accessibility features"

    static async enableAccessibilityHandler() {
        await SettingsStorage.setFlag("enable_tab_navigation", true)
        window.location.reload()
    }
}
