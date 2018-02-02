import { ensureXY } from './utils'
import extendHexFactory from './hex'
import defineGridFactory from './grid'
import PointFactory from './point'

/** @ignore */
const extendHex = extendHexFactory({ ensureXY })
/** @ignore */
const defineGrid = defineGridFactory({ extendHex })
/** @ignore */
const Point = PointFactory({ ensureXY })

/**
 * @namespace {Object} Honeycomb
 */
export {
    extendHex,
    defineGrid,
    Point
}
