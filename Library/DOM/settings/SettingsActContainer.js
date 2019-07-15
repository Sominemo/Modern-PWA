import DOM from "@DOMPath/DOM/Classes/dom"
import FieldsContainer from "@Core/Tools/validation/fieldsContainer"
import FieldChecker from "@Core/Tools/validation/fieldChecker"
import { $$ } from "@Core/Services/Language/handler"
import { Title } from "../object"
import Toast from "../elements/toast"

export default class SettingsActContainer {
    constructor(data, object) {
        new FieldsContainer([
            ["name"],
            {
                name: new FieldChecker({ type: "string" }),
            },
        ]).set(data)

        return new DOM({
            new: "div",
            class: ["settings-act-container"],
            content: [
                // TODO: Make a toast onRender
                new Title(data.name),
            ],
            ...(data.lock ? {
                style: { pointerEvents: "none", opacity: 0.7 },
            } : {}),
            onRender(p, e) {
                if (data.lock) {
                    // TODO: Localize
                    Toast.add($$("@settings/locked_item"))
                }
            },
        })
    }
}
