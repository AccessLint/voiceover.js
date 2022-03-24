"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = exports.startInteracting = exports.moveRight = exports.rotor = void 0;
exports.rotor = {
    name: "Rotor",
    description: "VO+U",
    keyCode: 32,
    modifiers: ['control down', 'option down']
};
exports.moveRight = {
    name: "Move Right",
    description: "VO+right arrow",
    keyCode: 124,
    modifiers: ['control down', 'option down']
};
exports.startInteracting = {
    name: "Start Interacting with Item",
    keyCode: 125,
    modifiers: ['control down', 'option down', 'shift down']
};
exports.activate = {
    name: "Activate a control",
    keyCode: 49,
    modifiers: ['control down', 'option down']
};
