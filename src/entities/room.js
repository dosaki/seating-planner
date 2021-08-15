import { coordInRectangle } from '../utils/geometry-utils';
import { Table } from './table';

export class Room {
    constructor() {
        this.tables = [];
    }

    addTable(size, pos) {
        this.tables.push(new Table(size, pos.x, pos.y));
    }
    
    checkClicked(pos) {
        let tableClicked = null;
        [...this.tables].forEach(table => {
            if(coordInRectangle(pos, table)){
                tableClicked = table;
            }
        });
        return tableClicked;
    }

    draw(ctx) {
        this.tables.forEach(t=>t.draw(ctx));
    }
}