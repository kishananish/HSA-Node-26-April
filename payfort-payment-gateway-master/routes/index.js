var express = require('express');
var sjcl = require('sjcl');
const axios = require('axios').default;
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const payfort_array = {command:"AUTHORIZATION", access_code:"C9znXzHGbZ8mKhP8aZqx", merchant_identifier:"KtIggBZD", merchant_reference:"Code-order-05", amount:"20", currency:"SAR", language:"en", customer_email:"test@payfort.com", order_description:"iPhone 6-S"}; 


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

console.log("\n");
console.log(text);

delete payfort_array['order_description'];


payfort_array["signature"] = myHash;
payfort_array["order_description"] = 'iPhone 6-S';

console.log("KKKKKKKKKKKKKK");
console.log(payfort_array);
console.log("KKKKKKKKKKKKKK");

const redirectUrl = 'https://sbcheckout.payfort.com/FortAPI/paymentPage';
  res.render('index', { title: 'Express', myHash:myHash, payfort_array:payfort_array, redirectUrl:redirectUrl });


});

router.post('/bbb', (req, res) => {

    console.log("CCCCCCCCCCCCCCCCC");
    console.log(req.body);
    console.log("CCCCCCCCCCCCCCCCC");


    console.log("QQQQQQQQQQQQQQQQQQQQQQQQ");
    console.log(req);
    console.log("QQQQQQQQQQQQQQQQQQQQQQQQ");

    console.log("PPPPPPPPPPPPPPPPPPPPPPPPPPP");
    console.log(res);
    console.log("PPPPPPPPPPPPPPPPPPPPPPPPPPP");

    res.send('Hello World!')

  })

module.exports = router;
