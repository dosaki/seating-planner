import * as traits from './traits';
import { pick } from '../utils/random-utils';
import { generateTraits } from '../helpers/portrait-generator';

const compatibleTraits = (trait) => {
    return Object.values(traits).filter(t => !t.incompatibleWith(trait) && !trait.incompatibleWith(t));
};

export class Person {
    constructor(name, gender) {
        this.name = name;
        this.gender = gender;
        this.traits = [];
        this.mood = null;
        this.image = null;
    }

    generateTraits() {
        const trait = pick(...Object.values(traits));
        this.traits = [trait, pick(...compatibleTraits(trait))].filter(t => !!t);
    }

    init() {
        this.generateTraits();
        this.mood = pick(...this.traits).mood;
        this.image = makePortrait(this.gender, this.mood);
    }

    draw(ctx, position) {
        ctx.translate(position.x, position.y)
        this.image.forEach((section) => {
            const path = new Path2D(section.path)
            ctx.fillStyle = section.colour;
            ctx.fill(path);
        });
    }
}