import { int, pick } from './random-utils';

let context = null;
const AudioContext = window.AudioContext || window.webkitAudioContext;

const isFirefox = typeof InstallTrigger !== 'undefined'; // This is because firefox has a bug with exponentialRampToValueAtTime

export const play = (type, frequency, duration, trail, initialVolume) => {
    if (!context) {
        context = new AudioContext();
    }
    const _trail = trail || 0.1;
    const _duration = isFirefox ? _trail * 100 : (duration || null);
    const _frequency = frequency || 440.0;

    const volume = context.createGain();
    const oscilator = context.createOscillator();
    oscilator.connect(volume);
    volume.connect(context.destination);
    volume.gain.value = initialVolume || 1;

    volume.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + _trail);
    oscilator.type = type || "sine";
    oscilator.frequency.value = _frequency;
    oscilator.start();
    if (_duration) {
        setTimeout(() => {
            oscilator.stop();
        }, _duration);
    }
};

const noteFrequencies = {
    "do": 16.35,
    "do#": 17.32,
    "re": 18.35,
    "re#": 19.45,
    "mi": 20.60,
    "fa": 21.83,
    "fa#": 23.12,
    "sol": 24.5,
    "sol#": 25.96,
    "la": 27.5,
    "la#": 29.14,
    "si": 30.87,
};
export class Note {
    constructor(frequency, trail, octave, name) {
        this.frequency = frequency;
        this.trail = trail;
        this.octave = octave;
        this.name = name;
    }

    play(type, volume) {
        play(type, this.frequency, null, this.trail, volume);
    }

    static create = (note, octave, trail) => {
        return new Note(noteFrequencies[note] * Math.pow(2, octave), trail, octave, note);
    };
}

export class Track {
    constructor(notes, type, tempo, volume, waitBeforeLoop) {
        this.type = type;
        this.tempo = tempo || 1;
        this.volume = volume;
        this.noteIndex = 0;
        this.loop = waitBeforeLoop !== null && waitBeforeLoop !== undefined;
        this.waitBeforeLoop = waitBeforeLoop || 0;
        this.notes = [...notes, ...new Array(this.waitBeforeLoop).fill(null)];
        this.lastTime = 0;
    }

    playNextNote(time, msPerBeat) {
        if ((time - this.lastTime) >= (msPerBeat * this.tempo)) {
            if (this.notes[this.noteIndex]) {
                this.notes[this.noteIndex].play(this.type, this.volume);
            }
            this.noteIndex++;
            if (this.loop && this.noteIndex >= this.notes.length) {
                this.noteIndex = 0;
            }
            this.lastTime = time;
        }
    }
}

export class DynamicTrack {
    constructor(notePool, type, tempo, volume) {
        this.type = type;
        this.tempo = tempo || 1;
        this.volume = volume;
        this.notePool = notePool;
        this.lastTime = 0;
        this.toneLength = 0;
        this.noteIndex = 0;
    }

    playNextNote(time, msPerBeat) {
        if ((time - this.lastTime) >= (msPerBeat * this.tempo)) {
            let nextIndex = this.noteIndex+1;
            if (nextIndex >= this.notePool.length) {
                nextIndex = 0;
            }
            const noteToPlay = pick(...this.notePool[this.noteIndex]);
            const length = this.notePool[nextIndex].includes(null) ? 1 : 2;
            if (noteToPlay) {
                Note.create(noteToPlay[0], noteToPlay[1], length)
                    .play("triangle", this.volume);
                Note.create(noteToPlay[0], noteToPlay[1], length)
                    .play(this.type, this.volume);
            }
            this.noteIndex = nextIndex;
            this.lastTime = time;
        }
    }
}

export class Music {
    constructor(tracks, bpm) {
        this.bpm = bpm;
        this.tracks = tracks;
    }

    get msPerBeat() {
        return 60000 / this.bpm;
    }

    play(time) {
        this.tracks.forEach(t => {
            t.playNextNote(time, this.msPerBeat);
        });
    }
}
