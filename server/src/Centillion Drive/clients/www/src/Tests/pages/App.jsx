// App.js
import React from 'react';
import FileUpload from '../components/FileUpload';

function App() {
  const email = 'user@example.com'; // Replace with the actual email

  return (
    <div className="App">
      <h1>File Upload App</h1>
      <FileUpload email={email} />
    </div>
  );
}

export default App;
