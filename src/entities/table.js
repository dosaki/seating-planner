export class Table {
    constructor(size, x, y) {
        this.shape = 'rectangular';
        this.size = size;
        this.spaces = [];
        this.x = x;
        this.y = y;
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

    drawTopRowPeople(ctx, scale) {
        const _scale = scale || { x: 1, y: 1 };
        this.spaces.slice(0, this.size / 2).forEach((p, i) => {
            p.draw(ctx, { x: (this.x + (58 * i)) / 0.25, y: (this.y - (this.height / 2)) / 0.25 }, { x: _scale.x * 0.25, y: _scale.y * 0.25 });
        });
    }

    drawBottomRowPeople(ctx, scale) {
        const _scale = scale || { x: 1, y: 1 };
        this.spaces.slice(this.size / 2).forEach((p, i) => {
            p.draw(ctx, { x: (this.x + (58 * i)) / 0.25, y: (this.y + (this.height / 2)) / 0.25 }, { x: _scale.x * 0.25, y: _scale.y * 0.25 });
        });
    }

    drawHappiness(ctx, scale) {
        const _scale = scale || { x: 1, y: 1 };
        const rect = this.rectangle;
        ctx.fillStyle = "#f1dbbb";
        const x = (rect[0] / _scale.x) + (rect[2] / 2) - 30;
        const y = (rect[1] / _scale.y) + 10;
        ctx.fillRect(x, y, 60, 30);

        ctx.font = '32px serif';
        ctx.fillStyle = "#000000";
        ctx.fillText(this.happiness, x + 5, y + 25);

        ctx.font = '12px serif';
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
        this.drawTopRowPeople(ctx, scale);
        this.drawTable(ctx, scale);
        this.drawHappiness(ctx, scale);
        this.drawBottomRowPeople(ctx, scale);
    }
}