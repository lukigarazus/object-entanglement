![coverage lines](coverage/badge-lines.svg "Coverage lines") ![coverage functions](coverage/badge-functions.svg "Coverage functions") ![coverage branches](coverage/badge-branches.svg "Coverage branches") ![coverage statements](coverage/badge-statements.svg "Coverage statements")

# Object entanglement

This is a simple package enabling you "object entanglement". What is it? Well...

## Entanglement

According to Wikipedia, Quantum Entanglement means:

```
Quantum entanglement is a physical phenomenon that occurs when a pair or group of particles is generated, interact, or share spatial proximity in a way such that the quantum state of each particle of the pair or group cannot be described independently of the state of the others, including when the particles are separated by a large distance.
```

I really like the idea of affecting one object by modifying another one. Here's how it works in this package:

```javascript
import { entangle, DISENTANGLE } from "object-entanglement";

const obj1 = { a: 1 };
const obj2 = { a: 100 };
entangle(obj1, obj2);

obj1.a++;

console.log(obj1.a); // 2
console.log(obj2.a); // 101

obj1.a = 10;

console.log(obj1.a); // 10
console.log(obj2.a); // 109
```

Two things are of importance here:

1. When you change any property on an entangled object **properties of objects entangled with it will change too**, but in accordance with the original value.
1. Getting an entangled object key's value is a lot more expensive (~20x) in terms of time than that of a regular object.

If you want to end the entanglement, simply do:

```javascript
obj1[DISENTANGLE];
obj2[DISENTANGLE];

obj1.a++;

console.log(obj1.a); // 11
console.log(obj2.a); // 109
```

Notice two things:

1. The values of disentangled objects will be permanently affected by the entanglement. Maybe I will make this configurable...
1. You have to disentangle from both sides. If you do it only in one object, it won't matter much, but some internals will remain in place and take up memory, so it's better to handle all entangled objects.

You can also entangle many objects:

```javascript
const obj1 = { a: 1 };
const obj2 = { a: 1 };
const obj3 = { a: 1 };
const obj4 = { a: 1 };
const obj5 = { a: 1 };
const obj6 = { a: 1 };
const obj7 = { a: 1 };
const obj8 = { a: 1 };
const obj9 = { a: 1 };
const objs = [obj1, obj2, obj3, obj4, obj5, obj6, obj7, obj8, obj9];

objs.reduce((acc, el) => entangle(acc, el) || el);
obj9.a++;

console.log(objs.every((el) => el.a === 2)); // true
```

Two things to underline here:

1. The fact that so many objects are entangled doesn't mean that more memory is needed or that updates take more time. All of this is optimized so that two entangled objects take exactly the same amount of time and space to be updated as an arbitrary number of objects. The only difference is the entanglement process itself.
1. You can disentangle any objects you want, it won't affect the others. In this example disentangling `obj4` won't break the entanglement of the next ones.

```javascript
obj4[DISENTANGLE];
obj3.a++;
console.log(obj6.a); // 3, reacts to changes of obj3 despite the fact that obj4 was disentangled
```

However, due to the way Javascript works adding new keys won't be registered, but don't worry, I got you covered for such a case too...

## Twin entanglement

Here we need to create **twins** of the original objects we want to entangle in order to enable them to keep track of added and deleted keys. Here's how it works:

```javascript
import { twinEntangle, DISENTANGLE } from "object-entanglement";

let obj1 = { a: 1 };
let obj2 = { a: 5 };

let [twin1, twin2] = twinEntangle(obj1, obj2);

console.log(twin1.a); // 1
console.log(twin2.a); // 5

console.log(twin1 === obj1); // false
console.log(twin2 === obj2); // false

twin1.a++;
console.log(twin1.a); // 2
console.log(twin2.a); // 6
console.log(obj1.a); // 1
console.log(obj2.a); // 5

obj1.a++;
console.log(twin1.a); // 2
console.log(twin2.a); // 6
console.log(obj1.a); // 2
console.log(obj2.a); // 6

twin1.b = 5;
console.log(twin1.b); // 5
console.log(twin2.b); // 5
console.log(obj1.b); // undefined
console.log(obj2.b); // undefined
```

Notice two things:

1. This is only useful is a situation with complete control of reference distribution in your application. If objects are already distributed in your app and you want to affect them directly, use regular entanglement. This feature is actually the reason I created this library.
1. This will affect your original object on disentanglement. This was done to be reflect regular entanglement's behavior.

These two features preserve original structures of entangled objects. However, if you'd like to create an "absolute entanglement", use...

## Mirror entanglement

Mirror entanglement enables you to create an exact copy of one object but using another one's reference. Let me show you:

```javascript
import { mirror, DEMIRROR } from "object-entanglement";

const obj1 = { a: 1 };
const obj2 = { a: 100 };
mirror(obj1, obj2);

console.log(obj1.a); // 1
console.log(obj2.a); // 1
console.log(obj1 === obj2); // false

obj2.a++;
console.log(obj1.a); // 2
console.log(obj2.a); // 2
```

If you want to end the mirroring, simply do:

```javascript
obj2[DEMIRROR];

console.log(obj2.a); // 100
```

Notice two things:

1. You don't have to "demirror" both objects. Mirroring is a one-way relationship
1. Mirroring object's value will come back to the original, unlike in the case of entanglement.

You can also create chains of objects:

```javascript
const obj1 = { a: 1 };
const obj2 = { a: 2 };
const obj3 = { a: 3 };
const obj4 = { a: 4 };
const obj5 = { a: 5 };
const obj6 = { a: 6 };
const obj7 = { a: 7 };
const obj8 = { a: 8 };
const obj9 = { a: 9 };
const objs = [obj1, obj2, obj3, obj4, obj5, obj6, obj7, obj8, obj9];

objs.reduce((acc, el) => entangle(acc, el) || el);

console.log(objs.every((el) => el.a === 1)); // true
```

It's important to underline one thing here:

1. If you break the chain in any place you will create a new one, not take out that element from it like in the case of entanglement:

```javascript
obj5[DEMIRROR];
console.log(obj6.a); // 5
```

However, just like in case of entanglement this won't register new keys. And that's the reason for...

## Twin mirror entanglement

Coming soon!

<!-- ## API

| name         | type     |
| ------------ | -------- |
| entangle     | function |
| DISENTANGLE  | symbol   |
| mirror       | function |
| DEMIRROR     | symbol   |
| tEntangle    | function |
| DISTENTANGLE | symbol   |
| tMirror      | function |
| DETMIRROR    | symbol   | -->
