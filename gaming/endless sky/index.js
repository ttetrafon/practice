import fs from 'fs';
import readline from 'readline';

const uniqueMissions = 225;
const saveFile = 'C:\\Users\\ttetr\\AppData\\Roaming\\endless-sky\\saves\\Mata Hari.txt';

const updates = {
  "bunks": {
    bonus: 5,
    frequency: 1
  },
  "\"cargo space\"": {
    bonus: 33,
    frequency: 1
  },
  "\"engine capacity\"": {
    bonus: 10,
    frequency: 1
  },
  "hull": {
    bonus: 33,
    frequency: 1
  },
  "\"multimodal armor\"": {
    bonus: 1,
    frequency: 50
  },
  "\"outfit space\"": {
    bonus: 33,
    frequency: 1
  },
  "shields": {
    bonus: 99,
    frequency: 1
  },
  "\"spinal mount\"": {
    bonus: 1,
    frequency: 50
  },
  "\"weapon capacity\"": {
    bonus: 25,
    frequency: 1
  }
}
const propertiesToUpdate = Object.keys(updates);
const initialValues = {
  "bunks": 130,
  "\"cargo space\"": 140,
  "\"engine capacity\"": 110,
  "hull": 44500,
  "\"multimodal armor\"": 1,
  "\"outfit space\"": 575,
  "shields": 7000,
  "\"weapon capacity\"": 275,
  "\"spinal mount\"": 1
}

let outputLines = [];

const fileStream = fs.createReadStream(saveFile);
const reader = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

let shipFound = false;

function replaceValue(line, prop) {
  let newValue = calculateValue(prop);
  return line.replace(/\d+/, newValue);
}

function calculateValue(prop) {
  return initialValues[prop] + (Math.floor(uniqueMissions / updates[prop].frequency) * updates[prop].bonus);
}

reader.on('line', (line) => {
  if (shipFound && (line.startsWith("ship") || line.startsWith("storage"))) shipFound = false;
  if (line.startsWith("ship Kaskhorade")) shipFound = true;

  if (shipFound) {
    const foundItem = propertiesToUpdate.find(item => line.includes(item));
    if (foundItem) {
      console.log(`- '${ line }' [${ foundItem }]`);
      line = replaceValue(line, foundItem);
      console.log(`... -> '${ line }'`);
    }
  }

  outputLines.push(line);
});

reader.on('close', () => {
  console.log('File reading completed.');

  const modifiedContent = outputLines.join('\n');
  fs.writeFile(saveFile, modifiedContent, (err) => {
    if (err) {
      console.error('Error writing to file:', err);
    } else {
      console.log('File successfully modified and saved.');
    }
  });
});
