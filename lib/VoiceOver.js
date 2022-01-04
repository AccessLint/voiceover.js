"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceOver = void 0;
const run_1 = require("@jxa/run");
const child_process_1 = require("child_process");
require("@jxa/global-type");
const util = require("util");
const exec = util.promisify(child_process_1.exec);
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
            await exec('/System/Library/CoreServices/VoiceOver.app/Contents/MacOS/VoiceOverStarter');
            this._started = true;
        }
        catch (error) {
            console.log(error);
        }
        ;
    }
    async quit() {
        if (!this._started && !this._timer) {
            return;
        }
        try {
            clearInterval(this._timer);
            await run_1.run(() => {
                const voiceOver = Application('VoiceOver');
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
                ;
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
    lastPhrase() {
        return run_1.run(() => {
            const voiceOver = Application('VoiceOver');
            // @ts-expect-error
            return voiceOver.lastPhrase.content();
        });
    }
    execute(command) {
        return run_1.run(({ keyCode, modifiers }) => {
            const systemEvents = Application('System Events');
            systemEvents.keyCode(keyCode, { using: modifiers });
        }, command);
    }
}
exports.VoiceOver = VoiceOver;
