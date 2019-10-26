import FieldsContainer from "@Core/Tools/validation/fieldsContainer"
import FieldChecker from "@Core/Tools/validation/fieldChecker"
import DOM from "@DOMPath/DOM/Classes/dom"
import CardContent from "./cardContent"

export default class CardList {
    constructor(content, forceWrapper = false) {
        new FieldsContainer([
            "array",
            new FieldsContainer([
                ["content"], {
                    handler: new FieldChecker({ type: "function" }),
                    userSelect: new FieldChecker({ type: "boolean" }),
                    style: new FieldChecker({ type: "object" }),
                    classes: new FieldsContainer(["array", new FieldChecker({ type: "string" })]),
                },
            ]),
        ]).set(content)

        const elements = []

        content.forEach((e) => {
            if (e.content === null) return
            const params = { new: "div" }
            params.class = ["card-list-item", ...("classes" in e ? e.classes : [])]
            if ("content" in e) params.content = (typeof e.content === "string" || (forceWrapper && !e.disableWrapper) ? new CardContent(e.content) : e.content)
            if ("userSelect" in e && !e.userSelect) {
                params.attributes = []
                params.attributes.push({
                    value: "true",
                })
            }
            if ("style" in e) {
                params.style = e.style
            }
            if ("handler" in e) {
                params.class.push("card-list-item-clickable")

                params.events = []
                params.events.push({
                    event: "click",
                    handler: e.handler,
                })
            }

            if ("object" in e) {
                params.objectProperty = e.object
            }

            elements.push(new DOM(params))
        })

        return new DOM({
            new: "div",
            class: ["card-list-container"],
            content: elements,
        })
    }
}
