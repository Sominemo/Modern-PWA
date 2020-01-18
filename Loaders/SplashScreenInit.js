import { CoreLoader, CoreLoaderResult, CoreLoaderSkip } from "@Core/Init/CoreLoader"
import SplashScreenController from "./SplashScreenController"

CoreLoader.registerTask({
    id: "splashscreen",
    presence: "SplashScreen",
    task() {
        if (!SplashScreenController.enabled) return new CoreLoaderSkip()
        SplashScreenController.splashFunction()
        window.addEventListener("load", () => {
            document.body.appendChild(SplashScreenController.splashElement)
        })

        return new CoreLoaderResult()
    },
})
