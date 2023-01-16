import express from 'express'
import { compressImage, downloadImage, uploadImage } from '../Controller/imageController.js';
import upload from '../utils/upload.js';
const route = express.Router()

// Testing upload route
route.post('/upload', upload.single('image'), uploadImage)
// Image Compression route
route.post('/compress', upload.single('image'), compressImage)
// Image downloading route
route.get('/download/:link', downloadImage);

export default route;