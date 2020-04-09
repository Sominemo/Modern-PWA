import DateToString from "@Core/Tools/time/dateToString"
import Design from "@Core/Services/design"
import { Align } from "@Environment/Library/DOM/style"
import WidgetEditable from "../widgetEditable"
import TextInput from "../textInput"
import Button from "../button"
import IconSide from "../../iconSide"
import { CardContent } from "../../card"

export default class DateInput {
    constructor({
        content = new Date(), placeholder = "", onchange = () => { }, iconName = "edit", buttonText = "Done",
    } = {}) {
        let acceptHandler

        return new WidgetEditable({
            builder(input, context) {
                const c = []
                const numberInput = new TextInput({
                    set: {
                        type: "date",
                        valueAsDate: input.currentValue,
                    },
                    style: {
                        boxShadow: "none",
                        fontSize: "42px",
                        color: Design.getVar("color-accent"),
                        overflowX: "auto",
                        textAlign: "center",
                        padding: "0 10px",
                        width: "400px",
                        margin: "10px auto 0 auto",
                    },
                    params: {
                        onRendered(ev, el) {
                            setTimeout(() => {
                                el.elementParse.native.focus()
                            }, 200)
                        },
                    },
                    dataGrabber: (el) => el.elementParse.native.valueAsDate,
                    dataSetter: (el, v) => { el.elementParse.native.valueAsDate = v },
                })
                c.push(numberInput)

                acceptHandler = () => {
                    const newValue = numberInput.elementParse.native.valueAsDate

                    input.emitEvent("editValue", { content: newValue })
                    if (typeof onchange === "function") onchange(newValue)
                    context().emitEvent("contextMenuClose")
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
            defaults: content,
            placeholder,
            printFunction: DateToString,
            dataGrabber: (el) => el.elementParse.native.valueAsDate,
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
