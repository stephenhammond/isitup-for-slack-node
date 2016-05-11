var express = require('express');
var app = express();
const https = require('https');

app.get('/', (req, res) => {
  res.send('Welcome to our isitup integration!!');
});

app.get('/isitup',(req, res) =>{
  
  var inputText = req.text;
  //for testing
  inputText = 'tsn.ca';

  var options = {
  	hostname: 'isitup.org',
  	path: '/'+inputText+'.json',
 	method: 'GET',
 	headers: {
 		'User-Agent': 'IsitupForSlack/1.0 (https://github.com/sphammond/istiupforslack; sphammond@gmail.com)'
 	}
  };

  https.get(options, (response) => {
  	//response.setEncoding('utf8');
	response.on('data', (result) =>{
		result = JSON.parse(result);
		if (result.status_code == 1){
			responseText = ":thumbsup: I am happy to report that *<http://"+inputText+"|"+inputText+">* is *up*!";
			console.log(responseText);
		  	res.send(responseText);
		}else if(result.status_code == 2){
		  	res.send(":disappointed: I am sorry to report that *<http://"+result.domain+"|"+result.domain+">* is *not up*!");
		}else if(result.status_code == 3){
			res.send(":interrobang: *"+inputText+"* does not appear to be a valid domain. \n"+"Please enter both the domain name AND suffix (example: *amazon.com* or *whitehouse.gov*).");

		}
	});
	response.on('error', (message) => {
    	res.send(":sob: Ironically, isitup could not be reached.");
  	});
  });

});

app.listen(process.env.PORT || 3000, () => {
  console.log('Example app listening on port 3000!');
});

