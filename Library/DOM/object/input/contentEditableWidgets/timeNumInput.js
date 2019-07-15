import Design from "@Core/Services/design"
import { $$ } from "@Core/Services/Language/handler"
import { Align } from "@Environment/Library/DOM/style"
import WidgetEditable from "../widgetEditable"
import TextInput from "../textInput"
import Button from "../button"
import IconSide from "../../iconSide"
import { CardContent } from "../../card"

export default class TimeNumInput {
    constructor({
        content = "00:00", placeholder = "", onchange = () => { }, iconName = "edit",
    } = {}) {
        let acceptHandler

        return new WidgetEditable({
            builder(input, context) {
                const c = []
                const numberInput = new TextInput({
                    set: {
                        type: "time",
                        value: input.currentValue,
                    },
                    style: {
                        boxShadow: "none",
                        fontSize: "42px",
                        color: Design.getVar("color-accent"),
                        overflowX: "auto",
                        textAlign: "center",
                        padding: "0 10px",
                        width: "300px",
                        margin: "10px auto 0 auto",
                    },
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
                    const newValue = numberInput.elementParse.native.value
                    if (!newValue.match(/^([01]\d|2[0-3]):([0-5]\d)$/)) return
                    input.emitEvent("editValue", { content: `${newValue}` })
                    if (typeof onchange === "function") onchange(newValue)
                    context().emitEvent("contextMenuClose")
                }

                c.push(new Button({
                    // TODO: Localize
                    content: new IconSide("done", $$("done")),
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
            defaults: `${content}`,
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
