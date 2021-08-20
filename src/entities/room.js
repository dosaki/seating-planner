import { coordInRectangle } from '../utils/shape-utils';
import { Table } from './table';

export class Room {
    constructor() {
        this.tables = [];
    }

    get tablesAreFull() {
        return !this.tables.find(t => !t.isFull);
    }

    addTable(sizeOrTable, pos) {
        if (sizeOrTable instanceof Table) {
            this.tables.push(sizeOrTable);
        } else {
            this.tables.push(new Table(sizeOrTable, pos.x, pos.y));
        }
        this.tables = [...new Set(this.tables)];
        return true;
    }

    checkClickedTable(pos) {
        let tableClicked = null;
        [...this.tables].forEach(table => {
            console.log(pos, table.rect)
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
        const clickedThing = this.checkClickedPerson(pos) || this.checkClickedTable(pos);
        console.log(pos, clickedThing);
        return clickedThing;
    }

    draw(ctx) {
        this.tables.forEach(t => t.draw(ctx));
    }
}