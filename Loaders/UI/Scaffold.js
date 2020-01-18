import { CoreLoader } from "@Core/Init/CoreLoader"
import DOMObjectWrapper from "@DOMPath/DOM/Helpers/domObjectWrapper"
import { Scaffold } from "@Environment/Library/DOM/buildBlock"
import Navigation from "@Core/Services/navigation"
import SplashScreenController from "../SplashScreenController"

CoreLoader.registerTask({
    id: "scaffold",
    presence: "Load UI and navigate",
    task() {
        Array.from(document.body.children).forEach((e) => {
            if (!e.isEqualNode(SplashScreenController.splashElement)) e.remove()
        })


        DOMObjectWrapper(document.body)
            .render(new Scaffold({
                navMenu: [
                ],
            }))

        try {
            if (!Navigation.listener("change")) throw new Error("No such listener")
        } catch (e) {
            Navigation.defaultScreen()
        }
    },
})
