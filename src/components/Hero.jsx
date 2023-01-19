import React, { useState } from "react";
import axios from "axios";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";

import {AiFillGithub} from 'react-icons/ai'

import "../index.css";

const Hero = () => {
  const [image, setImage] = useState(null);

  const [downloadLinkUser, setDownloadLinkUser] = useState("");
  const [downloadLink, setDownloadLink] = useState("");

  const [compressionLevel, setCompressionLevel] = useState(0);
  const [compressionPercent, setCompressionPercent] = useState("");

  const [message, setMessage] = useState("");

  const [status, setStatus] = useState("");

  const comURL = `${import.meta.env.VITE_BASE_URL}/compress`;

  const downURL = `${import.meta.env.VITE_BASE_URL}/download/${downloadLinkUser}`;

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
        setMessage("Image compressed successfully");
      }
    } catch (error) {
      setStatus(error.response.data.status);
      setMessage(error.response.data.message);
      setCompressionPercent("");
      setDownloadLink("");
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
      setStatus(error.response.data.status);
      setMessage(error.response.data.message);
      setCompressionPercent("");
      setDownloadLink("");
      console.log(error);
    }
  };
  return (
    <Form className="container outer_div my-4">
      <h1 className="text-center">Image Compression</h1>
      <Form.Group className="mb-3" controlId="image">
        <Form.Label>Upload images here</Form.Label>
        <Form.Control required type="file" onChange={handleImage} />
        <Form.Text className="text-muted">
          Image format must be png or jpg
        </Form.Text>
      </Form.Group>

      <div className="seperate_boxes">
        <Form.Group className="mb-3 me-3">
          <Form.Label>Compression Level</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter the value between 1 and 100"
            onChange={(e) => setCompressionLevel(e.target.value)}
            style={{ width: "20rem" }}
          />
          <Button variant="primary" className="mt-2" onClick={CompressImage}>
            Compress Image
          </Button>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Download Image</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter the download link"
            onChange={(e) => setDownloadLinkUser(e.target.value)}
            style={{ width: "20rem" }}
          />
          <Button variant="primary" onClick={DownloadImage} className="mt-2">
            Download Image
          </Button>
        </Form.Group>
      </div>

      <Card
        style={{ width: "50%", marginTop: "2rem", height: "15rem" }}
        className="container"
      >
        <Card.Body>
          <Card.Title className="text-center">Details</Card.Title>
          <Card.Text className="mt-3">
            Compression Percent :{" "}
            {compressionPercent === "" ? "none" : compressionPercent}
            <br />
            Status : {status === "" ? "none" : status}
            <br />
            Download Link : {downloadLink === "" ? "none" : downloadLink}
            <br />
            Message : {message === "" ? "none" : message}
            <br />
            <AiFillGithub className="github_icon" onClick={() => {window.location.href = 'https://github.com/ShadyResurrected/Image_Compressing'}} target="_blank"/>
          </Card.Text>
        </Card.Body>
      </Card>
    </Form>
  );
};

export default Hero;
