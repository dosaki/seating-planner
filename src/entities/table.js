import { coordInRectangle, circle } from '../utils/shape-utils';
import { Person } from './person';

const cardDimensions = {
    width: 234,
    height: 380,
    border: 8
};

const tableCloth = "M 0,9 9,18 18,9 9,0 Z";

export class Table {
    constructor(size, x, y) {
        this.shape = 'rectangular';
        this.size = size;
        this.spaces = [];
        this._x = x;
        this.y = y;
        this.areas = new Map();
        this.unit = Person.dimensions.width * 0.25;
    }

    get isFull() {
        return this.spaces.length === this.size;
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

    get dimensions() {
        return {
            x: this._x - this.unit / 2,
            y: this.y,
            width: this.width + this.unit,
            height: this.height
        };
    }

    // get rect() {
    //     return Object.values(this.dimensions);
    // }

    get width() {
        return (this.unit * (this.size / 2));
    }

    get _width() {
        return this.width - this.unit;
    }

    get height() {
        return this.unit * 2;
    }

    set x(x) {
        this._x = x;
    }

    get x() {
        return - this.unit / 2;
    }

    add(person) {
        if (this.spaces.length >= this.size) {
            return false;
        }
        this.spaces.push(person);
        this.spaces = [...new Set(this.spaces)];
        return true;
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
        return personCardClicked;
    }

    drawTopRowPeople(ctx) {
        ctx.save();
        const gap = this.width / (this.size / 2);
        ctx.translate((this.unit * -0.3), -15 - this.height / 2);
        this.spaces.slice(0, this.size / 2).forEach((p, i) => {
            p.draw(ctx, { x: 0.25, y: 0.25 });
            ctx.translate(gap, 0);
            const coords = { x: this._x + gap * i, y: this.y - (15 + this.height / 2) };
            this.areas.set(p, { x: coords.x, y: coords.y, width: gap, height: Person.dimensions.height * 0.25 });
        });
        ctx.restore();
    }

    drawBottomRowPeople(ctx) {
        ctx.save();
        const gap = this.width / (this.size / 2);
        ctx.translate((this.unit * -0.3), 15 + this.height / 2);
        this.spaces.slice(this.size / 2).forEach((p, i) => {
            p.draw(ctx, { x: 0.25, y: 0.25 });
            ctx.translate(gap, 0);
            const coords = { x: this._x + gap * i, y: this.y + (15 + this.height / 2) };
            this.areas.set(p, { x: coords.x, y: coords.y, width: gap, height: Person.dimensions.height * 0.25 });
        });
        ctx.restore();
    }

    drawHappiness(ctx, scale) {
        ctx.save();
        ctx.fillStyle = "#f1dbbb";
        ctx.strokeStyle = "#9a8472";
        ctx.translate((this.width / 2) - 30, 40);
        ctx.fillRect(0, 0, 60, 24);
        ctx.strokeRect(0, 0, 60, 24);

        ctx.font = '22px monospace';
        ctx.fillStyle = "#000000";
        ctx.fillText(this.happiness, 5, 20);

        ctx.font = '12px monospace';
        ctx.restore();
    }

    drawTable(ctx, scale) {
        this.drawPositionedTable(ctx, scale);
    }

    drawPositionedTable(ctx, scale) {
        ctx.save();
        const _scale = scale || { x: 1, y: 1 };
        this._drawTableTop(ctx, _scale, "#4f402e");
        ctx.translate((this.width - this.width * 0.9) / 2, (this.height - this.height * 0.9) / 2);
        this._drawTableTop(ctx, { x: _scale.x * 0.9, y: _scale.y * 0.9 }, "#ffe5d8");
        ctx.restore();
    }

    _drawTableTop(ctx, scale, colour) {
        ctx.save();
        const _scale = scale || { x: 1, y: 1 };
        ctx.scale(_scale.x, _scale.y);
        ctx.fillStyle = colour;
        ctx.fillRect(this.unit / 2, 0, this.width - this.unit, this.height);

        circle(ctx, this.unit / 2, this.height / 2, this.height / 2, null, "fill");
        circle(ctx, this._width + this.unit / 2, this.height / 2, this.height / 2, null, "fill");
        ctx.restore();
    }

    drawTableSeats(ctx, scale) {
        return this.drawPositionedTableSeats(ctx, scale);
    }

    drawPositionedTableSeats(ctx) {
        ctx.save();
        const width = this.width + this.unit;
        const gap = this.width / (this.size / 2);
        ctx.translate((width / 2 - (gap * (this.size / 2) / 2) - (this.unit * 0.3)), 0);
        for (let i = 0; i < this.size / 2; i++) {
            const x = gap * i;
            this.drawSeatPosition(ctx, { x, y: 10 });
            this.drawSeatPosition(ctx, { x, y: this.height - (10 + 18 * 1.5) });
        }
        ctx.restore();
    }

    drawSeatPosition(ctx, pos) {
        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.scale(1.5, 1.5);

        ctx.fillStyle = "#eae5e2";
        ctx.strokeStyle = "#ffffff";
        ctx.fill(new Path2D(tableCloth));
        ctx.stroke(new Path2D(tableCloth));

        circle(ctx, 9, 9, 6, "#fffaf3", "fill");
        circle(ctx, 9, 9, 4, "#ffffff", "fill");
        circle(ctx, 9, 9, 6, "#b3a899", "stroke");
        circle(ctx, 9, 9, 4, "#eae6e2", "stroke");

        ctx.restore();
    }

    draw(ctx, scale) {
        this.areas = new Map();
        ctx.translate(this._x, this.y);
        this.drawTopRowPeople(ctx, scale);
        this.drawTable(ctx, scale);
        this.drawTableSeats(ctx, scale);
        this.drawHappiness(ctx, scale);
        this.drawBottomRowPeople(ctx, scale);
        ctx.translate(-this._x, -this.y);
    }

    drawCard(ctx, pos, scale) {
        ctx.save();
        const _scale = scale || { x: 1, y: 1 };
        ctx.scale(_scale.x, _scale.y);
        ctx.translate(pos.x, pos.y);
        ctx.fillStyle = "#f1dbbb";
        ctx.fillRect(0, 0, cardDimensions.width, cardDimensions.height);
        ctx.strokeStyle = "#9a8472";
        ctx.lineWidth = cardDimensions.border;
        ctx.strokeRect((cardDimensions.border / 2), (cardDimensions.border / 2), cardDimensions.width - cardDimensions.border, cardDimensions.height - cardDimensions.border);

        ctx.translate((cardDimensions.width/2 - this.width/2), cardDimensions.height/2 - this.height/2);
        
        const midX = this.width / 2;
        const midY = this.height / 2;
        ctx.translate(midX, midY);
        ctx.rotate(Math.PI/2);
        ctx.translate(-midX, -midY);

        this.drawPositionedTable(ctx);
        this.drawPositionedTableSeats(ctx);
        ctx.lineWidth = 1;
        ctx.restore();
    }
}