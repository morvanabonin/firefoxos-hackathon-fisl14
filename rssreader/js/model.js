// TODO option to clear the database

/**
 * The Feed estructure
 * 
 * @param title
 * @param link
 */
function Feed(link) {
	this.link = link;
    this.title = "";
}

/**
 * Persist a feed in the db
 * @param  Feed   feed The feed object
 * @param  function callback Callback after execution (error, success)
 */
function saveFeed(feed, callback) {
    console.log("Persisting a feed");
    
	var transaction = db.transaction(["rssreader", "rssreader"], "readwrite");
    
    transaction.oncomplete = function (event) {
        console.log("Feed saved");
    };

    transaction.onerror = function (event) {
        console.error("Error saving feed:", event);
        callback({
            error: event
        }, null);
    };

    var objectStore = transaction.objectStore("rssreader");

    var request = objectStore.put(feed);

    request.onsuccess = function (event) {
        console.log("Feed saved with id: " + request.result);
        callback(null, request.result);
    }
}

/**
 * Delete a feed
 * @param  Feed  feed The feed object
 * @param  function callback Callback after execution (error, success)
 */
function deleteFeed(feed, callback) {
    var transaction = db.transaction(["rssreader", "rssreader"], "readwrite");

    transaction.oncomplete = function (event) {
        console.log("Feed saved");
    };

    var store = transaction.objectStore("rssreader");


    var request = store.delete(feed.id);

    request.onsuccess = function(e) {
        callback(null, request);
    };

    request.onerror = function(e) {
        callback(e, null)
    };
}

function listAllFeeds(callback) {	
    var objectStore = db.transaction("rssreader").objectStore("rssreader");
    console.log("Listing feeds...");

    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            console.log("Found feed #" + cursor.value.title);
            callback(null, cursor.value);
            cursor.continue();
        }
    };
}