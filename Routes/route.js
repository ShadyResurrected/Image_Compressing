import express from 'express'
import { compressImage, downloadImage } from '../Controller/imageController.js';
import upload from '../utils/upload.js';
const route = express.Router()

// Image Compression route
route.post('/compress', upload.single('image'), compressImage)
// Image downloading route
route.get('/download/:link', downloadImage);

export default route;