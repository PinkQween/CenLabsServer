// src/components/FolderList.jsx
import React from 'react';

const FolderList = ({ folders, onDoubleClick }) => {
    if (folders.length === 0) {
        return null; // Render nothing if there are no folders
    }
    
    return (
        <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Folders</h2>
            <ul>
                {folders.map((folder) => (
                    <li key={folder.name} className="mb-2">
                        <div className="folder" onClick={(e) => onDoubleClick(folder, e)}>
                            {folder.name}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FolderList;
