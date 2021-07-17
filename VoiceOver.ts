import { run as jxaRun } from '@jxa/run';
import { exec as execWithCallback } from 'child_process';
import "@jxa/global-type";
import * as util from 'util';
const exec = util.promisify(execWithCallback);

import { Command } from './Commands.js';

enum Messages {
  'stopped' = 'Session ended'
}

export class VoiceOver {
  current?: string = null;

  private _previous?: string = null;
  private _started?: boolean = false;
  private _timer?: NodeJS.Timer;

  public async launch(): Promise<void> {
    if (this._started) { return; }

    try {
      await exec('/System/Library/CoreServices/VoiceOver.app/Contents/MacOS/VoiceOverStarter');
      this._started = true;
    } catch (error) {
      console.log(error);
    };
  }

  public async quit(): Promise<void> {
    if (!this._started && !this._timer) { return; }

    try {
      clearInterval(this._timer);
      await jxaRun(() => {
        const voiceOver = Application('VoiceOver');
        voiceOver.quit();
      });
      this._timer = null;
      this._started = false;
      console.log(Messages.stopped);
    } catch (error) {
      console.error(error);
    }
  }

  public tail(): void {
    this._timer = setInterval(async () => {
      try {
        this.current = await this.lastPhrase();
        if (!this.current || this.current.trim() === this._previous) { return };
        console.log(this.current);
        this._previous = this.current.trim();
      } catch (error) {
        if (error.message.match(/Application isn't running|Command failed/)) { return; }
        console.error(error);
      }
    }, 100);
  }

  public lastPhrase(): Promise<string> {
    return jxaRun(() => {
      const voiceOver = Application('VoiceOver');
      // @ts-expect-error
      return voiceOver.lastPhrase.content();
    })
  }

  public execute(command: Command): Promise<string> {
    return jxaRun(({keyCode, modifiers}) => {
      const systemEvents = Application('System Events');
      systemEvents.keyCode(keyCode, { using: modifiers });
    }, command);
  }
}
