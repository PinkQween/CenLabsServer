// src/components/FileList.jsx
import React from 'react';

const FileList = ({ files, onDoubleClick }) => {
  if (files.length === 0) {
    return null; // Render nothing if there are no folders
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Files</h2>
      <ul>
        {files.map((file) => (
          <li key={file.name} className="mb-2">
            <div className="file" onClick={(e) => onDoubleClick(file, e)}>
              {file.name}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;
