const { exec } = require('child_process');
const shellQuote = require('shell-quote');
const fileUpload = require('express-fileupload');
const path = require('path');
const app = require('../index');
const cors = require('cors');
const express = require('express');
const fs = require('fs');
const serveIndex = require('serve-index');
let ExifParser = require("fix-esm").require('exif-parser');
let fileType = require("fix-esm").require('file-type');

// let exifParser = undefined;
// let fileType = undefined;

// const importOthers = async () => {
//     const exifParserModule = await import('exif-parser');
//     const fileTypeModule = await import('file-type');

//     exifParser = exifParserModule.default;
//     fileType = fileTypeModule.default;
// };

// importOthers();

module.exports = {
    setupRoutes: (app) => {
        app.use(cors());
        app.use(fileUpload());
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        // app.get('/', (req, res) => {
        //     res.redirect('https://cendrive.com')
        // });


        const blacklist = ['upload', 'delete', 'rename', 'unzip', 'zip', 'search'];

        // Zip a folder
        app.post('/:email/zip', (req, res) => {
            const email = req.params.email;
            const folderPath = req.body.folderPath; // Path to the folder to zip

            const userDirectory = path.join(rootDirectory, email);
            const folderToZip = path.join(userDirectory, folderPath);

            if (!folderToZip.startsWith(userDirectory)) {
                return res.status(403).send('Cannot zip a folder outside the user\'s directory.');
            }

            if (fs.existsSync(folderToZip) && fs.lstatSync(folderToZip).isDirectory()) {
                let zipFileName = `${path.basename(folderPath)}.zip`;
                let zipFilePath = path.join(userDirectory, zipFileName);

                // Check if a zip file with the same name already exists
                let counter = 1;
                while (fs.existsSync(zipFilePath)) {
                    zipFileName = `[RENAMED] ${path.basename(zipFilePath)}`;
                    zipFilePath = path.join(userDirectory, zipFileName);
                    counter++;
                }

                const escapedFolderToZip = shellQuote.quote([folderToZip]);
                const escapedZipFilePath = shellQuote.quote([zipFilePath]);

                exec(`zip -r ${escapedZipFilePath} ${escapedFolderToZip}`, (error, stdout, stderr) => {
                    if (error) {
                        return res.status(500).send("Error creating ZIP file: " + error);
                    }
                    console.log(`Command output: ${stdout}`);

                    res.send('Folder zipped successfully.');
                });
            } else {
                res.status(404).send('Folder not found or invalid for zipping.');
            }
        });



        // Rename a file
        app.post('/:email/rename', (req, res) => {
            console.log(`New Body: ${JSON.stringify(req.body)}`)
            const email = req.params.email;
            const sourceFilePath = req.body.sourceFilePath; // Path to the file to rename and move
            const newFilePath = req.body.newFilePath; // New path for the file

            const userDirectory = path.join(rootDirectory, email);
            const sourceFile = path.join(userDirectory, sourceFilePath);
            const destinationFile = path.join(userDirectory, newFilePath);

            // Check if the source file exists
            if (!fs.existsSync(sourceFile)) {
                return res.status(404).send({ success: false, message: 'Source file not found.' });
            }

            // Check if the destination path is within the user's directory
            if (!destinationFile.startsWith(userDirectory)) {
                return res.status(403).send({ success: false, message: 'Cannot move file outside the user\'s directory.' });
            }

            // Ensure the directory for the destination file exists
            const destinationDirectory = path.dirname(destinationFile);
            if (!fs.existsSync(destinationDirectory)) {
                try {
                    fs.mkdirSync(destinationDirectory, { recursive: true });
                } catch (err) {
                    return res.status(500).send({ success: false, message: 'Error creating destination directory: ' + err });
                }
            }

            fs.rename(sourceFile, destinationFile, (err) => {
                if (err) {
                    console.log(err)
                    return res.status(500).send({ success: false, message: 'Error renaming and moving file: ' + err });
                }
                res.send({ success: true, message: 'File renamed and moved successfully.' });
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
                console.log("uploading")
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

        async function getFolderDetails(folderPath) {
            try {
                const files = fs.readdirSync(folderPath);
                const folderDetails = [];

                try {
                    for (const file of files) {
                        const fileDetails = await getFileDetails(path.join(folderPath, file));
                        folderDetails.push(fileDetails);
                    }
                } catch (err) {
                    console.log(err)
                }

                const folderStats = fs.statSync(folderPath);

                return {
                    folderName: path.basename(folderPath),
                    fileType: 'directory',
                    folderContents: folderDetails,
                    totalFiles: folderDetails.length,
                    totalSize: folderDetails.reduce((acc, file) => acc + file.fileSize, 0),
                    lastModified: folderStats?.mtime,
                };
            } catch (error) {
                throw new Error(`Error reading folder: ${error.message}`);
            }
        }

        async function getFileDetails(filePath) {
            try {
                const stats = fs.statSync(filePath);

                if (stats.isDirectory()) {
                    // If it's a directory, use the new function to get folder details
                    return getFolderDetails(filePath);
                } else {
                    // If it's a file, proceed with the existing logic
                    const fileBuffer = fs.readFileSync(filePath);
                    const fileTypeResult = await fileType.fileTypeFromBuffer(fileBuffer);

                    if (fileTypeResult && fileTypeResult.mime.startsWith('image') && fileTypeResult.ext === 'jpg') {
                        // Only attempt to parse Exif data for JPEG images
                        const exifParser = ExifParser.create(fileBuffer);
                        const exifData = exifParser.parse();

                        console.log(fs.statSync(filePath))

                        const fileDetails = {
                            fileName: path.basename(filePath),
                            fileSize: fileBuffer.length,
                            fileType: fileTypeResult ? fileTypeResult.mime : 'unknown',
                            fileContents: fileBuffer.toString('base64'),
                            metadata: exifData.tags,
                            lastModified: fs.statSync(filePath).mtime,
                        };

                        return fileDetails;
                    } else {
                        // For non-JPEG or invalid JPEG files, provide basic details
                        return {
                            fileName: path.basename(filePath),
                            fileSize: fileBuffer.length,
                            fileType: fileTypeResult ? fileTypeResult.mime : 'unknown',
                            fileContents: fileBuffer.toString('base64'),
                            lastModified: fs.statSync(filePath).mtime,
                        };
                    }
                }
            } catch (error) {
                throw new Error(`Error reading file/folder: ${error.message}`);
            }
        }

        // Search paths with advanced criteria
        app.post('/:email/search', (req, res) => {
            const email = req.params.email;
            const searchCriteria = req.body.searchCriteria; // Advanced search criteria object

            const userDirectory = path.join(rootDirectory, email);

            const searchResults = searchPaths(userDirectory, searchCriteria);

            if (searchResults.length > 0) {
                res.send({ success: true, message: searchResults });
            } else {
                res.status(404).send({ success: false, message: 'No matching files or folders found.' });
            }
        });

        // Function to check if a file/folder matches the search criteria
        async function matchesSearchCriteria(filePath, searchCriteria) {
            const stats = fs.statSync(filePath);

            // Check file name if provided
            if (searchCriteria.fileName && !filePath.includes(searchCriteria.fileName)) {
                return false;
            }

            // Check file type (based on mime type) if provided
            if (searchCriteria.fileType) {
                const fileTypeResult = await getFileType(filePath);
                console.log(fileTypeResult)
                if (!fileTypeResult || !fileTypeResult.mime.startsWith(searchCriteria.fileType)) {
                    return false;
                }
            }

            // Add more advanced criteria checks here...

            return true;
        }

        // Function to search for paths with advanced criteria
        function searchPaths(directory, searchCriteria) {
            const results = [];

            function searchRecursively(currentPath, parentFolder = null) {
                const files = fs.readdirSync(currentPath);

                for (const file of files) {
                    const filePath = path.join(currentPath, file);

                    // Check if the file/folder matches the search criteria
                    if (matchesSearchCriteria(filePath, searchCriteria)) {
                        const resultObject = {
                            path: filePath,
                            parentFolder: parentFolder,
                        };
                        results.push(resultObject);
                    }

                    // Recursively search within directories
                    if (fs.lstatSync(filePath).isDirectory()) {
                        searchRecursively(filePath, path.basename(filePath));
                    }
                }
            }

            searchRecursively(directory);
            return results;
        }

        // Function to get file type (mime type) using the 'file-type' library
        async function getFileType(filePath) {
            try {
                const fileBuffer = fs.readFileSync(filePath);
                console.log(await fileType.fileTypeFromBuffer(fileBuffer))
                return await fileType.fileTypeFromBuffer(fileBuffer);
            } catch (error) {
                console.error(`Error getting file type for ${filePath}: ${error.message}`);
                return null;
            }
        }

        app.use('/:email/*', (req, res) => {
            console.log("Found route")

            const email = req.params.email;
            const requestedPath = req.params[0].replace(/\/+$/, '');
            const userDirectory = path.join(rootDirectory, email);
            const requestedFileOrFolder = path.join(userDirectory, requestedPath);

            console.log(requestedFileOrFolder)
            console.log(userDirectory)

            if (!requestedFileOrFolder.startsWith(userDirectory)) {
                return res.status(403).send('Cannot access files or folders outside the user\'s directory.');
            }

            if (fs.existsSync(requestedFileOrFolder)) {
                if (fs.lstatSync(requestedFileOrFolder).isDirectory()) {
                    getFolderDetails(requestedFileOrFolder).then((results) => {
                        res.send({ success: true, message: results });
                    }).catch((err) => {
                        res.status(500).send({ success: false, message: err });
                    });
                } else {
                    // file code
                    console.log(` file: ${requestedFileOrFolder}`)
                    getFileDetails(requestedFileOrFolder).then((results) => {
                        console.log(results)
                        res.send({ success: true, message: results });
                    }).catch((err) => {
                        res.status(500).send({ success: false, message: err });
                    })
                }
            } else {
                res.status(404).send({ success: false, message: 'File or folder not found.' });
            }
        });

        app.use('/:email', (req, res) => {
            const email = req.params.email;
            const userDirectory = path.join(rootDirectory, email);

            console.time('getFolderDetails');

            if (fs.existsSync(userDirectory)) {
                getFolderDetails(userDirectory).then((folderDetails) => {
                    console.timeEnd('getFolderDetails'); // End the timer
                    res.send({ success: true, message: folderDetails });
                })
                    .catch((err) => {
                        res.status(500).send({ success: true, message: err });
                    });
            } else {
                res.status(404).send({ success: false, message: 'File or folder not found.' });
            }
        });
    }
}