export declare class EventEmitter {
    private callBacks;
    trigger: (...args: any[]) => void;
    addEventListener: (callback: (...args: any[]) => void) => void;
    removeEventListener: (callback: (...args: any[]) => void) => void;
}
