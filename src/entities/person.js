import * as traits from './traits';
import { pick } from '../utils/random-utils';
import { makePortrait } from '../helpers/portrait-generator';
import { circle } from '../utils/shape-utils';
import { speak } from '../utils/audio-utils';

const compatibleTraits = (trait) => {
    return Object.values(traits).filter(t => t !== trait && !t.incompatibleWith(trait) && !trait.incompatibleWith(t));
};

const happinessColour = (score) => {
    if (score >= 20) {
        return "#1e8e3e";
    }
    if (score >= 10) {
        return "#5fc53d";
    }
    if (score >= 0) {
        return "#ffeb00";
    }
    if (score >= -10) {
        return "#f3931c";
    }
    return "#ad0000";
};

const happinessName = (score) => {
    if (score >= 20) {
        return "🟢 Ecstatic";
    }
    if (score >= 10) {
        return "🟢 Happy";
    }
    if (score >= 0) {
        return "🟡 Neutral";
    }
    if (score >= -10) {
        return "🟠 Angry";
    }
    return "🔴 Furious";
};

const changeTypeColour = ["#d43333", "#3ebd62"];

export class Person {
    constructor(name, gender) {
        this.name = name;
        this.gender = gender;
        this.traits = [];
        this.mood = null;
        this.image = null;
        this.cardDimensions = {
            width: 234,
            height: 380,
            border: 8
        };
        this.personToMatch = null;
        this._happiness = 10;
        this.showHappinessChange = false;
        this.changeType = 0;
        this.speechBubbleScale = 1;
        this.speechBubbleIsRising = true;
        // this._debug = {
        //     drawn:0
        // }
    }

    set happiness(value) {
        this.changeType = this._happiness > value ? 0 : 1;
        this.showHappinessChange = this._happiness !== value; //only show if there's an actual change (i.e. non-zero change)
        this._happiness = Math.max(Math.min(value, 50), -50);
        if (this.showHappinessChange && window.speechSound) {
            speak(4, this.gender, "triangle", this.changeType ? "calm" : "exclamation");
        }
        this.speechBubbleScale = 0.8;
        this.growBubble();
        setTimeout(() => {
            this.showHappinessChange = false;
        }, 900);
    }

    get happiness() {
        return Math.max(Math.min(this._happiness, 50), -50);
    }

    get shortName() {
        return `${this.name.split(" ")[0][0]}. ${this.name.split(" ").slice(1).join(" ")}`;
    }

    get happinessName() {
        return happinessName(this.happiness);
    }

    get cardInfoDimensions() {
        return {
            width: this.cardDimensions.width,
            height: this.cardDimensions.height / 3.8
        };
    }

    growBubble() {
        let interval = setInterval(() => {
            this.speechBubbleScale += 0.1;
            if (this.speechBubbleScale > 1.2) {
                clearInterval(interval);
                this.shrinkBubble();
            }
        }, 1);
    }

    shrinkBubble() {
        let interval = setInterval(() => {
            this.speechBubbleScale -= 0.1;
            if (this.speechBubbleScale <= 1) {
                this.speechBubbleScale = 1;
                clearInterval(interval);
            }
        }, 1);
    }

    hasTrait(traitName) {
        return !!this.traits.find(t => t.name.toLowerCase() === traitName.toLowerCase());
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

    drawSpeechBubble(ctx, colour) {
        ctx.translate(-10 + 10*this.speechBubbleScale, -10 + 10*this.speechBubbleScale);
        ctx.scale(this.speechBubbleScale, this.speechBubbleScale);
        ctx.translate(0, 40);
        ctx.fillStyle = colour;
        //bubble
        ctx.beginPath();
        ctx.ellipse(0, 0, 75, 50, 0, 0, 2 * Math.PI);
        ctx.fill();
        //indicator
        ctx.beginPath();
        ctx.moveTo(25, 40);
        ctx.lineTo(50, 75);
        ctx.lineTo(50, 25);
        ctx.fill();
    }

    drawSpikySpeechBubble(ctx, colour) {
        ctx.save();
        this.drawSpeechBubble(ctx, colour);
        //spikes
        for (let i = 0; i < 16; i++) {
            ctx.save();
            ctx.translate(Math.cos(i * Math.PI / 8) * (90 / 2), Math.sin(i * Math.PI / 8) * (50 / 2));
            ctx.rotate(i * Math.PI / 8);
            ctx.beginPath();
            ctx.moveTo(20, -15);
            ctx.lineTo(20, 15);
            ctx.lineTo(35, 0);
            ctx.fill();
            ctx.restore();
        }
        ctx.restore();
    }

    draw(ctx, scale, skipChanges) {
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
        ctx.fillStyle = `${happinessColour(this.happiness)}70`;
        ctx.fill(shadow);
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
        if (!skipChanges) {
            if (this.personToMatch && this !== this.personToMatch) {
                const happinessChange = this.scorePerson(this.personToMatch);
                circle(ctx, Person.dimensions.width / 2 - 15, 0, 30, happinessColour(happinessChange), "fill");
            }
            if (this.showHappinessChange) {
                if (!this.changeType) {
                    this.drawSpikySpeechBubble(ctx, changeTypeColour[this.changeType]);
                } else {
                    this.drawSpeechBubble(ctx, changeTypeColour[this.changeType]);
                }
            }
        }
        ctx.restore();
        // this._debug.drawn++;
    }

    drawTraitBox(ctx) {
        const infoBoxX = this.cardDimensions.border / 2;
        const infoBoxY = (this.cardDimensions.border / 2) + (this.cardDimensions.height - this.cardInfoDimensions.height);
        ctx.translate(infoBoxX, infoBoxY);
        ctx.fillStyle = "#cdc8c4f0";
        ctx.fillRect(0, 0, this.cardInfoDimensions.width, this.cardInfoDimensions.height);

        ctx.lineWidth = this.cardDimensions.border;
        ctx.strokeStyle = "#9a8472";
        ctx.stroke(new Path2D(`M 0,0 h ${this.cardInfoDimensions.width}`));

        ctx.font = '32px monospace';
        ctx.fillStyle = "#000000";
        this.traits.forEach((t, i) => {
            ctx.fillText(t.name, 20, 40 + (40 * i));
        });
        ctx.translate(-infoBoxX, -infoBoxY);
    }

    drawNameBox(ctx) {
        const infoBoxX = this.cardDimensions.border / 2;
        const infoBoxY = 0;
        ctx.translate(infoBoxX, infoBoxY);
        ctx.fillStyle = "#cdc8c4f0";
        ctx.fillRect(0, 0, this.cardDimensions.width, 50);

        ctx.lineWidth = this.cardDimensions.border;
        ctx.strokeStyle = "#9a8472";
        ctx.stroke(new Path2D(`M 0,50 h ${this.cardInfoDimensions.width}`));

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
        const gradient = ctx.createLinearGradient(0, 0, 0, 256);
        gradient.addColorStop(0, happinessColour(this.happiness));
        gradient.addColorStop(0.2, happinessColour(this.happiness));
        gradient.addColorStop(0.9, '#f1dbbb');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.cardDimensions.width, this.cardDimensions.height);

        this.draw(ctx, null, true);
        this.drawTraitBox(ctx);
        this.drawNameBox(ctx);

        ctx.strokeStyle = "#9a8472";
        ctx.lineWidth = this.cardDimensions.border;
        ctx.strokeRect(0, 0, this.cardDimensions.width, this.cardDimensions.height);

        ctx.font = '12px monospace';
        ctx.lineWidth = 1;
        ctx.fillStyle = "transparent";
        ctx.strokeStyle = "transparent";
        ctx.restore();
    }
}

Person.dimensions = {
    width: 210,
    height: 345,
};