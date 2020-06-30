import DOM from "@DOMPath/DOM/Classes/dom"
import delayAction from "@Core/Tools/objects/delayAction"
import hexToRgb from "@Core/Tools/transformation/text/hexToRgb"
import { Icon } from "../object"

export default class Block {
    constructor(
        props = {},
    ) {
        const render = props.render || (() => ({ content: "", color: [142, 142, 142] /* style: {...} */ }))
        const icon = props.icon || "dashboard"
        const colors = props.colors || { main: "#727272", light: "#bcbfc1" }
        const data = props.data || {}
        const request = props.request || []
        const size = props.size || { x: 1, y: 1 }
        const setup = props.setup || (() => {})
        const name = props.name || "Widget"
        return new DOM({
            new: "modern-block",
            objectProperty: [
                {
                    name: "props",
                    handler: props,
                },
                {
                    name: "name",
                    handler: name,
                },
                {
                    name: "setup",
                    handler: setup,
                },
                {
                    name: "controller",
                    handler: props.controller || null,
                    writable: true,
                    configurable: true,
                },
                {
                    name: "data",
                    handler: data,
                },
                {
                    name: "size",
                    handler: size,
                },
                {
                    name: "colors",
                    handler: colors,
                },
            ],
            async onRendered(ev, el) {
                const d = (el.controller
                    ? await el.controller.dataRequest(request)
                    : [])
                const result = await render(el, d)
                const body = new DOM({
                    new: "modern-block-body",
                    content: result.content,
                    style: {
                        opacity: "0",
                    },
                    onRendered() {
                        this.style(result.style)
                        this.setEvents(result.events || [])

                        delayAction(() => {
                            this.style({ opacity: "" })
                            setTimeout(() => {
                                el.content.values().next().value.destructSelf()
                                const color = (
                                    (
                                        Array.isArray(result.shadow)
                                            ? result.shadow
                                            : hexToRgb(result.shadow, { array: true })
                                    )
                                    || [142, 142, 142]).join(",")
                                el.style({
                                    "--shadow-block-color": color,
                                })
                            }, 200)
                        })
                    },
                })
                el.render(body)
            },
            content: [
                new DOM({
                    new: "div",
                    content: [
                        new Icon(icon, {
                            opacity: ".3",
                            position: "absolute",
                            left: "50%",
                            top: "50%",
                            transform: "translate(-50%, -50%)",
                            fontSize: "2em",
                            color: colors.main,
                        }),
                        new DOM({
                            new: "progress",
                            class: ["material-linear"],
                            style: {
                                position: "absolute",
                                bottom: "0",
                                left: "0",
                                width: "100%",
                                height: "1.5vmin",
                                opacity: ".3",
                                "--progress-color": colors.main,
                                "--progress-color-light": colors.light,
                            },
                        }),
                    ],
                }),
            ],
        })
    }
}
