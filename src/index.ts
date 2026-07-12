import { processLogs } from "./analyzer";
import { parseLogs } from "./parser";
import { generateHtmlReport } from "./reporters/htmlRepoter";
import * as fs from 'fs';
import { Options } from "./types";
import { DEFAULT_OPTION_VALUE, OPTION_VALUE_MAX, OPTION_VALUE_MIN } from "./constants";
import path from "path";

// TODO

// DONE

// bar charts size
// check edge cases
// create report folder
// polish design
// fix p95 and chart sorting
// add option of choosing top 5, top 10 or etc for reports through console.
// make appealing design for html report.
// clean up code: remove duplicates, hardcodes parts etc: chart, index are left

const file = process.argv[2];

if (!file || file === '-h' || file === '--help') {
  printHelp();
  process.exit(file ? 0 : 1);
}

const options: Options = {
  statusDistributionTop: getOption(3, DEFAULT_OPTION_VALUE),
  leastSuccessfulTop: getOption(4, DEFAULT_OPTION_VALUE),
  latencyTop: getOption(5, DEFAULT_OPTION_VALUE),
}

const logs = parseLogs(file);
const results = processLogs(logs);
const htmlString = generateHtmlReport(results, options);

const reportsDir = path.join(process.cwd(), "reports");

if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir);
}

const reportPath = path.join(reportsDir, `${path.parse(file).name}.html`);

fs.writeFileSync(reportPath, htmlString);

console.log('report generated successfully!');


function getOption(index: number, defaultValue: number): number {
  const value = Number.parseInt(process.argv[index]);
  return isValidOption(value) ? value : defaultValue;
}

function isValidOption(option: number): boolean {
  return option >= OPTION_VALUE_MIN && option <= OPTION_VALUE_MAX;
}


function printHelp() {
  console.log(`
Usage: api-log-analyzer <log-file> [statusTop] [leastSucc] [latencyTop]

Arguments:
  <log-file>    Path to the JSON log file you want to analyze (required)
  [statusTop]   Number of endpoints to show in status distribution (default: ${DEFAULT_OPTION_VALUE}, range: ${OPTION_VALUE_MIN}-${OPTION_VALUE_MAX})
  [leastSucc]   Number of endpoints to show in least successful chart (default: ${DEFAULT_OPTION_VALUE}, range: ${OPTION_VALUE_MIN}-${OPTION_VALUE_MAX})
  [latencyTop]  Number of endpoints to show in latency spread chart (default: ${DEFAULT_OPTION_VALUE}, range: ${OPTION_VALUE_MIN}-${OPTION_VALUE_MAX})

Options:
  -h, --help    Show this help message
`);
}