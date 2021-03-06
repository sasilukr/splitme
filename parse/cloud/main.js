var express = require('express');
var _ = require('underscore');
var querystring = require('querystring');
var xmldoc = require('cloud/xmldoc.js');

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
app.set('views', 'cloud/views');  // Specify the folder to find templates
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

app.all('/SubmitHostedPayment', function(request, response) {
    console.log('In SubmitPayment');
    var amount = request.query.amount ? request.query.amount : 0;
    var payer = request.query.payer ? request.query.payer : '';
    var paid = request.query.paid ? request.query.paid + ',' + payer : payer;

    console.log('Charging for amount: ' + amount);

    var PaymentIds = Parse.Object.extend("PaymentIds");
    var newPaymentId = new PaymentIds();
    newPaymentId.save({amount:amount,payer:payer,paid:paid}, {
        success: function (data) {

            var redirectUri = request.query.payer ? 'http://splitme.parseapp.com/PaymentComplete/'+data.id : 'http://splitme.parseapp.com/PayAllComplete';

            console.log(redirectUri);

            var xmlBody = '<?xml version="1.0" encoding="utf-8"?>\
        <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
    <soap:Body>\
    <InitializePayment xmlns="http://www.mercurypay.com/">\
    <request>\
    <MerchantID>013163015566916</MerchantID>\
    <Password>ypBj@f@zt3fJRX,k</Password>\
    <Invoice>1234</Invoice>\
    <TotalAmount>' + amount + '</TotalAmount>\
    <TaxAmount>0</TaxAmount>\
    <TranType>Sale</TranType>\
    <Frequency>OneTime</Frequency>\
    <Memo>SplitMe Payment</Memo>\
    <ProcessCompleteUrl>' + redirectUri +'</ProcessCompleteUrl>\
    <ReturnUrl>http://splitme.parseapp.com/bill.html</ReturnUrl>\
    <OperatorID>dano</OperatorID>\
    </request>\
    </InitializePayment>\
    </soap:Body>\
    </soap:Envelope>';

            console.log(xmlBody);

            Parse.Cloud.httpRequest({
                url: 'https://hc.mercurydev.net/hcws/hcservice.asmx',
                method: "POST",
                headers: { 'Content-Type': 'text/xml',
                    'SOAPAction':'http://www.mercurypay.com/InitializePayment'},
                body: xmlBody,
                success: function (httpResponse) {
                    //console.log(httpResponse.text);

                    var document = new xmldoc.XmlDocument(httpResponse.text);
                    var PaymentID = document.valueWithPath('soap:Body.InitializePaymentResponse.InitializePaymentResult.PaymentID');
                    console.log('HostedCheckout PaymentId: ' + PaymentID);
                    //response.end(PaymentID);

                    response.render('hostedredirect', {
                        PaymentId: PaymentID
                    });
                },
                error: function (httpResponse) {
                    console.error(httpResponse.text);
                    //response.json(responseJson);
                    response.end(httpResponse.text);
                }
            });
        },
        error: function (data, error) {
            console.log('newPaymentId save failed');
            // The save failed.  Error is an instance of Parse.Error.
            console.log(error);
        }
    });
});

app.post('/PayAllComplete', function(request, response) {
   response.redirect('/thankyou.html');
});

    app.post('/PaymentComplete/:objectId', function(request, response) {
    console.log('Payment Complete: '+request.params.objectId);
    var PaymentIds = Parse.Object.extend("PaymentIds");
    var query = new Parse.Query(PaymentIds);
    query.get(request.params.objectId, {
        success: function(PaymentId) {
            // The object was retrieved successfully.
            response.redirect('/bill.html?amount='+PaymentId.get('amount')+'&payer='+PaymentId.get('payer')+'&paid='+PaymentId.get('paid'));
        },
        error: function(object, error) {
            // The object was not retrieved successfully.
            // error is a Parse.Error with an error code and message.
        }
    });




    //response.end('Payment Complete');
});

app.all('/PaymentReturn', function(request, response) {
    console.log('Payment Return');
    response.end('Payment Return');
});

app.get('/VerifyPayment', function(request, response) {
    console.log('In SubmitPayment');

    var xmlBody = '<?xml version="1.0" encoding="utf-8"?>\
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
  <soap:Body>\
    <VerifyPayment xmlns="http://www.mercurypay.com/">\
      <request>\
        <MerchantID>013163015566916</MerchantID>\
        <Password>ypBj@f@zt3fJRX,k</Password>\
        <PaymentID>d20eb481-d7be-4d91-b1ff-c47c3dfbd150</PaymentID>\
      </request>\
    </VerifyPayment>\
  </soap:Body>\
</soap:Envelope>';

    Parse.Cloud.httpRequest({
        url: 'https://hc.mercurydev.net/hcws/hcservice.asmx',
        method: "POST",
        headers: { 'Content-Type': 'text/xml',
            'SOAPAction':'http://www.mercurypay.com/VerifyPayment'},
        body: xmlBody,
        success: function (httpResponse) {
            console.log(httpResponse.text);
            //var responseJson = JSON.parse(httpResponse.text);
            //
            //response.json(responseJson);
            //<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"><soap:Body><InitializePaymentResponse xmlns="http://www.mercurypay.com/"><InitializePaymentResult><ResponseCode>0</ResponseCode><PaymentID>d20eb481-d7be-4d91-b1ff-c47c3dfbd150</PaymentID><Message>Initialize Successful</Message></InitializePaymentResult></InitializePaymentResponse></soap:Body></soap:Envelope>

            response.end(httpResponse.text);
            // var document = new xmldoc.XmlDocument(httpResponse.text);
            // var PaymentID = document.valueWithPath('soap:Body.InitializePaymentResponse.InitializePaymentResult.PaymentID');
            // console.log('HostedCheckout PaymentId: ' + PaymentID);
            // response.end(PaymentID);
        },
        error: function (httpResponse) {
            console.error(httpResponse.text);
            //response.json(responseJson);
            response.end(httpResponse.text);
        }
    });
});

app.all('/test', function(request, response) {
    console.log(request.body);
});

// Attach the Express app to your Cloud Code
app.listen();
