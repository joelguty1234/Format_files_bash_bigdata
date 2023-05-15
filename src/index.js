const express = require('express');
var router = express.Router();
const multer = require('multer');
const { processInputFile } = require('../api/correct');
const fs = require('fs');
const app = express();
app.use(express.static('./views'));
const path = require('path');

let port = process.env.PORT || 3000;
//let domain = process.env.URL || 'https://format-files-bash-bigdata-e8j94co75-joelguty1234.vercel.app/';


let inputFilePath , outputFilePath, separator_character = '', num_columns = 0, originalname = '';

const inputdirectory = path.join(process.cwd(), '/tmp/uploads/');
const outputdirectory = path.join(process.cwd(), '/tmp/clean/');
const ejsdirectory = path.join(process.cwd(), '/views/upload.ejs');
const viewsdirectory = path.join(process.cwd(), '/views/');

console.log(inputdirectory)
console.log(outputdirectory)
console.log(ejsdirectory)


app.set('upload', viewsdirectory);  
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

  res.render(ejsdirectory, { showDownload: false });
  console.log("Inicio")
});

app.post('/api/upload', upload.single('file'), async (req, res) => {
  console.log(req.file)
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


app.listen(process.env.PORT || 3000);

// app.listen(port, () => {
//   console.log(`Server started on http://localhost:${port}`);
// });

// app.listen(port, domain, () => {
//   console.log(`Server started on http://${domain}:${port}`);
// });

module.exports = app;

