import { processLogs } from "./analyzer";
import { parseLogs } from "./parser";
import { generateHtmlReport } from "./reporters/htmlRepoter";
import * as fs from 'fs';


const file = process.argv[2];

if (!file) {
  console.log("Usage: ts-node index.ts <log-file>");
  process.exit(1);
}

const logs = parseLogs(file);
const results = processLogs(logs);

// printReport(results);
const htmlString = generateHtmlReport(results);

fs.writeFileSync('report.html', htmlString, 'utf-8');
console.log('report generated successfully!');

