import { NumericObject } from "./types";
import { DISENTANGLE } from "./constants";

export const TWIN_ENTANGLEMENT = Symbol("twin entanglement");

export type EntangledNumericObject = NumericObject & {
  [DISENTANGLE]?: any;
  [TWIN_ENTANGLEMENT]?: NumericObject;
};

const attachToEntanglement = (
  entangled: EntangledNumericObject,
  attached: NumericObject
) => {
  const entanglement = entangled[TWIN_ENTANGLEMENT] as NumericObject;
  return twinEntangleObject(attached, entanglement);
};

const twinEntangleObject = (
  obj: NumericObject,
  entanglement: NumericObject
) => {
  Object.keys(obj).forEach((key) => (entanglement[key] = 0));
  return new Proxy(obj, {
    get(t: NumericObject, p: string | symbol) {
      if (p === TWIN_ENTANGLEMENT) return entanglement;
      if (p === DISENTANGLE) {
        Object.keys(entanglement).forEach((key) => {
          if (t[key] !== undefined) {
            t[key] += entanglement[key];
          } else {
            t[key] = entanglement[key];
          }
        });
        return t;
      }
      p = p as string;
      if (entanglement[p] === undefined) {
        return undefined;
      }
      p = p as string;
      return (t[p] || 0) + entanglement[p];
    },
    set(t: NumericObject, key, value) {
      key = key as string;
      if (entanglement[key] !== undefined) {
        const val = t[key];
        entanglement[key] += value - ((val || 0) + entanglement[key]);
        return true;
      } else {
        entanglement[key] = value;
        return true;
      }
    },
    deleteProperty(t, p) {
      p = p as string;
      delete entanglement[p];
      delete t[p];
      return true;
    },
    ownKeys(t) {
      return Object.keys(entanglement);
    },
    getOwnPropertyDescriptor(t, p) {
      return Object.getOwnPropertyDescriptor(entanglement, p);
    },
  });
};

export default (obj1: EntangledNumericObject, obj2: EntangledNumericObject) => {
  if (obj1[TWIN_ENTANGLEMENT] && obj2[TWIN_ENTANGLEMENT]) {
    if (obj1[TWIN_ENTANGLEMENT] !== obj2[TWIN_ENTANGLEMENT])
      throw new Error("Cannot join two chains of entanglement");
  }
  if (obj1[TWIN_ENTANGLEMENT]) {
    return [obj1, attachToEntanglement(obj1, obj2)];
  }
  if (obj2[TWIN_ENTANGLEMENT]) {
    return [attachToEntanglement(obj2, obj1), obj2];
  }
  const entanglement = {};
  return [obj1, obj2].map((o) => twinEntangleObject(o, entanglement));
};
