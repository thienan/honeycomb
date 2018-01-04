export function includesFactory({ Grid }) {
    return function includes(searchHex, fromIndex = 0) {
        if (!Grid.isValidHex(searchHex)) {
            return false
        }

        for (let i = fromIndex; i < this.length; i++) {
            if (this[i].equals(searchHex)) {
                return true
            }
        }

        return false
    }
}

export function indexOfFactory({ Grid }) {
    return function indexOf(searchHex, fromIndex = 0) {
        if (!Grid.isValidHex(searchHex)) {
            return -1
        }

        for (let i = fromIndex; i < this.length; i++) {
            if (this[i].equals(searchHex)) {
                return i
            }
        }

        return -1
    }
}

export function pushFactory({ Grid }) {
    return function push(...elements) {
        return Array.prototype.push.apply(this, elements.filter(Grid.isValidHex))
    }
}

export function spliceFactory({ Grid }) {
    return function splice(start, deleteCount, ...elements) {
        return Array.prototype.splice.call(this, start, deleteCount, ...elements.filter(Grid.isValidHex))
    }
}

export function unshiftFactory({ Grid }) {
    return function unshift(...elements) {
        return Array.prototype.unshift.apply(this, elements.filter(Grid.isValidHex))
    }
}
