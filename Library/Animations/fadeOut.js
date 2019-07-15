import Linear from "@DOMPath/Animation/Library/Timing/linear"
import reversedTiming from "@DOMPath/Animation/Library/Timing/Transformations/reverse"
import reversedEase from "@DOMPath/Animation/Library/Timing/Transformations/reverseEase"
import FadeIn from "./fadeIn"

export default class FadeOut {
    constructor({ timing = Linear, ...params } = {}) {
        return new FadeIn({
            ...params,
            timing: reversedTiming(reversedEase(timing)),
        })
    }
}
