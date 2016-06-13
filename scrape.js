// Modules

var request = require('request')
	, cheerio = require('cheerio')
	;

/* 
* A scraper for Nairaland's front page
* lists the latest 20 topics
*/

var NairalandScraper = module.exports = function(options) {

	this._options = options || {};
	this.baseUrl = options.baseUrl || "http://nairaland.com";
}

NairalandScraper.prototype.getScrapedData = function(callback) {
	var self = this;

	this.getHtml(function(err, data) {
		if (err) { return callback(err, null) };
		self.extractMetadata(data, function(err, results) {
			if (err) { return callback(err, null) };
			return callback(null,results);
		})
	})
}

NairalandScraper.prototype.getHtml = function(callback) {
	var self = this;

	request(self.baseUrl, function(err, response, html) {
		if (err) { return callback(err, null) };
		if (response.statusCode !== 200) {
			var error = new Error(`Unexpected status code returned: ${response.statusCode}`)
			error.response = response
			return callback(error, null);
			console.log(error);
		}
		return callback(null, html);
	})
}

NairalandScraper.prototype.extractMetadata = function(html, callback) {
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
}

/* === Example === */
var options = {};
var latest = new NairalandScraper(options);
latest.getScrapedData(function(err, topics) {
	console.log(topics);
	return topics;
})

