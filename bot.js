var request = require('request');
var cheerio = require('cheerio');
var Twit = require('twit');

var config = require('./config.js');
var T = new Twit(config);

var lastSender;

//var users = {}

retrieveData();
setInterval(retrieveData, 1000*30);
//setInterval(retrieveDM,1000*10);


function retrieveData(){
	request('https://cubecraft.net/forums', function (err,response,html) {
		if (!err && response.statusCode == 200){
			var $ = cheerio.load(html);
			$('blockquote.ugc').each(function (i, element){
				var el = $(this);
				if(el.parent().parent().parent().parent().attr("id") == lastSender){
					return false;
				}
				var prefix = "";
				var poster = el.parent().prev().children().first().text();
				prefix += poster + " said";
				if(el.parent().prev().children().length == 3){
					var receiver = el.parent().prev().children().last().text();
					prefix += " to " + receiver;
				}
				prefix += ": ";
				var product = prefix + "\"" + el.text() + "\"";
				if (product.length > 140){
					product = product.substring(0, 135);
					product += "...\"";
				}
				console.log(product);

				sleep(1000);
				
				sendTweet(product);
			});

			
			lastSender = $('blockquote.ugc').first().parent().parent().parent().parent().attr("id");
			console.log("Ran!");
			
		}
	});
}

function sendTweet(tweetBody){
	var tweet = {
	  status: tweetBody
	}

	T.post('statuses/update', tweet, tweeted);

	function tweeted(err, data, response) {
	  if (err) {
	  	console.log("Something went wrong!" + err);
	  } else {}
	}
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}


/*
var params = {
	count:5
}

function retrieveDM(){
	T.get('direct_messages', params, gotData);
}

function gotData(err, data, response){
	console.log(data);
	console.log("\n\n---\n\n" + response);
	console.log(err);
	if (data.text.toLowerCase().startsWith("link ")) {
		var user = data.text.slice(5);
		users[user] = data.sender_id;
		console.log(users);
	}
	console.log("Got here!")
} */