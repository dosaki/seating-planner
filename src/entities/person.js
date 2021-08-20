import * as traits from './traits';
import { pick } from '../utils/random-utils';
import { makePortrait } from '../helpers/portrait-generator';

const compatibleTraits = (trait) => {
    return Object.values(traits).filter(t => t !== trait && !t.incompatibleWith(trait) && !trait.incompatibleWith(t));
};

const cardDimensions = {
    width: 234,
    height: 380,
    border: 8
};
const cardInfoDimensions = {
    width: 234,
    height: 100,
};
export class Person {
    constructor(name, gender) {
        this.name = name;
        this.gender = gender;
        this.traits = [];
        this.mood = null;
        this.image = null;
        // this._debug = {
        //     drawn:0
        // }
    }

    get shortName() {
        return `${this.name.split(" ")[0][0]}. ${this.name.split(" ").slice(1).join(" ")}`
    }

    get cardDimensions() {
        return cardDimensions;
    }

    scorePerson(person) {
        return this.traits.map(t => person.traits.map(pt => t.likes(pt) ? 10 : 0 + t.dislikes(pt) ? -10 : 0)).flat().reduce((a, b) => a + b, 0);
    }

    generateTraits() {
        const trait = pick(...Object.values(traits));
        this.traits = [trait, pick(true, true, false) && pick(...compatibleTraits(trait))].filter(t => !!t);
    }

    init() {
        this.generateTraits();
        this.mood = pick(...this.traits).mood;
        this.image = makePortrait(this.gender, this.mood);
        return this;
    }

    draw(ctx, scale) {
        const _scale = scale || { x: 1, y: 1 };
        ctx.save();
        ctx.translate(16, -6);
        ctx.scale(_scale.x, _scale.y);
        ctx.scale(1.04, 1.04);
        const shadow = new Path2D();
        this.image.forEach((section) => {
            shadow.addPath(new Path2D(section.path));
        });
        ctx.filter = 'blur(4px)';
        ctx.fillStyle = "#00000060";
        ctx.fill(shadow);
        ctx.filter = "none";
        ctx.restore();

        ctx.save();
        ctx.translate(15, 0);
        ctx.scale(_scale.x, _scale.y);
        this.image.forEach((section) => {
            const path = new Path2D(section.path);
            ctx.fillStyle = section.colour;
            ctx.fill(path);
        });
        ctx.restore();
        // this._debug.drawn++;
    }

    drawTraitBox(ctx) {
        ctx.fillStyle = "#cdc8c4";
        const infoBoxX = cardDimensions.border / 2;
        const infoBoxY = (cardDimensions.border / 2) + (cardDimensions.height - cardInfoDimensions.height);
        ctx.translate(infoBoxX, infoBoxY);
        ctx.fillRect(0, 0, cardInfoDimensions.width, cardInfoDimensions.height);

        ctx.lineWidth = cardDimensions.border;
        ctx.strokeStyle = "#9a8472";
        ctx.stroke(new Path2D(`M 0,0 h ${cardInfoDimensions.width}`));

        ctx.font = '32px monospace';
        ctx.fillStyle = "#000000";
        this.traits.forEach((t, i) => {
            ctx.fillText(t.name, 20, 40 + (40 * i));
        });
        ctx.translate(-infoBoxX, -infoBoxY);
    }

    drawNameBox(ctx) {
        ctx.fillStyle = "#cdc8c4";
        const infoBoxX = cardDimensions.border / 2;
        const infoBoxY = 0;
        ctx.translate(infoBoxX, infoBoxY);
        ctx.fillRect(0, 0, cardDimensions.width, 50);

        ctx.lineWidth = cardDimensions.border;
        ctx.strokeStyle = "#9a8472";
        ctx.stroke(new Path2D(`M 0,50 h ${cardInfoDimensions.width}`));

        ctx.font = 'bold 32px monospace';
        ctx.fillStyle = "#000000";
        ctx.fillText(this.shortName, 10, 40);
        ctx.translate(-infoBoxX, -infoBoxY);
    }

    drawCard(ctx, pos, scale) {
        ctx.save();
        const _scale = scale || { x: 1, y: 1 };
        ctx.scale(_scale.x, _scale.y);
        ctx.translate(pos.x, pos.y);
        ctx.fillStyle = "#f1dbbb";
        ctx.fillRect(0, 0, cardDimensions.width, cardDimensions.height);

        this.draw(ctx);
        this.drawTraitBox(ctx);
        this.drawNameBox(ctx);

        ctx.strokeStyle = "#9a8472";
        ctx.lineWidth = cardDimensions.border;
        ctx.strokeRect(0, 0, cardDimensions.width, cardDimensions.height);

        ctx.font = '12px monospace';
        ctx.lineWidth = 1;
        ctx.fillStyle = "transparent";
        ctx.strokeStyle = "transparent";
        ctx.restore();
    }

    drawHappinessChanges() {

    }
}

Person.cardDimensions = cardDimensions;
Person.dimensions = {
    width: 210,
    height: 345,
};