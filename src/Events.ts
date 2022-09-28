import { EE } from "./EE";
import { ValidEventNames } from "./types";

export type IEventsMap<EventTypes extends ValidEventNames = ValidEventNames> = Record<ValidEventNames, EE | EE[]>;

//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//

/**
 * Create storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 * 
 * @private
 */
export function getEventsMap<EventTypes extends ValidEventNames = ValidEventNames>(): IEventsMap<EventTypes> {
  return Object.create(null);
}
