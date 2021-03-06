import DOM from "@DOMPath/DOM/Classes/dom"
import ContentEditable from "./contentEditable"
import Icon from "../icon"
import { ContextMenu } from "../../elements"

export default class WidgetEditable {
    constructor({
        placeholder = "Tap to change",
        contextParams = {},
        builder = () => { },
        defaults = "",
        iconName = "edit",
        disableResizeHide = false,
        style = {},
        contentStyle = {},
        placeholderStyle = {},
        printFunction = (e) => String(e),
        dataGrabber = (el) => el.elementParse.native.innerText,
    }) {
        const methods = {}

        const input = new ContentEditable({
            placeholder,
            editable: false,
            methods,
            content: defaults,
            style,
            contentStyle,
            placeholderStyle,
            printFunction,
            dataGrabber,
        })

        return new DOM({
            new: "md-widget-editable",
            content: [
                input,
                ...(iconName !== null ? [new DOM({
                    new: "div",
                    class: "md-select-hint",
                    content: new Icon(iconName),
                })] : []),
            ],
            events: [
                {
                    event: "click",
                    async handler(e) {
                        ContextMenu({
                            generate: false,
                            ...contextParams,
                            content: (context) => builder(input, context),
                            event: e,
                            disableResizeHide,
                        })
                    },
                },
            ],
            objectProperty: [
                {
                    name: "currentValue",
                    get() {
                        return input.currentValue
                    },
                },
                {
                    name: "changeValue",
                    handler(n) {
                        input.emitEvent("editValue", { content: n })
                    },
                },
            ],
        })
    }
}
