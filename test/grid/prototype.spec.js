import { expect } from 'chai'
import sinon from 'sinon'

import createFactoryFactory from '../../src/grid'
import createHexFactory from '../../src/hex'

const createFactory = createFactoryFactory({ createHexFactory })
const Grid = createFactory()
const Hex = createHexFactory()

let instance = Grid()

describe('includes', () => {
    beforeEach(() => {
        sinon.stub(Grid, 'isValidHex').returns(true)
    })

    afterEach(() => {
        Grid.isValidHex.restore()
    })

    it('calls Grid.isValidHex', () => {
        instance.includes('value')
        expect(Grid.isValidHex).to.have.been.calledWith('value')
    })

    describe('when Grid.isValidHex returns false', () => {
        it('returns false', () => {
            Grid.isValidHex.returns(false)
            expect(instance.includes()).to.be.false
        })
    })

    describe(`when called with a hex that's present in the grid`, () => {
        it('returns true', () => {
            expect(instance.includes(Hex(0))).to.be.true
        })
    })

    describe(`when called with a hex that's not present in the grid`, () => {
        it('returns false', () => {
            expect(instance.includes(Hex(1))).to.be.false
        })
    })

    describe('when called with start index', () => {
        it('starts searching from that index', () => {
            instance = new Grid(Hex(0), Hex(1))
            expect(instance.includes(Hex(0), 1)).to.be.false
            expect(instance.includes(Hex(1), 1)).to.be.true
        })
    })
})

describe('indexOf', () => {
    beforeEach(() => {
        sinon.stub(Grid, 'isValidHex').returns(true)
    })

    afterEach(() => {
        Grid.isValidHex.restore()
    })

    it('calls Grid.isValidHex', () => {
        instance.indexOf('value')
        expect(Grid.isValidHex).to.have.been.calledWith('value')
    })

    describe('when Grid.isValidHex returns false', () => {
        it('returns -1', () => {
            Grid.isValidHex.returns(false)
            expect(instance.indexOf()).to.equal(-1)
        })
    })

    describe(`when called with a hex that's present in the grid`, () => {
        it('returns its index', () => {
            expect(instance.indexOf(Hex(0))).to.equal(0)
        })
    })

    describe(`when called with a hex that's not present in the grid`, () => {
        it('returns -1', () => {
            expect(instance.indexOf(Hex(1))).to.equal(-1)
        })
    })

    describe('when called with start index', () => {
        it('starts searching from that index', () => {
            instance = new Grid(Hex(0), Hex(1))
            expect(instance.indexOf(Hex(0), 1)).to.equal(-1)
            expect(instance.indexOf(Hex(1), 1)).to.equal(1)
        })
    })
})

describe('push', () => {
    afterEach(() => {
        Grid.isValidHex.restore()
    })

    it('calls Grid.isValidHex', () => {
        sinon.spy(Grid, 'isValidHex')
        instance.push('value')

        expect(Grid.isValidHex).to.have.been.calledWith('value')
    })

    it('pushes only elements that are valid hexes', () => {
        instance = new Grid()
        const isValidHex = sinon.stub(Grid, 'isValidHex')

        isValidHex.withArgs('valid').returns(true)
        isValidHex.withArgs('invalid').returns(false)
        instance.push('valid', 'invalid')

        expect(instance).to.eql(['valid'])
    })
})

describe('splice', () => {
    afterEach(() => {
        Grid.isValidHex.restore()
    })

    it('calls Grid.isValidHex', () => {
        sinon.spy(Grid, 'isValidHex')
        instance.splice(0, 0, 'value')

        expect(Grid.isValidHex).to.have.been.calledWith('value')
    })

    it('only adds elements that are valid hexes', () => {
        instance = new Grid(Hex(0), Hex(1), Hex(2))
        const isValidHex = sinon.stub(Grid, 'isValidHex')

        isValidHex.withArgs('valid').returns(true)
        isValidHex.withArgs('invalid').returns(false)
        const result = instance.splice(1, 2, 'valid', 'invalid')

        expect(instance).to.eql([Hex(0), 'valid'])
        expect(result[0]).to.eql(Hex(1))
        expect(result[1]).to.eql(Hex(2))
    })
})

describe('unshift', () => {
    afterEach(() => {
        Grid.isValidHex.restore()
    })

    it('calls Grid.isValidHex', () => {
        sinon.spy(Grid, 'isValidHex')
        instance.unshift('value')

        expect(Grid.isValidHex).to.have.been.calledWith('value')
    })

    it('adds only elements to the end of the grid that are valid hexes', () => {
        instance = new Grid()
        const isValidHex = sinon.stub(Grid, 'isValidHex')

        isValidHex.withArgs('valid').returns(true)
        isValidHex.withArgs('invalid').returns(false)
        instance.unshift('valid', 'invalid')

        expect(instance).to.eql(['valid'])
    })
})
