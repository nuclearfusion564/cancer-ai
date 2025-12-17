import csv from "csv-parser";
import fs from "fs";
import { type DataObject } from "./types/DataObject.ts";

const learningRate = 0.1;
const bias = 2;
const excludedInputs = 2;
const epochs = 2000;
let errorLogs: number[] = [];

const testMode = false;
let dataFileName = "data.csv";
if (testMode) {
  dataFileName = "industry.csv";
}

let weights: number[] = [];

function loadCsv(): Promise<DataObject[]> {
  return new Promise((resolve, reject) => {
    const newData: DataObject[] = [];

    fs.createReadStream(dataFileName)
      .pipe(csv())
      .on("data", (row) => {
        newData.push(row as DataObject);
      })
      .on("end", () => {
        console.log("Imported Data");
        resolve(newData);
      })
      .on("error", reject);
  });
}

function perceptrons(inputValues: DataObject[], answers: number[]) {
  const featureKeys = Object.keys(inputValues[0]); 

  inputValues.forEach((inputObj: DataObject, rowIndex: number) => {
    let prediction = 0; // reset per row

    featureKeys.forEach((key, featureIndex) => {
      const value = Number((inputObj as any)[key]); 
      prediction += value * weights[featureIndex];
    });

    prediction += bias * weights[featureKeys.length];

    prediction = prediction > 0 ? 1 : 0;

    const error = answers[rowIndex] - prediction;

    // weight update per feature
    featureKeys.forEach((key, featureIndex) => {
      const value = Number((inputObj as any)[key]);
      weights[featureIndex] += error * value * learningRate;
    });

    // bias update per row
    weights[featureKeys.length] += error * bias * learningRate;

    errorLogs.push(error);
  });
}

async function main() {
  const data = await loadCsv();

  let inputsNumber = Object.keys(data[0]).length - excludedInputs + 1;

  let inputs: DataObject[] = [];
  let answers: number[] = [];

  for (let i = 0; i < inputsNumber + 1; i++) {
    weights.push(Math.random());
  }

  data.forEach((element) => {
    const cls = Number((element as any)["Class"]);
    answers.push(cls);

    let elementCleaned = { ...element } as any;
    delete elementCleaned["Class"];
    delete elementCleaned["Image"];

    inputs.push(elementCleaned as DataObject);
  });

  for (let epochsIndex = 0; epochsIndex < epochs + 1; epochsIndex++) {
    console.log("Intense workout #"  + epochsIndex);
    perceptrons(inputs, answers);
  }

  let errorAverage = 0;
  errorLogs.forEach(error => {
    errorAverage += Math.abs(error);
  })

  errorAverage = errorAverage / errorLogs.length

  console.log("CancerGPT has finally finished his winter arc!!")
  console.log(`His single braincell correctly identified tumors ${Math.round((1 - errorAverage) * 100)}% of the time!`);
}

main();
