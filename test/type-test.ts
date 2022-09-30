import { EventEmitter } from '../src/EventEmitter';
import { EventLike, EventArgs, EventArgsWithoutEventObject } from '../src/types';

/*
Record<EventName, EventParams>
 where:
  EventName: string | symbol
  EventParams: 
*/
interface IEventMap {
    // tuple types
    'anyArgs': any[];
    'tupleArgs': [number, string];
    
    // infer from function
    'noArgs': () => void;
    'argsButNoEvent': (first: number, second: string) => void;
    'argsWithEvent': (e: EventLike<'argsWithEvent'>, first: number, second: string) => void;
}

/**
 * EventTypes:
 */
describe('EventTypes:', () => {
    
    beforeEach(function(){
        const ee = new EventEmitter<IEventMap>();
    });
    
    /**
     * EventArgs:
     */
    describe('EventArgs:', () => {
        
        /**
         * tuple args:
         */
        describe('tuple args:', () => {
            
            it('anyArgs', () => {
                type Z = EventArgs<IEventMap, 'anyArgs'>;
                type Z0 = Z[0];
                type Z1 = Z[1];
                
                // any is valid
                const z0: Z0 = '-1';
                const z1: Z1 = 'test';
            });
            
            it('tupleArgs', () => {
                type Z = EventArgs<IEventMap, 'tupleArgs'>;
                type Z0 = Z[0];
                type Z1 = Z[1];
                
                // [number, string]
                const z: Z = [-1, 'string'];
                const z0: Z0 /* number */ = -1;
                const z1: Z1 /* string */ = 'string';
            });
            
        });
        // End of 'tuple args:'.
        
        /**
         * infer function args:
         */
        describe('infer function args:', () => {
            
            it('noArgs', () => {
                
                type Z = EventArgs<IEventMap, 'noArgs'>;
                
                // no args, so length should be 0
                const length: Z['length'] = 0;
            });
            
            it('argsButNoEvent', () => {
                
                type Z = EventArgs<IEventMap, 'argsButNoEvent'>;
                type Z0 = Z[0];
                type Z1 = Z[1];
                
                // [number, string]
                const z: Z = [-1, 'string'];
                const z0: Z0 /* number */ = -1;
                const z1: Z1 /* string */ = 'string';
            });
            
            it('argsWithEvent', () => {
                
                type Z = EventArgs<IEventMap, 'argsWithEvent'>;
                type Z0 = Z[0];
                type Z1 = Z[1];
                type Z2 = Z[2];
                
                // [EventLike, number, string]
                const z: Z = [{type: 'argsWithEvent'}, -1, 'string'];
                const z0: Z0 /* EventLike */ = {type: 'argsWithEvent'};
                const z1: Z1 /* number */ = -1;
                const z2: Z2 /* string */ = 'string';
            });
            
        });
        // End of 'infer function args:'.
        
    });
    // End of 'EventArgs:'.
    
    
    /**
     * EventArgsWithoutEventObject:
     */
    describe('EventArgsWithoutEventObject:', () => {
        
        /**
         * tuple args:
         */
        describe('tuple args:', () => {
            
            it('anyArgs', () => {
                type Z = EventArgsWithoutEventObject<IEventMap, 'anyArgs'>;
                type Z0 = Z[0];
                type Z1 = Z[1];
                
                // any is valid
                const z0: Z0 = '-1';
                const z1: Z1 = 'test';
            });
            
            it('tupleArgs', () => {
                type Z = EventArgsWithoutEventObject<IEventMap, 'tupleArgs'>;
                type Z0 = Z[0];
                type Z1 = Z[1];
                
                // [number, string]
                const z: Z = [-1, 'string'];
                const z0: Z0 /* number */ = -1;
                const z1: Z1 /* string */ = 'string';
            });
            
        });
        // End of 'tuple args:'.
        
        /**
         * infer function args:
         */
        describe('infer function args:', () => {
            
            it('noArgs', () => {
                
                type Z = EventArgsWithoutEventObject<IEventMap, 'noArgs'>;
                
                // no args, so length should be 0
                const length: Z['length'] = 0;
            });
            
            it('argsButNoEvent', () => {
                
                type Z = EventArgsWithoutEventObject<IEventMap, 'argsButNoEvent'>;
                type Z0 = Z[0];
                type Z1 = Z[1];
                
                // [number, string]
                const z: Z = [-1, 'string'];
                const z0: Z0 /* number */ = -1;
                const z1: Z1 /* string */ = 'string';
            });
            
            it('argsWithEvent', () => {
                
                // Exclude the leading `EventLike` argument
                type Z = EventArgsWithoutEventObject<IEventMap, 'argsWithEvent'>;
                type Z0 = Z[0];
                type Z1 = Z[1];
                
                // [number, string]
                const z: Z = [-1, 'string'];
                const z0: Z0 /* number */ = -1;
                const z1: Z1 /* string */ = 'string';
            });
            
        });
        // End of 'infer function args:'.
        
    });
    // End of 'EventArgsWithoutEventObject:'.
    
});
// End of 'EventTypes:'.


/**
 * browser EventTarget:
 */
describe('browser EventTarget:', () => {
    
    let ee: EventEmitter<IEventMap>;
    
    beforeEach(function(){
        ee = new EventEmitter<IEventMap>();
    });
    
    it('triggerHandler(), emitWithEvent()', () => {
        /*
        the `emitWithEvent('type', ...args: any[])`  method (and `triggerHandler()` alias) 
        is like the browser-style `eventTarget.dispatchEvent(event)`
        that **does** pass an event object as the first parameter to the handler function.
        
        This matches the browser EventTarget approach
        */
        
        // (x: number, y: string) => void
        ee.on('argsButNoEvent', (x, y) => {
            const a: number = x;
            const b: string = y;
        });
        
        // (e: EventLike, x: number, y: string) => void
        ee.on('argsWithEvent', (e, x, y) => {
            const a: number = x;
            const b: string = y;
        })
        
        ee.triggerHandler('argsButNoEvent', 0, 'test');
        ee.emitWithEvent({type: 'argsWithEvent'}, 0, 'string');
    });
    
    it('node-style emit()', () => {
        /*
        the `emit('type', ...args: any[])` method is the node-style emit
        that **does not** pass an event object to the handler function.
        
        This matches the nodejs EventEmitter type.
        */
        
        // (x: number, y: string) => void
        ee.on('argsButNoEvent', (x, y) => {
            const a: number = x;
            const b: string = y;
        });
        
        // (e: EventLike, x: number, y: string) => void
        ee.on('argsWithEvent', (e, x, y) => {
            expect(e.type === 'argsWithEvent');
            
            const a: number = x;
            const b: string = y;
        })
        
        ee.emit('argsButNoEvent', 0, 'test');
        
        // testing this for completeness
        ee.emit('argsWithEvent', {type: 'argsWithEvent'}, 0, 'string');
    });
    
});
// End of 'browser EventTarget:'.

