const express = require('express');
var router = express.Router();
const multer = require('multer');
const { processInputFile } = require('./api/correct');
const fs = require('fs');
const app = express();
app.use(express.static('./views'));
const path = require('path');

let port = process.env.PORT || 3000;
//let domain = process.env.URL || 'https://format-files-bash-bigdata-e8j94co75-joelguty1234.vercel.app/';


let inputFilePath , outputFilePath, separator_character = '', num_columns = 0, originalname = '';
let isUploadActive = false; 
const inputdirectory = path.join(process.cwd(), '/tmp/uploads/');
const outputdirectory = path.join(process.cwd(), '/tmp/clean/');
const ejsdirectory = path.join(process.cwd(), '/views/upload.ejs');
const viewsdirectory = path.join(process.cwd(), '/views/');

console.log(inputdirectory)
console.log(outputdirectory)
console.log(ejsdirectory)


app.set('upload', viewsdirectory);  
app.set('view engine', 'ejs');  

if (!fs.existsSync(inputdirectory)) {
  fs.mkdirSync(inputdirectory, { recursive: true });
}
if (!fs.existsSync(outputdirectory)) {
  fs.mkdirSync(outputdirectory, { recursive: true });
}

var storage = multer.diskStorage({
  //destination: inputdirectory,
  destination: function (req, file, cb) {
    cb(null, inputdirectory)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

let upload = multer({ storage: storage });

app.get('/', (req, res) => {
  deleteFilesInDirectory(inputdirectory);
  deleteFilesInDirectory(outputdirectory);
  res.render(ejsdirectory, { showDownload: false });
  console.log("Inicio")
});

app.post('/api/upload', async (req, res, next) => {
  if (isUploadActive) {
    // If upload is already active, return an error response
    return res.status(400).send('Upload already in progress.');
  }

  isUploadActive = true; // Set the flag to indicate that upload is active

  try {
    upload.single('file')(req, res, async (err) => {
      if (err) {
        isUploadActive = false; // Reset the flag in case of an error
        return res.status(500).send('File upload failed.');
      }

      console.log(req.file);
      originalname = req.file.originalname;
      separator_character = req.body.separator_character;
      num_columns = parseInt(req.body.num_columns);
      await yourFunctionName();
      res.send('File uploaded successfully!');
      isUploadActive = false; // Reset the flag after upload 
    });
  } catch (error) {
    isUploadActive = false; // Reset the flag in case of an error
    console.error(error);
    res.status(500).send('An error occurred during file upload.');
  }

});

async function yourFunctionName() {
  console.log('Function called!');
  inputFilePath = path.join(inputdirectory, originalname);
  outputFilePath = path.join(outputdirectory, `clean_${originalname}`);
  await processInputFile(inputFilePath, outputFilePath, separator_character, num_columns);
  fs.unlink(inputFilePath, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`${inputFilePath} was deleted`);
  });
}


app.get('/download', (req, res) => {
  console.log("inicia descarga")
  try {
  const file = `${outputFilePath}`;
  res.download(file, (err) => {
    if (err) {
      console.error(err);
      console.log("error despues del post")
      return;
    }else { 
      console.log(`Download complete for file ${file}`);
      deleteFilesInDirectory(file)
  };
  });
  } catch (error) {
    console.log("error en dowload get")
  }
});


app.listen(process.env.PORT || 3000);

// app.listen(port, () => {
//   console.log(`Server started on http://localhost:${port}`);
// });

// app.listen(port, domain, () => {
//   console.log(`Server started on http://${domain}:${port}`);
// });

module.exports = app;


function deleteFilesInDirectory(directoryPath) {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }

    files.forEach((file) => {
      if (file !== 'data.py') {
        const filePath = path.join(directoryPath, file);
        fs.unlink(filePath, (error) => {
          if (error) {
            console.error('Error deleting file:', filePath);
          } else {
            console.log('Deleted file:', filePath);
          }
        });
      }
    });
  });
}

