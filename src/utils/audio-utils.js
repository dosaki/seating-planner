import { int } from './random-utils';

let context = null;
const AudioContext = window.AudioContext || window.webkitAudioContext;

const isFirefox = typeof InstallTrigger !== 'undefined'; // This is because firefox has a bug with exponentialRampToValueAtTime

export const play = (type, frequency, duration, trail) => {
    if (!context) {
        context = new AudioContext();
    }
    const _trail = trail || 0.1;
    const _duration = isFirefox ? _trail*100 : (duration || null);
    const _frequency = frequency || 440.0;

    const gain = context.createGain();
    const oscilator = context.createOscillator();
    oscilator.connect(gain);
    gain.connect(context.destination);

    gain.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + _trail);
    oscilator.type = type || "sine";
    oscilator.frequency.value = _frequency;
    oscilator.start();
    if (_duration) {
        setTimeout(() => {
            oscilator.stop();
        }, _duration);
    }
};