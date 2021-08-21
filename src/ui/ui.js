import { coordInRectangle } from '../utils/shape-utils';

const cardDimensions = {
    width: 234,
    height: 380,
    border: 8
};
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
        this.ctx.save();
        this.hand.forEach((p, i) => {
            const coords = {
                x: ((this.width - (cardDimensions.width / 4)) + (cardDimensions.width * (i - adjustment))),
                y: this.height * 2 - (cardDimensions.height)
            };
            p.drawCard(
                this.ctx,
                coords,
                { x: 0.5, y: 0.5 });
            this.areas.set(p, { x: coords.x * 0.5, y: coords.y * 0.5, width: cardDimensions.width * 0.5, height: cardDimensions.height * 0.5 });
        });
        this.ctx.restore();
    }

    drawTooltip() {
        if (this.tooltipInfo.content) {
            this.ctx.save();
            this.ctx.translate(this.tooltipInfo.x, this.tooltipInfo.y);
            this.ctx.fillStyle = "#f1dbbb";
            const fontsize = 16;
            const width = 20 + this.tooltipInfo.content.reduce((a, b) => Math.max(a, b.length), 0) * (fontsize * 0.5625);
            this.ctx.fillRect(0, 0, width, (this.tooltipInfo.content.length * 20) + 20);

            this.ctx.strokeStyle = "#9a8472";
            this.ctx.strokeRect(0, 0, width, (this.tooltipInfo.content.length * 20) + 20);

            this.ctx.fillStyle = "#000000";
            this.tooltipInfo.content.forEach((text, i) => {
                if (i > 0) {
                    this.ctx.font = `${fontsize - 2}px monospace`;
                } else {
                    this.ctx.font = `bold ${fontsize}px monospace`;
                }
                this.ctx.fillText(text, 10, 20 + (20 * i));
            });

            this.ctx.fillStyle = "transparent";
            this.ctx.restore();
        }
    }
    
    drawScore(score) {
        this.ctx.save();
        this.ctx.fillStyle = "#f1dbbb";
        this.ctx.strokeStyle = "#9a8472";
        this.ctx.translate(10, 10);
        this.ctx.fillRect(0, 0, 60, 24);
        this.ctx.strokeRect(0, 0, 60, 24);

        this.ctx.font = '22px monospace';
        this.ctx.fillStyle = "#000000";
        this.ctx.fillText(score, 5, 20);

        this.ctx.font = '12px monospace';
        this.ctx.restore();
    }
}