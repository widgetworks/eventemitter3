export interface ListenerFn<Args extends any[] = any[]> {
    (...args: Args): void;
}

export type ValidEventNames = string | symbol;

/**
* `object` should be in either of the following forms:
* ```
* interface EventTypes {
*   'event-with-parameters': any[]
*   'event-with-example-handler': (...args: any[]) => void
* }
* ```
*/
export type ValidEventTypes = string | symbol | EventLike;

/**
* An object that looks like a browser Event instance.
*
* (Widget Works extension)
*/
export type EventLike<T extends ValidEventNames = ValidEventNames> = {
    type: T;
};

export type EventNames<T extends ValidEventTypes> = T extends EventLike
    ? T['type']
    : T extends string | symbol
        ? T
        : keyof T;

export type ArgumentMap<T extends object> = {
    [K in keyof T]: T[K] extends (...args: any[]) => void
        ? Parameters<T[K]>
        : T[K] extends any[]
            ? T[K]
            : any[];
};

export type EventListener<
    T extends ValidEventTypes,
    K extends EventNames<T>
> = T extends string | symbol
    ? (...args: any[]) => void
    : (
        ...args: ArgumentMap<Exclude<T, string | symbol>>[Extract<K, keyof T>]
    ) => void;

export type EventArgs<
    T extends ValidEventTypes,
    K extends EventNames<T>
> = Parameters<EventListener<T, K>>;
