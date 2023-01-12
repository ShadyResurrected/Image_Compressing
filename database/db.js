import sqlite3 from "sqlite3";
sqlite3.verbose();

let db;

const Connection = () => {
  db = new sqlite3.Database(":memory:", (err) => {
    if (err) {
      return console.log(err.message);
    }
    console.log("Connected to the in-memory SQlite database.");
  });

  // Create a new table for image compression requests
  db.run(`CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY,
    ip TEXT,
    timestamp TIMESTAMP,
    status TEXT,
    download_link TEXT
)`);

  // To show the tables
  db.serialize(function() {
    db.get("select name from sqlite_master where type='table'", function(
      err,
      table
    ) {
      console.log(table);
    });
  });
};

export { db, Connection };
