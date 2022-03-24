export interface Command {
    keyCode: number;
    modifiers: string[];
    name?: string;
    description?: string;
}
export declare const rotor: Command;
export declare const moveRight: Command;
export declare const startInteracting: Command;
export declare const activate: Command;
