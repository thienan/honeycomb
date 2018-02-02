# Honeycomb

[![Gitter](https://img.shields.io/gitter/room/flauwekeul/honeycomb.svg)](https://gitter.im/honeycomb-grid)
[![NPM version](https://badge.fury.io/js/honeycomb-grid.svg)](https://www.npmjs.com/package/honeycomb-grid)
[![dependencies](https://david-dm.org/flauwekeul/honeycomb.svg)](https://david-dm.org/flauwekeul/honeycomb)
[![devDependencies](https://david-dm.org/flauwekeul/honeycomb/dev-status.svg)](https://david-dm.org/flauwekeul/honeycomb?type=dev)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/flauwekeul/honeycomb/blob/master/LICENSE)

Another hex grid library made in JavaScript, heavily inspired by [Red Blob Games'](http://www.redblobgames.com/grids/hexagons/) blog posts and code samples.

All existing JS hex grid libraries I could find are coupled with some form of view. Most often a `<canvas>` element or the browser DOM. I want more separation of concerns...and a new hobby project to spend countless hours on.

### Features

-   🙌 Works in (modern) browsers and in Node.js.
-   📐 Create hex grids in different shapes: ▭ rectangles, △ triangles, ⬡ hexagons and ▱ parallelograms.
-   🌐 2 coordinate systems: cartesian (`x` and `y`) and cube (`q`, `r` and `s`).
-   ✨ Create your own hexes by extending the built-in Hex.
-   🗺 Convert points to hexes and vice versa.
-   ⬢ Pointy and ⬣ flat hexes.
-   🖥 Lets you decide if and how hexes are rendered.

## Installation

NPM:

```bash
npm i --save honeycomb-grid
```

Yarn:

```bash
yarn add honeycomb-grid
```

## Getting started

### Browser

```html
<script src="honeycomb.js"></script>

<script>
    const Grid = Honeycomb.defineGrid()
    Grid.rectangle({ width: 4, height: 4 })
</script>
```

### Node.js

```javascript
const Honeycomb = require('honeycomb-grid')

const Grid = Honeycomb.defineGrid()
Grid.rectangle({ width: 4, height: 4 })
```

## Examples

### Basic usage

Create a hex grid in 3 steps:

```javascript
// 1.  (optionally) create a Hex factory by extending the default:
const Hex = Honeycomb.extendHex({
    size: 30,           // default: 1
    orientation: 'flat' // default: 'pointy'
})

// 2.  create a Grid factory that uses the Hex factory:
const Grid = Honeycomb.defineGrid(Hex)

// 3a. create a grid with a "shape" method:
const grid1 = Grid.rectangle({ width: 4, height: 4 })
// [
//    { x: 0, y: 0 },
//    { x: 0, y: 1 },
//    { x: 0, y: 2 },
//    …
// ]

// 3b. or create a grid from individual hexes:
const grid2 = Grid(Hex(1, 2), Hex(3, 4))
// [
//    { x: 1, y: 2 },
//    { x: 3, y: 4 }
// ]
```

### Rendering

Honeycomb comes without the ability to render hexes to screen. Fortunately, it isn't very hard. Especially if you use a dedicated rendering library.

#### With [PixiJS](http://www.pixijs.com/)

```javascript
const app = new PIXI.Application({ transparent: true })
const graphics = new PIXI.Graphics()

const Hex = Honeycomb.extendHex({ size: 5 })
const Grid = Honeycomb.defineGrid(Hex)

document.body.appendChild(app.view)
// set a line style of 1px wide and color #999
graphics.lineStyle(1, 0x999999)

// render 10,000 hexes
Grid.rectangle({ width: 100, height: 100 }).forEach(hex => {
    const point = hex.toPoint()
    // add the hex's position to each of its corner points
    const corners = hex.corners().map(corner => corner.add(point))
    // separate the first from the other corners
    const [firstCorner, ...otherCorners] = corners

    // move the "pen" to the first corner
    graphics.moveTo(firstCorner.x, firstCorner.y)
    // draw lines to the other corners
    otherCorners.forEach(({ x, y }) => graphics.lineTo(x, y))
    // finish at the first corner
    graphics.lineTo(firstCorner.x, firstCorner.y)

    app.stage.addChild(graphics)
})
```

[Try it in JSFiddle](https://jsfiddle.net/Flauwekeul/qmfgey44/).

#### With [SVG.js](http://svgjs.com/)

```javascript
const draw = SVG(document.body)

const Hex = Honeycomb.extendHex({ size: 5 })
const Grid = Honeycomb.defineGrid(Hex)
// get the corners of a hex (they're the same for all hexes created with the same Hex factory)
const corners = Hex().corners()
// an SVG symbol can be reused
const hexSymbol = draw.symbol()
    // map the corners' positions to a string and create a polygon
    .polygon(corners.map(({ x, y }) => `${x},${y}`))
    .fill('none')
    .stroke({ width: 1, color: '#999' })

// render 10,000 hexes
Grid.rectangle({ width: 100, height: 100 }).forEach(hex => {
    const { x, y } = hex.toPoint()
    // use hexSymbol and set its position for each hex
    draw.use(hexSymbol).translate(x, y)
})
```

[Try it in JSFiddle](https://jsfiddle.net/Flauwekeul/0vm2azj2/).

### Grids extend `Array.prototype`

Most properties/methods of grids are the same as their Array counterpart:

```javascript
const grid = Grid.rectangle({ width: 4, height: 4 })

grid.length // 16
grid.pop()  // { x: 3, y: 3 }
grid.length // 15
grid[4]     // { x: 1, y: 0 }
```

Some Grid methods are augmented. For example: [`Array#includes`](https://developer.mozilla.org/nl/docs/Web/JavaScript/Reference/Global_Objects/Array/includes) always returns `false` when passed an object literal because it uses [strict equality](https://developer.mozilla.org/nl/docs/Web/JavaScript/Equality_comparisons_and_sameness) internally. [`Grid#includes`](#includes) _only_ accepts object literals (in the form of [points](#point-1)):

```javascript
const array = [{ x: 1, y: 0 }]
array.includes({ x: 1, y: 0 })  // false

const grid = Grid(Hex(1, 0))
grid.includes({ x: 1, y: 0 })   // true
```

#### Grid methods that mutate

Methods that mutate the grid in-place ([Grid#push](#push), [Grid#splice](#splice) and [Grid#unshift](#unshift)) only accept valid hexes to prevent "grid corruption" 👮‍.

```javascript
const grid = Grid()             // []

// this silently fails:
grid.push('invalid hex')        // 0 <- the grid's length, which remains 0
grid.includes('invalid hex')    // false
```

Keep in mind that methods that return a new grid (e.g. [Grid#map](#map)) can create grids with invalid hexes:

```javascript
const grid = Grid.rectangle({ width: 4, height: 4 })

const newGrid = grid.map(hex => 'invalid hex')
// [
//    'invalid hex',
//    'invalid hex',
//    'invalid hex',
//    …
// ]
```

#### Be careful with bracket notation

It's possible to add an invalid hex to a grid by using bracket notation:

```javascript
const grid = Grid(Hex())

grid[0]                     // { x: 0, y: 0 }
grid[0] = 'invalid hex'
grid[0]                     // 'invalid hex' ⚠️
```

Use [`Grid#get`](#get) and [`Grid#set`](#set) instead:

```javascript
const grid = Grid(Hex())

grid.get(0)                 // { x: 0, y: 0 }
grid.set(0, 'invalid hex')
grid.get(0)                 // { x: 0, y: 0 } <- invalid hex is ignored

// Grid#set() also accepts a point:
grid.set({ x: 0, y: 0 }, Hex(-1, 3))
// …as does Grid#get():
grid.get([-1, 3])           // { x: -1, y: 3 }
```

### Point → Hex

Translating a point (pixel) in the grid to the corresponding hex is possible with [`Grid.pointToHex()`](#pointtohex).

```javascript
const Hex = Honeycomb.extendHex({ size: 30 })
const Grid = Honeycomb.defineGrid(Hex)
const grid = Grid.rectangle({ width: 10, height: 10 })

document.addEventListener('click', ({ offsetX, offsetY }) => {
    // convert point to hex (coordinates)
    const hexCoordinates = Grid.pointToHex([offsetX, offsetY])
    // get the actual hex from the grid
    console.log(grid.get(hexCoordinates))
})
```

See a more elaborate example in [JSFiddle](https://jsfiddle.net/Flauwekeul/3bd6sa9r/).

### Grid shapes

Honeycomb offers 4 shape methods: [rectangle](#rectangle), [triangle](#triangle), [hexagon](#hexagon) and [parallelogram](#parallelogram). [Try them out in JSFiddle](https://jsfiddle.net/Flauwekeul/arxo1vqo/).

### Coordinate systems

The standard coordinate system is a [cartesian](https://en.wikipedia.org/wiki/Cartesian_coordinate_system) one. It's intuitive and easy to reason about. A lot of methods internally use a "cube" coordinate system. See [this redblobgames.com blog post](https://www.redblobgames.com/grids/hexagons/#coordinates) for an explanation between the two (he calls the cartesian system "offset coordinates").

Hexes have getters for each of the cube coordinates `q`, `r` and `s`:

```javascript
const Hex = Honeycomb.extendHex()
const hex = Hex(3, 4)

hex.q           // 1
hex.r           // 4
hex.s           // -5

hex.cartesian() // { x: 3, y: 4 }
hex.cube()      // { q: 1, r: 4, s: -5 }
```

There are methods for converting between cartesian and cube:

```javascript
const Hex = Honeycomb.extendHex()
const hex = Hex()

hex.toCube({ x: 3, y: 4 })      // { q: 1, r: 4, s: -5 }

// Hex#toCartesian doesn't require the s coordinate:
hex.toCartesian({ q: 1, r: 4 }) // { x: 3, y: 4 }
```

> These methods always require coordinates to be passed and don't work on a hex instance, even though they're instance methods. This will be fixed in a future release 🙃

Hexes can also be created from cube coordinates:

```javascript
const Hex = Honeycomb.extendHex()
Hex({ q: 1, r: 4, s: -5 })  // { x: 3, y: 4 }
```
## Backlog

### 🐛 Bugs

### 🚀 Features

3.  Hex methods that do nothing with a hex's coordinates should be static (e.g. `cubeToCartesian`, `isPointy`, `width`)?
4.  Make some Grid instance methods also Grid static methods and vice versa?
5.  Make more methods accept points (instead of hexes). Also: instead of filtering invalid hexes, attempt to convert values to hexes (by passing them to `Hex()`)?
6.  Make some methods getters (e.g. `Hex#width`)?
7.  Make methods that accept points, also accept `x` and `y` as separate parameters?
8.  Maybe make entities immutable?
9.  Add possibility to [stretch hexes](http://www.redblobgames.com/grids/hexagons/implementation.html#layout-test-size-tall); they needn't be regularly shaped. This is an [actual request](https://github.com/flauwekeul/honeycomb/issues/1) as well. Maybe this should be solved during rendering (and not in Honeycomb at all)?
10. Add logger that "renders" a grid using `console.log`.
11. Overwrite `Grid#sort` so it can sort by 1 or more dimensions, ascending/descending (and also accepts a custom comparator)?
12. Add `Grid.union`, `Grid.subtract`, `Grid.intersect` and `Grid.difference` (or maybe as prototype methods?). [More info](https://www.sketchapp.com/docs/shapes/boolean-operations/).
13. Shiny github.io pages 😎
14. Maybe `Honeycomb.defineGrid` should accept a prototype too (as a second parameter).
15. Maybe `Honeycomb` should (also) be a function that accepts a hex prototype and returns a Grid factory?
16. Investigate how instance properties are set vs prototype properties. When creating a custom hex it should be possible to set properties that are copied when creating new hexes and properties that only exist in the prototype. Similar to how [stampit](https://github.com/stampit-org/stampit) solves this.
17. Add type definition files? Potential tools: [dts-gen](https://github.com/Microsoft/dts-gen), [dtsmake](https://github.com/ConquestArrow/dtsmake).

### 🛠 Refactorings

1.  Only inject what's needed, instead of whole factories (see `Grid.rectangle()` for example).
2.  Don't use `this` at all and just inject a context. Functional programming yo 🤓.
