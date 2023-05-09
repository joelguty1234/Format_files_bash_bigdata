const express = require('express');
const multer = require('multer');
const { processInputFile } = require('./correct');
const fs = require('fs');
const app = express();


let inputFilePath , outputFilePath, separator_character = '', num_columns = 0, originalname = '';

app.use(express.static('views'));

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('upload', { showDownload: false });
});

app.post('/upload', upload.single('file'), async (req, res) => {
  originalname = req.file.originalname;
  separator_character = req.body.separator_character;
  num_columns = parseInt(req.body.num_columns);
  res.send('File uploaded successfully!');
  await yourFunctionName();
  //res.render('upload', { showDownload: true });
});

async function yourFunctionName() {
  console.log('Function called!');
  inputFilePath = `uploads/${originalname}`;
  outputFilePath = `clean/clean_${originalname}`;
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
  const file = `${outputFilePath}`;
  res.download(file); 
  console.log("se acabo")

  res.on('finish', function() {
    console.log(`Download complete for file ${file}`);
    fs.unlink(file, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(`${file} was deleted`);
    });
  });
});

app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
