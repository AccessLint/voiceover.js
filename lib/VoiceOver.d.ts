import "@jxa/global-type";
import { Command } from './Commands.js';
export declare class VoiceOver {
    current?: string;
    private _previous?;
    private _started?;
    private _timer?;
    launch(): Promise<void>;
    quit(): Promise<void>;
    tail(): void;
    clickNext({ text, role, tries, }: {
        text: string;
        role?: "button" | "link";
        tries?: number;
    }): Promise<void>;
    seek({ text, role, tries, }: {
        text: string;
        role?: string;
        tries?: number;
    }): Promise<boolean>;
    lastPhrase(): Promise<string>;
    execute(command: Command): Promise<string>;
    cancel(): Promise<string>;
    rotor({ menu, find, }: {
        menu?: string;
        find?: string;
    }): Promise<void>;
    keyStrokes({ text, submit, }: {
        text: string;
        submit?: boolean;
    }): Promise<void>;
}
