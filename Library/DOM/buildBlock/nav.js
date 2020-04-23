import Navigation from "@Core/Services/navigation"
import Design from "@Core/Services/design"
import DOM from "@DOMPath/DOM/Classes/dom"
import EaseInOutQuad from "@DOMPath/Animation/Library/Timing/easeInOutQuad"
import FieldsContainer from "@Core/Tools/validation/fieldsContainer"
import FieldChecker from "@Core/Tools/validation/fieldChecker"
import Animation from "@DOMPath/Animation/Classes/Animation"
import { ContextMenuElement, ContextMenu } from "../elements"
import { Icon } from "../object"

export default class Nav {
    static config = []

    static dom = []

    static configBottom = []

    static domBottom = []

    static html = null

    static htmlBottom = null

    static mobileGesture = null

    static navItemIdPrefix = "nav-item-"

    static activeClassName = "active"

    static triggeredSwipe = false

    static get navigationList() {
        return this.navListFunction()
    }

    static constantNavMenu = []

    static navListFunction() {
        const current = Navigation.Current
        const custom = current.navMenu || []
        return [
            ...(Object.keys(custom).length > 0 && this.constantNavMenu.length > 0 ? [...custom, { type: "delimeter" }] : []),
            ...this.constantNavMenu,
        ]
    }

    static Toggle(e, ev) {
        ev.stopPropagation()
        ContextMenuElement.closeAll()
        const size = e.sizes
        ContextMenu({
            coords: size,
            content: this.navigationList,
        })
    }

    static NavSwipeToggle(e) {
        const self = this
        const minTop = e.touches[0].clientY
        const minLeft = e.touches[0].clientX
        if (Design.getVar("nav-bottom", true) !== "1") return
        let cardStuff
        let touchYLast = "0"

        let handlerLvl2
        let handlerLvl3
        let handlerLvl2triggered = false
        let handlerLvl3triggered = false
        const windowHeight = document.body.clientHeight


        const handlerLvl1 = (ev) => {
            if (
                minTop - ev.touches[0].clientY < Design.getVar("size-nav-width", true, true) / 2
                || Math.abs(ev.touches[0].clientX - minLeft) > Design.getVar("size-nav-width", true, true) / 2
            ) {
                this.mobileGesture.classList.add("animated")
                setTimeout(() => {
                    this.mobileGesture.classList.remove("animated")
                }, 200)
                return
            }

            self.triggeredSwipe = true

            cardStuff = ContextMenu({
                coords: { x: 0, y: 0 },
                content: [
                    {
                        type: "element",
                        title: new DOM({
                            new: "div",
                            class: "mobile-gesture",
                        }),
                    },
                    ...self.navigationList,
                ],
                noSelfControl: true,
                renderClasses: ["swiper", "start", "hide"],
                onClose() {
                    self.triggeredSwipe = false
                },
                async onClosing() {
                    await new Animation({
                        duration: 200,
                        timingFunc: EaseInOutQuad,
                        painter(t) {
                            this.style({
                                transform: "",
                            })
                        },
                    }).apply(cardStuff[0])
                },
                onRendered(evn, el) {
                    document.removeEventListener("touchmove", handlerLvl1)
                    document.addEventListener("touchmove", handlerLvl2)
                    document.addEventListener("touchend", handlerLvl3)
                },
            })
            setTimeout(() => {
                if (!handlerLvl2triggered) handlerLvl2(ev)
            }, 100)
        }

        handlerLvl2 = (ev) => {
            handlerLvl2triggered = true
            if (handlerLvl3triggered) {
                cardStuff[0].style({
                    transform: "none !important",
                })
                cardStuff[0].classList.remove("hide")
                return
            }
            touchYLast = ev.touches[0].clientY
            cardStuff[0].style({
                maxHeight: `${windowHeight - touchYLast}px`,
                transform: "none !important",
            })
            cardStuff[0].classList.remove("hide")
        }


        handlerLvl3 = (ev) => {
            handlerLvl3triggered = true
            document.removeEventListener("touchmove", handlerLvl2)
            if (Design.getVar("size-nav-width", true, true) > windowHeight - ev.changedTouches[0].clientY) {
                cardStuff[0].classList.add("start")
                cardStuff[0].emitEvent("contextMenuClose")
            } else {
                cardStuff[0].style({
                    maxHeight: "",
                    transform: "none !important",
                    transition: "all .2s",
                })
            }
            document.removeEventListener("touchend", handlerLvl3)
        }

        document.addEventListener("touchmove", handlerLvl1)

        const end = () => {
            document.removeEventListener("touchmove", handlerLvl1)
            document.removeEventListener("touchend", end)
        }

        document.addEventListener("touchend", end)
    }

    get menuItems() {
        return this.config
    }

    get menuItemsBottom() {
        return this.configBottom
    }

    static newItem(a, bottom = false) {
        const keyConfig = (bottom ? "configBottom" : "config")
        const keyHtml = (bottom ? "htmlBottom" : "html")
        const keyDom = (bottom ? "domBottom" : "dom")
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

    static getById(id, index = false, bottom = false) {
        return this[(bottom ? "configBottom" : "config")][(index ? "findIndex" : "find")]((e) => e.id === id)
    }

    static removeById(id, bottom = false) {
        const keyConfig = (bottom ? "configBottom" : "config")
        const keyHtml = (bottom ? "htmlBottom" : "html")
        const keyDom = (bottom ? "domBottom" : "dom")

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

        if (this.htmlBottom !== null) {
            this.generateElementListBottom()
            const eh = this.htmlBottom
            eh.clear()
            this.domBottom.forEach((el) => {
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

    static generateElementListBottom() {
        new FieldsContainer(["array", new FieldsContainer([
            ["icon", "name", "handler", "id"],
            {
                icon: new FieldChecker({ type: "string" }),
                handler: new FieldChecker({ type: "function" }),
                id: new FieldChecker({ type: "string", symbols: "a-z_" }),
            },
        ])]).set(this.configBottom)

        this.domBottom = []
        const curr = []

        this.configBottom.forEach((i) => {
            const generated = this.generateElement(i)
            this.domBottom.push({
                id: i.id,
                element: generated,
            })
            curr.push(generated)
        })

        return curr
    }

    static highlight(e) {
        this.dom.forEach((a) => a.element.classList.remove(this.activeClassName))
        this.domBottom.forEach((a) => a.element.classList.remove(this.activeClassName))
        const ele = this.dom.find((em) => em.id === e.id)
            || this.domBottom.find((em) => em.id === e.id)
        if (ele !== undefined) {
            const el = ele.element
            el.classList.add(this.activeClassName)
            this.currentActive = el
        } else this.currentActive = null
        this.updateGesturePosition()
    }

    static updateGesturePosition(el = false) {
        if (!this.mobileGesture) return
        if (el === false) el = this.currentActive
        if (el) {
            this.mobileGesture.style({ top: `${el.elementParse.native.offsetTop}px`, left: "0" })
        } else {
            this.mobileGesture.style({ left: "-100%" })
        }
    }

    constructor() {
        const self = this
        const genDom = this.constructor.generateElementList()
        const genDomBottom = this.constructor.generateElementListBottom()
        this.constructor.html = new DOM({
            new: "div",
            class: "menu-buttons",
            content: genDom,
        })

        this.constructor.htmlBottom = new DOM({
            new: "div",
            class: "menu-pc-bottom",
            content: genDomBottom,
        })

        this.constructor.mobileGesture = new DOM({
            new: "div",
            class: "mobile-gesture",
        })

        return new DOM({
            new: "nav",
            class: "main-nav",
            events: [
                {
                    event: "touchstart",
                    handler(e) {
                        self.constructor.NavSwipeToggle(e)
                    },
                    params: { passive: true },
                },
                {
                    event: "mouseup",
                    handler(e) {
                        if (Design.getVar("nav-bottom", true) !== "1" || e.button !== 2) return

                        ContextMenu({
                            content: self.constructor.navigationList,
                            event: e,
                        })
                    },
                },
            ],
            content: [
                this.constructor.mobileGesture,
                new DOM({
                    new: "div",
                    class: "nav-content",
                    content: [
                        new DOM({
                            new: "div",
                            class: "menu-area",
                            content: new DOM({
                                new: "div",
                                class: "nav-item",
                                content: new Icon("more_vert"),
                                events: [
                                    {
                                        event: "click",
                                        handler(ev, el) { Nav.Toggle(el, ev) },
                                    },
                                ],
                            }),
                        }),
                        this.constructor.html,

                    ],
                }),
                this.constructor.htmlBottom,
            ],
        })
    }
}
