export default new Proxy({}, {
    get(target, property, receiver) {
        // forward everything to Array.prototype
        return Reflect.get(Array.prototype, property, receiver)
    }
})
