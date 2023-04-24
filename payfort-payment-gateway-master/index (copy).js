const express = require('express')
var sjcl = require('sjcl');
const axios = require('axios').default;
const app = express()
const port = 3000



const payfort_array = {command:"AUTHORIZATION", access_code:"C9znXzHGbZ8mKhP8aZqx", merchant_identifier:"KtIggBZD", merchant_reference:"Code-order-04", amount:"20", currency:"SAR", language:"en", customer_email:"test@payfort.com", order_description:"iPhone 6-S"}; 


const ordered = Object.keys(payfort_array).sort().reduce(
  (obj, key) => { 
    obj[key] = payfort_array[key]; 
    return obj;
  }, 
  {}
);

console.log(JSON.stringify(ordered));
console.log(ordered);

let text = "";
for (let x in ordered) {
  text += x + "="+ordered[x];
}

const myString = '2020@Sharif'+text+'2020@Sharif'
const myBitArray = sjcl.hash.sha256.hash(myString)
const myHash = sjcl.codec.hex.fromBits(myBitArray)

console.log(myHash);

app.get('/', (req, res) => {

  axios.post('/bbb', {
    firstName: 'Fred',
    lastName: 'Flintstone'
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });



  res.send({myHash:myHash,example:"db73f024f7efb28bccd873d53c2560d1cae3567ba634fa13229b337dcc90bae3"})
})


app.post('/bbb', (req, res) => {
console.log("AAAAAAAAAAAAAAAAAAAA");
  console.log(res);
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})