"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceOver = void 0;
const run_1 = require("@jxa/run");
const child_process_1 = require("child_process");
require("@jxa/global-type");
const util = require("util");
const exec = util.promisify(child_process_1.exec);
const Commands_js_1 = require("./Commands.js");
var Messages;
(function (Messages) {
    Messages["stopped"] = "Session ended";
})(Messages || (Messages = {}));
class VoiceOver {
    current = null;
    _previous = null;
    _started = false;
    _timer;
    async launch() {
        if (this._started) {
            return;
        }
        try {
            await exec("/System/Library/CoreServices/VoiceOver.app/Contents/MacOS/VoiceOverStarter");
            this._started = true;
        }
        catch (error) {
            console.log(error);
        }
    }
    async quit() {
        if (!this._started && !this._timer) {
            return;
        }
        try {
            clearInterval(this._timer);
            await run_1.run(() => {
                const voiceOver = Application("VoiceOver");
                voiceOver.quit();
            });
            this._timer = null;
            this._started = false;
            console.log(Messages.stopped);
        }
        catch (error) {
            console.error(error);
        }
    }
    tail() {
        this._timer = setInterval(async () => {
            try {
                this.current = await this.lastPhrase();
                if (!this.current || this.current.trim() === this._previous) {
                    return;
                }
                console.log(this.current);
                this._previous = this.current.trim();
            }
            catch (error) {
                if (error.message.match(/Application isn't running|Command failed/)) {
                    return;
                }
                console.error(error);
            }
        }, 100);
    }
    async clickNext({ text, role, tries, }) {
        const found = await this.seek({ text, role, tries });
        if (found) {
            await this.execute(Commands_js_1.activate);
        }
    }
    async seek({ text, role, tries = 10, }) {
        let match = false;
        let count = 0;
        const textRegex = new RegExp(text, "i");
        while (count < tries && !match) {
            await this.execute(Commands_js_1.moveRight);
            const phrase = await this.lastPhrase();
            if (role) {
                if (phrase.endsWith(` ${role}`)) {
                    if (phrase.match(textRegex)) {
                        return true;
                    }
                }
            }
            else {
                if (phrase.match(textRegex)) {
                    return true;
                }
            }
            count++;
        }
        return false;
    }
    lastPhrase() {
        return run_1.run(() => {
            const voiceOver = Application("VoiceOver");
            // @ts-expect-error
            return voiceOver.lastPhrase.content();
        });
    }
    execute(command) {
        return run_1.run(({ keyCode, modifiers }) => {
            const systemEvents = Application("System Events");
            systemEvents.keyCode(keyCode, { using: modifiers });
        }, command);
    }
    cancel() {
        return run_1.run(() => {
            const systemEvents = Application("System Events");
            systemEvents.keyCode(53);
        });
    }
    async rotor({ menu, find, }) {
        await run_1.run(({ keyCode, modifiers }) => {
            const systemEvents = Application("System Events");
            systemEvents.keyCode(keyCode, { using: modifiers });
        }, Commands_js_1.rotor);
        if (menu) {
            const menuFound = await this.seek({ text: `${menu} menu`, tries: 10 });
            if (find && menuFound) {
                await this.keyStrokes({ text: find, submit: true });
            }
        }
    }
    async keyStrokes({ text, submit = false, }) {
        const letters = text.split("");
        for (const letter of letters) {
            await run_1.run((letter) => {
                const systemEvents = Application("System Events");
                systemEvents.keystroke(letter);
                delay(0.05);
            }, letter);
        }
        if (submit) {
            await run_1.run(() => {
                const systemEvents = Application("System Events");
                systemEvents.keyCode(36);
            });
        }
    }
}
exports.VoiceOver = VoiceOver;
