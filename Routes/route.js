import express from 'express'
import { uploadImage } from '../Controller/imageController.js';
import upload from '../utils/upload.js';
const route = express.Router()

route.post('/upload', upload.single('image'), uploadImage)

export default route;