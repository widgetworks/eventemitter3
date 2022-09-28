import { getEventsMap } from './Events';
import { EE } from './EE';
import { EventNames, EventListener, ValidEventNames, EventLike, EventArgs } from './types';

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * `EventTypes` should be in either of the following forms:
 * ```
 * interface EventTypes {
 *   'event-with-parameters': any[]
 *   'event-with-example-handler': (...args: any[]) => void
 * }
 * ```
 * 
 * @constructor
 * @public
 */
export class EventEmitter<
  EventTypes extends ValidEventNames = ValidEventNames,
  Context extends any = any
> {
  
  _events = getEventsMap<EventTypes>();
  _eventsCount = 0;

  /**
   * Return an array listing the events for which the emitter has registered
   * listeners.
   *
   * @returns {Array}
   * @public
   */
  eventNames(): Array<EventNames<EventTypes>> {
    if (this._eventsCount === 0) return [];
  
    const events = this._events;
    const names: Array<EventNames<EventTypes>> = Object.keys(events) as any;
    
    if (Object.getOwnPropertySymbols) {
      return names.concat(Object.getOwnPropertySymbols(events) as any);
    }
  
    return names;
  }
  
  /**
   * Return the listeners registered for a given event.
   *
   * @param {(String|Symbol)} event The event name.
   * @returns {Array} The registered listeners.
   * @public
   */
  listeners<T extends EventNames<EventTypes>>(
      event: T
  ): Array<EventListener<EventTypes, T>> {
    
    const evt = event;
    const handlers = this._events[evt];
  
    if (!handlers) return [];
    if ('fn' in handlers) return [handlers.fn as any];
  
    for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
      ee[i] = handlers[i].fn;
    }
  
    return ee;
  };
  
  /**
   * Return the number of listeners listening to a given event.
   *
   * @param {(String|Symbol)} event The event name.
   * @returns {Number} The number of listeners.
   * @public
   */
  listenerCount(event: EventNames<EventTypes>): number {
    const evt = event;
    const listeners = this._events[evt];
  
    if (!listeners) return 0;
    if ('fn' in listeners) return 1;
    return listeners.length;
  };
  
  /**
   * Calls each of the listeners registered for a given event.
   *
   * @param {(String|Symbol)} event The event name.
   * @returns {Boolean} `true` if the event had listeners, else `false`.
   * @public
   */
  emit<T extends EventNames<EventTypes>>(
      event: T, 
      ...args: EventArgs<EventTypes, T>
  ): boolean {
  
    const evt = event;
  
    if (!this._events[evt]) {
      return false
    }
  
    const listeners = this._events[evt];
    if ('fn' in listeners) {
      if (listeners.once) {
        this.removeListener(event, listeners.fn, undefined, true)
      }
  
      listeners.fn.apply(listeners.context, args);
    } else {
      const length = listeners.length;
      
      for (let i = 0; i < length; i++) {
        if (listeners[i].once) {
          this.removeListener(event, listeners[i].fn, undefined, true)
        }
        
        listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  
    return true;
  };
  
  /**
   * Calls each of the listeners registered for a given event, passing some `Event`-like
   * object as the first parameter to the listener.
   * 
   * @wiwo
   * Widget Works extension to make this work like jquery `.trigger('eventName', arg1, arg2, ...)`
   *
   * .on((eventObj, arg1, arg2) => {
   *     eventObj.type;
   * });
   *
   * @param {(EventLike|String|Symbol)} event The event name.
   * @returns {Boolean} `true` if the event had listeners, else `false`.
   * @public
   */
  emitWithEvent<T extends EventNames<EventTypes>>(
      event: T | EventLike<T>, a1?: any, a2?: any, a3?: any, a4?: any, a5?: any, ...args2: any[]
  ): boolean {
    
    // `Event`-like object
    let eventObj: EventLike;
    let evt: EventNames<EventTypes>;
    if (isEventLike(event)){
      // event object
      eventObj = event;
      evt = event.type;
    } else {
      // string | symbol
      eventObj = {
        type: event,
      };
      evt = event;
    }
    
    if (!this._events[evt]) return false;
  
    var listeners = this._events[evt]
      , len = arguments.length
      , args
      , i;
    
    if ('fn' in listeners) {
      if (listeners.once) this.removeListener(evt, listeners.fn, undefined, true);
  
      switch (len) {
        case 1: return listeners.fn.call(listeners.context, eventObj), true;
        case 2: return listeners.fn.call(listeners.context, eventObj, a1), true;
        case 3: return listeners.fn.call(listeners.context, eventObj, a1, a2), true;
        case 4: return listeners.fn.call(listeners.context, eventObj, a1, a2, a3), true;
        case 5: return listeners.fn.call(listeners.context, eventObj, a1, a2, a3, a4), true;
        case 6: return listeners.fn.call(listeners.context, eventObj, a1, a2, a3, a4, a5), true;
      }
      
      args = [eventObj];
      for (i = 1; i < len; i++) {
        args.push(arguments[i]);
      }
  
      listeners.fn.apply(listeners.context, args);
    } else {
      var length = listeners.length
        , j;
  
      for (i = 0; i < length; i++) {
        if (listeners[i].once) this.removeListener(evt, listeners[i].fn, undefined, true);
  
        switch (len) {
          case 1: listeners[i].fn.call(listeners[i].context, eventObj); break;
          case 2: listeners[i].fn.call(listeners[i].context, eventObj, a1); break;
          case 3: listeners[i].fn.call(listeners[i].context, eventObj, a1, a2); break;
          case 4: listeners[i].fn.call(listeners[i].context, eventObj, a1, a2, a3); break;
          default:
            if (!args) {
              args = [eventObj];
              for (j = 1; j < len; j++) {
                args.push(arguments[j]);
              }
            }
  
            listeners[i].fn.apply(listeners[i].context, args);
        }
      }
    }
  
    return true;
  };
  
  /**
   * Add a listener for a given event.
   *
   * @param {(String|Symbol)} event The event name.
   * @param {Function} fn The listener function.
   * @param {*} [context=this] The context to invoke the listener with.
   * @returns {EventEmitter} `this`.
   * @public
   */
  on<T extends EventNames<EventTypes>>(
    event: T,
    fn: EventListener<EventTypes, T>,
    context?: Context
  ): this {
    return addListener(this, event, fn, context, false);
  };
  
  /**
   * Add a one-time listener for a given event.
   *
   * @param {(String|Symbol)} event The event name.
   * @param {Function} fn The listener function.
   * @param {*} [context=this] The context to invoke the listener with.
   * @returns {EventEmitter} `this`.
   * @public
   */
  once<T extends EventNames<EventTypes>>(
    event: T,
    fn: EventListener<EventTypes, T>,
    context?: Context
  ): this {
    return addListener(this, event, fn, context, true);
  };
  
  /**
   * Remove the listeners of a given event.
   *
   * @param {(String|Symbol)} event The event name.
   * @param {Function} fn Only remove the listeners that match this function.
   * @param {*} context Only remove the listeners that have this context.
   * @param {Boolean} once Only remove one-time listeners.
   * @returns {EventEmitter} `this`.
   * @public
   */
  removeListener<T extends EventNames<EventTypes>>(
      event: T,
      fn?: EventListener<EventTypes, T> | Function,
      context?: Context,
      once?: boolean
  ): this {
    
    var evt = event;
  
    if (!this._events[evt]) return this;
    if (!fn) {
      clearEvent(this, evt);
      return this;
    }
  
    var listeners = this._events[evt];
  
    if ('fn' in listeners) {
      if (
        listeners.fn === fn &&
        (!once || listeners.once) &&
        (!context || listeners.context === context)
      ) {
        clearEvent(this, evt);
      }
    } else {
      for (var i = 0, events = [], length = listeners.length; i < length; i++) {
        if (
          listeners[i].fn !== fn ||
          (once && !listeners[i].once) ||
          (context && listeners[i].context !== context)
        ) {
          events.push(listeners[i]);
        }
      }
  
      //
      // Reset the array, or remove it completely if we have no more listeners.
      //
      if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
      else clearEvent(this, evt);
    }
  
    return this;
  };
  
  /**
   * Remove all listeners, or those of the specified event.
   *
   * @param {(String|Symbol)} [event] The event name.
   * @returns {EventEmitter} `this`.
   * @public
   */
  removeAllListeners(event?: EventNames<EventTypes>) {
    var evt: ValidEventNames;
  
    if (event) {
      evt = event;
      if (this._events[evt]) clearEvent(this, evt);
    } else {
      this._events = getEventsMap();
      this._eventsCount = 0;
    }
  
    return this;
  };
  
  //
  // Alias methods names because people roll like that.
  //
  off = this.removeListener;
  addListener = this.on;
  
  /**
   * @wiwo
   * @jquery
   * Alias our custom `emitWithEvent()` to jquery `triggerHandler()`.
   */
  triggerHandler = this.emitWithEvent;
  
  /**
   * @wiwo
   * @jquery
   * Alias `once()` to `one()` to match jquery API
   */
  one = this.once;
  
}

function isEventLike(value: any): value is EventLike {
  const isEventLike = value && typeof value === 'object' && 'type' in value;
  return isEventLike;
}

/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */
function addListener<
    T extends EventEmitter<any, any>
  >(emitter: T, event: ValidEventNames, fn: Function, context: any, once?: boolean): T {
  
  if (typeof fn !== 'function') {
    throw new TypeError('The listener must be a function');
  }

  const listener = new EE(fn, context || emitter, once);
  const evt = event as any as string;

  const existingEE = emitter._events[evt];
  if (!existingEE) {
    emitter._events[evt] = listener;
    emitter._eventsCount++;
    
  } else if (! ('fn' in existingEE)) {
    existingEE.push(listener);
    
  } else {
    emitter._events[evt] = [existingEE, listener];
  }

  return emitter;
}

/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} event The Event name.
 * @private
 */
function clearEvent<T extends EventEmitter<any, any>>(emitter: T, event: ValidEventNames): void {
  const evt = event as any as string;
  if (--emitter._eventsCount === 0) emitter._events = getEventsMap();
  else delete emitter._events[evt];
}
