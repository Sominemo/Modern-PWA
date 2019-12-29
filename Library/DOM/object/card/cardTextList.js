import CardList from "./cardList"

export default class CardTextList {
    constructor(e, additional = {}, forceWrapper = false) {
        return new CardList(
            e.map((i) => ({
                ...additional,
                content: i,
            })),
            forceWrapper,
        )
    }
}
