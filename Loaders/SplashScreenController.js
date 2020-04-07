import LoadState from "@Core/Services/LoadState"
import delayAction from "@Core/Tools/objects/delayAction"
import Report from "@Core/Services/reportOld"
import Sleep from "@Core/Tools/objects/sleep"

export default class SplashScreenController {
    static enabled = true

    static splashElement = document.createElement("div")

    static splashBG = "#181A1D"

    static splashColor = "#FFFFFF"

    static splashImage = document.createElement("div")

    static name = ""

    static splashFunction() {
        const e = this.splashElement

        const style = document.createElement("style")
        style.innerHTML = `@keyframes splash-logo-pulse {
            0% {
                transform: scale(1);
                opacity: 1;
            }

            50% {
                transform: scale(1.05);
                opacity: 0.75;
            }

            100% {
                transform: scale(1);
                opacity: 1;
            }
        }`

        e.appendChild(style)

        e.style.background = this.splashBG
        e.style.color = this.splashColor
        e.style.position = "fixed"
        e.style.top = "0"
        e.style.left = "0"
        e.style.width = "100%"
        e.style.height = "100%"
        e.style.display = "flex"
        e.style.flexDirection = "column"
        e.style.zIndex = "1000"

        const logoCell = document.createElement("div")
        logoCell.style.height = "50%"
        logoCell.style.position = "relative"
        logoCell.style.display = "flex"
        logoCell.style.alignItems = "flex-end"
        logoCell.style.justifyContent = "center"

        const logoImage = this.splashImage
        logoImage.style.animationName = "splash-logo-pulse"
        logoImage.style.animationIterationCount = "infinite"
        logoImage.style.animationDuration = "2s"

        logoCell.appendChild(logoImage)
        e.appendChild(logoCell)

        const statusCell = document.createElement("div")
        statusCell.style.height = "50%"
        statusCell.style.position = "relative"
        statusCell.style.display = "flex"
        statusCell.style.alignItems = "center"
        statusCell.style.justifyContent = "center"

        const title = document.createElement("div")
        title.style.fontSize = "1.5em"
        title.style.fontFamily = "'Segoe UI', Arial, sans-serif"
        title.style.fontWeight = "500"
        title.innerHTML = this.name

        statusCell.appendChild(title)
        e.appendChild(statusCell)

        LoadState.ondone = () => {
            try {
                e.style.willChange = "opacity"
                e.style.transition = "opacity .2s"
                delayAction(async () => {
                    e.style.pointerEvents = "none"
                    e.style.opacity = "0"
                    await Sleep(200)
                    delayAction(() => {
                        try {
                            e.remove()
                        } catch (er) {
                            Report.error("SplashScreen remove failed", er, e)
                        }
                    })
                })
            } catch (err) {
                Report.error("SplashScreen remove failed", err, e)
                e.style.pointerEvents = "none"
                e.style.opacity = "0"
            }
        }
    }
}
