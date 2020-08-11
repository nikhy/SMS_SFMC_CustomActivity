'use strict';
const Path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const urlEncodeJSON = function(obj) {
	const str = [];
	for (let key in obj)
	  if (obj.hasOwnProperty(key)) {
		str.push(encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]));
	  }
	return str.join("&");
  }

const app = express();

// Register middleware that parses the request payload.
app.use(bodyParser.json({ extended: true }));

// Route that is called for every contact who reaches the custom split activity
app.post('/activity/execute', async (req, res) => {
  //const apiKey = 'Kao9PENmhLk-pm9jezRlMYb5kb5vxGxHGvSQ5Z7NaM';
  const apiKey = req.apiKey;
  const numbers = req.phoneNumber;
  const message = 'Hello World';
  const payload = {
    apiKey: apiKey,
    numbers: numbers,
    message: message,
  };
  console.log('Text Local payload ',JSON.stringify(payload));
  const result =  await axios
    .post('https://api.textlocal.in/send', urlEncodeJSON(payload));

  console.log('Text Local result ',JSON.stringify(result));
  return res.status(200).json({ success: true, res: result.data });
});

// Routes for saving, publishing and validating the custom activity. In this case
// nothing is done except decoding the jwt and replying with a success message.
app.post(/\/activity\/(save|publish|validate)/, (req, res) => {
  // verifyJwt(req.body, Pkg.options.salesforce.marketingCloud.jwtSecret, (err, decoded) => {
  // 	// verification error -> unauthorized request
  // 	if (err) return res.status(401).end();
  // 	console.log('save / publish / validate called => '+JSON.stringify(req));

  // 	return res.status(200).json({ success: true });
  // });
  console.log('save / publish / validate called => ');

  return res.status(200).json({ success: true });
});

// Serve the custom activity's interface, config, etc.
app.use(express.static(Path.join(__dirname, '..', 'public')));

// Start the server and listen on the port specified by heroku or defaulting to 12345
app.listen(process.env.PORT || 8080, () => {
  console.log('SMS Custom Activity backend is now running!');
});
