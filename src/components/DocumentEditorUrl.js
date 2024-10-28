
import React, { useState } from 'react';
import { DocumentEditor } from "@onlyoffice/document-editor-react";

const OnlyOfficeEditor = () => {
    const [docUrl, setDocUrl] = useState(null);
    const [fileName, setFileName] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                // Convert the file to a base64 string
                const base64data = reader.result;
                setDocUrl(base64data);
                setFileName(file.name);
            };
            reader.readAsDataURL(file); // Read the file as a data URL
        }
    };

    const onLoadComponentError = (errorCode, errorDescription) => {
        console.error("Error loading component:", errorDescription);
    };

    const onDocumentReady = (event) => {
        console.log("Document is loaded");
    };

    return (
        <div style={{
        height:'100vh'
        }}>
            <input type="file" accept=".docx" onChange={handleFileChange} />
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
    );
};

export default OnlyOfficeEditor;
