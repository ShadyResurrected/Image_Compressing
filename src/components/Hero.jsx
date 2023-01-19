import React, { useState } from "react";
import axios from "axios";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const Hero = () => {
  const [image, setImage] = useState(null);
  const [downloadLink, setDownloadLink] = useState("");
  const [compressionLevel, setCompressionLevel] = useState(0);
  const [compressionPercent, setCompressionPercent] = useState("");
  const [status, setStatus] = useState("");

  const comURL = "http://localhost:3000/compress";
  const downURL = `http://localhost:3000/download/${downloadLink}`;

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  // Uploading the image to compress
  const CompressImage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);
    formData.append("compressionLevel", compressionLevel);
    try {
      const response = await axios({
        method: "post",
        url: comURL,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 200) {
        setCompressionPercent(response.data.compressionPercent);
        setStatus(response.data.status);
        setDownloadLink(response.data.downloadLink);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Donwloading the image to download
  const DownloadImage = async (e) => {
    e.preventDefault();
    try {
      const response = await axios({
        url: downURL,
        method: "GET",
        responseType: "blob", // important
      });
      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        const fileType = response.data.type.split("/").pop();
        link.setAttribute("download", `fileName.${fileType}`);
        document.body.appendChild(link);
        link.click();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Form className="container outer_div">
      <h1 className="text-center">Image Compression</h1>
      <Form.Group className="mb-3" controlId="image">
        <Form.Label>Upload images here</Form.Label>
        <Form.Control required type="file" onChange={handleImage} />
        <Form.Text className="text-muted">
          Image format must be png or jpg
        </Form.Text>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Compression Level</Form.Label>
        <Form.Control
          required
          type="text"
          placeholder="Enter the compression level"
          onChange={(e) => setCompressionLevel(e.target.value)}
        />
      </Form.Group>
      <Button variant="primary" className="me-2" onClick={CompressImage}>
        Compress Image
      </Button>
      <Button variant="primary" onClick={DownloadImage}>
        Download Image
      </Button>
    </Form>
  );
};

export default Hero;
