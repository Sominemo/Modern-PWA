import { $$ } from "@Core/Services/Language/handler"
import WarningConstructor from "./WarningConstructor"

export default class InDevelopmentCard {
    constructor() {
        return new WarningConstructor({
            icon: "sms_failed",
            // TODO: Localize
            title: $$("experiments/warning"),
            content: $$("dev_warn"),
            type: 3,
        })
    }
}
