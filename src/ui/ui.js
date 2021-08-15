import { coordInRectangle } from '../utils/geometry-utils';

export class UI {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.areas = new Map();
        this.hand = [];
    }

    get atHandLimit() {
        return this.hand.length >= 5;
    }

    addToHand(...items) {
        this.hand.push(...items);
    }

    removeFromHand(item) {
        this.hand = this.hand.filter(i => item !== i);
    }

    checkClicked(pos) {
        let personCardClicked = null;
        [...this.areas.keys()].forEach(person => {
            if(coordInRectangle(pos, this.areas.get(person))){
                personCardClicked = person;
            }
        });
        return personCardClicked;
    }

    drawHand() {
        this.areas = new Map();
        const adjustment = this.hand.length % 2 === 0 ? (this.hand.length / 2) - 0.5 : Math.floor(this.hand.length / 2);
        this.hand.forEach((p, i) => {
            const coords = { x: ((this.width - (p.cardDimensions.width / 4)) + (p.cardDimensions.width * (i - adjustment))), y: this.height * 2 - (p.cardDimensions.height) };
            p.drawCard(
                this.ctx,
                coords,
                { x: 0.5, y: 0.5 });
            this.areas.set(p,{ x: coords.x*0.5, y: coords.y*0.5, width: p.cardDimensions.width * 0.5, height: p.cardDimensions.height * 0.5 });
        });
    }
}