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
    lastPhrase(): Promise<string>;
    execute(command: Command): Promise<string>;
}
