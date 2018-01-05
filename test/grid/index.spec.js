import { expect } from 'chai'
import sinon from 'sinon'

import createFactoryFactory from '../../src/grid'
import createHexFactory from '../../src/hex'

const createFactory = createFactoryFactory({ createHexFactory })
const Hex = createHexFactory()

describe('Grid.createFactory', function() {
    describe('when not passed a function', function() {
        it(`calls Honeycomb.Hex.createFactory() to create a default Hex factory`, function() {
            const createHexFactorySpy = sinon.spy(createHexFactory)
            const createFactory = createFactoryFactory({ createHexFactory: createHexFactorySpy })
            createFactory()
            expect(createHexFactorySpy).to.have.been.called
        })
    })

    it('returns a function that has the Grid static methods', function() {
        const Grid = createFactory()
        expect(Grid).to.be.a('function')
        const staticProps = Object.keys(Grid)

        expect(staticProps).to.eql([
            'Hex',
            'isValidHex',
            'pointToHex',
            'hexToPoint',
            'colSize',
            'rowSize',
            'parallelogram',
            'triangle',
            'hexagon',
            'rectangle'
        ])
    })

    it('unbinds the Hex property (binds to undefined)', function() {
        const boundHex = sinon.spy()
        const bindSpy = sinon.stub().returns(boundHex)
        const Hex = { bind: bindSpy }
        const Grid = createFactory(Hex)

        expect(bindSpy).to.have.been.calledWith(/* undefined */) // passing undefined doesn't work...
        expect(Grid.Hex).to.equal(boundHex)

        Grid.Hex()
        expect(boundHex).to.have.been.called
    })
})

describe('Grid', function() {
    it('returns a function with the Grid prototype', function() {
        const Grid = createFactory()
        const prototype = Object.getPrototypeOf(Grid())
        const prototypeProps = Object.keys(prototype)

        expect(prototypeProps).to.eql([
            '__isHoneycombGrid'
        ])
    })

    it('returns a function that creates an object that listens to some Array.prototype methods', function() {
        const instance = createFactory()()

        expect(instance.concat).to.eql(Array.prototype.concat)
        expect(instance.constructor).to.eql(Array.prototype.constructor)
        expect(instance.copyWithin).to.eql(Array.prototype.copyWithin)
        expect(instance.entries).to.eql(Array.prototype.entries)
        expect(instance.every).to.eql(Array.prototype.every)
        expect(instance.fill).to.eql(Array.prototype.fill)
        expect(instance.filter).to.eql(Array.prototype.filter)
        expect(instance.find).to.eql(Array.prototype.find)
        expect(instance.findIndex).to.eql(Array.prototype.findIndex)
        expect(instance.forEach).to.eql(Array.prototype.forEach)
        expect(instance.join).to.eql(Array.prototype.join)
        expect(instance.keys).to.eql(Array.prototype.keys)
        expect(instance.lastIndexOf).to.eql(Array.prototype.lastIndexOf)
        expect(instance.length).to.eql(Array.prototype.length)
        expect(instance.map).to.eql(Array.prototype.map)
        expect(instance.pop).to.eql(Array.prototype.pop)
        expect(instance.reduce).to.eql(Array.prototype.reduce)
        expect(instance.reduceRight).to.eql(Array.prototype.reduceRight)
        expect(instance.reverse).to.eql(Array.prototype.reverse)
        expect(instance.shift).to.eql(Array.prototype.shift)
        expect(instance.slice).to.eql(Array.prototype.slice)
        expect(instance.some).to.eql(Array.prototype.some)
        expect(instance.sort).to.eql(Array.prototype.sort)
        expect(instance.toLocaleString).to.eql(Array.prototype.toLocaleString)
        expect(instance.toString).to.eql(Array.prototype.toString)

        // methods that AREN'T forwarded to Array.prototype
        expect(instance.includes).not.to.eql(Array.prototype.includes)
        expect(instance.indexOf).not.to.eql(Array.prototype.indexOf)
        expect(instance.push).not.to.eql(Array.prototype.push)
        expect(instance.splice).not.to.eql(Array.prototype.splice)
        expect(instance.unshift).not.to.eql(Array.prototype.unshift)
    })
})

describe('Grid creation', function() {
    let Grid

    beforeEach(function() {
        Grid = createFactory(Hex)
        sinon.spy(Grid, 'isValidHex')
    })

    afterEach(() => {
        Grid.isValidHex.restore()
    })

    describe(`when called with one or more parameters that aren't arrays`, () => {
        it('calls Grid.isValidHex for each hex', () => {
            const hex1 = Hex()
            const hex2 = Hex(2, -4)
            Grid(hex1, hex2)

            expect(Grid.isValidHex).to.have.been.calledWith(hex1)
            expect(Grid.isValidHex).to.have.been.calledWith(hex2)
        })

        describe(`when they're valid hexes`, function() {
            it('returns a grid instance containing those hexes', function() {
                const hex1 = Hex()
                const hex2 = Hex(2, -4)
                const result = Grid(hex1, hex2)

                expect(result).to.have.lengthOf(2)
                expect(result[0]).to.equal(hex1)
                expect(result[1]).to.equal(hex2)
            })
        })

        describe(`when they're valid hexes and other types`, function() {
            it('returns a grid instance with only the valid hexes', function() {
                const hex1 = Hex()
                const hex2 = Hex(2, -4)
                const result = Grid(null, 'string', hex1, {}, hex2, 1)

                expect(result).to.have.lengthOf(2)
                expect(result[0]).to.equal(hex1)
                expect(result[1]).to.equal(hex2)
            })
        })
    })

    describe(`when called with an array`, () => {
        it('calls Grid.isValidHex for each hex in the array', () => {
            const hex1 = Hex()
            const hex2 = Hex(2, -4)
            Grid([hex1, hex2])

            expect(Grid.isValidHex).to.have.been.calledWith(hex1)
            expect(Grid.isValidHex).to.have.been.calledWith(hex2)
        })

        describe('that is a valid grid', function() {
            it('returns a copy of the grid', function() {
                const grid = Grid(Hex(), Hex())
                const result = Grid(grid)

                expect(result).to.eql(grid)
                expect(result).to.not.equal(grid)
            })
        })

        describe('containing valid hexes', function() {
            it('returns a grid instance containing those hexes', function() {
                const hex1 = Hex()
                const hex2 = Hex(2, -4)
                const result = Grid([hex1, hex2])

                expect(result).to.have.lengthOf(2)
                expect(result[0]).to.equal(hex1)
                expect(result[1]).to.equal(hex2)
            })
        })

        describe('containing valid hexes and other types', function() {
            it('returns a grid instance with only the valid hexes', function() {
                const hex1 = Hex()
                const hex2 = Hex(2, -4)
                const result = Grid([null, 'string', hex1, {}, hex2, 1])

                expect(result).to.have.lengthOf(2)
                expect(result[0]).to.equal(hex1)
                expect(result[1]).to.equal(hex2)
            })
        })
    })
})
