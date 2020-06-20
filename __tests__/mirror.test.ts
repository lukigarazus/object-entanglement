import { mirror, DEMIRROR } from "../src/main";
import { NumericObject } from "../src/types";
import { MirroringNumericObject } from "../src/mirror";

describe("Mirror", () => {
  let obj1: NumericObject;
  let obj2: NumericObject;
  beforeEach(() => {
    obj1 = { a: 1, b: 2 };
    obj2 = { a: 2 };
    mirror(obj1, obj2);
  });
  test("Get works", () => {
    expect(obj2.a).toEqual(1);
  });
  test("Set works", () => {
    obj2.a = 3;
    expect(obj1.a).toEqual(3);
    expect(obj2.a).toEqual(3);
  });
  test("Chain works", () => {
    const obj3 = { a: 3 };
    mirror(obj2, obj3);
    expect(obj3.a).toEqual(1);
  });
  test("Demirror works", () => {
    (obj2 as MirroringNumericObject)[DEMIRROR];
    expect(obj2.a).toEqual(2);
  });
  test("Keys don't give out mirroring", () => {
    expect(Object.keys(obj2)).toEqual(["a", "b"]);
  });
});
