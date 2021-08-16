import { Person } from './entities/person';
import { Room } from './entities/room';
import { Table } from './entities/table';
import { UI } from './ui/ui';
import { generateName } from './utils/name-gen';
import { pick } from './utils/random-utils';

const canvas = document.querySelector('[game_area]');
canvas.width = window.innerWidth - 5;
canvas.height = window.innerHeight - 5;
const ctx = canvas.getContext('2d');
canvas.oncontextmenu = (e) => { e.preventDefault(); e.stopPropagation(); };

const ui = new UI(ctx, canvas.width, canvas.height);
const people = new Array(ui.handLimit-1).fill(0).map(ignored => {
    const gender = pick("female", "male");
    return new Person(generateName(gender), gender).init();
});
ui.addToHand(...people, new Table(4));

const room = new Room();
const startingTable = new Table(6);
startingTable.x = window.innerWidth/2 - startingTable.rectangle[2]/2
startingTable.y = window.innerHeight/2 - startingTable.rectangle[3]/2
room.addTable(startingTable);

const mousePos = { x: 0, y: 0 };
document.addEventListener("mousemove", function (e) {
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
});

let selection = null;

document.addEventListener("mousedown", function (e) {
    if (e.button === 0) {
        selection = ui.checkClicked(mousePos) || room.checkClicked(mousePos);
        ui.tooltipInfo.content = null;
    }
});

document.addEventListener("mouseup", function (e) {
    if (e.button === 0 && selection) {
        if (selection instanceof Person) {
            const table = room.checkClicked(mousePos);
            if (table && table instanceof Table) {
                room.tables.forEach(t => {
                    t.remove(selection);
                });
                table.add(selection);
                ui.removeFromHand(selection);
            }
        }
        if (selection instanceof Table && !ui.checkClicked(mousePos) && !room.checkClicked(mousePos)) {
            selection.x = mousePos.x;
            selection.y = mousePos.y;
            room.addTable(selection);
            ui.removeFromHand(selection);
        }
    }
    if (e.button === 2) {
        const clickedThing = room.checkClicked(mousePos);
        if (clickedThing instanceof Person) {
            ui.tooltipInfo.content = [clickedThing.name, ...clickedThing.traits.map(t => t.name)];
            ui.tooltipInfo.x = mousePos.x;
            ui.tooltipInfo.y = mousePos.y;
        }
        if (!clickedThing) {
            ui.tooltipInfo.content = null;
        }
    }
});

let last = 0;
window.main = function (now) {
    window.requestAnimationFrame(main);
    if (!last || now - last >= 5 * 1000) {
        last = now;
        if (pick(true, false) && !ui.atHandLimit) {
            const tryTable = ui.hand.filter(c=> c instanceof Table).length <= 1 && pick(true, false, false, false, false, false, false);
            if (tryTable) {
                ui.addToHand(new Table(pick(2, 4, 6, 8), 0, 0));
            } else {
                const gender = pick("female", "male");
                ui.addToHand(new Person(generateName(gender), gender).init());
            }
        }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    room.draw(ctx);
    ui.drawHand();
    ui.drawTooltip();
};

main(); // Start the cycle

