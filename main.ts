import csv from "csv-parser";
import fs from "fs";
import { type DataObject } from "./types/DataObject.ts";

const learningRate = 1;
const bias = 1;
const excludedInputs = 3;

const testMode = false;
let dataFileName = 'data.csv';
if (testMode){
    dataFileName = 'industry.csv'
}

let weights: number[] = [];


function loadCsv(): Promise<DataObject[]> {
    return new Promise((resolve, reject) => {
        const newData: DataObject[] = [];

        fs.createReadStream(dataFileName)
            .pipe(csv())
            .on('data', (row) => {
                newData.push(row as DataObject);
            })
            .on('end', () => {
                console.log('Imported Data');
                resolve(newData);
            })
            .on('error', reject);
    });
}

function perceptrons(inputValues: number[], answer: number){
    let prediction = 0;

    inputValues.forEach((input: number, index: number) => {
        prediction += input * weights[index];
    });

    prediction += bias * weights[inputValues.length];
    if (prediction > 0){
        prediction = 1;
    } else {
        prediction = 0;
    }
    const error = answer - prediction;

    inputValues.forEach((input: number, index: number) => {
        weights[index] += error * input * learningRate;
    });

    weights[inputValues.length] += error * bias * learningRate;
}


async function main() {
  const data = await loadCsv();
  let inputsNumber = Object.keys(data[0]).length - excludedInputs + 1; // There's 3 inputs that i would not like to include
  let inputs: number[] = [];

  for (let i = 0; i < inputsNumber; i++){
    weights.push(Math.random())
  }

  for (const element in data){

  }

  let outputP = 0;

  for (let i = 0; i < inputsNumber; i++){
    outputP += weights[i]
  }

}

main();
