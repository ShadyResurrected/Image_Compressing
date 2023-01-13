import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

// importing the database
import sqlite3 from "sqlite3";
const db = new sqlite3.Database('./image.db');

export const uploadImage = (req, res) => {
  console.log(req.file);
  res.json({ message: "Successfully uploaded files" });
};

export const compressImage = (req, res) => {
  // Get the file type and compression level from the request
  const fileType = req.file.mimetype.split("/")[1];
  const compressionLevel = parseInt(req.body.compressionLevel);
  let output;
  // Asynchronously compress the image
  if (fileType === "jpeg") {
    output = sharp(req.file.path)
      .jpeg({ quality: compressionLevel, progressive: true })
      .toFile(`compressed/${req.file.originalname}`)
      .then((data) => {
        const compressedSize = data.size;
        const originalSize = req.file.size;
        const comPercent = (compressedSize / originalSize) * 100;
        // Generate a unique download link
        const downloadLink = uuidv4();
        // Create a new record in the database
        const sql =
          "INSERT INTO images (id,ip, timestamp, status, download_link) VALUES (NULL,?, ?, ?, ?)"; // Insert NULL to autoincrement id
        const values = [ req.ip, new Date(), "success", downloadLink];
        db.run(sql, values, (err) => {
          if (err) {
            res.status(500).json({ status: "failed", message: err.message });
          } else {
            res.json({
              status: "success",
              downloadLink: downloadLink,
              compressionPercent: comPercent,
            });
          }
        });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json(err.message);
      });
  }
};
