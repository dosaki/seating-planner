import { coordInRectangle } from '../utils/shape-utils';

export class UI {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.areas = new Map();
        this.hand = [];
        this.handLimit = 5;
        this.tooltipInfo = {
            x: 0,
            y: 0,
            content: null
        };
    }

    get atHandLimit() {
        return this.hand.length >= this.handLimit;
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
            if (coordInRectangle(pos, this.areas.get(person))) {
                personCardClicked = person;
            }
        });
        return personCardClicked;
    }

    drawHand() {
        this.areas = new Map();
        const adjustment = this.hand.length % 2 === 0 ? (this.hand.length / 2) - 0.5 : Math.floor(this.hand.length / 2);
        this.hand.forEach((p, i) => {
            const coords = {
                x: ((this.width - (p.cardDimensions.width / 4)) + (p.cardDimensions.width * (i - adjustment))),
                y: this.height * 2 - (p.cardDimensions.height)
            };
            p.drawCard(
                this.ctx,
                coords,
                { x: 0.5, y: 0.5 });
            this.areas.set(p, { x: coords.x * 0.5, y: coords.y * 0.5, width: p.cardDimensions.width * 0.5, height: p.cardDimensions.height * 0.5 });
        });
    }

    drawTooltip() {
        if (this.tooltipInfo.content) {
            this.ctx.save();
            this.ctx.translate(this.tooltipInfo.x, this.tooltipInfo.y);
            this.ctx.fillStyle = "#f1dbbb";
            this.ctx.fillRect(0, 0, 150, (this.tooltipInfo.content.length * 20) + 20);
            
            this.ctx.strokeStyle = "#9a8472"
            this.ctx.strokeRect(0, 0, 150, (this.tooltipInfo.content.length * 20) + 20);

            this.ctx.font = '16px monospace';
            this.ctx.fillStyle = "#000000";
            this.tooltipInfo.content.forEach((text, i) => {
                this.ctx.fillText(text, 10, 20 + (20 * i));
            });

            this.ctx.fillStyle = "transparent";
            this.ctx.restore();
        }
    }
}