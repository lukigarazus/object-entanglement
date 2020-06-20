import { DEMIRROR } from "./constants";
import { NumericObject } from "./types";

const MIRROR = Symbol("mirror");

export type MirroringNumericObject = NumericObject & {
  [MIRROR]?: { target: MirroringNumericObject; original: NumericObject };
  [DEMIRROR]?: any;
};

export default (obj1: MirroringNumericObject, obj2: MirroringNumericObject) => {
  if (obj2[MIRROR]) {
    throw new Error("Object is already mirroring something. Demirror first.");
  }
  const clone = { ...obj2 };
  Object.keys(obj1).forEach((key) => {
    //obj1[key] += obj2[key];
    delete obj2[key];
    Object.defineProperty(obj2, key, {
      get() {
        return obj1[key];
      },
      set(val) {
        return (obj1[key] = val);
      },
      enumerable: true,
      configurable: true,
    });
  });
  Object.defineProperty(obj2, MIRROR, {
    value: { target: obj1, original: clone },
    configurable: true,
    enumerable: false,
  });
  Object.defineProperty(obj2, DEMIRROR, {
    get() {
      delete this[DEMIRROR];
      Object.keys(this).forEach((key) => {
        delete this[key];
        this[key] = this[MIRROR].original[key];
      });
      delete this[MIRROR];
    },
    configurable: true,
    enumerable: false,
  });
};
