import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

// importing the database
import sqlite3 from "sqlite3";
const db = new sqlite3.Database("./image.db");

export const compressImage = (req, res) => {
  // Get the file type and compression level from the request
  const fileType = req.file.mimetype.split("/")[1];
  const compressionLevel = parseInt(req.body.compressionLevel);
  let output;
  const fileName = Date.now() + "-" + req.file.originalname;
  // Asynchronously compress the image
  // the image format allowed is only jpeg and png
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
        const timestamp = new Date();

        // Get the IP address of the client
        const ip = req.ip;

        // Generate a unique download link
        const downloadLink = uuidv4();

        // Check if the IP address has exceeded the limit of 10 images per hour
        const sql =
          "SELECT COUNT(*) as count FROM images WHERE ip = ? AND timestamp >= ?";
          const oneHourAgo = new Date(timestamp.getTime() - (60*60*1000));
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
                    imageName : fileName
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
  // Get the download link from the request
  const downloadLink = req.params.link;

  // Get the current timestamp
  const currentTimestamp = new Date();

  // Get the image data from the database
  const sql = "SELECT * FROM images WHERE download_link = ?";
  db.get(sql, [downloadLink], (err, row) => {
    if (err) {
      res.status(500).json({ status: "failed", message: err.message });
    } else {
      if (!row) {
        res.status(404).json({ status: "failed", message: "Link not found" });
      } else {
        // Check if the image is still available for download
        const sixHours = 6 * 60 * 60 * 1000;
        if (currentTimestamp - new Date(row.timestamp) > sixHours) {
          res.status(410).json({ status: "failed", message: "Link expired" });
        } else {
          // Serve the image file
          res.download(`compressed/${row.fileName}`);
        }
      }
    }
  });
};
