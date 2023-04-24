var crypto = require('crypto');
import request from 'request';

var createHash = function (string) {
  var hash = crypto.createHash('sha256').update(string, 'utf8').digest('hex');
  return hash;
};

var create_signature = function (passphrase, object) {
  var signatureText = '';
  var keys = [];
  for (var eachKey in object) {
    keys.push(eachKey);
  }
  keys.sort(compare);

  var len = keys.length;

  for (var i = 0; i < len; i++) {
    var k = keys[i];
    signatureText = signatureText + (k + '=' + object[k]);
  }
  var digest = passphrase + signatureText + passphrase;
 // console.log("digest",digest);
  var signature = createHash(digest);
  
  return signature;
};

function compare(a, b) {
  if (a < b)
    return -1;
  if (a > b)
    return 1;
  return 0;
}


/**
 * create token from payfort
 * @param {*} object 
 */

var create_token = async (requestParams) => {
  var cardData = requestParams;
  const options = {
    url: 'https://sbcheckout.PayFort.com/FortAPI/paymentPage',
    method: 'POST',
    form: cardData

  };
  let res = await doRequest(options);
  return res;
};

// send request to payfort 
function doRequest(url) {
  return new Promise(function (resolve, reject) {
    request(url, function (error, res, body) {
      if (!error && res.statusCode == 200) {
        var result = body.match(/\{.+\}/);
        var responseBody = result[0];
        var payfortResponse = JSON.parse(responseBody);
        resolve(payfortResponse);
      } else {
        reject(error);
      }
    });
  });
}



/**
 * send request to payfort for getting 3d url
 * @param {*} requestParams 
 */
var create_payfort_url = async (requestParams) => {
  var cardData = requestParams;
  const options = {
    url: 'https://sbpaymentservices.payfort.com/FortAPI/paymentApi',
    method: 'POST',
    json: cardData
  };
  let res = await getPayfort3dUrl(options);
  return res;
};

function getPayfort3dUrl(url) {
  return new Promise(function (resolve, reject) {
    request(url, function (error, res, body) {
      if (!error && res.statusCode == 200) {
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
}




exports.create_signature = create_signature;
exports.create_token = create_token;
exports.create_payfort_url = create_payfort_url;

