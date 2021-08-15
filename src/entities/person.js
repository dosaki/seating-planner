import * as traits from './traits';
import { pick } from '../utils/random-utils';
import { makePortrait } from '../helpers/portrait-generator';

const compatibleTraits = (trait) => {
    return Object.values(traits).filter(t => t !== trait && !t.incompatibleWith(trait) && !trait.incompatibleWith(t));
};

const cardDimensions = {
    width: 234,
    height: 380,
    border: 4
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
    }

    get cardDimensions() {
        return cardDimensions;
    }

    scorePerson(person) {
        return this.traits.map(t => person.traits.map(pt => t.likes(pt) ? 10 : 0 + t.dislikes(pt) ? -10 : 0)).flat().reduce((a,b)=>a+b,0);
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

    draw(ctx, position, scale) {
        const _scale = scale || { x: 1, y: 1 };
        ctx.scale(_scale.x, _scale.y);
        ctx.translate(position.x + 16, position.y - 6);
        ctx.scale(1.04, 1.04);
        const shadow = new Path2D();
        this.image.forEach((section) => {
            shadow.addPath(new Path2D(section.path));
        });
        ctx.filter = 'blur(4px)';
        ctx.fillStyle = "#00000060";
        ctx.fill(shadow);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.filter = "none";

        ctx.scale(_scale.x, _scale.y);
        ctx.translate(position.x + 15, position.y);
        this.image.forEach((section) => {
            const path = new Path2D(section.path);
            ctx.fillStyle = section.colour;
            ctx.fill(path);
        });
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    drawCard(ctx, position, scale) {
        const _scale = scale || { x: 1, y: 1 };
        ctx.scale(_scale.x, _scale.y);
        ctx.translate(position.x, position.y);
        ctx.fillStyle = "#f1dbbb";
        ctx.fillRect(4, 0, cardDimensions.width, cardDimensions.height);
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        this.draw(ctx, { x: position.x, y: position.y - 5 }, scale);


        ctx.scale(_scale.x, _scale.y);
        ctx.fillStyle = "#cdc8c4";
        const infoBoxX = position.x + (cardDimensions.border / 2);
        const infoBoxY = position.y + (cardDimensions.border / 2) + (cardDimensions.height - cardInfoDimensions.height);
        ctx.fillRect(infoBoxX, infoBoxY, cardInfoDimensions.width, cardInfoDimensions.height);

        ctx.lineWidth = cardDimensions.border;
        ctx.strokeStyle = "#9a8472";
        ctx.stroke(new Path2D(`M ${infoBoxX},${infoBoxY} h ${cardInfoDimensions.width}`));
        ctx.strokeRect(position.x + (cardDimensions.border / 2), position.y + (cardDimensions.border / 2), cardDimensions.width - cardDimensions.border, cardDimensions.height - cardDimensions.border);

        ctx.font = '32px serif';
        ctx.fillStyle = "#000000";
        this.traits.forEach((t, i) => {
            ctx.fillText(t.name, infoBoxX + 20, infoBoxY + 40 + (40 * i));
        });

        ctx.font = '12px serif';
        ctx.lineWidth = 0;
        ctx.fillStyle = "transparent";
        ctx.strokeStyle = "transparent";
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
}