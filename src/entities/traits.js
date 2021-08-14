import { pick } from '../utils/random-utils';

class Trait {
    constructor(name, mood) {
        this.name = name;
        this.mood = mood;
        this.likedTraits = [];
        this.dislikedTraits = [];
        this.incompatibileTraits = [];
    }

    addLikes(...likedTraits) {
        this.likedTraits.push(...likedTraits);
    }

    addDislikes(...dislikedTraits) {
        this.dislikedTraits.push(...dislikedTraits);
    }

    addIncompatibles(...incompatibileTraits) {
        this.incompatibileTraits = incompatibileTraits;
    }

    likes(trait) {
        return !!this.likedTraits.find(t => t === trait);
    }

    dislikes(trait) {
        return !!this.dislikedTraits.find(t => t === trait);
    }

    incompatibleWith(trait) {
        return this.incompatibileTraits.includes(trait);
    }
}

export const boring = new Trait("Boring", "neutral");
export const hyperactive = new Trait("Hyperactive", "talkative");

export const playful = new Trait("Playful", "positive");
export const serious = new Trait("Serious", "negative");

export const gossip = new Trait("Gossip", "talkative");
export const smart = new Trait("Smart", pick("positive", "neutral"));

export const humble = new Trait("Humble", "neutral");
export const boastful = new Trait("Boastful", "talkative");

export const patient = new Trait("Patient", "positive");
export const impatient = new Trait("Impatient", "negative");

export const clumsy = new Trait("Clumsy", pick("positive", "neutral"));
export const organised = new Trait("Organised", "neutral");

export const annoying = new Trait("Annoying", "talkative");

boring.addDislikes(hyperactive, playful);
boring.addLikes(serious, boring, humble, organised);
boring.addIncompatibles(hyperactive, playful, smart, gossip, boastful, clumsy);
hyperactive.addDislikes(serious, annoying);
hyperactive.addLikes(playful, boastful);
hyperactive.addIncompatibles(boring, humble);

playful.addDislikes(boring, annoying);
playful.addLikes(playful, patient, smart, gossip);
playful.addIncompatibles(serious);
serious.addDislikes(playful, boastful, gossip, clumsy, annoying);
serious.addLikes(smart, organised);
serious.addIncompatibles(playful, gossip);

gossip.addDislikes(boring, annoying);
gossip.addLikes(gossip, boastful);
gossip.addIncompatibles(smart, impatient);
smart.addDislikes(boring, gossip, boastful, annoying);
smart.addLikes(smart, humble);
smart.addIncompatibles(gossip, boring);

humble.addDislikes(boastful, gossip, annoying);
humble.addLikes(humble, clumsy);
humble.addIncompatibles(boastful, gossip);
boastful.addDislikes(boastful, hyperactive, annoying);
boastful.addLikes(humble, patient);
boastful.addIncompatibles(humble, boring);

patient.addLikes(smart, humble);
patient.addIncompatibles(impatient, hyperactive);

impatient.addDislikes(impatient, hyperactive, playful, gossip, boastful, clumsy, annoying);
impatient.addLikes(humble, boring, serious);
impatient.addIncompatibles(patient, gossip);

clumsy.addDislikes(organised, impatient, annoying);
clumsy.addLikes(patient);
clumsy.addIncompatibles(organised);

organised.addDislikes(clumsy, hyperactive, annoying);
organised.addLikes(organised, serious, smart);
organised.addIncompatibles(clumsy);

annoying.addDislikes(annoying);
annoying.addLikes(patient);