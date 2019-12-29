import WindowManager from "@Core/Services/SimpleWindowManager"
import DOM from "@DOMPath/DOM/Classes/dom"
import { Title } from "../object"
import { CardContent } from "../object/card"
import { Align } from "../style"
import { Button } from "../object/input"
import Popup from "./popup"

export default function Prompt({
    title = null,
    text = null,
    buttons = [],
    popupSettings = {},
    centredTitle = false,
    pureText = false,
    onClose = () => { },
}) {
    const o = WindowManager.newOverlay()
    const ca = []
    let pop


    if (title !== null) {
        let titleObject = new Title(title, 2)
        if (centredTitle) titleObject = new Align(titleObject, ["row", "center"])
        ca.push(titleObject)
    }
    if (text !== null) ca.push((pureText ? text : new CardContent(text)))
    if (buttons.length > 0) {
        ca.push(new DOM({
            new: "div",
            class: "bottom-buttons",
            content: new Align(buttons.map((e) => {
                if (e instanceof DOM) return e
                if (typeof e === "object") if (e.handler === "close") e.handler = () => pop.close()
                return new Button(e)
            }), ["center", "row"]),
        }))
    }

    const content = (pureText ? ca : new DOM({ new: "div", content: ca }))
    pop = new Popup(content, {
        control: o, fullWidth: true, ...popupSettings, onPop: onClose,
    })
    o.append(pop)
    return pop
}
