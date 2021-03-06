import DOM from "@DOMPath/DOM/Classes/dom"
import DOMObjectWrapper from "@DOMPath/DOM/Helpers/domObjectWrapper"
import Animation from "@DOMPath/Animation/Classes/Animation"

export default class Button {
    constructor({
        content, handler = () => {}, type = "bright", style = {}, eventType = "click",
    }) {
        type = (Array.isArray(type) ? type : [type])
        function rippleOut(ripple) {
            new Animation({
                duration: 200,
                painter(t) {
                    ripple.style.opacity = 1 - t
                },
            }).apply(this)
                .then(() => {
                    const pn = ripple.parentNode
                    if (pn) pn.removeChild(ripple)
                })
        }

        function startRipple(ev) {
            const biggerSide = Math.max(this.clientHeight, this.clientWidth)
            const self = this

            const ripple = new DOM({
                new: "md-ripple-effect",
                onRender(p, e) {
                    e.elementParse.native.style.top = `${ev.layerY}px`
                    e.elementParse.native.style.left = `${ev.layerX}px`
                    if (!ev.isTrusted) {
                        e.elementParse.native.style.top = `${self.clientHeight / 2.5}px`
                        e.elementParse.native.style.left = `${self.clientWidth / 2.5}px`
                    }

                    new Animation({
                        duration: 100,
                        painter(t) {
                            e.elementParse.native.style.width = `${t * biggerSide * 2.5}px`
                            e.elementParse.native.style.height = `${t * biggerSide * 2.5}px`
                        },
                    }).apply(e)
                },
            })

            DOMObjectWrapper(this).render(ripple)
        }

        function endRippleUniversal(ev) {
            this.querySelectorAll("md-ripple-effect").forEach((r) => {
                rippleOut(r)
            })
        }

        return new DOM({
            new: "md-button",
            class: [...type],
            content: new DOM({
                new: "md-button-content",
                content,
            }),
            style,
            events: [
                {
                    event: "mousedown",
                    handler: startRipple,
                },
                {
                    event: eventType,
                    handler(ev) {
                        handler.bind(this)(ev)
                    },
                },
                {
                    event: "mouseleave",
                    handler: endRippleUniversal,
                },
                {
                    event: "mouseup",
                    handler: endRippleUniversal,
                },
                {
                    event: "touchend",
                    handler: endRippleUniversal,
                },
                {
                    event: "blur",
                    handler: endRippleUniversal,
                },
            ],
        })
    }
}
