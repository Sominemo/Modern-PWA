import DOM from "@DOMPath/DOM/Classes/dom"

export default class TextInput {
    constructor({
        set = {}, style = {}, events = [], params = {},
        dataGrabber = (el) => el.elementParse.native.value,
        dataSetter = (el, v) => { el.elementParse.native.value = v },
    }) {
        return new DOM({
            new: "input",
            class: "md-input",
            set,
            style,
            events,
            objectProperty: [
                {
                    name: "currentValue",
                    get() { return dataGrabber(this) },
                },
                {
                    name: "value",
                    set(v) { dataSetter(this, v) },
                },
            ],
            ...params,
        })
    }
}
