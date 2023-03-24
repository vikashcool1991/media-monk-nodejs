const fs = require("fs");
const { faker } = require("@faker-js/faker");
const dotenv = require("dotenv");
const path = require("path");

// load .env file
dotenv.config({ path: path.join(__dirname, ".env") });

async function createFakeKeyValuePair() {
  const fileName = "key-value-pair.csv";
  const filePath = path.join(__dirname, fileName);
  const fileWriteStream = fs.createWriteStream(filePath);
  const numOfIterations = +process.env.TOTAL_KEY_VALUE_PAIR_CSV;
  for (let i = 1; i <= numOfIterations; i++) {
    const key = faker.name.firstName();
    const value = faker.name.firstName();
    const row = `${key},${value}\n`;
    const ableToWrite = fileWriteStream.write(row);
    if (!ableToWrite) {
    //   console.log("Error writing key value pair to csv file.");
      await new Promise((resolve) => fileWriteStream.once("drain", resolve));
    }
  }
}

createFakeKeyValuePair();
