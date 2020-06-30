import DOM from "@DOMPath/DOM/Classes/dom"
import Design from "@Core/Services/design"

export default class ModernBlocks {
    x = 1

    y = 1

    index = []

    widgetsRAW = []

    constructor({
        centering = true, widgets = [], headerStyle = {}, headerContent = [], fixedHeight = true,
        append = [], useClass = false,
    } = {}) {
        this.widgetsRAW = widgets.filter((e) => !(e.item instanceof Error)).sort((a, b) => {
            if (a.y < b.y) return -1
            if (a.y > b.y) return 1

            if (a.x < b.x) return -1
            if (a.x > b.x) return 1
            return 0
        })
        this.fixedHeight = fixedHeight

        this.widgetsRAW.forEach((e) => {
            e.item.controller = this
        })

        this.header = new DOM({
            new: "div",
            class: ["win-modern-blocks-header"],
            style: headerStyle,
            content: headerContent,
        })

        this.content = new DOM({
            new: "div",
            class: ["win-modern-blocks-content"],
            content: this.widgetsRAW.map((e) => e.item),
            style: {
                margin: (centering ? "auto" : ""),
            },
        })

        const listener = () => this.position()

        this.object = new DOM({
            new: "div",
            class: ["win-modern-blocks-container", ...(fixedHeight ? [] : ["not-fixed-height"])],
            content: [
                this.header,
                this.content,
                ...append,
            ],
            objectProperty: [
                {
                    name: "dataRequest",
                    handler: this.dataRequest,
                },
            ],
            onRendered() {
                window.addEventListener("resize", listener, { passive: true })
            },
            onClear() {
                window.removeEventListener("resize", listener, { passive: true })
            },
        })

        this.position()

        if (!useClass) { return this.object }
    }

    get widgets() {
        const res = []
        this.widgetsRAW.forEach(({
            item, x, y, actualX = null,
        }, i) => {
            const s = item.size
            if (actualX === "next") x = res[i - 1].x + res[i - 1].sizeX
            res.push({
                item, x, y, sizeX: s.x, sizeY: s.y,
            })
        })
        return res
    }

    get limit() {
        const min = 3

        if (Design.scaffoldMode === "mobile") return min

        const target = 5
        const m = Design.vmin
        const r = parseInt(Design.getVar("size-card-side-default", true), 10)
        const g = parseInt(Design.getVar("size-block-gap", true), 10)
        let w = this.object.elementParse.native.clientWidth
        if (!w) {
            const s = parseInt(Design.getVar("size-nav-width", true), 10)
            w = window.innerWidth - 10 * m - s
        }

        const a = Math.floor((w + g * m) / (r * m + g * m))
        if (a <= target) return a
        return null
    }

    takenMap(widgets = this.autoReposition) {
        const map = {}
        widgets.forEach(({
            item, x, y, sizeX, sizeY,
        }, ind) => {
            const size = { x: sizeX, y: sizeY }
            for (let i = y; i < y + size.y; i++) {
                if (!(i in map)) map[i] = {}
                for (let j = x; j < x + size.x; j++) {
                    if (j in map[i]) throw new Error("Widget overlap")
                    map[i][j] = ind
                }
            }
        })

        return map
    }

    checkFit({
        x, y, sizeX, sizeY,
    }, map = this.takenMap(), limit = this.limit, ignore = null) {
        if (limit && x + sizeX - 1 > limit) return false
        for (let i = y; i < y + sizeY; i++) {
            if (!(i in map)) break
            for (let j = x; j < x + sizeX; j++) {
                if (j in map[i]) {
                    if (ignore !== null) {
                        if (!(j >= ignore.x && j <= ignore.x + sizeX - 1
                            && i >= ignore.y && i <= ignore.y + sizeY - 1)) return false
                    } else return false
                }
            }
        }
        return true
    }

    get autoReposition() {
        const { limit } = this
        if (limit === null || limit === 5) return this.widgets

        const repositioned = []
        this.widgets.forEach(({
            x, y, item, sizeX, sizeY,
        }) => {
            const size = { x: sizeX, y: sizeY }
            if (size.x > limit) return
            if (this.checkFit({
                x, y, sizeX: size.x, sizeY: size.y,
            }, this.takenMap(repositioned), limit)) {
                repositioned.push({
                    x, y, item, sizeX, sizeY,
                })
            } else {
                let newX = 1
                let newY = y + 1
                while (!this.checkFit({
                    x: newX, y: newY, sizeX: size.x, sizeY: size.y,
                }, this.takenMap(repositioned), limit)) {
                    if (newX === limit) {
                        newY++
                        newX = 1
                    } else newX++
                }
                repositioned.push({
                    x: newX, y: newY, item, sizeX, sizeY,
                })
            }
        })

        return repositioned
    }

    position() {
        this.x = 1
        this.y = 1
        this.autoReposition.forEach(({
            item, x, y, sizeX, sizeY,
        }) => {
            const size = { x: sizeX, y: sizeY }
            item.style({
                gridColumnStart: x,
                gridRowStart: y,
                gridColumnEnd: `span ${size.x}`,
                gridRowEnd: `span ${size.y}`,
            })
            if (x + size.x - 1 > this.x) this.x = x + size.x - 1
            if (y + size.y - 1 > this.y) this.y = y + size.y - 1
        })

        this.content.style({
            gridTemplateColumns: `repeat(${this.x}, var(--size-card-side))`,
            ...(this.fixedHeight ? { gridTemplateRows: `repeat(${this.y}, var(--size-card-side))` } : {}),
        })
    }

    requestCache = {}

    async dataRequest(scopes) {
        return scopes.map(
            () => null,
        )
    }
}
