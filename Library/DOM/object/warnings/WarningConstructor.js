import Design from "@Core/Services/design"
import DOM from "@DOMPath/DOM/Classes/dom"
import IconSide from "../iconSide"
import Title from "../title"
import TwoSidesMobileFlick from "../twoSidesMobileFlick"
import { Card, CardContent } from "../card"
import TwoSidesWrapper from "../twoSidesWrapper"

export default class WarningConstructor {
    constructor({
        title = "",
        content = "",
        icon = null,
        type = 0, // 0 - none; 1 - main; 2 - accent; 3 - warning
        sideContent = null,
        style = {},
    } = {}) {
        let iconColor = ""
        let cardType = []
        if (type === 1) {
            iconColor = Design.getVar("color-main")
            cardType = ["main-highlight"]
        } else if (type === 2) {
            iconColor = Design.getVar("color-accent")
            cardType = ["accent-highlight"]
        } else if (type === 3) {
            iconColor = Design.getVar("color-warning-info")
            cardType = ["warn-highlight"]
        }

        return new Card(
            new CardContent(
                new (sideContent === null ? TwoSidesWrapper : TwoSidesMobileFlick)(
                    new IconSide(icon,
                        [
                            new Title(title, 2, { margin: 0 }),
                            new DOM({ new: "div", content }),
                        ],
                        {
                            style: {
                                color: iconColor,
                                margin: "5px 15px 5px 5px",
                                fontSize: "32px",
                                ...(icon === null ? { display: "none" } : {}),
                            },
                            containerStyle: {
                                width: "100%",
                            },
                            contentStyle: {
                                width: "100%",
                            },
                        }),
                    (sideContent === null ? [] : sideContent),
                ),
            ), {
                type: cardType,
                style,
            },
        )
    }
}
