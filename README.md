# guetzli-js

> [Guetzli](https://github.com/google/g) is a JPEG encoder that aims for excellent compression density at high visual quality. Guetzli-generated images are typically 20-30% smaller than images of equivalent quality generated by libjpeg.

[Guetzli](https://github.com/google/g) for NodeJS/Browser


## Install

### Windows User

```
$ npm install -g windows-build-tool
$ npm install -g node-gyp

$ node-gyp install
$ npm install -g guetzli-js
```

In China:

```
$ npm  install -g cnpm --registry=https://registy.npm.taobao.org
$ cnpm install -g windows-build-tool
$ cnpm install -g node-gyp

$ node-gyp install --dist-url https://npm.taobao.org/mirrors/node
$ cnpm install -g guetzli-js
```

### macOS and Linux User

```
$ npm install -g node-gyp

$ node-gyp install
$ npm install -g guetzli-js
```

In China:

```
$ npm  install -g cnpm --registry=https://registy.npm.taobao.org
$ cnpm install -g node-gyp

$ node-gyp install --dist-url https://npm.taobao.org/mirrors/node
$ cnpm install -g guetzli-js
```

## Example for NodeJS

```js
const fs = require('fs')
const guetzli = require('guetzli-js')

// usage node a.js input.png output.jpg
let args = process.argv.splice(2)

// load png
let data = fs.readFileSync(args[0])

// decode png image
let m = guetzli.decodePng32(data)

// encode jpg image
let jpegData = guetzli.encodeRGBA(m.pix, m.width, m.height, 0, guetzli.defaultQuality)

// save jpg
fs.writeFileSync(args[1], jpegData)
```
## Example for Borwser

```js
const guetzli = require('guetzli-js/browser')

let canvas = document.getElementById('myCanvas')
let ctx = canvas.getContext('2d')
let imgd = ctx.getImageData(0, 0, canvas.width, canvas.height)

// all image
let jpegData = guetzli.encodeImage({
	width:    canvas.width,
	height:   canvas.height,
	channels: 4,
	depth:    8,
	stride:   0,
	pix:      imgd.data,
})

// sub image
let jpegData2 = guetzli.encodeImage({
	width:    canvas.width/2,
	height:   canvas.height/2,
	channels: 4,
	depth:    8,
	stride:   canvas.width*4, // avoid padding
	pix:      imgd.data,
})
```

## Guetzli API

### Glocal Variable

```ts
export declare const version: string;
export declare const minQuality: number;     // 84
export declare const maxQuality: number;     // 110
export declare const defaultQuality: number; // 95
```

### Image Type

```ts
interface Image {
    width:    number;
    height:   number;
    channels: number;
    depth:    number;
    stride:   number;
    pix:      Uint8Array;
}
```

### `function encodeImage(m: Image, quality?: number = defaultQuality): Uint8Array`

```js
const guetzli = require('guetzli-js')

let w = 300
let h = 200
let pix = new Uint8Array(w*h*4) // RGBA

let jpegData = guetzli.encodeImage({
	width:    w,
	height:   h,
	channels: 4,
	depth:    8,
	stride:   0,
	pix:      pix,
})
```

### `function encodeGray(pix: Uint8Array, width: number, height: number, stride: number, quality: number): Uint8Array`

```js
const guetzli = require('guetzli-js/browser')

let canvas = document.getElementById('myCanvas')
let ctx = canvas.getContext('2d')
let rgba = ctx.getImageData(0, 0, canvas.width, canvas.height).data

let off = 0
let gray = new Uint8Array(w*h)

for(let y = 0; y < canvas.height; y++) {
	for(let x = 0; x < canvas.width; x++) {
		let idx = y*canvas.width+x
		let R = rgba[idx*4+0]
		let G = rgba[idx*4+0]
		let B = rgba[idx*4+0]

		gray[off++] = ((R+G+B)/3)|0
	}
}

let jpegData = guetzli.encodeGray({
	width:    w,
	height:   h,
	channels: 4,
	depth:    8,
	stride:   0,
	pix:      pix,
})
```

### `function encodeRGB(pix: Uint8Array, width: number, height: number, stride: number, quality: number): Uint8Array`

```js
const guetzli = require('guetzli-js/browser')

let canvas = document.getElementById('myCanvas')
let ctx = canvas.getContext('2d')
let rgba = ctx.getImageData(0, 0, canvas.width, canvas.height).data

let off = 0
let rgb = new Uint8Array(w*h*3)

for(let y = 0; y < canvas.height; y++) {
	for(let x = 0; x < canvas.width; x++) {
		let idx = y*canvas.width+x
		rgb[off++] = rgba[idx*4+0]
		rgb[off++] = rgba[idx*4+0]
		rgb[off++] = rgba[idx*4+0]
	}
}

let jpegData = guetzli.encodeGray({
	width:    canvas.width,
	height:   canvas.height,
	channels: 4,
	depth:    8,
	stride:   0,
	pix:      rgb,
})
```

### `function encodeRGBA(pix: Uint8Array, width: number, height: number, stride: number, quality: number): Uint8Array`


```js
const guetzli = require('guetzli-js/browser')

let canvas = document.getElementById('myCanvas')
let ctx = canvas.getContext('2d')
let rgba = ctx.getImageData(0, 0, canvas.width, canvas.height).data

let jpegData = guetzli.encodeRGBA({
	width:    canvas.width,
	height:   canvas.height,
	channels: 4,
	depth:    8,
	stride:   0,
	pix:      rgba,
})
```

## PNG helper (only for NodeJS)

### `function decodePng24(data: Uint8Array): Image`

```js
const assert = require('assert')
const fs = require('fs')

let data = fs.readFileSync('./testdata/bees.png')
let m = guetzli.decodePng24(data)

assert(m.width == 444)
assert(m.height == 258)
assert(m.channels == 3) // RGB
assert(m.depth == 8)    // 3*8 = 24 bit

let pix_size = m.width*m.height*m.channels*m.depth/8
assert(m.pix.length == pix_size)
```

### `function decodePng32(data: Uint8Array): Image`

```js
const assert = require('assert')
const fs = require('fs')

let data = fs.readFileSync('./testdata/bees.png')
let m = guetzli.decodePng32(data)

assert(m.width == 444)
assert(m.height == 258)
assert(m.channels == 4) // RGBA
assert(m.depth == 8)    // 4*8 = 32 bit

let pix_size = m.width*m.height*m.channels*m.depth/8
assert(m.pix.length == pix_size)
```

## License

MIT © [chai2010](https://github.com/chai2010)
