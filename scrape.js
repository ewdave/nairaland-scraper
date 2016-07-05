// Modules

var request = require('request')
	, cheerio = require('cheerio')
	;


var NairalandScraper = module.exports = function(options) {

	this._options = options || {};
	this.baseUrl = options.baseURI || "http://nairaland.com";
	this.serpURI = options.serpURI || this.baseURI + '/search';

}

NairalandScraper.prototype.getScrapedData = function(limit, callback) {
	var self = this;

	this.getHtml(self.baseURI, function(err, data) {
		if (err) { return callback(err, null) };
		self.extractData(data, limit, function(err, results) {
			if (err) { return callback(err, null) };
			return callback(null,results);
		});
	});
};

/*
* Method to extract data from nairaland's 
* SERP(Search Engine Results Page)
*/

NairalandScraper.prototype.getSERPScrapedData = function(params, callback) {
	var self = this;
	var limit;
	var params = params || {};
	if ("limit" in params) {
		limit = params["limit"];
	}

	this.getHtml(self.serpURI, params, function(error, data) {
		if (error) {
			return callback(error, null);
		};
		self.extractSERPData(data, limit, function(error, results) {
			if (error) { return callback(error, null) };
			return callback(null, results);
		});
	});
};

NairalandScraper.prototype.getHtml = function(url, params, callback) {
	var self = this;

	if (url == null) {
		url = this.baseUrl;
	}
	var params = params || {};

	request({
		url: url,
		qs: params
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

NairalandScraper.prototype.extractSERPData = function (html, limit, callback) {
	if (limit == null) {
		limit = 50;
	};
	var parsedResult = [];
		$ = cheerio.load(html);
		$('div.narrow').slice(0,limit).each(function(i, el) {
			var comment = $(this).text();
			var metadata = {
				comment: comment
			}
			parsedResult.push(metadata);
			console.log(metadata);
		});
}

NairalandScraper.prototype.extractData = function(html, limit, callback) {
	if (limit == null) {
		limit = 20;
	};
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

/* === Example === */
var options = {};
var latest = new NairalandScraper(options);
/*latest.getScrapedData(function(err, topics) {
	console.log(topics);
	return topics;
});
*/
latest.getSERPScrapedData(function(err, comments) {
	console.log(comments);
	return;
})

