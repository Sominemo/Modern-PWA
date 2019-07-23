import Prompt from "@Environment/Library/DOM/elements/prompt"
import { CoreLoader, CoreLoaderResult, CoreLoaderWarning } from "@Core/Init/CoreLoader"
import SettingsStorage from "../../../core/Services/Settings/SettingsStorage"
import { $$ } from "../../../core/Services/Language/handler"

CoreLoader.registerTask({
    id: "test-db-writable",
    presence: "IDB Usability",

    async task() {
        let test = true
        let err
        try {
            test = await SettingsStorage.setFlag("idb_compatible_test", true)
        } catch (e) {
            test = false
            err = e
        }
        if (!test) {
            Prompt({
                // TODO: Localizations
                title: $$("@recovery_mode/idb_fail/warning"),
                text: $$("@recovery_mode/idb_fail/description"),
                buttons: [
                    {
                        content: $$("@recovery_mode/idb_fail/dl_ff"),
                        type: ["light"],
                        handler() {
                            window.location.href = "https://www.mozilla.org/firefox/new/"
                        },
                    },
                    {
                        content: $$("@recovery_mode/idb_fail/dl_chrome"),
                        handler() {
                            window.location.href = "https://www.google.com/chrome/"
                        },
                    },
                ],
            })
            return new CoreLoaderWarning("IDB test failed", err)
        }
        return new CoreLoaderResult()
    },
})
