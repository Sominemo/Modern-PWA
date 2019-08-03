import WindowManager from "@Core/Services/SimpleWindowManager"
import ToastElement from "./toastElement"

export default class Toast {
    static showing = false

    static buffer = []

    static add(content, duration = 3000, { buttons = [], click = false } = {}) {
        let resolve; let
            reject
        const p = new Promise((res, rej) => {
            resolve = res
            reject = rej
        })
        this.buffer.push([[content, { buttons, click, duration }], { resolve, reject }])
        if (!this.showing) this.next()

        return p
    }

    static cancelBuffer() {
        this.buffer.length = 0
    }

    static addNow(content, duration = 3000, params) {
        let resolve; let
            reject
        const p = new Promise((res, rej) => {
            resolve = res
            reject = rej
        })
        this.buffer.unshift([[content, { duration, ...params }], { resolve, reject }])
        if (this.showing) this.showing.pop()

        return p
    }

    static display(p) {
        if (!p) return false
        const h = WindowManager.newHelper()
        const index = this.buffer.indexOf(p)
        if (index !== -1) {
            this.buffer.splice(index, 1)
        }
        const oFunc = h.pop
        h.pop = (...a) => {
            this.showing = false
            this.next()

            return oFunc(...a)
        }
        const toast = new ToastElement(...p[0], h)
        this.showing = toast
        p[1].resolve(toast)

        h.append(toast)
        return true
    }

    static next() {
        this.display(this.buffer[0])
        return true
    }
}
