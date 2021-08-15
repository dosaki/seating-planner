import { coordInRectangle } from '../utils/geometry-utils';
import { Table } from './table';

export class Room {
    constructor() {
        this.tables = [];
    }

    addTable(sizeOrTable, pos) {
        if(sizeOrTable instanceof Table){
            this.tables.push(sizeOrTable);
        } else {
            this.tables.push(new Table(sizeOrTable, pos.x, pos.y));
        }
    }

    checkClickedTable(pos) {
        let tableClicked = null;
        [...this.tables].forEach(table => {
            if (coordInRectangle(pos, table)) {
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