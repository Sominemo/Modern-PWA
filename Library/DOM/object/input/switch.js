import DOM from "@DOMPath/DOM/Classes/dom"

export default class Switch {
    static stateAttr = "state"

    static lockedAttr = "locked"

    constructor(
        state = false,
        onchange = (newValue, observer = false, element) => { },
        { locked = false, include = false, approveFirst = false } = {},
    ) {
        let approving = false
        let ignoreChange = false
        let element
        const changeState = async (s, o = false) => {
            s = (s ? 1 : 0)
            if (!o) {
                element.elementParse.native
                    .setAttribute(this.constructor.stateAttr, s.toString())
            } else {
                if (ignoreChange) return
                await onchange(s, o, element)
            }
        }

        const toggleState = () => {
            if (locked || approving) return
            changeState(!(parseInt(element.elementParse.native
                .getAttribute(this.constructor.stateAttr), 10)))
        }

        const changeStateHandler = async (r, o) => {
            await Promise.all(r.map(async (e) => {
                if (e.attributeName === this.constructor.stateAttr) {
                    let isError = false
                    if (locked) return
                    if (approving) return
                    if (approveFirst) element.setAttributes({ name: this.constructor.lockedAttr, value: "" })
                    approving = true
                    const newValue = parseInt(element.elementParse.native
                        .getAttribute(this.constructor.stateAttr), 10)
                    try {
                        await changeState(newValue, o)
                    } catch (er) {
                        ignoreChange = true
                        await changeState(!newValue)
                        ignoreChange = false
                        isError = er
                    }
                    approving = false
                    if (approveFirst) element.removeAttributes(this.constructor.lockedAttr)
                    if (isError) {
                        throw isError
                    }
                }
                if (e.attributeName === this.constructor.lockedAttr) {
                    if (approving) return
                    if (!element.elementParse.native
                        .hasAttribute(this.constructor.lockedAttr)) locked = false
                    else locked = true
                }
            }))
        }

        element = new DOM({
            new: "switch-input",
            attributes: {
                state: (state ? 1 : 0),
                ...(locked ? [{ locked: "" }] : []),
            },
            mutations: [
                {
                    config: { attributes: true, attributeOldValue: true },
                    handler: changeStateHandler,
                },
            ],
            events: [
                ...(include ? [] : [{
                    event: "click",
                    handler: toggleState,
                }]),
            ],
            objectProperty: [
                {
                    name: "changeState",
                    value: changeState,
                },
            ],
        })

        return (include ? [element, toggleState] : element)
    }
}
