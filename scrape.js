// Modules
var request = require('request')
	, cheerio = require('cheerio')
;


var NairalandScraper = module.exports = function(options) {
	if (options == null) {
		options = {};
	}
	this._options = options || {};
	this.baseURL = "http://nairaland.com";
	this.serpURL = this.baseURL + '/search';

}

NairalandScraper.prototype.getScrapedData = function(params, callback) {
	var self = this;

	var params, limit;
	params = params || {};
	limit = params["limit"] || 20;

	this.getHtml(this.baseURL, params, function(err, data) {
		if (err) { return callback(err, null) };
		self.extractData(data, limit, function(err, results) {
			if (err) { return callback(err, null) };
			return callback(null,results);
		});
	});
};


NairalandScraper.prototype.extractData = function(html, limit, callback) {

	var scraped_data = [];
	var $ = cheerio.load(html);
	var links = $('td.featured').children('a').slice(0,limit);
	$(links).each(function(i, el) {
		var title = $(this).text();
		var url = $(this).attr('href');
		var metadata = {
			title: title,
			url: url
		};
		scraped_data.push(metadata);
	});
	//console.log(scraped_data);
	return callback(null, scraped_data);
};


/*
* Method to extract data from nairaland's 
* SERP(Search Engine Results Page)
*/
NairalandScraper.prototype.getSERPScrapedData = function(params, callback) {
	var self = this;
	var limit;
	var params = params || {};
	limit = params["limit"] || 50;

	this.getHtml(this.serpURL, params, function(error, data) {
		if (error) { return callback(error, null);  };

		self.extractSERPData(data, limit, function(error, results) {
			if (error) { return callback(error, null) };
			return callback(null, results);
		});
	});
};


/** Method to extract exact comment data from returned html, passed via 'getHtml()'' function
** 
** TODO: Format comments 
*/
NairalandScraper.prototype.extractSERPData = function (html, limit, callback) {

	var parsedResult = [];
		$ = cheerio.load(html);
		$('div.narrow').slice(0,limit).each(function(i, el) {
			var comment = $(this).text();
			var metadata = {
				comment: comment
			}
			parsedResult.push(metadata);
			//console.log(metadata);
			return callback(null, parsedResult);
		});
}

/** Method to request and return html data from nairaliand's home page
**
*/

NairalandScraper.prototype.getHtml = function(url, params, callback) {
	var self = this;


	var options = {
		url: url
	};
	var params, q, board;
	params = params || {};
	if ("q" in params) {
		options.q = params["q"];
	}
	if ("board" in params) {
		options.board = params["board"];
	}

	request({
		url: url,
		qs: options
	}, function(err, response, html) {
		if (err) { return callback(err, null) };
		if (response.statusCode !== 200) {
			var error = new Error(`Unexpected status code returned: ${response.statusCode}`)
			error.response = response
			return callback(error, null);
			console.log(error);
		};

		return callback(null, html);
	});
};

/* === Example === */
var latest = new NairalandScraper();
/*
latest.getScrapedData({ limit: 10 }, function(err, topics) {
	console.log(topics);
	return topics;
});
*/

latest.getSERPScrapedData({ limit: 1, q: "fuel", board: 0 }, function(err, comments) {
	console.log(comments);
	return;
});