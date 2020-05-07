import DOM from "@DOMPath/DOM/Classes/dom"
import WindowManager from "@Core/Services/SimpleWindowManager"
import ContextMenuElement from "./contextMenuElement"
import { Icon } from "../object"
import { Scaffold } from "../buildBlock"

function toMenuItem(o, close = false, ind) {
    const {
        type = "item", icon = null, title, handler = () => { }, disabled = false, unshown = false, style = {},
    } = o

    if (unshown) return false

    if (type === "delimeter") return new DOM({ new: "context-menu-delimeter" })

    if (type === "item") {
        const proxyHandler = () => {
            handler()
            if (close) close()
            else ContextMenuElement.closeAll()
        }

        return new DOM({
            new: "context-menu-item",
            content: new DOM({
                new: "context-menu-item-holder",
                content: [
                    new Icon(icon),
                    new DOM({
                        new: "context-menu-item-title",
                        content: title,
                    }),
                ],
            }),
            style,
            ...(disabled ? { attributes: [{ name: "disabled", value: "" }] } : {}),
            events: [
                {
                    event: "click",
                    handler: proxyHandler,
                },
            ],
            ...(
                ind === 0 && Scaffold.accessibility
                    ? {
                        onRendered(ev, el) {
                            setTimeout(() => {
                                el.elementParse.native.focus()
                            }, 200)
                        },
                    }
                    : {}
            ),
        })
    }

    if (type === "element") {
        return new DOM({
            new: "context-menu-element",
            content: title,
            style,
        })
    }

    return false
}


function ContextMenu({
    content = [], coords = null, style = {}, mode = "context", event = false, noSelfControl = false,
    onClose = false, classes = [], onRendered = () => { }, onClosing = false, renderClasses = [],
    generate = true, disableResizeHide = false, closeOnKey = true,
} = {}) {
    const h = WindowManager.newHelper()

    const cm = new ContextMenuElement({
        coords,
        style,
        control: h,
        event,
        mode,
        noSelfControl,
        classes,
        onClose,
        onRendered,
        onClosing,
        renderClasses,
        disableResizeHide,
        closeOnKey,
        content: (
            generate
                ? content.reduce((a, c, ind) => {
                    const conv = toMenuItem(c, () => { cm[0].emitEvent("contextMenuClose") }, ind)
                    if (conv) a.push(conv)
                    return a
                }, [])
                : (typeof content === "function" ? content(() => cm[0]) : content)
        ),
    })

    h.append(cm[1])
    h.append(cm[0])

    return (noSelfControl ? [cm[0], cm[2]] : cm[0])
}

export {
    ContextMenu,
    toMenuItem,
}
