import { circle, coordInRectangle } from '../utils/shape-utils';

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
        this.pings = {};
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
        this.ctx.fillRect(0, 0, 200, 24);
        this.ctx.strokeRect(0, 0, 200, 24);

        this.ctx.font = '20px monospace';
        this.ctx.fillStyle = "#000000";
        this.ctx.fillText(`Happiness: ${score}`, 5, 20);

        this.ctx.font = '12px monospace';
        this.ctx.restore();
    }

    ping(pos, colour, duration) {
        this.pings[`${pos.x}|${pos.y}|${colour}`] = 3;
        setTimeout(()=>{
            delete this.pings[`${pos.x}|${pos.y}|${colour}`];
        }, duration);
    }

    drawPings() {
        Object.keys(this.pings).forEach(k=>{
            this.ctx.save();
            this.ctx.translate(parseInt(k.split("|")[0]), parseInt(k.split("|")[1]));
            const colour = (255-this.pings[k]).toString(16).padStart(2,0);
            console.log(colour);
            circle(this.ctx, 0,0, this.pings[k]*(this.pings[k]*0.05)*0.1, `${k.split('|')[2]}${colour}`, "stroke");
            circle(this.ctx, 0,0, this.pings[k]*(this.pings[k]*0.05)*0.5, `${k.split('|')[2]}${colour}`, "stroke");
            circle(this.ctx, 0,0, this.pings[k]*(this.pings[k]*0.05), `${k.split('|')[2]}${colour}`, "stroke");
            circle(this.ctx, 0,0, this.pings[k]*(this.pings[k]*0.05)*1.5, `${k.split('|')[2]}${colour}`, "stroke");
            circle(this.ctx, 0,0, this.pings[k]*(this.pings[k]*0.05)*2, `${k.split('|')[2]}${colour}`, "stroke");
            this.pings[k]+=1
            this.ctx.restore();
        });
    }
}