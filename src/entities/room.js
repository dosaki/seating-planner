import { circle, coordInRectangle } from '../utils/shape-utils';
import { Table } from './table';

export class Room {
    constructor() {
        this.tables = [];
    }

    get tablesAreFull() {
        return !this.tables.find(t => !t.isFull);
    }

    get totalScore() {
        return this.tables.reduce((acc, table) => acc + table.happiness, 0);
    }

    addTable(sizeOrTable) {
        if (sizeOrTable instanceof Table) {
            this.tables.push(sizeOrTable);
            this.tables = [...new Set(this.tables)];
            return true;
        }
    }

    checkClickedTable(pos) {
        let tableClicked = null;
        [...this.tables].forEach(table => {
            if (coordInRectangle(pos, table.dimensions)) {
                tableClicked = table;
            }
        });
        return tableClicked;
    }

    checkClickedPerson(pos) {
        let personClicked = null;
        [...this.tables].forEach(table => {
            const person = table.checkClicked(pos);
            if (person) {
                personClicked = person;
            }
        });
        return personClicked;
    }

    checkClicked(pos) {
        return this.checkClickedPerson(pos) || this.checkClickedTable(pos);
    }

    drawFloorSection(ctx) {
        ctx.fillStyle = "#f3f0e9";
        ctx.beginPath();
        ctx.moveTo(45, 45);
        ctx.arcTo(5, 45, 5, 5, 10);
        ctx.arcTo(5, 5, 45, 5, 10);
        ctx.arcTo(45, 5, 45, 45, 10);
        ctx.arcTo(45, 45, 5, 45, 10);
        ctx.fill();
        ctx.fillStyle = "#fffaf4";
        ctx.beginPath();
        ctx.moveTo(25, 10);
        ctx.quadraticCurveTo(25, 25, 40, 25);
        ctx.quadraticCurveTo(25, 25, 25, 40);
        ctx.quadraticCurveTo(25, 25, 10, 25);
        ctx.quadraticCurveTo(25, 25, 25, 10);
        ctx.fill();

        // Wooden floorboards
        // ctx.fillStyle = "#865f3e";
        // ctx.fillRect(0, 0, 50, 15);
        // ctx.fillStyle = "#b18e68";
        // ctx.fillRect(50, 0, 50, 15);
        // ctx.fillRect(150, 0, 50, 15);
        // ctx.fillRect(25, 15, 50, 15);
        // ctx.fillRect(75, 15, 50, 15);
        // ctx.fillStyle = "#3e250e";
        // ctx.fillRect(125, 15, 50, 15);
        // ctx.fillStyle = "#d0b391";
        // ctx.fillRect(100, 0, 50, 15);
        // ctx.fillRect(175, 15, 30, 15);
        // ctx.fillRect(-5, 15, 30, 15);

        // ctx.strokeStyle = "#00000060";
        // ctx.strokeRect(0, 0, 50, 15);
        // ctx.strokeRect(50, 0, 50, 15);
        // ctx.strokeRect(150, 0, 50, 15);
        // ctx.strokeRect(25, 15, 50, 15);
        // ctx.strokeRect(75, 15, 50, 15);
        // ctx.strokeRect(125, 15, 50, 15);
        // ctx.strokeRect(100, 0, 50, 15);
    }

    drawFloor(ctx) {
        ctx.save();
        const width = 50;
        const height = 50;
        const horizontal = ctx.canvas.width / width;
        const vertical = (ctx.canvas.height) / height;
        ctx.fillStyle = "#e3e0d9";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.translate(50, 50);
        for (let y = 0; y < vertical; y++) {
            let xTranslated = 0;
            for (let x = 0; x < horizontal; x++) {
                this.drawFloorSection(ctx);
                xTranslated += width;
                ctx.translate(width, 0);
            }
            ctx.translate(-xTranslated, 0);
            ctx.translate(0, height);
        }
        ctx.restore();
    }

    drawWalls(ctx) {
        ctx.save();
        ctx.strokeStyle = "#d5d5d5";
        ctx.lineWidth = 100;
        ctx.strokeRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.strokeStyle = "#847766";
        ctx.lineWidth = 25;
        ctx.strokeRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.strokeStyle = "#847766";
        ctx.lineWidth = 3;
        ctx.strokeRect(50, 50, ctx.canvas.width - 100, ctx.canvas.height - 100);
        ctx.lineWidth = 1;
        ctx.moveTo(0, 0);
        ctx.lineTo(50, 50);
        ctx.stroke();
        ctx.moveTo(ctx.canvas.width, 0);
        ctx.lineTo(ctx.canvas.width - 50, 50);
        ctx.stroke();
        ctx.moveTo(ctx.canvas.width, ctx.canvas.height);
        ctx.lineTo(ctx.canvas.width - 50, ctx.canvas.height - 50);
        ctx.stroke();
        ctx.moveTo(0, ctx.canvas.height);
        ctx.lineTo(50, ctx.canvas.height - 50);
        ctx.stroke();
        ctx.restore();
    }

    drawLights(ctx) {
        ctx.save();
        this._drawLights(ctx);
        ctx.translate(0, ctx.canvas.height / 2 - 0.5);
        this._drawLights(ctx);
        ctx.restore();
    }

    _drawLights(ctx) {
        ctx.save();

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(ctx.canvas.width, 0);
        ctx.lineTo(ctx.canvas.width, ctx.canvas.height / 2);
        ctx.lineTo(0, ctx.canvas.height / 2);
        ctx.closePath();

        ctx.translate((ctx.canvas.width - ctx.canvas.height * 2) / 4, 0);
        for (let i = 0; i < 4; i++) {
            ctx.arc(ctx.canvas.height / 4 + (i * (5 + ctx.canvas.height / 2)), ctx.canvas.height / 4, ctx.canvas.height / 4, -Math.PI / 2, Math.PI * 2);
        }
        ctx.closePath();

        ctx.fillStyle = "#00000030";
        ctx.fill('evenodd');

        ctx.translate(-(5 + ctx.canvas.height / 4), ctx.canvas.height / 4);
        for (let i = 0; i < 4; i++) {
            ctx.translate((5 + ctx.canvas.height / 2), 0);
            const gradient = ctx.createRadialGradient(0, 0, Math.max(5, ctx.canvas.height / 4 - 100), 0, 0, ctx.canvas.height / 4);
            gradient.addColorStop(0, '#fff70010');
            gradient.addColorStop(.7, '#00000030');
            gradient.addColorStop(1, '#00000030');
            circle(ctx, 0, 0, ctx.canvas.height / 4, gradient, "fill");
        }

        ctx.restore();
    }

    draw(ctx) {
        this.drawFloor(ctx);
        this.drawWalls(ctx);
        // this.drawDoor(ctx);
        this.tables.forEach(t => t.draw(ctx));
        this.drawLights(ctx);
    }
}