import React, { useState } from 'react';
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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    height: '80%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const OnlyOfficeEditor = () => {
    const [docUrl, setDocUrl] = useState(null);
    const [fileName, setFileName] = useState('');
    const [open, setOpen] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64data = reader.result;
                setDocUrl(base64data);
                setFileName(file.name);
                handleOpen();
            };
            reader.readAsDataURL(file);
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
        setFileName('');
    };

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>
                OnlyOffice Document Editor
            </Typography>
            <Input
                type="file"
                accept=".docx"
                onChange={handleFileChange}
                style={{ marginBottom: '20px' }}
            />
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
                    <div style={{ height: '80%', marginTop: '20px' }}>
                        {docUrl && (
                            <DocumentEditor
                                id="docxEditor"
                                documentServerUrl="http://localhost:8080"
                                config={{
                                    document: {
                                        fileType: "docx",
                                        key: "Khirz6zTPdfd7",
                                        title: fileName,
                                        url: docUrl,
                                    },
                                    documentType: "word",
                                    editorConfig: {
                                        callbackUrl: "http://localhost:3001/url-to-callback",
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
