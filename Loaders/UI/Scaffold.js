import { CoreLoader } from "@Core/Init/CoreLoader"
import DOMObjectWrapper from "@DOMPath/DOM/Helpers/domObjectWrapper"
import { Scaffold } from "@Environment/Library/DOM/buildBlock"
import Navigation from "@Core/Services/navigation"

CoreLoader.registerTask({
    id: "scaffold",
    presence: "Load UI and navigate",
    task() {
        document.body.innerHTML = ""

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
