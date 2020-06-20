import { DISENTANGLE } from "./constants";
import { NumericObject } from "./types";

const ENTANGLEMENT = Symbol("entanglement");

export type EntangledNumericObject = NumericObject & {
  [DISENTANGLE]?: any;
  [ENTANGLEMENT]?: NumericObject;
};

const defineProperty = (
  obj: EntangledNumericObject,
  val: number,
  key: string,
  entanglement: NumericObject
) => {
  Object.defineProperty(obj, key, {
    get() {
      return val + entanglement[key];
    },
    set(value: number) {
      entanglement[key] += value - (val + entanglement[key]);
      return val + entanglement[key];
    },
    configurable: true,
    enumerable: true,
  });
};

const entangleKey = (
  obj: EntangledNumericObject,
  key: string,
  entanglement: NumericObject
) => {
  const val1 = obj[key];

  delete obj[key];

  entanglement[key] = 0;

  defineProperty(obj, val1, key, entanglement);
};

const entangleObject = (obj: NumericObject, entanglement: NumericObject) => {
  Object.defineProperty(obj, ENTANGLEMENT, {
    value: entanglement,
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(obj, DISENTANGLE, {
    get() {
      Object.keys(this[ENTANGLEMENT]).forEach((key) => {
        const value = this[key];
        delete this[key];
        this[key] = value;
      });
      delete this[ENTANGLEMENT];
    },
    configurable: true,
    enumerable: false,
  });
};

const attachToEntanglement = (
  entangled: EntangledNumericObject,
  attached: NumericObject
) => {
  const entanglement = entangled[
    ENTANGLEMENT
  ] as NumericObject; /* Here we know that this is not undefined */

  Object.keys(entanglement).forEach((key) => {
    entangleKey(attached, key, entanglement);
  });

  entangleObject(attached, entanglement);
};

export default (obj1: EntangledNumericObject, obj2: EntangledNumericObject) => {
  if (obj2[ENTANGLEMENT] && obj1[ENTANGLEMENT]) {
    if (obj2[ENTANGLEMENT] !== obj1[ENTANGLEMENT]) {
      throw new Error(
        "Objects are already parts of different entanglement chains. Disentangle first"
      );
    }
  } else if (obj1[ENTANGLEMENT]) {
    attachToEntanglement(obj1, obj2);
  } else if (obj2[ENTANGLEMENT]) {
    attachToEntanglement(obj2, obj1);
  } else {
    const entanglement: NumericObject = {};

    Object.keys(obj1).forEach((key) => {
      entangleKey(obj1, key, entanglement);
      entangleKey(obj2, key, entanglement);
    });

    entangleObject(obj1, entanglement);
    entangleObject(obj2, entanglement);
  }
};
