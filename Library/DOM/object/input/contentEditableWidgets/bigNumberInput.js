import Design from "@Core/Services/design"
import DOM from "@DOMPath/DOM/Classes/dom"
import { Align } from "@Environment/Library/DOM/style"
import WidgetEditable from "../widgetEditable"
import NumericTextInput from "../numericTextInput"
import Button from "../button"
import IconSide from "../../iconSide"
import { CardContent } from "../../card"

export default class BigNumberInput {
    constructor({
        content = 0, placeholder = "", onchange = () => { }, units = null, min = 0, max = null, iconName = "edit", buttonText = "Done",
    } = {}) {
        let acceptHandler
        let unitHint = null

        return new WidgetEditable({
            builder(input, context) {
                const c = []
                const numberInput = new NumericTextInput({
                    set: {
                        value: parseInt(input.currentValue, 10),
                        placeholder,
                    },
                    style: {
                        boxShadow: "none",
                        fontSize: "42px",
                        color: Design.getVar("color-accent"),
                        overflowX: "auto",
                        textAlign: "center",
                        padding: "0 10px",
                        width: "200px",
                        margin: "10px auto 0 auto",
                    },
                    events: [
                        {
                            event: "keyup",
                            handler(ev) {
                                if (ev.keyCode === 13) {
                                    acceptHandler()
                                }
                            },
                        },
                        {
                            event: "input",
                            async handler(ev, el) {
                                const elm = el.elementParse.native

                                elm.value = elm.value.replace(/^0+/, "")

                                if (elm.value === "") elm.value = min

                                if (min !== null
                                    && (typeof min === "function"
                                        ? parseInt(elm.value, 10) < await min()
                                        : parseInt(elm.value, 10) < min)) {
                                    elm.value = (typeof min === "function" ? await min() : min)
                                }
                                if (max !== null
                                    && (typeof max === "function"
                                        ? parseInt(elm.value, 10) > await max()
                                        : parseInt(elm.value, 10) > max)) {
                                    elm.value = (typeof max === "function" ? await max() : max)
                                }

                                if (unitHint !== null) {
                                    unitHint.clear(new DOM({
                                        type: "text",
                                        new: (typeof units === "function" ? units(parseInt(elm.value, 10)) : (units !== null ? units : "")),
                                    }))
                                }
                            },
                        },
                    ],
                    params: {
                        onRendered(ev, el) {
                            setTimeout(() => {
                                el.elementParse.native.focus()
                            }, 200)
                        },
                    },
                })
                c.push(numberInput)

                acceptHandler = () => {
                    const newValue = parseInt(numberInput.elementParse.native.value, 10)
                    const newUnits = (typeof units === "function" ? units(newValue) : (units !== null ? units : ""))
                    input.emitEvent("editValue", { content: `${newValue} ${newUnits}` })
                    if (typeof onchange === "function") onchange(newValue)
                    context().emitEvent("contextMenuClose")
                }

                if (units !== null) {
                    unitHint = new DOM({
                        new: "div",
                        content: (typeof units === "function" ? units(parseInt(input.currentValue, 10)) : (units !== null ? units : "")),
                        style: {
                            color: Design.getVar("color-accent-light"),
                            textAlign: "center",
                            fontSize: "24px",
                            marginBottom: "20px",
                        },
                    })
                    c.push(unitHint)
                }

                c.push(new Button({
                    content: new IconSide("done", buttonText),
                    type: ["accent"],
                    style: {
                        marginLeft: "auto",
                        marginRight: "auto",
                        borderRadius: "2em",
                    },
                    handler: acceptHandler,
                }))

                return new CardContent(new Align(c, ["center", "column"]), { whiteSpace: "nowrap" })
            },
            disableResizeHide: true,
            defaults: `${content} ${(typeof units === "function" ? units(content) : (units !== null ? units : ""))}`,
            placeholder,
            iconName,
            style: {
                boxShadow: "none",
            },
            contentStyle: {
                minHeight: "auto",
                paddingBottom: "0",
            },
        })
    }
}
