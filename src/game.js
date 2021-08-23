import { Person } from './entities/person';
import { Room } from './entities/room';
import { Table } from './entities/table';
import { UI } from './ui/ui';
import { play } from './utils/audio-utils';
import { generateName } from './utils/name-gen';
import { int, pick } from './utils/random-utils';

window.play = play;

const canvas = document.querySelector('[game_area]');
canvas.width = window.innerWidth - 5;
canvas.height = window.innerHeight - 5;
const ctx = canvas.getContext('2d');
canvas.oncontextmenu = (e) => { e.preventDefault(); e.stopPropagation(); };

const ui = new UI(ctx, canvas.width, canvas.height);
window.ui = ui;
const people = new Array(ui.handLimit - 1).fill(0).map(ignored => {
    const gender = pick("female", "male");
    return new Person(generateName(gender), gender).init();
});
ui.addToHand(...people, new Table(4));

const room = new Room();
const startingTable = new Table(6);
startingTable.x = window.innerWidth / 2 - startingTable.width / 2;
startingTable.y = window.innerHeight / 2 - startingTable.height / 2;
room.addTable(startingTable);

let lost = false;
let loseReason = 0;
const loseReasons = [
    "You kept your guests waiting for too long.",
    "You had at least two furious people at a table."
];
const loseTips = [
    "Tip: Guests in your hand grow angry as time passes.",
    "Tip: Shift guests from table to table to balance out their happiness."
];
let scoredSaved = false;
let previousScore = 0;

let selection = null;
let hoveredSelection = null;
const mousePos = { x: 0, y: 0 };
const mousePosPress = { x: null, y: null };

let longTouchTimer;
let isLongTouch = false;
const touchDuration = 500;

let resizeTime;
let isResizing = false;
const resizeDurationTimeout = 200;

function onResize() {
    resizeTime = new Date();
    if (isResizing === false) {
        isResizing = true;
        setTimeout(onResizeEnd, resizeDurationTimeout);
    }
}

function onResizeEnd() {
    if (new Date() - resizeTime < resizeDurationTimeout) {
        setTimeout(onResizeEnd, resizeDurationTimeout);
    } else {
        isResizing = false;
        canvas.width = window.innerWidth - 5;
        canvas.height = window.innerHeight - 5;
        ui.width = window.innerWidth - 5;
        ui.height = window.innerHeight - 5;
    }
}

function onMove(e) {
    if (lost) return;
    mousePos.x = e.touches ? e.touches[0].clientX : e.clientX;
    mousePos.y = e.touches ? e.touches[0].clientY : e.clientY;
    hoveredSelection = room.checkClicked(mousePos);
}

function onPress(e) {
    if (lost) return;
    onMove(e);
    mousePosPress.x = mousePos.x;
    mousePosPress.y = mousePos.y;
    if ((e.button === 0 || e.touches)) {
        selection = ui.checkClicked(mousePos) || room.checkClicked(mousePos);
        ui.tooltipInfo.content = null;
    }
}

function onLetGo(e) {
    if (lost) return;
    mousePosPress.x = null;
    mousePosPress.y = null;
    if ((e.button === 0 || (!isLongTouch && e.touches)) && selection) {
        if (selection instanceof Person) {
            const table = room.checkClicked(mousePos);
            if (table && table instanceof Table) {
                room.tables.forEach(t => {
                    t.remove(selection);
                });
                if (table.add(selection)) {
                    ui.removeFromHand(selection);
                }
            }
        }
        if (selection instanceof Table && !ui.checkClicked(mousePos) && !room.checkClicked(mousePos)) {
            selection.x = mousePos.x;
            selection.y = mousePos.y;
            if (room.addTable(selection)) {
                ui.removeFromHand(selection);
            }
        }
    }
    if (e.button === 2 || isLongTouch) {
        const clickedThing = room.checkClicked(mousePos);
        if (clickedThing instanceof Person) {
            ui.tooltipInfo.content = [clickedThing.name, clickedThing.happinessName, ...clickedThing.traits.map(t => t.name)];
            ui.tooltipInfo.x = mousePos.x;
            ui.tooltipInfo.y = mousePos.y;
        }
        if (!clickedThing) {
            ui.tooltipInfo.content = null;
        }
    }
    selection = null;
    room.tables.forEach(t => t.spaces.forEach(p => p.personToMatch = null));
}

window.addEventListener("resize", onResize, true);

document.addEventListener("mousemove", onMove);
document.addEventListener("touchmove", onMove);
document.addEventListener("touchmove", () => {
    if (longTouchTimer) {
        clearTimeout(longTouchTimer);
    }
    isLongTouch = false;
});

document.addEventListener("mousedown", onPress);
document.addEventListener("touchstart", onPress);
document.addEventListener("touchstart", function (e) {
    longTouchTimer = setTimeout(() => isLongTouch = true, touchDuration);
});

document.addEventListener("mouseup", onLetGo);
document.addEventListener("touchend", onLetGo);
document.addEventListener("touchcancel", onLetGo);
document.addEventListener("touchend", () => {
    if (longTouchTimer) {
        clearTimeout(longTouchTimer);
    }
    isLongTouch = false;
});
document.addEventListener("touchcancel", () => {
    if (longTouchTimer) {
        clearTimeout(longTouchTimer);
    }
    isLongTouch = false;
});

let last = 0;
window.speed = 1;
let called = 0;
window.main = function (t) {
    const now = t || 0;
    if (now - last >= 5 * (1000 * window.speed)) {
        last = now;
        if (!lost) {
            room.tables.forEach(t => t.updateHappiness());
            const badTable = room.tables.find(t => t.moreThanOneFurious);
            if (badTable) {
                ui.ping(badTable.centre, "#ff0000", 8000);
                lost = true;
                loseReason = 1;
            }
            ui.hand.forEach(card => {
                if (card instanceof Person) {
                    card.happiness -= card.hasTrait("impatient") ? int(3, 6) : (card.hasTrait("patient") ? int(0, 2) : int(1, 4));
                    if (card.happiness <= -50) {
                        lost = true;
                        loseReason = 0;
                    }
                }
            });
            if (pick(true, false) && !ui.atHandLimit) {
                const tryTable = ui.hand.filter(c => c instanceof Table).length <= 1 && ((room.tablesAreFull && (ui.hand.length === (ui.handLimit - 1))) || pick(true, false, false, false, false, false, false));
                if (tryTable) {
                    ui.addToHand(new Table(pick(2, 4, 6, 8), 0, 0));
                } else {
                    const gender = pick("female", "male");
                    ui.addToHand(new Person(generateName(gender), gender).init());
                }
            }
            if (ui.atHandLimit && !room.tablesAreFull) {
                const tableWithSpaces = room.tables.find(t => !t.isFull);
                ui.ping(tableWithSpaces.centre, "#0088ff", 2000);
            }
        }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.lineWidth=2
    // ctx.strokeStyle="#000000"
    // ctx.stroke(new Path2D(`M ${canvas.width/2},0 ${canvas.width/2}, ${canvas.height}`));
    // ctx.stroke(new Path2D(`M 0,${canvas.height/2} ${canvas.width}, ${canvas.height/2}`));
    room.draw(ctx);
    ui.drawTooltip();
    ui.drawHand();
    ui.drawScore(room.totalScore);
    if (selection) {
        ctx.save();
        ctx.globalAlpha = 0.7;
        if (selection instanceof Person) {
            ctx.translate(mousePos.x, mousePos.y);
            ctx.scale(0.3, 0.3);
            ctx.translate(-30, -50);
        } else if (selection instanceof Table) {
            selection.x = mousePos.x;
            selection.y = mousePos.y;
        }
        selection.draw(ctx);
        ctx.restore();

        if (selection instanceof Person && hoveredSelection && hoveredSelection instanceof Table) {
            hoveredSelection.spaces.forEach(p => p.personToMatch = selection);
        }
    }
    ui.drawPings();
    // room.tables.forEach(t=>t.spaces.forEach(p => p._debug.drawn = 0))
    // ui.hand.forEach(p => p._debug && (p._debug.drawn = 0))


    if (lost) {
        if (!scoredSaved) {
            scoredSaved = true;
            previousScore = parseInt(localStorage.getItem('dosaki-seating-space-planner-high-score')) || 0;
            localStorage.setItem('dosaki-seating-space-planner-high-score', Math.max(previousScore, room.totalScore));
        }
        ctx.fillStyle = "#050000aa";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#ffffff";
        const gameOverMessages = [
            ["Your wedding reception is ruined!", 42],
            [loseReasons[loseReason], 32],
            ["", 5],
            [`Happiness: ${room.totalScore}`, 44],
            [previousScore < room.totalScore ? 'New High Score!' : `Highest: ${previousScore}`, 38],
            ["", 10],
            [loseTips[loseReason], 26],
            ["", 40],
            ["Refresh to start a new game.", 32]
        ];
        const totalSize = gameOverMessages.reduce((acc, m) => acc + m[1], 0) * 0.5625;
        gameOverMessages.forEach((message, i) => {
            ctx.font = `${message[1]}px monospace`;
            ctx.fillText(message[0], canvas.width / 2 - (message[0].length * message[1] * 0.5625) / 2, (canvas.height / 2 - totalSize) + (i * 40 + message[1] * 0.5625));
        });
    }
    window.requestAnimationFrame(main);
};

window.start = () => {
    document.querySelector('[intro]').classList.add("hidden");
    document.querySelector('[game_area]').classList.remove("hidden");
    main();
};

