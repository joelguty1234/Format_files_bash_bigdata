const fs = require('fs');
const readline = require('readline');

async function processInputFile(
              inputFilePath, 
              outputFilePath,
              separator_character,
              num_character) {
 
  const readStream = fs.createReadStream(inputFilePath);
  const writeStream = fs.createWriteStream(outputFilePath);

  const rl = readline.createInterface({
    input: readStream
  });

  let currentLine = '';
  let lineNumber = 0;
  let header;

  const processLine = (contenido_line) => {
    lineNumber++;
    if (lineNumber === 1) {
      header = contenido_line;
      writeStream.write(header + '\n');
      return;
    }
    if (currentLine.split(separator_character).length - 1 < num_character) {
      currentLine += contenido_line;
    } else {
      writeStream.write(currentLine + '\n');
      currentLine = contenido_line;
    }
    
    // Pause and resume after every 100,000 lines
    if (lineNumber % 100000 === 0) {
      console.log("se colgo")
      rl.pause();
      setTimeout(() => {
        rl.resume();
      }, 500);
    }
  };

  rl.on('line', processLine);
  
  rl.on('close', () => {
    writeStream.write(currentLine + '\n');
    console.log('Donex!');
    writeStream.close();
  });

}

module.exports = {
  processInputFile
};
