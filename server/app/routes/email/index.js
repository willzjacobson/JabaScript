var express = require('express');
var router = express.Router();
var mandrill = require('mandrill-api/mandrill');
var path = require('path');

var MANDRILL_CLIENT = require(path.join(__dirname, '../../../env')).MANDRILL_CLIENT;
var mandrill_client = new mandrill.Mandrill(MANDRILL_CLIENT);


router.post('/', function (req, res, next) {
	sendEmail(req.body.to_name, req.body.to_email, req.body.from_name, req.body.from_email, req.body.subject, req.body.message_html);
	res.status(200).send('Email sent');
})


// Sends email using Mandrill
function sendEmail(to_name, to_email, from_name, from_email, subject, message_html) {
  var message = {
    html: message_html,
    subject: subject,
    from_email: from_email,
    to: [{
      email: to_email,
      name: to_name
    }],
    important: false,
    track_opens: true,
    auto_html: false,
    preserve_recipients: true,
    merge: false,
    tags: [
      "Fullstack_StackStore"
    ]
  };
  var async = false;
  var ip_pool = "Main Pool";
  mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool}, function(result) {
    console.log(message);
    console.log(result);
  }, function(e) {
    // Mandrill returns the error as an object with name and message keys
    console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
    // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
  });
}


module.exports = router;