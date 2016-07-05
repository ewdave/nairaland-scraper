# NairalandScraper

A simple nodejs tool to extract topics(links) from [Nairaland's](http://nairaland.com) front page and comments relating to certain specified keywords from [Nairaland's](http://nairaland.com/search) SERP -- Search Engine Results Page.

### Installation

```
npm install nairaland-scraper
```

### Example

```js
//var NLscraper = require('nairaland-scraper');

var options = {};

var latest = new NLScraper(options);

// you can pass in an optional string before the callback function to limit the number of scraped data. Defaults to 20.
latest.getScrapedData(25, function(err, topics) {
	if (err) {console.log(err)}
	console.log(topics);
	//return topics;
});
```

```javascript
var options = {};

var latest = new NLScraper(options);

// You should pass in a params object to `getSERPScrapedData` to specify a certain keyword to query the site's data. 
   `limit` is optional

var queryParams = {
	"q": "buhari",
	"limit": 20
}
latest.getSERPScrapedData(queryParams, function(err, comments) {
	console.log(comments);
	return;
})
```