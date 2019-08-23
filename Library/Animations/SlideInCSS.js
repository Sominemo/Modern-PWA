import Animation from "@DOMPath/Animation/Classes/Animation"

export default class SlideInCSS {
    constructor({ renderAwait = true, ...params }) {
        let original
        let padding = [0, 0, 0, 0]
        let margin = [0, 0, 0, 0]
        return new Animation({
            async init(el) {
                el.style({
                    position: "absolute",
                    visibility: "hidden",
                    transition: `all ${this.duration}ms`,
                })

                function getDimensions() {
                    original = el.sizes
                    padding = el.getStyle(["padding-top", "padding-right", "padding-bottom", "padding-left"]).map(e => parseFloat(e, 10))
                    margin = el.getStyle(["margin-top", "margin-right", "margin-bottom", "margin-left"]).map(e => parseFloat(e, 10))

                    el.style({
                        height: 0,
                        padding: 0,
                        margin: 0,
                    })
                }

                if (renderAwait) {
                    await new Promise((resolve, reject) => {
                        el.onEvent("rendered", () => {
                            resolve()
                        })
                    })
                }

                getDimensions()

                setTimeout(() => {
                    el.style({
                        position: "",
                        visibility: "",
                        overflow: "hidden",
                        height: `${original.height}px`,
                        padding: `${padding[0]}px ${padding[1]}px ${padding[2]}px ${padding[3]}px`,
                        margin: `${margin[0]}px ${margin[1]}px ${margin[2]}px ${margin[3]}px`,
                    })
                }, 0)

                return true
            },
            end(el) {
                el.style({
                    overflow: "",
                    padding: "",
                    margin: "",
                    height: "",
                    transition: "",
                })
            },
            ...params,
        })
    }
}
