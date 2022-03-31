import { run as jxaRun } from "@jxa/run";
import { exec as execWithCallback } from "child_process";
import "@jxa/global-type";
import * as util from "util";
const exec = util.promisify(execWithCallback);

import { activate, Command, moveRight, rotor } from "./Commands.js";

enum Messages {
  "stopped" = "Session ended",
}

export class VoiceOver {
  current?: string = null;

  private _previous?: string = null;
  private _started?: boolean = false;
  private _timer?: NodeJS.Timer;

  public async launch(): Promise<void> {
    if (this._started) {
      return;
    }

    try {
      await exec(
        "/System/Library/CoreServices/VoiceOver.app/Contents/MacOS/VoiceOverStarter"
      );
      this._started = true;
    } catch (error) {
      console.log(error);
    }
  }

  public async quit(): Promise<void> {
    if (!this._started && !this._timer) {
      return;
    }

    try {
      clearInterval(this._timer);
      await jxaRun(() => {
        const voiceOver = Application("VoiceOver");
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
        if (!this.current || this.current.trim() === this._previous) {
          return;
        }
        console.log(this.current);
        this._previous = this.current.trim();
      } catch (error) {
        if (error.message.match(/Application isn't running|Command failed/)) {
          return;
        }
        console.error(error);
      }
    }, 100);
  }

  public async clickNext({
    text,
    role,
    tries,
  }: {
    text: string;
    role?: "button" | "link";
    tries?: number;
  }): Promise<void> {
    const found = await this.seek({ text, role, tries });

    if (found) {
      await this.execute(activate);
    }
  }

  public async advance({
    target,
    steps = 1,
  }: {
    target?: {
      text: string;
      role: string;
    };
    steps?: number;
  }): Promise<string> {
    const { text, role } = target;
    const phrases = [];
    let match = false;
    let count = 0;
    const textRegex = new RegExp(text, "i");

    while (count < steps && !match) {
      const phrase = await this.lastPhrase();
      phrases.push(phrase);

      if (phrase.match(textRegex)) {
        if (!role || phrase.startsWith(role) || phrase.endsWith(role)) {
          match = true;
        }
      }

      if (!match) {
        await this.execute(moveRight);
        count++;
      }
    }

    return phrases[phrases.length - 1];
  }

  public async seek({
    text,
    role,
    tries = 10,
  }: {
    text: string;
    role?: string;
    tries?: number;
  }): Promise<string[]> {
    let match = false;
    let count = 0;
    let phrases = [];
    const textRegex = new RegExp(text, "i");

    while (count < tries && !match) {
      await this.execute(moveRight);
      const phrase = await this.lastPhrase();
      phrases.push(phrase);

      if (role) {
        if (phrase.endsWith(` ${role}`)) {
          if (phrase.match(textRegex)) {
            break;
          }
        }
      } else {
        if (phrase.match(textRegex)) {
          break;
        }
      }

      count++;
    }

    return phrases;
  }

  public lastPhrase(): Promise<string> {
    return jxaRun(() => {
      const voiceOver = Application("VoiceOver");
      // @ts-expect-error
      return voiceOver.lastPhrase.content();
    });
  }

  public execute(command: Command): Promise<string> {
    return jxaRun(({ keyCode, modifiers }) => {
      const systemEvents = Application("System Events");
      systemEvents.keyCode(keyCode, { using: modifiers });
    }, command);
  }

  public cancel(): Promise<string> {
    return jxaRun(() => {
      const systemEvents = Application("System Events");
      systemEvents.keyCode(53);
    });
  }

  public async rotor({
    menu,
    find,
  }: {
    menu?: string;
    find?: string;
  } = {}): Promise<void> {
    await jxaRun(({ keyCode, modifiers }) => {
      const systemEvents = Application("System Events");
      systemEvents.keyCode(keyCode, { using: modifiers });
    }, rotor);

    if (menu) {
      const menuFound = await this.seek({ text: `${menu} menu`, tries: 10 });

      if (find && menuFound) {
        await this.keyStrokes({ text: find, submit: true });
      }
    }
  }

  public async keyStrokes({
    text,
    submit = false,
  }: {
    text: string;
    submit?: boolean;
  }): Promise<void> {
    const letters = text.split("");

    for (const letter of letters) {
      await jxaRun((letter) => {
        const systemEvents = Application("System Events");
        systemEvents.keystroke(letter);
        delay(0.05);
      }, letter);
    }

    if (submit) {
      await jxaRun(() => {
        const systemEvents = Application("System Events");
        systemEvents.keyCode(36);
      });
    }
  }
}
