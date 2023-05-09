const fs = require('fs');
const readline = require('readline');

async function processInputFile(inputFilePath, outputFilePath,separator_character,num_columns) {
 
  const readStream = fs.createReadStream(inputFilePath);
  const writeStream = fs.createWriteStream(outputFilePath);

  const rl = readline.createInterface({
    input: readStream
  });

  let currentLine = '';
  let lineNumber = 0;
  let header;

  rl.on('line', (line) => {
    lineNumber++;
    if (lineNumber === 1) {
      header = line
      writeStream.write(header + '\n');
      //console.log(line)
      return;
    }
    if (currentLine.split(separator_character).length - 1 < num_columns) {   // reemplazar || por el separador que desees y la cantidad que debe tener cada ||
      //console.log(currentLine)
      currentLine += line;
    } else {
      writeStream.write(currentLine + '\n');
      currentLine = line;
    }
  });

  
  rl.on('close', () => {
    writeStream.write(currentLine + '\n');
    console.log('Donex!');
  });

}

module.exports = {
  processInputFile
};
