// control external load. I assumed that the DOM load first then other resources.
var externals = {
	google : false,
	db : false
};

// load google
google.load("feeds", "1", {
	callback : googleLoaded
});

/**
 * Set google as loaded and try start app
 */
function googleLoaded() {
	console.log("Google API loaded.")
	externals.google = true;
	startApp();
}

/**
 * Set db as loaded and try start app
 */
function dbLoaded() {
	console.log("IndexedDB loaded.")
	externals.db = true;
	startApp();
}

/**
 * Start the app only if load resources
 */
function startApp() {
	for(var prop in externals) {
		if(!externals[prop]) {
			console.log("Wait " + prop + " resource")
			return false;
		}
	}
	listFeeds();
	showScreen("feeds");
}

/**
 * Alter the current screen 
 * @param  string screen The id of the 
 * @return {[type]}
 */
function showScreen(screen) {
	$("section[role='region']").each(function(i, item) {
		var id = $(item).attr("id");
		if(id == screen)
			$(item).show();
		else
			$(item).hide();
	});
}

// control the iframe size
fullSizeHeight();
$(window).resize(function() {
	fullSizeHeight();
});

/**
 * Set the size of the full-size element
 */
function fullSizeHeight() {
	var screenHeight = $(window).height();
	var headerHeight = $("#navigator > header").height();
	$(".full-size").height(screenHeight - headerHeight);
}


/**
 * List all feeds in the screen
 */
function listFeeds() {	
	$("#feeds-list").html("");
	
	listAllFeeds(function(err, feed) {
		addFeedItem(feed);
    });
}

/**
 * Add a feed resource in the feeds screen
 * @param Feed feed A feed object.
 */
function addFeedItem(feed) {
	var template = $('#feed').html();
    var html = Mustache.to_html(template, {
    	title : feed.title != "" ? feed.title : feed.link,
    	link : feed.link,
    });
    $("#feeds-list").append(html);

    // save the Feed object in the li element
    var elem = $("#feeds-list").find("li:last-child")[0];
    console.log(elem);
    $.data(elem, "feed", feed);
    console.log($.data(elem, "feed").title);
}

/**
 * @param  Feed feed A feed object
 * @return {[type]}
 */
function loadFeed(feed) {
	getFeed(feed, openFeed);

	// TODO put a loading screen
}

/**
 * Get a google.feeds.Feed in JSON format
 * @param Feed feed A feed object
 * @return {[type]}
 */
function getFeed(feedurl, callback) {
	console.log("Getting feed " + feedurl);
	
    var feed = new google.feeds.Feed(feedurl);
    feed.setResultFormat(google.feeds.Feed.JSON_FORMAT);
    feed.setNumEntries(10);
    feed.load(function(result) {
    	callback(result.feed)
    });
}

/**
 * Open the Feed resource screen
 * @param JSON feedJSON A JSON with the feed data 
 */
function openFeed(feedJSON) {
	setFeedTitle(feedJSON.title);
	setFeedList(feedJSON.entries);
	showScreen("feed-items");

	// TODO Pass to the events section don't work with jQuery.on
	$("#items a").click(function(e) {
		e.preventDefault();

		openNavigator($(this).attr("href"));
	});	
}

/**
 * Define the screen title.
 * @param string title The title
 */
function setFeedTitle(title) {
	$(".feed-title").text(title);
}

/**
 * Define the feed list.
 * @param JSON entries The entries items
 */
function setFeedList(entries) {
	$(entries).each(function(i, item) {
		addItem(item);
	});
}

/**
 * Add a new feed item to the list.
 * @param JSON item The item
 */
function addItem(item) {
	var template = $('#feed-item').html();
    var html = Mustache.to_html(template, {
    	title : item.title,
    	link : item.link
    });
    $("#items").append(html);
}

/**
 * Open a navigator screen.
 * @param  string href The url to open
 */
function openNavigator(url) {
	$("#navigator iframe").attr("src", url);
	showScreen("navigator");		
}

$(function() {
	$("#add-feed").click(function() {
		console.log("Adding a feed");

		// check if the input isn't empty and is url
		if($("#feed-url")[0].checkValidity()) {
			var feedURL = $("#feed-url").val();

			// load the feed
			getFeed(feedURL, function(feedJSON) {
				var feed = new Feed("feedURL")
				feed.title = feedJSON.title;

				// save the feed
				saveFeed(feed, function(err, id) {
					if(err == null) {
						feed.id = id;
					} else {
						alert("Error to insert feed.");
					}
				});
			});

			// clear the input
			$("#feed-url").val("");

			// list feeds
			listFeeds();

		} else {
			alert("Insert a valid URL.");
		}
	});

	$("#back-to-feeds").click(function() {
		console.log("Going to feeds screen");
		showScreen("feeds");
	});

	$("#back-to-feed-items").click(function() {
		console.log("Going to feed items screen");
		showScreen("feed-items");
	});

	
	$("#items").on("click", "a", function(e) {
		console.log("Openning the navigator screen");
		e.preventDefault();

		openNavigator($(this).attr("href"));
	});

	$("#feeds").on("click", ".feed-see", function(e) {
		console.log("Openning a feed resource");
		e.preventDefault();

		// get the Feed object
		var url = $(this).parents(".feed").find(".feed-link").text();

		//console.log("Load feed #" + feed.id);
		
		// open feed
		loadFeed(url);
	});

	$("#feeds").on("click", ".feed-delete", function(e) {
		console.log("Deleting a feed resource");
		e.preventDefault();

		// get the Feed object
		var elem = $(this).parents(".feed")[0];
		var feed = $.data($(this).parents(".feed")[0], "feed");
		
		// delete feed
		deleteFeed(feed, function(error, success) {
			if(error) {
				alert("Error to delete feed.");
			}

			// list feeds
			listFeeds();
		});
	});
});
