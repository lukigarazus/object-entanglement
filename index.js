var ENTANGLED = Symbol("entangle");
var DISENTANGLE = Symbol("disentangle");

module.exports.ENTANGLED   = ENTANGLED;
module.exports.DISENTANGLE = DISENTANGLE

module.exports.entangle = (obj1, obj2) => {
  const clone = { ...obj2 };
  Object.keys(obj1).forEach(key => {
    if (typeof obj1[key] !== "number") {
      console.log("Can entangle only numeric keys");
      return
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
  Object.defineProperty(obj2, ENTANGLED, {
    value: { target: obj1, original: clone },
    configurable: true,
    enumerable: false
  });
  Object.defineProperty(obj2, DISENTANGLE, {
    get() {
      delete this[DISENTANGLE];
      Object.keys(this).forEach(key => {
        delete this[key]
        this[key] = this[ENTANGLED].original;
      })
      delete this[ENTANGLED];
    },
    configurable: true,
    enumerable: false
  });
};


