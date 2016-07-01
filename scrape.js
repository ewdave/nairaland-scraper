// Modules

var request = require('request')
	, cheerio = require('cheerio')
	;

/* 
* A scraper for Nairaland's front page
* lists the latest 20 topics
*
*
* TODO: extract from nairaland's SERP
*/

var NairalandScraper = module.exports = function(options) {

	this._options = options || {};
	this.baseUrl = options.baseUrl || "http://nairaland.com";
	this.serpURI = options.serpURI || this.baseUrl + '/search?q=buhari&board=20';

}

NairalandScraper.prototype.getScrapedData = function(callback) {
	var self = this;

	this.getHtml(function(err, data) {
		if (err) { return callback(err, null) };
		self.extractData(data, function(err, results) {
			if (err) { return callback(err, null) };
			return callback(null,results);
		});
	});
};

/*
* Method to extract data from nairaland's 
* SERP(Search Engine Results Page)
* 
*
*/

NairalandScraper.prototype.getSERPScrapedData = function(callback) {
	var self = this;

	this.getHtml(self.serpURI, function(error, data) {
		if (error) {
			return callback(error, null);
		};
		self.extractSERPData(data, function(error, results) {
			if (error) { return callback(error, null) };
			return callback(null, results);
		});
	});
};

NairalandScraper.prototype.getHtml = function(url, callback) {
	if (url == null) {
		url = this.baseUrl;
	}
	var self = this;

	request(url, function(err, response, html) {
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

NairalandScraper.prototype.extractSERPData = function (html, callback) {
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
}

NairalandScraper.prototype.extractData = function(html, callback) {
	var scraped_data = [];
	var $ = cheerio.load(html);
	var links = $('td.featured').children('a').slice(0,20);
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

