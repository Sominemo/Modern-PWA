import FieldsContainer from "@Core/Tools/validation/fieldsContainer"
import FieldChecker from "@Core/Tools/validation/fieldChecker"
import DOM from "@DOMPath/DOM/Classes/dom"
import MDRadio from "./md-radio"

export default class RadioLabel {
    constructor(data, style = [], bigCard = false, noBorders = false) {
        new FieldsContainer(["array",
            new FieldsContainer([
                ["handler", "content"],
                {
                    handler: new FieldChecker({ type: "function" }),
                },
            ])]).set(data)

        const radios = new MDRadio(data.map((e) => ({
            handler: e.handler,
            selected: (typeof e.selected === "function" ? !!(e.selected()) : !!e.selected),
            include: true,
        })), style)

        return radios.map((m, i) => new DOM({
            new: "div",
            class: ["card-list-item", "card-list-item-clickable"],
            content: new DOM({
                new: "div",
                class: ["flex-container", "md-radio-label", ...(bigCard ? ["big-card"] : [])],
                content: [
                    m[0],
                    new DOM({
                        new: "div",
                        class: "md-radio-label-content",
                        content: data[i].content,
                    }),
                ],
            }),
            ...(noBorders ? { style: { borderBottom: 0 } } : {}),
            events: [
                {
                    event: "click",
                    handler() { return m[1]() },
                },
            ],
        }))
    }
}
