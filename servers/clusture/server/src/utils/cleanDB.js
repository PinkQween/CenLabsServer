const path = require('path')
const fs = require('fs');
const dbDirectory = path.join(__dirname, '../../db');
const whitelist = ['backups', 'other'];

const DBAllowedToDelete = (file) => {
    if (validEmail(file) || whitelist.includes(file)) {
        return false
    } else {
        return true
    }
}

const validEmail = (email) => {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const deleteDirectory = (directoryPath) => {
    if (fs.existsSync(directoryPath)) {
        fs.readdirSync(directoryPath).forEach((file, index) => {
            const curPath = path.join(directoryPath, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                // Recursive call for directories
                deleteDirectory(curPath);
            } else {
                // Delete files
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(directoryPath);
    }
}

module.exports = () => {
    fs.readdir(dbDirectory, (err, files) => {
        if (err) {
            console.error('Error reading the db directory:', err);
            return;
        }

        files.forEach((file) => {
            const filePath = path.join(dbDirectory, file);

            // Check if the file/folder should be deleted
            if (DBAllowedToDelete(file)) {
                if (fs.lstatSync(filePath).isDirectory()) {
                    // Recursively delete directories
                    deleteDirectory(filePath);
                } else {
                    // Delete individual files
                    fs.unlinkSync(filePath);
                }
                console.log(`Deleted: ${file}`);
            }
        });
    });
}