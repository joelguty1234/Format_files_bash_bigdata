const express = require('express');
const multer = require('multer');
const { processInputFile } = require('./correct');
const fs = require('fs');
const app = express();
const path = require('path');

let port = process.env.PORT || 3000;

let inputFilePath , outputFilePath, separator_character = '', num_columns = 0, originalname = '';
app.use(express.static('views'));
const inputdirectory = path.join(process.cwd(), 'uploads');
const outputdirectory = path.join(process.cwd(), 'clean');
console.log(inputdirectory)
console.log(outputdirectory)

if (!fs.existsSync(inputdirectory)) {
  fs.mkdirSync(inputdirectory, { recursive: true });
}
if (!fs.existsSync(outputdirectory)) {
  fs.mkdirSync(outputdirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: inputdirectory,
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

app.set('view engine', 'ejs');  

app.get('/', (req, res) => {
  res.render('upload', { showDownload: false });
  console.log("Inicio")
});

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
  originalname = req.file.originalname;
  separator_character = req.body.separator_character;
  num_columns = parseInt(req.body.num_columns);
  await yourFunctionName();
  res.send('File uploaded successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred during file upload.');
  }
});

async function yourFunctionName() {
  console.log('Function called!');
  //inputFilePath = `./uploads/${originalname}`;
  inputFilePath = path.join(inputdirectory, originalname);
  outputFilePath = `./clean/clean_${originalname}`;
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
  const file = `${outputFilePath}`;
  res.download(file, (err) => {
    if (err) {
      console.error(err);
      return;
    }else { 
      console.log(`Download complete for file ${file}`);
      fs.unlink(file, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(`${file} was deleted`);
    })};
  });

});


app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});


