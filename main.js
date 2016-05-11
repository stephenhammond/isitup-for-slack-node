var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Welcome to our isitup integration!!');
});

app.get('/isitup',(req, res) =>{
	// console.log("REQUEST!");	
	console.log(req.body);
  
  if (req.token != '46DjNf4FV4JtMOFKGhouWpz2'){
  	return res.end("The token for the slash command doesn't match. Check your script.");
  }else{
	  //var inputText = req.text;
	  inputText = 'tsn.ca';
	  var options = {
	  	uri: 'https://isitup.org/'+inputText+'.json',
	 	method: 'GET',
	 	headers: {
	 		'User-Agent': 'IsitupForSlack/1.0 (https://github.com/sphammond/istiupforslack; sphammond@gmail.com)'
	 	}
	  };

	  request(options, (error, response, body) => {
	  	if(error){
	  		console.log(error);
	  		return res.send(404);
	  	}else{
			result = JSON.parse(body);
			if (result.status_code == 1){
				responseText = ":thumbsup: I am happy to report that *<http://"+inputText+"|"+inputText+">* is *up*!";
				console.log(responseText);
			  	res.send(responseText);
			}else if(result.status_code == 2){
			  	res.send(":disappointed: I am sorry to report that *<http://"+result.domain+"|"+result.domain+">* is *not up*!");
			}else if(result.status_code == 3){
				res.send(":interrobang: *"+inputText+"* does not appear to be a valid domain. \n"+"Please enter both the domain name AND suffix (example: *amazon.com* or *whitehouse.gov*).");
			}
		}
	  });
	}

});

app.listen(process.env.PORT || 3000, () => {
  console.log('Example app listening on port 3000!');
});

