// src/App.jsx
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import FileList from '../components/FileList';
import FolderList from '../components/FolderList';
import structureData from '../structure.json';
import Modal from 'react-modal'
import TextViewer from '../components/TextViewer';

const App = () => {
  const [data, setData] = useState(null);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [selectedFile, setSelectedFile] = useState({});

  useEffect(() => {
    setData(structureData);
  }, []);

  useEffect(() => {
    console.log(currentFolder);
  }, [currentFolder]);

  const handleItemDoubleClick = (item, e) => {
    if (e.detail >= 2) {
      if (item.type === 'folder') {
        setCurrentFolder(item);
      } else if (item.type === 'file') {
        openFileModal(item);
      } else {
        console.log(item)
      }
    }
  };

  const handleBackClick = () => {
    setCurrentFolder(null);
  };

  const openFileModal = async (file) => {
    let fileType = getFileType(file.path);

    console.log(fileType)

    // Dynamically import the file based on the path
    try {
      // const moduleImported = await import(`/src${getFilePathWithoutExtension(file.path).slice(1)}.png`);

      setSelectedFile({ ...file });
    } catch (error) {
      console.error("Error importing:", error);
    }
  };

  function getFilePathWithoutExtension(filePath) {
    const parts = filePath.split('.');
    const fileNameWithoutExtension = parts.slice(0, -1).join('.');
    return fileNameWithoutExtension;
  }

  useEffect(() => {
    console.log("File:", selectedFile);
  }, [selectedFile]);

  const closeFileModal = () => {
    setSelectedFile({});
  };

  const getFileType = (path) => {
    const extension = path.split('.').pop();
    switch (extension.toLowerCase()) {
      case 'txt':
        return 'text';
      case 'mp3':
        return 'audio';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 'image';
      default:
        return 'unknown';
    }
  };


  return (
    <div>
      <Header />
      <div className="flex-col">
        {data && (
          <>
            {currentFolder && (
              <button className="back-button w-full" onClick={handleBackClick}>
                Back
              </button>
            )}
            {data.folders.length > 0 && (
              <FolderList
                folders={currentFolder ? currentFolder.items.filter((item) => item.type === 'folder') : data.folders}
                onDoubleClick={handleItemDoubleClick}
              />
            )}
            {data.folders.length > 0 && (
              <FileList
                files={currentFolder ? currentFolder.items.filter((item) => item.type === 'file') : []}
                onDoubleClick={handleItemDoubleClick}
              />
            )}


            <Modal
              isOpen={Object.keys(selectedFile).length > 0}
              onRequestClose={closeFileModal}
              contentLabel="File Viewer"
              className="file-modal"
              ariaHideApp={false}
            >
              {selectedFile.path && (
                <div>
                  {/* <h2>{selectedFile.name}</h2> */}
                  {console.log(getFileType(selectedFile.path))}
                  {console.log("/" + selectedFile.path)}
                  {getFileType(selectedFile.path) === 'audio' && <audio src={"/" + selectedFile.path} controls autoPlay />}
                  {getFileType(selectedFile.path) === 'image' && <img src={"/" + selectedFile.path} alt={selectedFile.name} />}
                  {getFileType(selectedFile.path) === 'text' && (
                    <TextViewer path={"/" + selectedFile.path} />
                  )}
                </div>
              )}
            </Modal>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
