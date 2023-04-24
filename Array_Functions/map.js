const numbers = [65, 44, 12, 4];
const newArr = numbers.map(myFunction);

console.log(newArr);

function myFunction(num) {
  return num * 10;
}

const numbers2 = [4, 9, 16, 25];
const newArr2 = numbers2.map(Math.sqrt);

console.log(newArr2);
