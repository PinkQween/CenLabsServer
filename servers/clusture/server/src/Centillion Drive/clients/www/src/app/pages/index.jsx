import React, { useEffect, useState, useLayoutEffect } from 'react';
import Header from '../components/Header';
import Card from '../components/Card';
import BackCard from '../components/BackCard'
import { Container, CardContainer, Aligner } from '../styles';
import Footer from '../../components/Footer';

const Index = () => {
  const [folderData, setFolderData] = useState([]);
  const [fileData, setFileData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userTimeZone, setUserTimeZone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [currentFolderPath, setCurrentFolderPath] = useState('/'); // Initial value is the root

  useLayoutEffect(() => {
    const fetchData = async () => {
      try {
        const email = 'user@example.com';

        const response = await fetch(`https://db.cendrive.com/${email}${currentFolderPath}`);
        console.log(response)
        const data = await response.json();
        console.log(data);

        const sortedFolders = sortItemsByLastModified(data.message.folderContents.filter(item => item.fileType === 'directory'));
        const sortedFiles = sortItemsByLastModified(data.message.folderContents.filter(item => item.fileType !== 'directory'));

        setFolderData(sortedFolders);
        setFileData(sortedFiles);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [currentFolderPath]); // Update when the currentFolderPath changes

  const sortItemsByLastModified = (items) => {
    return items.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
  };

  const handleCardClickFolder = (folder) => {
    setCurrentFolderPath(`${currentFolderPath}/${folder.folderName}`);
  };

  const handleCardClickFile = (name) => {
    // Handle navigation to the folder or file with the given name
    console.log(`Navigating to: ${name}`);
  };

  const handleGoBack = () => {
    // Remove the last segment from the current folder path to go back
    const segments = currentFolderPath.split('/');
    const newPath = segments.slice(0, -1).join('/');
    setCurrentFolderPath(newPath);
  };

  const formatDateTime = (dateTimeString) => {
    const options = { timeZone: userTimeZone, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return new Date(dateTimeString).toLocaleString(undefined, options);
  };

  return (
    <Container>
      <Header />
      <h2>Folders</h2>
      <Aligner>
        <CardContainer>
          {currentFolderPath !== '/' && ( // Render "Go Back" only if not at the root
            <BackCard onClick={handleGoBack} />
          )}
          {folderData.map((folder) => (
            <Card
              key={folder.folderName}
              name={folder.folderName}
              type={folder.fileType}
              lastModified={formatDateTime(folder.lastModified)}
              onClick={() => handleCardClickFolder(folder)}
            />
          ))}
        </CardContainer>
      </Aligner>

      <h2>Files</h2>

      <Aligner>
        <CardContainer>
          {fileData.map((file) => (
            <Card
              key={file.fileName}
              name={file.fileName}
              type={file.fileType}
              lastModified={formatDateTime(file.lastModified)}
              contents={file.fileContents}
              onClick={() => handleCardClickFile(file.fileName)}
            />
          ))}
        </CardContainer>
      </Aligner>
      <Footer />
    </Container>
  );
};

export default Index;
