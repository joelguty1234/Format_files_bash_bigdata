const fs = require('fs');
const readline = require('readline');

function processInputFile(
  inputFilePath,
  outputFilePath,
  separator_character,
  num_character
) {
  return new Promise((resolve, reject) => {
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
        }, 100);
      }
    };

    rl.on('line', processLine);

    rl.on('close', () => {
      writeStream.write(currentLine + '\n');
      writeStream.end(); // Close the write stream
      console.log('Done!');
      resolve(); // Resolve the promise when processing is complete
    });

    rl.on('error', (error) => {
      reject(error); // Reject the promise if an error occurs
    });
  });
}

module.exports = {
  processInputFile
};
