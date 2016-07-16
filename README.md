# NairalandScraper

A simple nodejs tool to extract topics(links) from [Nairaland's](http://nairaland.com) front page and comments relating to certain specified keywords from [Nairaland's](http://nairaland.com/search) SERP -- Search Engine Results Page.

### Installation

```
npm install nairaland-scraper
```

### Example

```js
var NLscraper = require('nairaland-scraper');


var latest = new NLScraper(options);

// you can pass in an optional object before the callback function to limit the number of scraped data. Defaults to 20.
latest.getScrapedData({ limit: 10 }, function(err, topics) {
	if (err) { console.log(err) };
	console.log(topics);
	return topics;
})
```

```javascript
var latest = new NLScraper(options);

To scrape data from Nairaland's SERP, make a call to the `getSERPScrapedData` method specifying an options object with a specific keyword and board (must be an `int`, e.g. 0). You can also add a limit params to the options object to limit the number of comments returned

var queryOptions = {
	"q": "fuel",
	"board": 0
	"limit": 20
}
latest.getSERPScrapedData(queryOptions, function(err, comments) {
	console.log(comments);
	return;
})
```

## License

[The MIT License](http://opensource.org/licenses/MIT)