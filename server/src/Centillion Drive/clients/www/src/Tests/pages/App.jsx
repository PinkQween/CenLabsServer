import React, { useState, useRef } from 'react';
function App() {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');
  const uploadBoxRef = useRef(null);
  const handleDragOver = (e) => {
    e.preventDefault();
    if (uploadBoxRef.current) {
      uploadBoxRef.current.style.borderColor = '#666';
    }
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    if (uploadBoxRef.current) {
      uploadBoxRef.current.style.borderColor = '#ccc';
    }
  };
  const handleDrop = (e) => {
    e.preventDefault();
    if (uploadBoxRef.current) {
      uploadBoxRef.current.style.borderColor = '#ccc';
    }
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(droppedFiles);
  };
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };
  const handleUpload = async () => {
    setMessage('');
    for (const item of files) {
      if (!item.size) {
        setMessage("Can't upload folders; create one instead.");
      }
      else {
        const uploadUrl = 'https://db.cendrive.com/user@example.com/upload'; // Replace with your actual server endpoint
        const formData = new FormData();
        formData.append('file', item);
        formData.append('isFolderZipped', 'false');
        try {
          const response = await fetch(uploadUrl, {
            method: 'POST',
            body: formData,
          });
          if (response.status === 200) {
            setMessage('Upload successful.');
          }
          else {
            setMessage('Upload failed.');
          }
        }
        catch (error) {
          console.error('Error during upload:', error);
          if (error.message) {
            console.error('Network error message:', error.message);
          }
          if (error.response) {
            // Access the response object for more details
            console.error('Network error response:', error.response);
          }
        }
      }
    }
  };
  return (React.createElement("div", { className: "App" },
    React.createElement("h1", null, "File and Folder Upload"),
    React.createElement("div", { id: "upload-box", ref: uploadBoxRef, onDragOver: handleDragOver, onDragLeave: handleDragLeave, onDrop: handleDrop },
      React.createElement("p", null, "Drag and drop a file here, or click to select one."),
      React.createElement("input", { type: "file", id: "file-input", onChange: handleFileChange })),
    React.createElement("div", { id: "output" }, message),
    React.createElement("button", { id: "upload-button", onClick: handleUpload }, "Upload")));
}
export default App;
