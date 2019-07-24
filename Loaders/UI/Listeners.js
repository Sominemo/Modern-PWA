import Listeners from "@Core/Services/Listeners"
import { Nav } from "@Environment/Library/DOM/buildBlock"
import Navigation from "@Core/Services/navigation"
import PointerInfo from "@Core/Services/PointerInfo"

Listeners.add(window, "appNavigation", (e) => { Nav.highlight({ id: e.detail.parsed.module }) }, true)
Listeners.add(window, "resize", () => Nav.updateGesturePosition(), true)
Listeners.add(window, "popstate", () => Navigation.listener(), true)
Listeners.add(window, "mousemove", e => PointerInfo.moveEventListener(e), true)
Listeners.add(window, "click", e => PointerInfo.clickEventListener(e), true)
Listeners.add(window, "contextmenu", e => PointerInfo.contextEventListener(e), true)
