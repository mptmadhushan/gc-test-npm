// src/components/OnlyOfficeEditor.js
import React, { useState, useEffect } from "react";
import { Button, Typography, Input } from "@mui/material";
import DocumentModal from "./DocumentModal";
import { generateRandomKey } from "../utils/utils";

const OnlyOfficeEditor = ({ devUrl }) => {
  const [docUrl, setDocUrl] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Load uploaded files from local storage on component mount
  useEffect(() => {
    const storedFiles = JSON.parse(localStorage.getItem("uploadedFiles")) || [];
    setUploadedFiles(storedFiles);
  }, []);

  // Handle file upload and persistence
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      fetch(`${devUrl}/upload`, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.url) {
            const updatedDocUrl = data.url.replace("http://localhost:3001", devUrl);
            const randomKey = generateRandomKey();
            setDocUrl(updatedDocUrl);
            setFileName(file.name);
            setIsModalOpen(true);

            // Save uploaded file with generated key
            const newFile = { url: updatedDocUrl, key: randomKey, name: file.name };
            setUploadedFiles((prevFiles) => {
              const updatedFiles = [...prevFiles, newFile];
              localStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles));
              return updatedFiles;
            });
          }
        })
        .catch((error) => console.error("Error uploading file:", error));
    }
  };

  // Handle document selection from the list
  const handleDocumentClick = (file) => {
    setDocUrl(file.url);
    setFileName(file.name);
    setIsModalOpen(true);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>OnlyOffice Document Editor</Typography>
      <Input
        type="file"
        accept=".docx"
        onChange={handleFileChange}
        style={{ marginBottom: "20px" }}
      />

      <Typography variant="h6" gutterBottom>Uploaded Documents</Typography>
      <ul>
        {uploadedFiles.map((file, index) => (
          <li key={index}>
            <Button onClick={() => handleDocumentClick(file)}>{file.name}</Button>
          </li>
        ))}
      </ul>

      {isModalOpen && (
        <DocumentModal
          isModalOpen={isModalOpen}
          handleClose={() => setIsModalOpen(false)}
          docUrl={docUrl}
          fileName={fileName}
          devUrl={devUrl}
          fileKey={uploadedFiles.find((file) => file.url === docUrl)?.key} // Use stored key
        />
      )}
    </div>
  );
};

export default OnlyOfficeEditor;
