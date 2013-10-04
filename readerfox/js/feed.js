function Feed(feed_title, feed_link, feed_url, pub_date, feed_object, feed_type) {
	this.feed_title = feed_title;
	this.feed_link = feed_link;
	this.feed_url = feed_url;
	this.pub_date = pub_date;
	this.feed_object = JSON.stringify(feed_object);
	this.feed_type = feed_type;
}

function FeedManager() {
	
}

FeedManager.prototype.persistFeedList = function(feedObject) {
	window.localStorage.setItem("feed_list", JSON.stringify(feedObject));
}

FeedManager.prototype.loadFeedList = function() {
	return JSON.parse(window.localStorage.getItem("feed_list"));
}

FeedManager.prototype.deleteFeedList = function() {
	window.localStorage.setItem("feed_list", null);
}