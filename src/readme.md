# Interned
Create an interned object. Interned objects are frozen with only sorted string keys.

## Example
```js
import { Interned, isInterned } from "{PACKAGE_NAME}"

const internedObject = Interned({ foo: "bar" })

console.log(internedObject == Interned({ foo: "bar" })) // true
console.log(internedObject == { foo: "bar" }) // false
console.log(isInterned(internedObject)) // true
console.log(isInterned({ foo: "bar" })) // false

const map = new Set<{ x: number, y: number }, string>

map.set(Interned({ x: 1, y: 2 }), "foo")

console.log(map.get(Interned({ y: 2, x: 1 }))) // "foo"
```
