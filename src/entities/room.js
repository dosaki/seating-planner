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
        ctx.lineWidth = 30;
        ctx.strokeRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.strokeStyle = "#847766";
        ctx.lineWidth = 2;
        ctx.strokeRect(50, 50, ctx.canvas.width - 100, ctx.canvas.height - 100);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(50, 50);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(ctx.canvas.width, 0);
        ctx.lineTo(ctx.canvas.width - 50, 50);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(ctx.canvas.width, ctx.canvas.height);
        ctx.lineTo(ctx.canvas.width - 50, ctx.canvas.height - 50);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, ctx.canvas.height);
        ctx.lineTo(50, ctx.canvas.height - 50);
        ctx.stroke();
        ctx.restore();
    }

    drawDoor(ctx) {
        ctx.save();
        ctx.translate(0, ctx.canvas.height / 2 - 100);

        // Door
        ctx.beginPath();
        ctx.moveTo(5, 0);
        ctx.lineTo(40, 50);
        ctx.lineTo(40, 150);
        ctx.lineTo(5, 200);
        ctx.fillStyle = "#90641f";
        ctx.fill();
        
        // Door details
        ctx.beginPath();
        ctx.moveTo(10, 15);
        ctx.lineTo(35, 50);
        ctx.lineTo(35, 150);
        ctx.lineTo(10, 185);
        ctx.fillStyle = "#fffaf4";
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(5, 93);
        ctx.lineTo(50, 95);
        ctx.lineTo(50, 105);
        ctx.lineTo(5, 108);
        ctx.fillStyle = "#90641f";
        ctx.fill();
        // Wall Top
        ctx.beginPath();
        ctx.moveTo(5, 0);
        ctx.lineTo(15, 0);
        ctx.lineTo(51, 50);
        ctx.lineTo(40, 50);
        ctx.fillStyle = "#c5c5c5";
        ctx.fill();

        // Wall Bottom
        ctx.beginPath();
        ctx.moveTo(51, 150);
        ctx.lineTo(40, 150);
        ctx.lineTo(5, 200);
        ctx.lineTo(15, 200);
        ctx.fillStyle = "#f5f5f5";
        ctx.fill();

        // Floor
        ctx.fillStyle = "#e3e0d9";
        ctx.fillRect(40, 50, 11, 100);

        // Footer Top
        ctx.beginPath();
        ctx.moveTo(51, 150);
        ctx.lineTo(40, 150);
        ctx.strokeStyle = "#847766";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Footer Bottom
        ctx.beginPath();
        ctx.moveTo(51, 50);
        ctx.lineTo(40, 50);
        ctx.stroke();        

        ctx.restore();
    }
    
    drawWindow(ctx) {
        ctx.save();
        
        // Window
        ctx.beginPath();
        ctx.moveTo(50, 5);
        ctx.lineTo(ctx.canvas.width - 50, 5);
        ctx.lineTo(ctx.canvas.width - 75, 40);
        ctx.lineTo(75, 40);
        ctx.fillStyle = "#e0f9fe";
        ctx.fill();
        
        // Wall Left
        ctx.beginPath();
        ctx.moveTo(50, 5);
        ctx.lineTo(75, 40);
        ctx.lineTo(75, 51);
        ctx.lineTo(50, 16);
        ctx.fillStyle = "#f5f5f5";
        ctx.fill();
        
        // Wall Right
        ctx.beginPath();
        ctx.moveTo(ctx.canvas.width - 50, 5);
        ctx.lineTo(ctx.canvas.width - 75, 40);
        ctx.lineTo(ctx.canvas.width - 75, 51);
        ctx.lineTo(ctx.canvas.width - 50, 16);
        ctx.fillStyle = "#f5f5f5";
        ctx.fill();
        
        // Footer Left
        ctx.beginPath();
        ctx.moveTo(75, 40);
        ctx.lineTo(75, 51);
        ctx.strokeStyle = "#847766";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Footer Right
        ctx.beginPath();
        ctx.moveTo(ctx.canvas.width - 75, 40);
        ctx.lineTo(ctx.canvas.width - 75, 51);
        ctx.stroke();    
        
        // Floor
        ctx.fillStyle = "#e3e0d9";
        ctx.fillRect(75, 40, ctx.canvas.width - 150, 11);

        ctx.restore();
    }

    drawLighting(ctx) {
        ctx.save();
        this._drawWindowShadows(ctx);
        this._drawLights(ctx, '#ffff8810', '#00000000');
        ctx.translate(0, ctx.canvas.height / 2);
        this._drawShadow(ctx);
        this._drawLights(ctx, '#fff70010', '#00000030');
        ctx.restore();
    }

    _drawLights(ctx, lightColour, outerColour) {
        ctx.save();
        ctx.translate((ctx.canvas.width - ctx.canvas.height * 2) / 4, 0);
        ctx.translate(-(5 + ctx.canvas.height / 4), ctx.canvas.height / 4);
        for (let i = 0; i < 4; i++) {
            ctx.translate((5 + ctx.canvas.height / 2), 0);
            const gradient = ctx.createRadialGradient(0, 0, Math.max(5, ctx.canvas.height / 4 - 100), 0, 0, ctx.canvas.height / 4);
            gradient.addColorStop(0, lightColour);
            gradient.addColorStop(.7, outerColour);
            gradient.addColorStop(1, outerColour);
            circle(ctx, 0, 0, ctx.canvas.height / 4, gradient, "fill");
        }
        ctx.restore();
    }

    _drawWindowShadows(ctx) {
        // Main shadow
        const gradient = ctx.createLinearGradient(0, ctx.canvas.height / 2 - 300, 0, ctx.canvas.height / 2);
        gradient.addColorStop(0, "#ddddff10");
        gradient.addColorStop(1, "#00000030");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, ctx.canvas.height / 2 - 300, ctx.canvas.width, 300);
        
        const triangleGradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height / 2);
        triangleGradient.addColorStop(0, "#00000030");
        triangleGradient.addColorStop(0.5, "#00000000");
        triangleGradient.addColorStop(1, "#00000000");
        ctx.fillStyle = triangleGradient;
        // Left triangle shadow
        ctx.moveTo(0, 0);
        ctx.lineTo(50, 0);
        ctx.lineTo(50, 15);
        ctx.lineTo(75, 51);
        ctx.lineTo(51, ctx.canvas.height / 2);
        ctx.lineTo(0, ctx.canvas.height / 2);
        ctx.fill();
        // Right triangle shadow
        ctx.moveTo(ctx.canvas.width, 0);
        ctx.lineTo(ctx.canvas.width-50, 0);
        ctx.lineTo(ctx.canvas.width-50, 15);
        ctx.lineTo(ctx.canvas.width-75, 51);
        ctx.lineTo(ctx.canvas.width-51, ctx.canvas.height / 2);
        ctx.lineTo(ctx.canvas.width, ctx.canvas.height / 2);
        ctx.fill();
    }

    _drawShadow(ctx) {
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

        ctx.restore();
    }

    draw(ctx) {
        this.drawFloor(ctx);
        this.drawWalls(ctx);
        this.drawDoor(ctx);
        this.drawWindow(ctx);
        this.tables.forEach(t => t.draw(ctx));
        this.drawLighting(ctx);
    }
}