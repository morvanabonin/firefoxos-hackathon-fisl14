const dbName = "rssreader";
const dbVersion = 1;

var db;
var request = indexedDB.open(dbName, dbVersion);

request.onerror = function(event) {
    console.error("Can't open indexedDB!!!", event);
};
request.onsuccess = function(event) {
    console.log("DB Loaded");
    db = event.target.result;
    dbLoaded();
};

request.onupgradeneeded = function (event) {

    console.log("Upgrading DB");

    db = event.target.result;

    if (!db.objectStoreNames.contains(dbName)) {

        console.log("Creating objectStore for " + dbName);

        var objectStore = db.createObjectStore(dbName, {
            keyPath: "id",
            autoIncrement: true
        });
        objectStore.createIndex("link", "link", {
            unique: true
        });
        objectStore.createIndex("title", "title", {
            unique: false
        });
    }
}