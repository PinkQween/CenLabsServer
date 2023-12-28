import React, { useState, useRef } from 'react';

function App() {
    const [files, setFiles] = useState<File[]>([]);
    const [message, setMessage] = useState<string>('');
    const uploadBoxRef = useRef<HTMLDivElement | null>(null);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (uploadBoxRef.current) {
            uploadBoxRef.current.style.borderColor = '#666';
        }
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (uploadBoxRef.current) {
            uploadBoxRef.current.style.borderColor = '#ccc';
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (uploadBoxRef.current) {
            uploadBoxRef.current.style.borderColor = '#ccc';
        }

        const droppedFiles = Array.from(e.dataTransfer.files);
        setFiles(droppedFiles);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files as FileList);
        setFiles(selectedFiles);
    };

    const handleUpload = async () => {
        setMessage('');
        for (const item of files) {
            if (!item.size) {
                setMessage("Can't upload folders; create one instead.");
            } else {
                const uploadUrl = 'http://db.cendrive.com/user@example.com/upload'; // Replace with your actual server endpoint
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
                    } else {
                        setMessage('Upload failed.');
                    }
                } catch (error: any) {
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

    return (
        <div className="App">
            <h1>File and Folder Upload</h1>
            <div
                id="upload-box"
                ref={uploadBoxRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <p>Drag and drop a file here, or click to select one.</p>
                <input type="file" id="file-input" onChange={handleFileChange} />
            </div>
            <div id="output">{message}</div>
            <button id="upload-button" onClick={handleUpload}>
                Upload
            </button>
        </div>
    );
}

export default App;
