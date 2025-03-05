const fs = require('fs');
const path = require('path');

const deleteFolderRecursive = function(folderPath) {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const curPath = path.join(folderPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        try {
          fs.unlinkSync(curPath);
        } catch (err) {
          console.error(`Error deleting file ${curPath}:`, err);
        }
      }
    });
    try {
      fs.rmdirSync(folderPath);
    } catch (err) {
      console.error(`Error deleting folder ${folderPath}:`, err);
    }
  }
};

// Clean .next directory
const nextDir = path.join(__dirname, '.next');
console.log(`Trying to delete ${nextDir}...`);
try {
  deleteFolderRecursive(nextDir);
  console.log(`Successfully deleted ${nextDir}`);
} catch (error) {
  console.error(`Error while deleting ${nextDir}:`, error);
}

// Clean node_modules/.cache directory
const cacheDir = path.join(__dirname, 'node_modules', '.cache');
console.log(`Trying to delete ${cacheDir}...`);
try {
  if (fs.existsSync(cacheDir)) {
    deleteFolderRecursive(cacheDir);
    console.log(`Successfully deleted ${cacheDir}`);
  } else {
    console.log(`${cacheDir} doesn't exist, skipping`);
  }
} catch (error) {
  console.error(`Error while deleting ${cacheDir}:`, error);
}

console.log('Cleaning completed!');
