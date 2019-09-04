import DOM from "@DOMPath/DOM/Classes/dom"

export default class ClusterList {
    content = []

    padding = 1

    container = null

    scroller = null

    nativeScroller = false

    preDummy = new DOM({
        new: "cluster-list-dummy",
    })

    afterDummy = new DOM({
        new: "cluster-list-dummy",
    })

    measurments = {
        content: {
            coord: [],
            fullHeight: 0,
        },
    }

    scroll = {
        top: 0,
        bottom: 0,
    }

    constructor({
        content = [], padding = 1, container = null, scroller = null,
    }) {
        this.content = content
        this.padding = padding

        container = container || new DOM({ new: "div" })
        scroller = scroller || container

        if (!(scroller instanceof DOM)) this.nativeScroller = true

        this.container = container
        this.scroller = scroller

        container.render(...content)
        this.scroll.bottom = content.length - 1

        if (document.body.contains(container.elementParse.native)) this.firstMeasure()
        else {
            container.onEvent("rendered", () => {
                setTimeout(() => {
                    this.firstMeasure()
                }, 0)
            })
        }

        return container
    }

    firstMeasure() {
        this.container.prepend(this.preDummy)
        this.container.render(this.afterDummy)
        this.hideJob()
    }

    isDisplayable(index) {
        if (index >= this.scroll.top && index <= this.scroll.bottom) return true
        if (Math.abs(this.scroll.top - index) <= this.padding
            || Math.abs(index - this.scroll.bottom) <= this.padding) return true
        return false
    }

    isInViewport(elem) {
        const bounding = elem.sizes
        const w = (this.nativeScroller
            ? this.scroller.clientHeight
            : this.scroller.elementParse.native.clientHeight)
        if (bounding.top >= 0 && bounding.top <= w && bounding.bottom <= w) return true
        if (bounding.top <= 0 && bounding.bottom >= 0) return true
        if (bounding.top > 0 && bounding.top <= w && bounding.bottom >= w) return true
        return false
    }

    hideJob() {
        let lastFound = false
        let firstFound = false
        this.content.forEach((item, index) => {
            const { sizes } = item
            this.measurments.content.coord[index] = { top: sizes.top, bottom: sizes.bottom }
            this.measurments.content.fullHeight += sizes.height
            const isInV = this.isInViewport(item)
            if (!firstFound && isInV) {
                firstFound = true
                this.scroll.top = index
            }
            if (!lastFound && !this.isInViewport(item)) {
                lastFound = true
                this.scroll.bottom = index - 1
            }
            if (lastFound && !this.isDisplayable(index)) {
                item.destructSelf()
            }
        })
    }
}
