import { CoreLoader } from "@Core/Init/CoreLoader"

CoreLoader.registerTask({
    id: "fonts",
    presence: "Fonts loading",
    async task() {
        await Promise.all(Array.from(document.fonts).map((font) => font.load().catch((e) => e)))
    },
})
