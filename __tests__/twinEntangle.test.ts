import { twinEntangle as entangle, DISENTANGLE } from "../src/main";
import { NumericObject } from "../src/types";
import { TWIN_ENTANGLEMENT } from "../src/twinEntangle";

describe("Entangle", () => {
  let obj1: NumericObject;
  let obj2: NumericObject;
  beforeEach(() => {
    obj1 = { a: 1 };
    obj2 = { a: 5 };
    const [e1, e2] = entangle(obj1, obj2);
    obj1 = e1;
    obj2 = e2;
  });

  test("Get works", () => {
    expect(obj1.a).toEqual(1);
    expect(obj2.a).toEqual(5);
  });
  test("Set works", () => {
    obj1.a++;
    expect(obj1.a).toEqual(2);
    expect(obj2.a).toEqual(6);
  });
  test("Multiple sets work", () => {
    obj1.a = 8;
    obj2.a--;
    obj2.a = 13;
    expect(obj1.a).toEqual(9);
    expect(obj2.a).toEqual(13);
  });
  test("Disentangle works", () => {
    obj2.a++;
    // @ts-ignore
    obj1 = obj1[DISENTANGLE];
    obj1.a++;
    expect(obj1.a).toEqual(3);
    expect(obj2.a).toEqual(6);
  });
  test("Reentanglement works", () => {
    entangle(obj1, obj2);
    entangle(obj2, obj1);
  });
  test("Entanglement of already entangled chains doesn't work", () => {
    let [obj3, obj4] = entangle({ a: 6 }, { a: 100 });
    expect(() => entangle(obj3, obj1)).toThrowError();
  });
  test("Adding to entanglement chain works from left", () => {
    let obj3 = { a: 100 };
    // @ts-ignore
    obj3 = entangle(obj1, obj3)[1];
    obj3.a++;
    expect(obj1.a).toEqual(2);
    expect(obj3.a).toEqual(101);
    expect(obj2.a).toEqual(6);
  });
  test("Adding to entanglement chain works from right", () => {
    let obj3 = { a: 100 };
    // @ts-ignore
    obj3 = entangle(obj2, obj3)[1];
    obj3.a++;
    expect(obj1.a).toEqual(2);
    expect(obj3.a).toEqual(101);
    expect(obj2.a).toEqual(6);
  });
  test("Adding to entanglement chain works with reverse order", () => {
    let obj3 = { a: 100 };
    // @ts-ignore
    obj3 = entangle(obj3, obj1)[0];
    obj3.a++;
    expect(obj1.a).toEqual(2);
    expect(obj3.a).toEqual(101);
    expect(obj2.a).toEqual(6);
  });
  test("Long chains work", () => {
    const obj3 = { a: 1 };
    const obj4 = { a: 1 };
    const obj5 = { a: 1 };
    const obj6 = { a: 1 };
    const obj7 = { a: 1 };
    const obj8 = { a: 1 };
    const obj9 = { a: 1 };
    let objs = [obj3, obj4, obj5, obj6, obj7, obj8, obj9];
    // @ts-ignore
    objs = objs.reduce(
      // @ts-ignore
      (acc, el) => [...acc, entangle(acc[acc.length - 1], el)[1]],
      [obj2]
    );
    objs.shift();
    // @ts-ignore
    objs.pop().a++;
    expect(objs.every((el) => el.a === 2)).toEqual(true);
    expect(obj1.a).toEqual(2);
    expect(obj2.a).toEqual(6);
  });
  test("Keys do not give out entanglement", () => {
    expect(Object.keys(obj1)).toEqual(["a"]);
  });
  test("Adding keys works", () => {
    obj1.b = 4;
    expect(obj1.b).toEqual(4);
    expect(obj2.b).toEqual(4);
  });
  test("Adding and modifying keys works", () => {
    obj1.b = 4;
    obj2.b++;
    expect(obj1.b).toEqual(5);
    expect(obj2.b).toEqual(5);
  });
  test("Removing keys works", () => {
    obj1.b = 4;
    delete obj1.b;
    expect(obj1.b).toEqual(undefined);
    expect(obj2.b).toEqual(undefined);
  });
  test("Iteration works for added keys", () => {
    obj1.b = 4;
    expect(Object.keys(obj1)).toEqual(["a", "b"]);
    expect(Object.keys(obj2)).toEqual(["a", "b"]);

    expect(Object.values(obj1)).toEqual([1, 4]);
    expect(Object.values(obj2)).toEqual([5, 4]);

    expect(Object.entries(obj1)).toEqual([
      ["a", 1],
      ["b", 4],
    ]);
    expect(Object.entries(obj2)).toEqual([
      ["a", 5],
      ["b", 4],
    ]);
  });
});
