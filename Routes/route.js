import express from 'express'
import { compressImage, uploadImage } from '../Controller/imageController.js';
import upload from '../utils/upload.js';
const route = express.Router()

route.post('/upload', upload.single('image'), uploadImage)
route.post('/compress', upload.single('image'), compressImage)

export default route;