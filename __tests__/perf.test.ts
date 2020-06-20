import { entangle } from "../src/main";
test("Speed test", () => {
  const obj1 = { a: 1 };
  const obj2 = { a: 2 };
  entangle(obj1, obj2);
  const s1 = Date.now();
  for (let i = 0; i < 100000000; i++) {
    obj1.a;
    obj2.a;
  }
  const e1 = Date.now() - s1;
  const obj3 = { a: 1 };
  const obj4 = { a: 2 };
  const s2 = Date.now();
  for (let i = 0; i < 100000000; i++) {
    obj3.a;
    obj4.a;
  }
  const e2 = Date.now() - s2;
  console.log(e1, e2);
});
