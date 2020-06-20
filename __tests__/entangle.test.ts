import { entangle, DISENTANGLE } from "../src/main";
import { NumericObject } from "../src/types";
import { EntangledNumericObject } from "../src/entangle";

describe("Entangle", () => {
  let obj1: NumericObject;
  let obj2: NumericObject;
  beforeEach(() => {
    obj1 = { a: 1 };
    obj2 = { a: 5 };
    entangle(obj1, obj2);
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
    (obj1 as EntangledNumericObject)[DISENTANGLE];
    obj1.a++;
    expect(obj1.a).toEqual(2);
    expect(obj2.a).toEqual(5);
  });
  test("Reentanglement works", () => {
    entangle(obj1, obj2);
    entangle(obj2, obj1);
  });
  test("Entanglement of already entangled chains doesn't work", () => {
    const obj3 = { a: 6 };
    const obj4 = { a: 100 };
    entangle(obj3, obj4);
    expect(() => entangle(obj3, obj1)).toThrowError();
  });
  test("Adding to entanglement chain works from left", () => {
    const obj3 = { a: 100 };
    entangle(obj1, obj3);
    obj3.a++;
    expect(obj1.a).toEqual(2);
    expect(obj3.a).toEqual(101);
    expect(obj2.a).toEqual(6);
  });
  test("Adding to entanglement chain works from right", () => {
    const obj3 = { a: 100 };
    entangle(obj2, obj3);
    obj3.a++;
    expect(obj1.a).toEqual(2);
    expect(obj3.a).toEqual(101);
    expect(obj2.a).toEqual(6);
  });
  test("Adding to entanglement chain works with reverse order", () => {
    const obj3 = { a: 100 };
    entangle(obj3, obj1);
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
    const objs = [obj3, obj4, obj5, obj6, obj7, obj8, obj9];
    [obj2, ...objs].reduce(
      // @ts-ignore
      (acc, el) => entangle(acc, el) || el
    );
    obj9.a++;
    expect(objs.every((el) => el.a === 2)).toEqual(true);
    expect(obj1.a).toEqual(2);
    expect(obj2.a).toEqual(6);
  });
  test("Keys do not give out entanglement", () => {
    expect(Object.keys(obj1)).toEqual(["a"]);
  });
});
