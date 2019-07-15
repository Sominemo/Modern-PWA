import DOMController from "@DOMPath/DOM/Helpers/domController"
import { CoreLoader } from "@Core/Init/CoreLoader"

CoreLoader.registerTask({
    id: "dom-config",
    presence: "DOM Configuration",
    task() {
        DOMController.setConfig({
            reportRegistration: false,
            reparseAlways: false,
            useFunctionsComparation: false,

            useDefaultNodeTypeOnError: true,
            allowDeprecatedAttributeConstructor: true,

            contentStringAsTextNode: true,

            eventsOnClickAutoTabIndex: false,
        })
    },
})
