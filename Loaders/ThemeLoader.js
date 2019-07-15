import Design from "@Core/Services/design"
import { CoreLoader, CoreLoaderResult } from "@Core/Init/CoreLoader"

CoreLoader.registerTask({
    id: "load-theme",
    presence: "Load Theme",
    async task() {
        const dt = Design.defaultTheme
        require(`@Themes/${dt}/theme.css`).use()
        return new CoreLoaderResult(true, await Design.themeLoader())
    },
})
