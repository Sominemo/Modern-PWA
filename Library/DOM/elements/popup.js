import FadeOut from "@Environment/Library/Animations/fadeOut"
import DOM from "@DOMPath/DOM/Classes/dom"
import FadeIn from "@Environment/Library/Animations/fadeIn"
import { Report } from "@Core/Services/Report"
import { Card } from "../object/card"
import { Scaffold } from "../buildBlock"

export default class Popup {
    constructor(content, {
        control = {}, fullWidth = false, fullHeight = false,
        noClose = false, fixedContext = false, cardStyle = {},
        cardSet = {}, cardClass = [], onPop = () => { }, cardAdditional,
    } = {}) {
        let escapeListener

        const pop = async () => {
            try {
                onPop()
                document.removeEventListener("keyup", escapeListener)
                if (fixedContext) window.removeEventListener("appNavigation", pop)
                await new FadeOut({ duration: 200 }).apply(control.element)
                control.pop()
            } catch (e) {
                Report.add(e, "error")
            }
        }

        escapeListener = (evt) => {
            if ((evt.key === "Escape" || evt.key === "Esc") && !noClose) pop()
        }

        const pe = new Card(new DOM({
            new: "div",
            class: ["card-scroll-container"],
            content: new DOM({
                new: "div",
                class: ["card-scroll-content"],
                content,
                style: {
                    ...(fullHeight ? { height: "100%" } : {}),
                },
            }),
            style: {
                ...(fullHeight ? { height: "100%" } : {}),
            },
        }), {
            style: {
                ...(fullHeight ? { height: "100%" } : {}),
                ...cardStyle,
            },
            type: cardClass,
        }, cardSet, cardAdditional)

        document.addEventListener("keyup", escapeListener)
        if (fixedContext) window.addEventListener("appNavigation", pop)

        return new DOM({
            new: "div",
            onRender(p, e) { new FadeIn({ duration: 200 }).apply(e) },
            ...(Scaffold.accessibility
                ? {
                    onRendered(p, e) {
                        setTimeout(() => {
                            e.elementParse.native.focus()
                        }, 200)
                    },
                }
                : {}),
            style: {
                opacity: "0",
            },
            class: ["popup-main-scaffold"],
            objectProperty: [
                {
                    name: "close",
                    handler: pop,
                },
            ],
            content: [
                new DOM({
                    new: "div",
                    class: ["blackout-fullscreen"],
                    events: [
                        {
                            event: "click",
                            handler() {
                                if (!noClose) return pop()
                                return true
                            },
                        },
                    ],
                }),
                new DOM({
                    new: "div",
                    class: ["absolute-popup-container"],
                    content:
                        new DOM({
                            new: "div",
                            class: ["popup-position-wrap"],
                            content: new DOM({
                                new: "div",
                                class: ["popup-limit-container"],
                                style: {
                                    ...(fullWidth ? { width: "100%" } : {}),
                                },
                                content: new DOM({
                                    new: "div",
                                    class: ["popup-under-limit-position"],
                                    content: pe,
                                    style: {
                                        ...(fullHeight ? { height: "100%" } : {}),
                                    },
                                }),
                            }),
                        }),
                }),
            ],
        })
    }
}
