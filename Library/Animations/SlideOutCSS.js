import Animation from "@DOMPath/Animation/Classes/Animation"

export default class SlideOutCSS {
    constructor({ renderAwait = false, ...params }) {
        let original
        let padding = [0, 0, 0, 0]
        let margin = [0, 0, 0, 0]
        return new Animation({
            async init(el) {
                function getDimensions() {
                    original = el.sizes
                    padding = el.getStyle(["padding-top", "padding-right", "padding-bottom", "padding-left"]).map(e => parseFloat(e, 10))
                    margin = el.getStyle(["margin-top", "margin-right", "margin-bottom", "margin-left"]).map(e => parseFloat(e, 10))
                }
                if (renderAwait) {
                    await new Promise((resolve, reject) => {
                        el.onEvent("rendered", () => {
                            resolve()
                        })
                    })
                }

                getDimensions()

                el.style({
                    height: `${original.height}px`,
                    padding: `${padding[0]}px ${padding[1]}px ${padding[2]}px ${padding[3]}px`,
                    margin: `${margin[0]}px ${margin[1]}px ${margin[2]}px ${margin[3]}px`,
                    transition: `all ${this.duration}ms`,
                })

                setTimeout(() => {
                    el.style({
                        overflow: "hidden",
                        height: 0,
                        padding: 0,
                        margin: 0,
                    })
                }, 0)

                return true
            },
            ...params,
            end(el) {
                el.style({
                    transition: "",
                })
            },
        })
    }
}
