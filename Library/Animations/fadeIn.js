import Linear from "@DOMPath/Animation/Library/Timing/linear"
import Animation from "@DOMPath/Animation/Classes/Animation"

export default class FadeIn {
    constructor({ timing = Linear, duration = 1000 } = {}) {
        return new Animation({
            duration,
            painter(time) {
                this.style({ opacity: time })
            },
            timingFunc: timing,
        })
    }
}
