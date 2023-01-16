import multer from "multer";

// Configuration for file uploads
const storage = multer.diskStorage({});

const upload = multer({ storage: storage });

export default upload;
