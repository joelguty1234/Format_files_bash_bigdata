const express = require('express');
const multer = require('multer');
const { processInputFile } = require('./correct');
const fs = require('fs');
const app = express();
const path = require('path');

let port = process.env.PORT || 3000;

let inputFilePath , outputFilePath, separator_character = '', num_columns = 0, originalname = '';
app.use(express.static('./views'));
// const inputdirectory = path.join(process.cwd(), '/tmp/uploads/');
// const outputdirectory = path.join(process.cwd(), '/tmp/clean/');
const inputdirectory = process.env.INPUT_DIR || path.join(process.cwd(), '/tmp/uploads/');
const outputdirectory = process.env.OUTPUT_DIR || path.join(process.cwd(), '/tmp/clean/');
 
// const inputdirectory = './tmp/uploads/';
// const outputdirectory = './tmp/clean/';
const kaka = path.join(process.cwd(), '/views/upload.ejs');
console.log(inputdirectory)
console.log(outputdirectory)
console.log(kaka)
app.set('view engine', 'ejs');  
// if (!fs.existsSync(inputdirectory)) {
//   fs.mkdirSync(inputdirectory, { recursive: true });
// }
// if (!fs.existsSync(outputdirectory)) {
//   fs.mkdirSync(outputdirectory, { recursive: true });
// }

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
  res.render(kaka, { showDownload: false });
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
  //inputFilePath = `./tmp/uploads/${originalname}`;
  inputFilePath = path.join(inputdirectory, originalname);
  //outputFilePath = `./tmp/clean/clean_${originalname}`;
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


