import { processLogs } from "./analyzer";
import { parseLogs } from "./parser";
import { generateHtmlReport } from "./reporters/htmlRepoter";
import * as fs from 'fs';
import { Options } from "./types";
import { DEFAULT_OPTION_VALUE, OPTION_VALUE_MAX, OPTION_VALUE_MIN } from "./constants";

// TODO 

// polish design
// clean up code: remove duplicates, hardcodes parts etc
// fix p95


// DONE

// add option of choosing top 5, top 10 or etc for reports through console.
// make appealing design for html report.


const file = process.argv[2];

if (!file) {
  console.log("Usage: ts-node index.ts <log-file>");
  process.exit(1);
}

const options: Options = {
  usageTop: getOption(3, DEFAULT_OPTION_VALUE),
  leastSuccessfulTop: getOption(4, DEFAULT_OPTION_VALUE),
  latencyTop: getOption(5, DEFAULT_OPTION_VALUE),
  statusDistributionTop: getOption(6, DEFAULT_OPTION_VALUE)
}

const logs = parseLogs(file);
const results = processLogs(logs);

const htmlString = generateHtmlReport(results, options);

fs.writeFileSync('report.html', htmlString, 'utf-8');
console.log('report generated successfully!');



function getOption(index: number, defaultValue: number): number {
  const value = Number.parseInt(process.argv[index]);
  return isValidOption(value) ? value : defaultValue;
}

function isValidOption(option: number): boolean {
  return option >= OPTION_VALUE_MIN && option <= OPTION_VALUE_MAX;
}