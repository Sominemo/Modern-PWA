import FieldsContainer from "@Core/Tools/validation/fieldsContainer"
import FieldChecker from "@Core/Tools/validation/fieldChecker"
import DOM from "@DOMPath/DOM/Classes/dom"
import WindowManager from "@Core/Services/SimpleWindowManager"
import Design from "@Core/Services/design"
import ContentEditable from "./contentEditable"
import RadioLabel from "./radioLabel"
import Icon from "../icon"
import { Popup } from "../../elements"
import { Scaffold } from "../../buildBlock"

export default class SelectInput {
    constructor({
        placeholder = "Select option",
        options = [],
        defaultOption = -1,
        change = (option) => { },
        emptySelection = true,
        autoClose = true,
    }) {
        new FieldsContainer(["array", new FieldsContainer([
            ["content", "value"],
            {
                content: new FieldChecker({ type: "string" }),
            },

        ])]).set(options)

        let selection = (defaultOption >= 0 ? options[defaultOption] : { content: "", value: null })

        const input = new ContentEditable({
            placeholder,
            editable: false,
            content: selection.content,
        })

        let p

        const radioOptions = options.map((option, index) => ({
            content: option.content,
            handler(s) {
                if (!s) return
                selection = option
                input.emitEvent("editValue", { content: option.content })
                change(option)
                p.close()
            },
            selected: index === defaultOption,
        }))

        if (emptySelection) {
            radioOptions.unshift({
                content: new DOM({ new: "span", content: String(emptySelection), style: { color: Design.getVar("color-generic-light-b") } }),
                handler(s) {
                    if (!s) return
                    const ne = { content: "", value: null }
                    selection = ne
                    input.emitEvent("editValue", { content: "" })
                    change(ne)
                    p.close()
                },
                selected: defaultOption < 0,
            })
        }

        const selector = new RadioLabel(radioOptions)

        if (Scaffold.accessibility) {
            try {
                selector[0].onEvent("rendered", (ev, el) => {
                    setTimeout(() => {
                        el.elementParse.native.focus()
                    }, 200)
                })
            } catch (e) {
                // Nothing to focus
            }
        }

        return new DOM({
            new: "md-select",
            content: [
                input,
                new DOM({
                    new: "div",
                    class: "md-select-hint",
                    content: new Icon("arrow_drop_down"),
                }),
            ],
            events: [
                {
                    event: "click",
                    handler() {
                        const o = WindowManager.newOverlay()
                        p = new Popup(selector, {
                            control: o,
                            fullWidth: true,
                        })

                        o.append(p)
                    },
                },
            ],
        })
    }
}
