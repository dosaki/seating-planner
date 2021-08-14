import { Person } from './entities/person';

const person = new Person("Marlene", "female");


const canvas = document.querySelector('[game_area]');
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
const context = canvas.getContext('2d');
context.clearRect(0, 0, canvas.width, canvas.height);
person.draw(context, 300, 300)
