class EE {
    
    /**
     * Representation of a single event listener.
     *
     * @param {Function} fn The listener function.
     * @param {*} context The context to invoke the listener with.
     * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
     * @constructor
     * @private
     */
    constructor(
        public fn: Function,
        public context: any,
        public once = false,
    ){}
    
}

export default EE;
