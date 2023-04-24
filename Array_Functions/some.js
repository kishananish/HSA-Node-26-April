const ages = [3, 10, 18, 20];
console.log(ages.some(checkAdult));
function checkAdult(age) {
  return age > 18;
}
