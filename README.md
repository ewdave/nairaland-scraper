# NairalandScraper

A nodejs module to extract topics(links) from [Nairaland's](http://nairaland.com) front page

# Example

```js
//var scraper = require('nairaland-scraper');

var options = {};

var latest = new NairalandScraper(options);
latest.getScrapedData(function(err, topics) {
	if (err) {console.log(err)}
	console.log(topics);
	//return topics;
});
```