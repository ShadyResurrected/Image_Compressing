import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

// importing the database
import sqlite3 from "sqlite3";
const db = new sqlite3.Database("./image.db");

export const uploadImage = (req, res) => {
  console.log(req.file);
  res.json({ message: "Successfully uploaded files" });
};

export const compressImage = (req, res) => {
  // Get the file type and compression level from the request
  const fileType = req.file.mimetype.split("/")[1];
  const compressionLevel = parseInt(req.body.compressionLevel);
  let output;
  const fileName = Date.now() + "-" + req.file.originalname;
  // Asynchronously compress the image
  if (fileType === "jpeg" || fileType == "png") {
    output = sharp(req.file.path)
      .jpeg({ quality: compressionLevel, progressive: true })
      .toFile(`compressed/${fileName}`)
      .then((data) => {
        const compressedSize = data.size;
        const originalSize = req.file.size;
        const comPercent = (compressedSize / originalSize) * 100;

        // Generating the date when the image was compressed
        let obj = new Date();
        let time = obj.toISOString();

        // Get the IP address of the client
        const ip = req.ip;

        // Generate a unique download link
        const downloadLink = uuidv4();
        // Check if the IP address has exceeded the limit of 10 images per hour
        const sql =
          "SELECT COUNT(*) as count FROM images WHERE ip = ? AND timestamp >= ?";
        const oneHourAgo = new Date(time - 60 * 60 * 1000);
        db.get(sql, [ip, oneHourAgo], (err, row) => {
          if (err) {
            res.status(500).json({ status: "failed", message: err.message });
          } else {
            if (row.count >= 10) {
              res.status(429).json({
                status: "failed",
                message: "Too many requests, please try again later",
              });
            } else {
              // Create a new record in the database
              const sql =
                "INSERT INTO images (id,ip, fileName,timestamp, status, download_link) VALUES (NULL,?, ?,?, ?, ?)"; // Insert NULL to autoincrement id
              const values = [req.ip, fileName, time, "success", downloadLink];
              db.run(sql, values, (err) => {
                if (err) {
                  res.status(500).json({ status: "failed" });
                } else {
                  res.json({
                    status: "success",
                    downloadLink: downloadLink,
                    compressionPercent: comPercent,
                  });
                }
              });
            }
          }
        });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json(err.message);
      });
  }
};

export const downloadImage = (req, res) => {
  // Check if the image has been requested within the last 6 hours
  const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
  db.get(
    "SELECT * FROM images WHERE download_link = ? AND timestamp > ?",
    [req.params.link, sixHoursAgo],
    (err, image) => {
      if (err || !image) {
        res.status(404).send("Not found");
      } else {
        // Send the compressed image as a download
        res.download(`compressed/${image.fileName}`);
      }
    }
  );
};
