// src/components/DocumentModal.js
import React from "react";
import { Modal, Box, Typography, AppBar, Toolbar, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DocumentEditor } from "@onlyoffice/document-editor-react";
import { modalStyle } from "../styles/styles";

const DocumentModal = ({ isModalOpen, handleClose, docUrl, fileName, devUrl, fileKey }) => {
  const onDocumentReady = () => console.log("Document is loaded");
  const onLoadComponentError = (errorCode, errorDescription) => {
    console.error("Error loading component:", errorDescription);
  };

  return (
    <Modal open={isModalOpen} onClose={handleClose}>
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
                  key: fileKey, // Use the stored key from uploaded file
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
  );
};

export default DocumentModal;
