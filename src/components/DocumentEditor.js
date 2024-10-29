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
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { generateRandomKey } from "../utils/utils"; 

const OnlyOfficeEditor = ({ devUrl }) => {
  const [docUrl, setDocUrl] = useState(null);
  const [fileName, setFileName] = useState("");
  const [open, setOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [editorError, setEditorError] = useState(null); 

  useEffect(() => {
    // Load uploaded files from local storage
    const storedFiles = JSON.parse(localStorage.getItem("uploadedFiles")) || [];
    setUploadedFiles(storedFiles);
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      setLoading(true);

      fetch(`${devUrl}/upload`, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.url) {
            const updatedDocUrl = data.url.replace("http://localhost:3001", devUrl);
            const newFile = {
              url: updatedDocUrl,
              key: generateRandomKey(), // Generate a new key only for this upload
              name: file.name,
            };
            setDocUrl(updatedDocUrl);
            setFileName(file.name);
            handleOpen();

            // Update local storage and state with the new file info
            setUploadedFiles((prevFiles) => {
              const updatedFiles = [...prevFiles, newFile];
              localStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles));
              return updatedFiles;
            });
          }
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
          setEditorError("Error uploading file. Please try again."); 
        })
        .finally(() => {
          setLoading(false); 
        });
    }
  };

  const handleDocumentClick = (file) => {
    // Open existing document with its saved URL and key
    setDocUrl(file.url);
    setFileName(file.name);
    handleOpen();
  };

  const onLoadComponentError = (errorCode, errorDescription) => {
    console.error("Error loading component:", errorDescription);
    setEditorError(`Error loading document: ${errorDescription}`);
  };

  const onDocumentReady = () => {
    console.log("Document is loaded");
    setEditorError(null); 
  };

  const handleOpen = () => {
    setOpen(true);
    setEditorError(null); 
  };

  const handleClose = () => {
    setOpen(false);
    setDocUrl(null);
    setFileName("");
    setEditorError(null); 
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom style={{ textAlign: "center" }}>
        OnlyOffice Document Editor
      </Typography>
      <Input
        type="file"
        accept=".docx"
        onChange={handleFileChange}
        style={{ marginBottom: "20px", display: "block", width: "60%", margin: "0 auto" }}
      />
      
      {/* Loader for document upload */}
      {loading && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          zIndex: 9999,
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <CircularProgress />
        </div>
      )}

      <Typography variant="h6" gutterBottom style={{ textAlign: "center", margin: "20px 0" }}>
        Uploaded Documents
      </Typography>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {uploadedFiles.map((file, index) => (
          <li key={index} style={{ margin: "10px 0" }}>
            <Button onClick={() => handleDocumentClick(file)} style={{ textDecoration: 'underline' }}>
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
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            height: "80%",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
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
            {editorError && (
              <Typography variant="body1" color="error" style={{ textAlign: "center" }}>
                {editorError}
              </Typography>
            )}
            {docUrl && (
              <DocumentEditor
                id="docxEditor"
                documentServerUrl="http://localhost:8080"
                config={{
                  document: {
                    fileType: "docx",
                    key: uploadedFiles.find(file => file.url === docUrl)?.key || generateRandomKey(),
                    title: fileName,
                    url: docUrl,
                  },
                  documentType: "word",
                  editorConfig: {
                    callbackUrl: `${devUrl}/track`,
                    user: {
                      id: "user-1",
                      name: "Test User",
                    },
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

export default OnlyOfficeEditor;
