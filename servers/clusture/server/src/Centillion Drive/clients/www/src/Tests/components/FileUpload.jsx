// FileUpload.js
import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = ({ email }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('isFolderZipped', 'false');

      const response = await axios.post(`https://198.58.110.234:3002/${email}/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

      console.log(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default FileUpload;
