import Linear from "@DOMPath/Animation/Library/Timing/linear"
import reversedTiming from "@DOMPath/Animation/Library/Timing/Transformations/reverse"
import reversedEase from "@DOMPath/Animation/Library/Timing/Transformations/reverseEase"
import FlyIn from "./flyIn"

export default class FlyOut {
    constructor({ timing = Linear, ...params } = {}) {
        return new FlyIn({
            ...params,
            timing: reversedTiming(reversedEase(timing)),
        })
    }
}
