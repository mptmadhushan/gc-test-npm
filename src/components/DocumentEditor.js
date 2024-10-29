import React, { useState, useEffect } from "react";
import { DocumentEditor } from "@onlyoffice/document-editor-react";
import {
  Button,
  Modal,
  Box,
  Typography,
  Input,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  height: "80%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const OnlyOfficeEditor = ({devUrl}) => {

console.log("🍺 - bebz - 🚀 ~ file: DocumentEditor.js:29 ~ OnlyOfficeEditor ~ devUrl:", devUrl)
//   const devUrl = 'https://0392-2402-4000-b190-4aac-ccf3-1888-4d96-28ba.ngrok-free.app';
  const [docUrl, setDocUrl] = useState(null);
  const [fileName, setFileName] = useState("");
  const [open, setOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]); // To store uploaded files

  useEffect(() => {
    // Load uploaded files from localStorage when the component mounts
    const storedFiles = JSON.parse(localStorage.getItem("uploadedFiles")) || [];
    setUploadedFiles(storedFiles);
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      // Upload file to the server
      fetch(`${devUrl}/upload`, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Uploaded file data:", data);
          if (data.url) {
            const updatedDocUrl = data.url.replace('http://localhost:3001', devUrl);
            const randomKey = generateRandomKey(); // Generate a random key for the uploaded file
            setDocUrl(updatedDocUrl);
            setFileName(file.name);
            handleOpen();

            // Add the uploaded file to the uploadedFiles array
            const newFile = { url: updatedDocUrl, key: randomKey, name: file.name };
            setUploadedFiles((prevFiles) => {
              const updatedFiles = [...prevFiles, newFile];
              // Store updated files in localStorage
              localStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles));
              return updatedFiles;
            });
          }
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
    }
  };

  const onLoadComponentError = (errorCode, errorDescription) => {
    console.error("Error loading component:", errorDescription);
  };

  const onDocumentReady = (event) => {
    console.log("Document is loaded");
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setDocUrl(null); // Reset the docUrl when closing
    setFileName("");
  };

  const handleDocumentClick = (file) => {
    setDocUrl(file.url);
    setFileName(file.name);
    handleOpen();
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        OnlyOffice Document Editor
      </Typography>
      <Input
        type="file"
        accept=".docx"
        onChange={handleFileChange}
        style={{ marginBottom: "20px" }}
      />

      {/* List of uploaded files */}
      <Typography variant="h6" gutterBottom>
        Uploaded Documents
      </Typography>
      <ul>
        {uploadedFiles.map((file, index) => (
          <li key={index}>
            <Button onClick={() => handleDocumentClick(file)}>
              {file.name}
            </Button>
          </li>
        ))}
      </ul>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={modalStyle}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Editing: {fileName}
              </Typography>
              <IconButton edge="end" color="inherit" onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <div style={{ height: "80%", marginTop: "20px" }}>
            {docUrl && (
              <DocumentEditor
                id="docxEditor"
                documentServerUrl="http://localhost:8080"
                config={{
                  document: {
                    fileType: "docx",
                    key: uploadedFiles.find(file => file.url === docUrl)?.key || generateRandomKey(), // Use old key if exists, otherwise generate new
                    title: fileName,
                    url: docUrl,
                  },
                  documentType: "word",
                  editorConfig: {
                    callbackUrl: `${devUrl}/url-to-callback`,
                  },
                }}
                events_onDocumentReady={onDocumentReady}
                onLoadComponentError={onLoadComponentError}
              />
            )}
          </div>
        </Box>
      </Modal>
    </div>
  );
};

// Function to generate a random key
const generateRandomKey = (length = 32) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._=';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result.substring(0, 128); // Ensure max length is 128
};

export default OnlyOfficeEditor;
