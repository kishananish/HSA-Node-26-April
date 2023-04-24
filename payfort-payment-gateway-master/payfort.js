// import dependencies
const express = require('express')
var payfort = require("payfort-node");
var request = require('request');
const app = express()
const port = 3000

// import files
var resources = require("./resources");
var utility = require("./utility");


// initialize the client
var payfort = require("payfort-node");
// create client
var client = payfort.create_client("development", {
  access_code : "C9znXzHGbZ8mKhP8aZqx",
  merchant_identifier : "KtIggBZD",
  passphrase : "2020@Sharif",
  purchase_url : "https://sbcheckout.payfort.com/FortAPI/paymentPage"
});
// default URLs
// Authorization/Purchase URLs
// Test Environment URL: https://sbcheckout.payfort.com/FortAPI/paymentPage
// Production Environment URL: https://checkout.payfort.com/FortAPI/paymentPage
// purchase data to be sent to payfort
var purchaseData = {
  "amount": 100,
  "command" : "PURCHASE", // PURCHASE OR AUTHORIZATION
  "currency": "SAR",
  "customer_email": "hameed@saudianfal.com",
  "customer_name": "Hameed Payment",
  "language": "en",
  "return_url": "http://localhost:3000/bbb",
  "merchant_reference": "ki0098"
};
//call payfort API
payfort.send_request(client, purchaseData, function(err, response){
  if(err){
    console.log(err)
      //error stuff
    }

    console.log(response)
    //handle response
})



// function to create a simple client to be used multiple times
var create_client = function(environment, data){
    var client = {
        environment : environment,
        access_code : data.access_code,
        merchant_identifier : data.merchant_identifier,
        passphrase : data.passphrase
    };
    // check url
    var url = "";
    if(data.purchase_url){
        url = data.purchase_url;
    }else{
        if(environment == "development"){
            console.log("development")
            url = resources.purchase_url.development;    
        }else{
            console.log("production")
            url = resources.purchase_url.production;
        }
    }
    
    client.url = url;
    return client;
};

// function to create payfort signature
// can also be used to manage data
var create_signature = function(passphrase, data){
    var signature = utility.create_signature(passphrase, data);
    return signature;
};

// function to call payfort and create payment.
var send_request = function(client, data, callback){
    data.access_code = client.access_code;
    data.merchant_identifier = client.merchant_identifier;
    if(!data.signature){
        data.signature = create_signature(client.passphrase, data);
    }
    request.post({
        url : client.url,
        form : data
    }, function(err, httpResponse, body){ 
        if (err){
            callback(err, null);
        }

        console.log("AAAAAAAAAAAAAA");
        console.log(httpResponse);
        console.log("AAAAAAAAAAAAAA");

        console.log("BBBBBBBBBBBB");
        console.log(body);
        console.log("BBBBBBBBBBBB");
        callback(null, httpResponse);
    });
};


app.get('/', (req, res) => {


    //call payfort API
  payfort.send_request(client, purchaseData, function(err, response){
    if(err){
  
      console.log("Error = ",err);
        //error stuff
      }
      //handle response
  })
  
  
  // Callback will be a get request so below valiable 'get_request' will the decoded Query Parameters
  
  var get_request = {
    // decoded query params
  };
  var original_signature = get_request.signature;
  delete res.signature;
  var new_signature = payfort.create_signature("2020@Sharif", get_request);
  
  if(original_signature == new_signature){
    // valid data
  
    console.log("original_signature==",original_signature);
  }else{
  
    console.log("original_signature==",original_signature);
    // invalid data
  }
  
  
  
      res.send('Hello World!')
    })


    app.get('/bbb', (req, res) => {


  console.log("CCCCCCCCCCCC");
        console.log(res);
        console.log("CCCCCCCCCCCC");


      })



    app.post('/bbb', (req, res) => {


        console.log("DDDDDDDDDDDDD");
              console.log(res);
              console.log("DDDDDDDDDDDDD");
      
      
            })


  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })

exports.create_client = create_client;
exports.create_signature = create_signature;
exports.send_request = send_request;
