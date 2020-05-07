import {
    CoreLoader, CoreLoaderResult, CoreLoaderSkip, CoreLoaderWarning,
} from "@Core/Init/CoreLoader"
import SplashScreenController from "./SplashScreenController"

CoreLoader.registerTask({
    id: "splashscreen",
    presence: "SplashScreen",
    task() {
        if (!SplashScreenController.enabled) return new CoreLoaderSkip()
        SplashScreenController.splashFunction()
        const exec = () => {
            if (SplashScreenController.enabled) {
                document.body.appendChild(SplashScreenController.splashElement)
            }
        }
        if (!document.body) window.addEventListener("DOMContentLoaded", exec)
        else {
            try {
                exec()
            } catch (e) {
                throw new CoreLoaderWarning("SplashScreen failed", e)
            }
        }

        return new CoreLoaderResult()
    },
})
