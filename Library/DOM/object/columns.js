import FieldsContainer from "@Core/Tools/validation/fieldsContainer"
import DOM from "@DOMPath/DOM/Classes/dom"

export default class Columns {
    constructor(content, {
        styleFirst = {}, styleLast = {}, classFirst = [], classLast = [],
    } = {}) {
        new FieldsContainer(["array", new FieldsContainer([
            ["first", "last"], {},
        ])]).set(content)

        const columnItems = []
        content.forEach(((e) => {
            columnItems.push(new DOM({
                new: "div",
                class: "columns-sector",
                content: [
                    new DOM({
                        new: "div",
                        content: e.first,
                        style: styleFirst,
                        class: classFirst,
                    }),
                    new DOM({
                        new: "div",
                        content: e.last,
                        style: styleLast,
                        class: classLast,
                    }),
                ],
            }))
        }))

        const cont = new DOM({
            new: "div",
            class: ["columns-container"],
            content: columnItems,
        })

        return cont
    }
}
