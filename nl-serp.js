var request = require('request');
var cheerio = require('cheerio');

BASE_URL = 'http://nairaland.com';

request(BASE_URL + '/search?q=buhari&board=20', function(err, r, html) {
	if (err) { console.log(err) };
	if (!err && r.statusCode == 200) {
		var parsedResult = [];
		$ = cheerio.load(html);
		$('div.narrow').slice(0,5).each(function(i, el) {
			var comment = $(this).text();
			var metadata = {
				comment: comment
			}
			parsedResult.push(metadata);
			console.log(metadata);
		});
		
		
		//var user_path = $(block).parent().prev().children('td').slice(0,10);
		
	}
});

/*
$(user_path).each(function(i, el) {
	var title = $(this).attr('href').next().text();
	var user_moniker = $(this).attr('class', 'user').text();
	var time = $(this).attr('class', 's').text();
	var metadata = {
		title: title,
		user: user_moniker,
		time: time,
		comment: comment
	};
	parsedResult.push(metadata);
	console.log(parsedResult);
});
*/