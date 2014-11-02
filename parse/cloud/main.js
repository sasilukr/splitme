var express = require('express');
var _ = require('underscore');
var querystring = require('querystring');

/**
 * Create an express application instance
 */
var app = express();

/**
 * Create a Parse ACL which prohibits public access.  This will be used
 *   in several places throughout the application, to explicitly protect
 *   Parse User, TokenRequest, and TokenStorage objects.
 */
var restrictedAcl = new Parse.ACL();
restrictedAcl.setPublicReadAccess(false);
restrictedAcl.setPublicWriteAccess(false);

/**
 * Global app configuration section
 */
//app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine
app.use(express.bodyParser());    // Middleware for reading request body

app.get('/SubmitClearPayment', function(request, response) {
    console.log('In SubmitPayment');

    var bodyJson = {
        "InvoiceNo":"1",
        "RefNo":"1",
        "Memo":"SplitMe Payment",
        "Purchase":"1.00",
        "AccountSource":"Swiped",
        "AcctNo":"5499990123456781",
        "ExpDate":"0816",
        "OperatorID":"money2020"
    };
    
    Parse.Cloud.httpRequest({
        url: 'https://w1.mercurycert.net/PaymentsAPI/Credit/Sale',
        method: "POST",
        headers: { 'Content-Type': 'application/json',
            'Authorization':'Basic MDE5NTg4NDY2MzEzOTIyOnh5eg=='},
        body: bodyJson,
        success: function (httpResponse) {
            console.log(httpResponse.text);
            var responseJson = JSON.parse(httpResponse.text);

            response.json(responseJson);
        },
        error: function (httpResponse) {
            console.error(httpResponse.text);
            response.json(responseJson);
        }
    });
});

app.get('/SubmitHostedPayment', function(request, response) {
    console.log('In SubmitPayment');

    var xmlBody = '<?xml version="1.0" encoding="utf-8"?>\
        <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
    <soap:Body>\
    <InitializePayment xmlns="http://www.mercurypay.com/">\
    <request>\
    <MerchantID>013163015566916</MerchantID>\
    <Password>ypBj@f@zt3fJRX,k</Password>\
    <Invoice>1234</Invoice>\
    <TotalAmount>2.22</TotalAmount>\
    <TaxAmount>0</TaxAmount>\
    <TranType>Sale</TranType>\
    <Frequency>OneTime</Frequency>\
    <Memo>SplitMe Payment</Memo>\
    <ProcessCompleteUrl>http://splitme.parseapp.com/paymentcomplete.html</ProcessCompleteUrl>\
    <ReturnUrl>http://splitme.parseapp.com/paymenthook.html</ReturnUrl>\
    <OperatorID>dano</OperatorID>\
    </request>\
    </InitializePayment>\
    </soap:Body>\
    </soap:Envelope>';

    Parse.Cloud.httpRequest({
        url: 'https://hc.mercurydev.net/hcws/hcservice.asmx',
        method: "POST",
        headers: { 'Content-Type': 'text/xml',
            'SOAPAction':'http://www.mercurypay.com/InitializePayment'},
        body: xmlBody,
        success: function (httpResponse) {
            console.log(httpResponse.text);
            //var responseJson = JSON.parse(httpResponse.text);
            //
            //response.json(responseJson);
            //<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"><soap:Body><InitializePaymentResponse xmlns="http://www.mercurypay.com/"><InitializePaymentResult><ResponseCode>0</ResponseCode><PaymentID>d20eb481-d7be-4d91-b1ff-c47c3dfbd150</PaymentID><Message>Initialize Successful</Message></InitializePaymentResult></InitializePaymentResponse></soap:Body></soap:Envelope>
            response.end(httpResponse.text);
        },
        error: function (httpResponse) {
            console.error(httpResponse.text);
            //response.json(responseJson);
            response.end(httpResponse.text);
        }
    });
});


// Attach the Express app to your Cloud Code
app.listen();