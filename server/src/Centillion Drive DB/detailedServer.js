const { exec } = require('child_process');
const shellQuote = require('shell-quote');
const fileUpload = require('express-fileupload');
const path = require('path');
const app = require('../index');
const cors = require('cors');
const express = require('express');
const fs = require('fs');
const serveIndex = require('serve-index');

app.use(fileUpload());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.get('/', (req, res) => {
//     res.redirect('https://cendrive.com')
// });


const blacklist = ['upload', 'delete', 'rename', 'unzip'];

// Rename a file
app.post('/:email/rename', (req, res) => {
    const email = req.params.email;
    const sourceFilePath = req.body.sourceFilePath; // Path to the file to rename and move
    const newFilePath = req.body.newFilePath; // New path for the file

    const userDirectory = path.join(rootDirectory, email);
    const sourceFile = path.join(userDirectory, sourceFilePath);
    const destinationFile = path.join(userDirectory, newFilePath);

    // Check if the source file exists
    if (!fs.existsSync(sourceFile)) {
        return res.status(404).send('Source file not found.');
    }

    // Check if the destination path is within the user's directory
    if (!destinationFile.startsWith(userDirectory)) {
        return res.status(403).send('Cannot move file outside the user\'s directory.');
    }

    // Ensure the directory for the destination file exists
    const destinationDirectory = path.dirname(destinationFile);
    if (!fs.existsSync(destinationDirectory)) {
        try {
            fs.mkdirSync(destinationDirectory, { recursive: true });
        } catch (err) {
            return res.status(500).send('Error creating destination directory: ' + err);
        }
    }

    fs.rename(sourceFile, destinationFile, (err) => {
        if (err) {
            return res.status(500).send('Error renaming and moving file: ' + err);
        }
        res.send('File renamed and moved successfully.');
    });
});

app.post('/:email/unzip', (req, res) => {
    const email = req.params.email;
    const filePath = req.body.filePath; // Path to the ZIP file to unzip

    const userDirectory = path.join(rootDirectory, email);
    const zipFilePath = path.join(userDirectory, filePath);
    const zipFileName = path.basename(filePath);

    if (!zipFilePath.startsWith(userDirectory)) {
        return res.status(403).send('Cannot unzip a file outside the user\'s directory.');
    }

    if (fs.existsSync(zipFilePath)) {
        const destinationFolder = path.join(userDirectory, zipFileName.replace('.zip', '')); // Extract to a folder with the same name as the ZIP file

        const escapedZipFilePath = shellQuote.quote([zipFilePath]);
        const escapedDestinationFolder = shellQuote.quote([destinationFolder]);

        exec(`unzip ${escapedZipFilePath} -d ${escapedDestinationFolder}`, (error, stdout, stderr) => {
            if (error) {
                return res.status(500).send("Error extracting ZIP file: " + error);
            }
            console.log(`Command output: ${stdout}`);

            // // Delete the ZIP file
            // fs.unlinkSync(zipFilePath);

            if (blacklist.includes(zipFileName) && path.dirname(filePath) === '.') {
                const renamedDestinationFolder = path.join(userDirectory, `[RENAMED] ${zipFileName.replace('.zip', '')}`);
                fs.renameSync(destinationFolder, renamedDestinationFolder);
            }

            res.send('ZIP file extracted successfully.');
        });
    } else {
        res.status(404).send('ZIP file not found.');
    }
});

// Delete a file or folder
app.post('/:email/delete', (req, res) => {
    const email = req.params.email;
    const filePath = req.body.filePath; // Path to the file or folder to delete

    const userDirectory = path.join(rootDirectory, email);
    const fileToDelete = path.join(userDirectory, filePath);

    if (!fileToDelete.startsWith(userDirectory)) {
        return res.status(403).send('Cannot delete file or folder outside the user\'s directory.');
    }

    if (fs.existsSync(fileToDelete)) {
        if (fs.lstatSync(fileToDelete).isDirectory()) {
            // If it's a directory, use recursive deletion
            deleteFolderRecursive(fileToDelete);
        } else {
            // If it's a file, delete it directly
            fs.unlinkSync(fileToDelete);
        }
        res.send('File or folder deleted successfully.');
    } else {
        res.status(404).send('File or folder not found.');
    }
});


// Function to recursively delete a folder and its contents
function deleteFolderRecursive(folderPath) {
    if (fs.existsSync(folderPath)) {
        fs.readdirSync(folderPath).forEach((file) => {
            const curPath = path.join(folderPath, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                // Recursive call for subdirectories
                deleteFolderRecursive(curPath);
            } else {
                // Delete files within the directory
                fs.unlinkSync(curPath);
            }
        });
        // Finally, delete the directory itself
        fs.rmdirSync(folderPath);
    }
}

app.post('/:email/upload', (req, res) => {
    try {
        const email = req.params.email;
        const isFolderZipped = req.body.isFolderZipped;

        console.log(req.files)

        const file = req.files.file;
        const uploadPath = path.join(__dirname, '../../db', email);

        if (!fs.existsSync(uploadPath)) {
            try {
                fs.mkdirSync(uploadPath);
            } catch (err) {
                console.error('Error creating upload directory:', err);
                return res.status(500).send('Error creating upload directory: ' + err);
            }
        }

        if (isFolderZipped != 'false') {
            const zipFilePath = path.join(uploadPath, file.name);

            file.mv(zipFilePath, (err) => {
                if (err) {
                    console.error('Error moving folder:', err);
                    return res.status(500).send('Error moving folder: ' + err);
                }

                console.log(`unzip ${zipFilePath} -d ${uploadPath}`)

                const escapedZipFilePath = shellQuote.quote([zipFilePath]);
                const escapedUploadDestination = shellQuote.quote([uploadPath]);

                // Unzip the folder
                exec(`unzip ${escapedZipFilePath} -d ${escapedUploadDestination}`, (error, stdout, stderr) => {
                    if (error) {
                        res.status(500).send("Error extracting zip: " + error)
                        return;
                    }
                    console.log(`Command output: ${stdout}`);

                    // Delete the zip file
                    fs.unlinkSync(zipFilePath);

                    res.send('Folder uploaded and extracted successfully.');
                });
            });
        } else {
            if (!blacklist.includes(file.name)) {
                file.mv(path.join(uploadPath, file.name), (err) => {
                    if (err) {
                        return res.status(500).send('Error moving file: ' + err);
                    }
                    res.send('File uploaded successfully.');
                });
            } else {
                file.mv(path.join(uploadPath, `[RENAMED] ${file.name}`), (err) => {
                    if (err) {
                        return res.status(500).send('Error moving file: ' + err);
                    }
                    res.send('File uploaded successfully.');
                });
            }
        }
    } catch (error) {
        console.log('Error processing file upload:', error);
        res.status(500).send('Internal Server Error');
    }
});

const rootDirectory = path.join(__dirname, '../../db');

app.use('/:email/*', (req, res, next) => {
    const email = req.params.email;
    const requestedPath = req.params[0].replace(/\/+$/, '');
    // const userDirectory = path.join(rootDirectory, email).replace(/ /g, "\\ ");
    // const requestedFileOrFolder = path.join(userDirectory, requestedPath).replace(/ /g, "\ ");
    const userDirectory = path.join(rootDirectory, email);
    const requestedFileOrFolder = path.join(userDirectory, requestedPath);

    console.log(requestedFileOrFolder)
    console.log(userDirectory)

    if (!requestedFileOrFolder.startsWith(userDirectory)) {
        return res.status(403).send('Cannot access files or folders outside the user\'s directory.');
    }

    if (fs.existsSync(requestedFileOrFolder)) {
        if (fs.lstatSync(requestedFileOrFolder).isDirectory()) {
            console.log("request was a dir")
            if (fs.existsSync(path.join(requestedFileOrFolder, 'index.html'))) {
                express.static(path.dirname(path.join(requestedFileOrFolder, 'index.html')))(req, res, next);
            } else {
                // Serve directory listing using serve-index middleware
                serveIndex(requestedFileOrFolder, { icons: true, index: 'index.html', hidden: true })(req, res, next);
            }
        } else {
            // Serve individual files using express.static middleware
            res.sendFile(requestedFileOrFolder);
        }
    } else {
        res.status(404).send('File or folder not found.');
    }
});

app.use('/:email', (req, res, next) => {
    const email = req.params.email;
    const userDirectory = path.join(rootDirectory, email);

    serveIndex(userDirectory, { icons: true, hidden: true })(req, res, next);
});