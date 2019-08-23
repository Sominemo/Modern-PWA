import DOM from "@DOMPath/DOM/Classes/dom"

export default class ContentEditable {
    constructor({
        placeholder = "", change = (value, element) => { }, content = "", type = "", contentType = "text",
        editable = true, onRendered = () => { }, style = {}, species = [], contentStyle = {},
        placeholderStyle = {}, transformString = true, onKey = () => {}, set = {},
        focusOnRender = false, onEnter = () => {},
    }) {
        let value = content
        let curValue = value
        let ip
        let contentArray

        if (transformString) {
            contentArray = String(content).split(/\n/g).reduce((arr, b) => [...arr, b, new DOM({ new: "br" })], [])
            contentArray.pop()
        } else contentArray = content

        const methods = {
            elementEvents: [
                {
                    event: "editValue",
                    handler(ev) {
                        if (!("content" in ev)) throw new Error("Incorrect editValue event")
                        if (transformString) {
                            const evalue = String(ev.content)
                            ip.clear(new DOM({ type: "text", new: evalue }))
                            value = evalue
                            change(evalue, ip)
                        } else {
                            value = ev.content
                            ip.clear(ev.content)
                            change(value, ip)
                        }
                    },
                },
            ],
            objectProperty: [
                {
                    name: "currentValue",
                    get() {
                        return value
                    },
                },
                {
                    name: "actualValue",
                    get() {
                        return curValue
                    },
                },
                {
                    name: "focus",
                    handler() {
                        return ip.elementParse.native.focus()
                    },
                },
            ],
        }

        ip = new DOM({
            new: "md-input-content",
            content: (content === "" ? "" : contentArray),
            set: {
                ...(editable ? { contentEditable: "true" } : {}),
            },
            style: {
                // ...(type === "password" ? { "-webkit-text-security": "disc" } : {}),
                ...contentStyle,
            },
            events: [
                {
                    event: "paste",
                    handler(ev, el) {
                        ev.preventDefault()

                        const paste = (ev.clipboardData || window.clipboardData)
                            .getData(contentType)

                        const selection = window.getSelection()
                        if (!selection.rangeCount) return
                        selection.deleteFromDocument()
                        selection.getRangeAt(0).insertNode(document.createTextNode(paste))
                        selection.collapseToEnd()
                    },
                },
                {
                    event: "blur",
                    handler(ev, el) {
                        value = el.elementParse.native.innerText
                        change(value, el)
                    },
                },
                {
                    event: "keypress",
                    handler(ev, el) {
                        curValue = el.elementParse.native.innerText
                        onKey(value, ev, el)
                        if (ev.keyCode === 13) onEnter(value, ev, el)
                    },
                },
            ],
            ...methods,
            onRendered() {
                onRendered()
                if (focusOnRender) {
                    setTimeout(() => {
                        ip.elementParse.native.focus()
                    }, 0)
                }
            },
        })

        const ph = new DOM({
            new: "md-input-placeholder",
            content: placeholder,
            style: placeholderStyle,
        })

        const wr = new DOM({
            new: "md-input",
            class: species,
            content: [
                ip,
                ph,
            ],
            style,
            ...methods,
            set,
        })


        return wr
    }
}
