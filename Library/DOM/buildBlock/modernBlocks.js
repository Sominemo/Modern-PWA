import DOM from "@DOMPath/DOM/Classes/dom"
import Design from "@Core/Services/design"

export default class ModernBlocks {
    x = 1

    y = 1

    index = []

    widgets = []

    constructor({ centering = true, widgets = [] } = {}) {
        this.widgets = widgets.filter((e) => !(e.item instanceof Error)).sort((a, b) => {
            if (a.y < b.y) return -1
            if (a.y > b.y) return 1

            if (a.x < b.x) return -1
            if (a.x > b.x) return 1
            return 0
        })

        this.header = new DOM({
            new: "div",
            class: ["win-modern-blocks-header"],
        })

        this.content = new DOM({
            new: "div",
            class: ["win-modern-blocks-content"],
            content: this.widgets.map((e) => e.item),
            style: {
                margin: (centering ? "auto" : ""),
            },
        })

        this.position()
        let listenerObj
        const listener = () => this.position()

        return new DOM({
            new: "div",
            class: ["win-modern-blocks-container"],
            content: [
                this.header,
                this.content,
            ],
            objectProperty: [
                {
                    name: "dataRequest",
                    handler: this.dataRequest,
                },
            ],
            onRendered() {
                listenerObj = Design.onScaffoldModeUpdate(listener)
            },
            onClear() {
                listenerObj.removeListener(listener)
            },
        })
    }

    get limit() {
        return (Design.scaffoldMode === "mobile" ? 3 : null)
    }

    takenMap(widgets = this.autoReposition) {
        const map = {}
        widgets.forEach(({ item, x, y }, ind) => {
            const { size } = item
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
    }, map = this.takenMap()) {
        if (x + sizeX - 1 > this.limit) return false
        for (let i = y; i < y + sizeY; i++) {
            if (!(i in map)) break
            for (let j = x; j < x + sizeX; j++) {
                if (j in map[i]) return false
            }
        }
        return true
    }

    get autoReposition() {
        const { limit } = this
        if (limit === null) return this.widgets

        const repositioned = []
        this.widgets.forEach(({ x, y, item }) => {
            if (item.size.x > limit) return
            if (this.checkFit({
                x, y, sizeX: item.size.x, sizeY: item.size.y,
            }, this.takenMap(repositioned))) {
                repositioned.push({ x, y, item })
            } else {
                let newX = 1
                let newY = y + 1
                while (!this.checkFit({
                    x: newX, y: newY, sizeX: item.size.x, sizeY: item.size.y,
                }, this.takenMap(repositioned))) {
                    if (newX === limit) {
                        newY++
                        newX = 1
                    } else newX++
                }
                repositioned.push({ x: newX, y: newY, item })
            }
        })

        return repositioned
    }

    position() {
        this.x = 1
        this.y = 1
        this.autoReposition.forEach(({ item, x, y }) => {
            item.style({
                gridColumnStart: x,
                gridRowStart: y,
                gridColumnEnd: `span ${item.size.x}`,
                gridRowEnd: `span ${item.size.y}`,
            })
            item.controller = this
            if (x + item.size.x - 1 > this.x) this.x = x + item.size.x - 1
            if (y + item.size.y - 1 > this.y) this.y = y + item.size.y - 1
        })

        this.content.style({
            gridTemplateColumns: `repeat(${this.x}, var(--size-card-side))`,
            gridTemplateRows: `repeat(${this.y}, var(--size-card-side))`,
        })
    }

    async dataRequest(scopes) {
        return scopes.map(
            () => null,
        )
    }
}
