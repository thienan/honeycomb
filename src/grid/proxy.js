export default new Proxy({}, {
    get(target, property, receiver) {
        // forward everything to Array.prototype
        return Reflect.get(Array.prototype, property, receiver)
    },

    set(target, property, value, receiver) {
        // console.log('proxy set',property,value)
        if (value.__isHoneycombHex) {
            return Reflect.set(target, property, value, receiver)
        }
    }
})
