export const ENTANGLED = Symbol("coupled");

export const entangle = (obj1, obj2) => {
  const clone = { ...obj2 };
  Object.keys(obj1).forEach(key => {
    if (typeof obj1[key] !== "number") {
      throw new Error("Can couple only numbers");
    }
    obj1[key] += obj2[key];
    delete obj2[key];
    Object.defineProperty(obj2, key, {
      get() {
        return obj1[key];
      },
      set(val) {
        return (obj1[key] = val);
      },
      enumerable: true,
      configurable: true
    });
  });
  Object.defineProperty(obj2, COUPLED, {
    value: { target: obj1, original: clone },
    configurable: false,
    enumerable: false
  });
};