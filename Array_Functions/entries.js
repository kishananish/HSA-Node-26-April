// const fruits = ["Banana", "Orange", "Apple", "Mango"];
// const f = fruits.entries();

// for (let x of f) {
//   console.log(+= x + "<br>");
// }

const array1 = ["a", "b", "c"];

const iterator1 = array1.entries();

console.log(iterator1);

for (let x of iterator1) {
  console.log(x);
}

console.log(iterator1.next().value);
// Expected output: Array [0, "a"]

console.log(iterator1.next().value);
// Expected output: Array [1, "b"]
