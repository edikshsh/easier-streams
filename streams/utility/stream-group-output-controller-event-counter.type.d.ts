declare type StreamGroupControllerEvents = {
    end: () => void;
    close: () => void;
    finish: () => void;
};
export declare type StreamGroupControllerEventCounter = Record<keyof StreamGroupControllerEvents, number>;
export {};
