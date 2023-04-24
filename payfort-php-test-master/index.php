<?php
// How to calculate request signature
$shaString  = '';
// array request
$arrData    = array(
'command'            =>'AUTHORIZATION',
'access_code'        =>'C9znXzHGbZ8mKhP8aZqx',
'merchant_identifier'=>'KtIggBZD',
'merchant_reference' =>'Code-order-03',
'amount'             =>'20',
'currency'           =>'SAR',
'language'           =>'en',
'customer_email'     =>'test@payfort.com',
'order_description'  =>'iPhone 6-S',
);
// sort an array by key
ksort($arrData);
foreach ($arrData as $key => $value) {
    $shaString .= "$key=$value";
}
// make sure to fill your sha request pass phrase
$shaString = "2020@Sharif" . $shaString . "2020@Sharif";
$signature = hash("sha256", $shaString);
// your request signature
echo $signature;
?>

<?php
$requestParams = array(
  'command' => 'AUTHORIZATION',
  'access_code' => 'C9znXzHGbZ8mKhP8aZqx',
  'merchant_identifier' => 'KtIggBZD',
  'merchant_reference' => 'Code-order-03',
  'amount' => '20',
  'currency' => 'SAR',
  'language' => 'en',
  'customer_email' => 'test@payfort.com',
  'signature' => $signature,
  'order_description' => 'iPhone 6-S',
  );
  
  
  $redirectUrl = 'https://sbcheckout.payfort.com/FortAPI/paymentPage';
  echo "<html xmlns='https://www.w3.org/1999/xhtml'>\n<head></head>\n<body>\n";
  echo "<form action='$redirectUrl' method='post' name='frm'>\n";
  foreach ($requestParams as $a => $b) {
      echo "\t<input type='text' name='".htmlentities($a)."' value='".htmlentities($b)."'>\n";
  }
  echo "\t<script type='text/javascript'>\n";
  echo "\t\tdocument.frm.submit();\n";
  echo "\t</script>\n";
  echo "</form>\n</body>\n</html>";