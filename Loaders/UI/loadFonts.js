import { CoreLoader, CoreLoaderSkip, CoreLoaderResult } from "@Core/Init/CoreLoader"

CoreLoader.registerTask({
    id: "fonts",
    presence: "Fonts loading",
    async task() {
        if (!document.fonts) return new CoreLoaderSkip("Fonts API is not supported")
        await Promise.all(Array.from(document.fonts)
            .reverse()
            .map((font) => font.load().catch((e) => e)))
        return new CoreLoaderResult()
    },
})
