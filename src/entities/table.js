import { coordInRectangle } from '../utils/geometry-utils';

const cardDimensions = {
    width: 234,
    height: 380,
    border: 4
};

export class Table {
    constructor(size, x, y) {
        this.shape = 'rectangular';
        this.size = size;
        this.spaces = [];
        this.x = x;
        this.y = y;
        this.areas = new Map();
    }

    get cardDimensions() {
        return cardDimensions;
    }

    get happiness() {
        return this.spaces.reduce((acc, person) => {
            return acc + (this.spaces.reduce((a, p) => {
                return p === person ? 0 : a + person.scorePerson(p);
            }, 0));
        }, 0);
    }

    get rectangle() {
        return [this.x, this.y, 58 * (this.size / 2), 58 * 2];
    }

    get width() {
        return 58 * (this.size / 2);
    }

    get height() {
        return 58 * 2;
    }

    add(person) {
        if (this.spaces.length >= this.size) {
            return;
        }
        this.spaces.push(person);
    }

    remove(person) {
        this.spaces = this.spaces.filter(p => p !== person);
    }

    checkClicked(pos) {
        let personCardClicked = null;
        [...this.areas.keys()].forEach(person => {
            if (coordInRectangle(pos, this.areas.get(person))) {
                personCardClicked = person;
            }
        });
        console.log(this.areas);
        return personCardClicked;
    }

    drawTopRowPeople(ctx, scale) {
        const _scale = scale || { x: 1, y: 1 };
        this.spaces.slice(0, this.size / 2).forEach((p, i) => {
            const coords = { x: (this.x + (58 * i)) / 0.25, y: (this.y - (this.height / 2)) / 0.25 };
            const dimensions = p.personDimensions;
            p.draw(ctx, { x: coords.x, y: coords.y }, { x: _scale.x * 0.25, y: _scale.y * 0.25 });
            this.areas.set(p, { x: coords.x * 0.25, y: coords.y * 0.25, width: dimensions.width * _scale.x * 0.25, height: dimensions.height * _scale.y * 0.25 });
        });
    }

    drawBottomRowPeople(ctx, scale) {
        const _scale = scale || { x: 1, y: 1 };
        this.spaces.slice(this.size / 2).forEach((p, i) => {
            const coords = { x: (this.x + (58 * i)) / 0.25, y: (this.y + (this.height / 2)) / 0.25 };
            const dimensions = p.personDimensions;
            p.draw(ctx, { x: coords.x, y: coords.y }, { x: _scale.x * 0.25, y: _scale.y * 0.25 });
            this.areas.set(p, { x: coords.x * 0.25, y: coords.y * 0.25, width: dimensions.width * _scale.x * 0.25, height: dimensions.height * _scale.y * 0.25 });
        });
    }

    drawHappiness(ctx, scale) {
        const _scale = scale || { x: 1, y: 1 };
        const rect = this.rectangle;
        ctx.fillStyle = "#f1dbbb";
        const x = (rect[0] / _scale.x) + (rect[2] / 2) - 30;
        const y = (rect[1] / _scale.y) + 10;
        ctx.fillRect(x, y, 60, 30);

        ctx.font = '32px monospace';
        ctx.fillStyle = "#000000";
        ctx.fillText(this.happiness, x + 5, y + 25);

        ctx.font = '12px monospace';
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    drawTable(ctx, scale) {
        const _scale = scale || { x: 1, y: 1 };
        ctx.scale(_scale.x, _scale.y);
        ctx.fillStyle = "#583a08";
        ctx.fillRect(...this.rectangle);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    draw(ctx, scale) {
        this.areas = new Map();
        this.drawTopRowPeople(ctx, scale);
        this.drawTable(ctx, scale);
        this.drawHappiness(ctx, scale);
        this.drawBottomRowPeople(ctx, scale);
    }

    drawCard(ctx, position, scale) {
        const _scale = scale || { x: 1, y: 1 };
        ctx.scale(_scale.x, _scale.y);
        ctx.fillStyle = "#f1dbbb";
        ctx.fillRect(position.x, position.y, cardDimensions.width, cardDimensions.height);
        ctx.strokeStyle = "#9a8472";
        ctx.strokeRect(position.x + (cardDimensions.border / 2), position.y + (cardDimensions.border / 2), cardDimensions.width - cardDimensions.border, cardDimensions.height - cardDimensions.border);
        ctx.fillStyle = "#000000";
        let totalY = 0;
        [["Table", 32], [`${this.size}`, 128], [`seats`, 32], [`(${this.size / 2}x2)`, 32]].forEach(text => {
            ctx.font = `${text[1]}px monospace`;
            totalY += 30 + text[1];
            ctx.fillText(text[0], position.x + ((text[1] / 2) + (cardDimensions.width + cardDimensions.border) / 2) * scale.x, position.y - (text[1] / 4) + totalY);
        });
        ctx.font = `12px monospace`;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
}