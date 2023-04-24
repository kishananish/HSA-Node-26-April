const numbers = [155, 70, 45, 40];
console.log(numbers.reduceRight(myFunc));

function myFunc(total, num) {
  console.log("total==" + total);
  console.log("num==" + num);
  return total - num;
}
