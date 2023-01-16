import sqlite3 from "sqlite3";
sqlite3.verbose();

let db;

const Connection = () => {
  db = new sqlite3.Database("./image.db", (err) => {
    if (err) {
      return console.log(err.message);
    }
    console.log("Connected to the in-memory SQlite database.");
  });

      // Create a new table for image compression requests
      db.run(`CREATE TABLE IF NOT EXISTS images (
        id INTEGER PRIMARY KEY,
        ip TEXT,
        fileName TEXT,
        timestamp TIMESTAMP,
        status TEXT,
        download_link TEXT
    )`);

  // To show the tables
  db.serialize(function() {


    db.all("SELECT * FROM images", (error, rows) => {
      console.log(rows);
    });
  });
};

export { db, Connection };
