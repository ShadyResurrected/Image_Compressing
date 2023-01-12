export const uploadImage = (req,res) => {
    console.log(req.file);
    res.json({ message: "Successfully uploaded files" });
}