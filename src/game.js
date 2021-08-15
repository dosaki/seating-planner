import { Person } from './entities/person';
import { Room } from './entities/room';
import { Table } from './entities/table';
import { UI } from './ui/ui';
import { pick } from './utils/random-utils';

const canvas = document.querySelector('[game_area]');
canvas.width = window.innerWidth - 5;
canvas.height = window.innerHeight - 5;
const ctx = canvas.getContext('2d');

const ui = new UI(ctx, canvas.width, canvas.height);
const people = [
    new Person("Manuel", "male").init(),
    new Person("Virgulino", "male").init(),
    new Person("Victoria", "female").init(),
    new Person("Helena", "female").init(),
    new Person("Marlene", "female").init()
];
ui.addToHand(...people);

const room = new Room();
room.addTable(6, { x: 120, y: 120 });
room.addTable(4, { x: 520, y: 120 });

const mousePos = { x: 0, y: 0 };
document.addEventListener("mousemove", function (e) {
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
});

let selectedPerson = null;
document.addEventListener("mousedown", function (e) {
    selectedPerson = ui.checkClicked(mousePos);
});

document.addEventListener("mouseup", function (e) {
    if (selectedPerson) {
        const table = room.checkClicked(mousePos);
        if (table) {
            table.add(selectedPerson);
            ui.removeFromHand(selectedPerson);
        }
    }
});

let last = 0;
window.main = function (now) {
    window.requestAnimationFrame(main);
    // each 2 seconds call the createNewObject() function
    if(!last || now - last >= 10*1000) {
        last=now;
        if(pick(true, false, false) && !ui.atHandLimit){
            ui.addToHand(new Person("???", pick("female", "male")).init());
        }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ui.drawHand();
    room.draw(ctx);
};

main(); // Start the cycle

