import Navigation from "@Core/Services/navigation"
import DOM from "@DOMPath/DOM/Classes/dom"
import FieldsContainer from "@Core/Tools/validation/fieldsContainer"
import FieldChecker from "@Core/Tools/validation/fieldChecker"
import delayAction from "@Core/Tools/objects/delayAction"
import { Icon } from "../object"

export default class Nav {
    static config = []

    static dom = []

    static html = null

    static mobileGesture = null

    static navItemIdPrefix = "nav-item-"

    static activeClassName = "active"

    get menuItems() {
        return this.config
    }

    static newItem(a) {
        const keyConfig = "config"
        const keyHtml = "html"
        const keyDom = "dom"
        new FieldsContainer([
            ["name", "icon", "handler", "id"],
            {
                icon: new FieldChecker({ type: "string" }),
                handler: new FieldChecker({ type: "function" }),
                id: new FieldChecker({ type: "string", symbols: "a-z_" }),
            },
        ]).set(a)

        if (this[keyConfig].some((e) => e.id === a.id)) return

        this[keyConfig].push(a)

        if (this[keyHtml] !== null) {
            const generated = this.generateElement(a)
            this[keyDom].push({
                id: a.id,
                element: generated,
            })
            this[keyHtml].render(generated)
        }
    }

    static getById(id, index = false) {
        return this.config[(index ? "findIndex" : "find")]((e) => e.id === id)
    }

    static removeById(id) {
        const keyConfig = "config"
        const keyHtml = "html"
        const keyDom = "dom"

        const nid = this.getById(id, true)
        delete this[keyConfig][nid]
        delete this[keyDom][nid]
        const elView = this[keyHtml].elementView
        const htmlCh = elView.children[nid]
        elView.removeChild(htmlCh)
    }

    static updateHTML() {
        if (this.html !== null) {
            this.generateElementList()
            const eh = this.html
            eh.clear()
            this.dom.forEach((el) => {
                eh.render(el.element)
            })
        }

        this.highlight({ id: Navigation.parse.module })
    }

    static generateElement(i) {
        return new DOM({
            new: "div",
            class: "nav-item",
            id: `${this.navItemIdPrefix}${i.id}`,
            content: new Icon(i.icon),
            attributes: {
                hint: (typeof i.name === "function" ? i.name() : i.name.toString()),
            },
            events: {
                event: "click",
                handler: i.handler,
            },
            menuNavData: i,
        })
    }

    static generateElementList() {
        new FieldsContainer(["array", new FieldsContainer([
            ["icon", "name", "handler", "id"],
            {
                icon: new FieldChecker({ type: "string" }),
                handler: new FieldChecker({ type: "function" }),
                id: new FieldChecker({ type: "string", symbols: "a-z_" }),
            },
        ])]).set(this.config)

        this.dom = []
        const curr = []

        this.config.forEach((i) => {
            const generated = this.generateElement(i)
            this.dom.push({
                id: i.id,
                element: generated,
            })
            curr.push(generated)
        })

        return curr
    }

    static highlight(e) {
        this.dom.forEach((a) => a.element.classList.remove(this.activeClassName))
        const ele = this.dom.find((em) => em.id === e.id)
        if (ele !== undefined) {
            const el = ele.element
            el.classList.add(this.activeClassName)
            this.currentActive = el
        } else this.currentActive = null
        this.updateGesturePosition()
    }

    static gesturePositionInited = false

    static updateGesturePosition(el = false) {
        if (!this.mobileGesture) return
        if (el === false) el = this.currentActive
        const upd = () => {
            if (el) {
                this.mobileGesture.style({ top: `${el.elementParse.native.offsetTop}px`, transform: "translateX(0)" })
            } else {
                this.mobileGesture.style({ transform: "" })
            }
        }
        if (this.gesturePositionInited) delayAction(upd)
        else {
            upd()
            this.gesturePositionInited = true
        }
    }

    constructor() {
        const genDom = this.constructor.generateElementList()
        this.constructor.html = new DOM({
            new: "div",
            class: "menu-buttons",
            content: genDom,
        })

        this.constructor.mobileGesture = new DOM({
            new: "div",
            class: "mobile-gesture",
        })

        return new DOM({
            new: "nav",
            class: "main-nav",
            content: [
                this.constructor.mobileGesture,
                new DOM({
                    new: "div",
                    class: "nav-content",
                    content: [
                        this.constructor.html,

                    ],
                }),
            ],
        })
    }
}
