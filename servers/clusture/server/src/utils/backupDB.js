const path = require('path');
const fs = require('fs');
const { readdirSync, statSync } = fs;

const sourceDirectory = path.join(__dirname, '../../db');
const backupBaseDirectory = path.join(__dirname, '../../backups');

function backupDatabase() {
    try {
        if (!fs.existsSync(backupBaseDirectory)) {
            fs.mkdirSync(backupBaseDirectory);
        }

        const denverTime = getDenverTimestamp();
        const backupDirectory = path.join(backupBaseDirectory, denverTime);
        fs.mkdirSync(backupDirectory);

        const dbContents = readdirSync(sourceDirectory);
        for (const item of dbContents) {
            const itemPath = path.join(sourceDirectory, item);
            if (isValidEmailDirectory(itemPath) && statSync(itemPath).isDirectory()) {
                const userEmail = item;
                const userBackupDirectory = path.join(backupDirectory, userEmail);
                fs.mkdirSync(userBackupDirectory);
                copyUserFiles(itemPath, userBackupDirectory);
            }
        }

        console.log(`Backup created at ${backupDirectory}`);
    } catch (error) {
        console.error(`Error creating backup: ${error.message}`);
    }
}

function isValidEmailDirectory(directoryPath) {
    // You can add your own validation logic here to determine if the directory is a valid email directory.
    // For example, you can check if it contains valid email addresses.
    return true; // Modify this as per your validation requirements.
}

function copyUserFiles(sourceDir, destinationDir) {
    const userFiles = readdirSync(sourceDir);
    for (const file of userFiles) {
        const sourceFilePath = path.join(sourceDir, file);
        const destinationFilePath = path.join(destinationDir, file);
        fs.copyFileSync(sourceFilePath, destinationFilePath);
    }
}

function getDenverTimestamp() {
    const denverTimezoneOffset = -6 * 60; // Denver time offset is UTC-6
    const now = new Date();
    const denverTime = new Date(now.getTime() + denverTimezoneOffset * 60000);
    return denverTime.toISOString().replace(/[-T:]/g, '_').split('.')[0];
}

module.exports = backupDatabase;
